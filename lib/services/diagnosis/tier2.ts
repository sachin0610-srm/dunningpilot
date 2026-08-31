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
 * Executes Tier 2 AI Diagnosis with strict SLA timeout & automatic Tier 1 fallback.
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
  const apiKey = process.env.ANTHROPIC_API_KEY;

  // If no API key is set, immediately return Tier 1 Deterministic Result
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your-anthropic-api-key') {
    return {
      category: tier1.category,
      playbook: tier1.defaultPlaybook,
      diagnosisSource: 'TIER_1_DETERMINISTIC',
      executionTimeMs: Date.now() - startTime,
      reasoningNotes: `Tier 1 Rule Matched: ${tier1.ruleMatched}. (AI disabled or key missing)`
    };
  }

  // Step 2: Attempt Tier 2 AI Diagnosis with Strict SLA Timeout
  try {
    const anthropic = new Anthropic({ apiKey });
    const model = process.env.AI_MODEL || 'claude-3-5-sonnet-20241022';

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

    // Promise.race for strict 2500ms timeout
    const aiPromise = anthropic.messages.create({
      model,
      max_tokens: 600,
      temperature: 0.2,
      messages: [{ role: 'user', content: prompt }]
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('AI_TIMEOUT_EXCEEDED')), AI_TIMEOUT_MS)
    );

    const response = await Promise.race([aiPromise, timeoutPromise]) as Anthropic.Messages.Message;

    const contentText = response.content[0].type === 'text' ? response.content[0].text : '';
    const cleanJson = contentText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedPlaybook = JSON.parse(cleanJson) as AIPlaybook;

    return {
      category: parsedPlaybook.category || tier1.category,
      playbook: parsedPlaybook,
      diagnosisSource: 'TIER_2_AI',
      executionTimeMs: Date.now() - startTime,
      reasoningNotes: `Tier 2 AI Claude classification successful in ${Date.now() - startTime}ms.`
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
