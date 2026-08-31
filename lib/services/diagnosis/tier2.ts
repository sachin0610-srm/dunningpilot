import Anthropic from '@anthropic-ai/sdk';
import { FailureCategory, AIPlaybook, DiagnosisSource } from '@/lib/types/dunning';
import { diagnoseTier1 } from './tier1';

export interface DiagnosisEngineResult {
  category: FailureCategory;
  playbook: AIPlaybook;
  diagnosisSource: DiagnosisSource;
  executionTimeMs: number;
  reasoningNotes: string;
}

const AI_TIMEOUT_MS = 2500; // 2.5 second strict SLA timeout

/**
 * Call NVIDIA API (OpenAI-compatible chat completions format)
 * Default Model: meta/llama-3.2-11b-vision-instruct or meta/llama-3.2-90b-vision-instruct
 */
async function callNvidiaApi(apiKey: string, prompt: string, model: string): Promise<string> {
  const endpoint = process.env.NVIDIA_API_BASE_URL || 'https://integrate.api.nvidia.com/v1/chat/completions';
  
  const selectedModel = model || process.env.NVIDIA_MODEL || 'meta/llama-3.2-11b-vision-instruct';

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: selectedModel,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 600
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`NVIDIA API HTTP ${res.status}: ${errText}`);
  }

  const json = await res.json();
  return json?.choices?.[0]?.message?.content || '';
}

/**
 * Call Anthropic Claude API
 */
async function callAnthropicApi(apiKey: string, prompt: string, model: string): Promise<string> {
  const anthropic = new Anthropic({ apiKey });
  const response = await anthropic.messages.create({
    model: model || 'claude-3-5-sonnet-20241022',
    max_tokens: 600,
    temperature: 0.2,
    messages: [{ role: 'user', content: prompt }]
  });
  return response.content[0].type === 'text' ? response.content[0].text : '';
}

/**
 * Executes Tier 2 AI Diagnosis with strict SLA timeout & automatic Tier 1 fallback.
 * Supports NVIDIA API (NVIDIA_API_KEY) and Anthropic Claude (ANTHROPIC_API_KEY).
 */
export async function diagnoseFailureEvent(
  errorCode: string,
  errorDescription: string,
  customerName: string,
  amount: number,
  currency: string
): Promise<DiagnosisEngineResult> {
  const startTime = Date.now();

  // Step 1: Compute Tier 1 Deterministic Baseline
  const tier1 = diagnoseTier1(errorCode, errorDescription);

  const nvidiaKey = process.env.NVIDIA_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  const hasKey = (nvidiaKey && nvidiaKey.trim() !== '' && !nvidiaKey.includes('your-')) ||
                 (anthropicKey && anthropicKey.trim() !== '' && !anthropicKey.includes('your-'));

  // If no AI key is configured, immediately return Tier 1 Deterministic Result
  if (!hasKey) {
    return {
      category: tier1.category,
      playbook: tier1.defaultPlaybook,
      diagnosisSource: 'TIER_1_DETERMINISTIC',
      executionTimeMs: Date.now() - startTime,
      reasoningNotes: `Tier 1 Rule Matched: ${tier1.ruleMatched}. (AI disabled or keys missing)`
    };
  }

  // Step 2: Attempt Tier 2 AI Diagnosis with Strict SLA Timeout
  try {
    const prompt = `You are DunningPilot, an expert payment-recovery AI.
Diagnose this failed payment event and generate an optimal recovery playbook.

Customer: ${customerName}
Amount: ${currency} ${amount}
Error Code: ${errorCode}
Error Description: ${errorDescription}
Tier 1 Baseline Category: ${tier1.category}

Return ONLY valid JSON matching this exact structure with no extra text or markdown formatting:
{
  "category": "${tier1.category}",
  "recommended_action": "High level strategy description",
  "action_type": "GATEWAY_RETRY" | "PAYMENT_LINK_SMS" | "CARD_UPDATE_EMAIL" | "MANUAL_DISMISS",
  "confidence_score": 0.95,
  "explanation": "Detailed rationale based on gateway response and customer behavior",
  "retry_delay_hours": 12,
  "max_allowed_retries": 3,
  "customer_outreach_copy": {
    "subject": "Email subject",
    "body": "Empathetic, clear, conversion-optimized copy for the customer",
    "cta_text": "Call to action button text"
  }
}`;

    // Select provider execution
    const fetchAiResponse = async (): Promise<string> => {
      if (nvidiaKey && nvidiaKey.trim() !== '' && !nvidiaKey.includes('your-')) {
        const model = process.env.NVIDIA_MODEL || process.env.AI_MODEL || 'meta/llama-3.2-11b-vision-instruct';
        return await callNvidiaApi(nvidiaKey, prompt, model);
      } else {
        const model = process.env.AI_MODEL || 'claude-3-5-sonnet-20241022';
        return await callAnthropicApi(anthropicKey!, prompt, model);
      }
    };

    // Promise.race for strict 2500ms timeout
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('AI_TIMEOUT_EXCEEDED')), AI_TIMEOUT_MS)
    );

    const contentText = await Promise.race([fetchAiResponse(), timeoutPromise]);
    const cleanJson = contentText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedPlaybook = JSON.parse(cleanJson) as AIPlaybook;

    const providerName = nvidiaKey ? 'NVIDIA Llama 3.2' : 'Claude 3.5 Sonnet';

    return {
      category: parsedPlaybook.category || tier1.category,
      playbook: parsedPlaybook,
      diagnosisSource: 'TIER_2_AI',
      executionTimeMs: Date.now() - startTime,
      reasoningNotes: `Tier 2 AI (${providerName}) classification successful in ${Date.now() - startTime}ms.`
    };
  } catch (err: any) {
    const isTimeout = err?.message === 'AI_TIMEOUT_EXCEEDED';
    const errorMsg = isTimeout ? 'Strict SLA 2500ms timeout exceeded' : err?.message || 'AI API Error';

    // Graceful Degradation to Tier 1 Fallback
    return {
      category: tier1.category,
      playbook: tier1.defaultPlaybook,
      diagnosisSource: 'TIER_1_FALLBACK',
      executionTimeMs: Date.now() - startTime,
      reasoningNotes: `Tier 2 AI execution failed (${errorMsg}). Safe fallback to Tier 1 default playbook applied.`
    };
  }
}
