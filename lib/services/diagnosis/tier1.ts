import { FailureCategory, AIPlaybook } from '@/lib/types/dunning';

export interface Tier1Result {
  category: FailureCategory;
  defaultPlaybook: AIPlaybook;
  ruleMatched: string;
}

/**
 * Tier 1 Deterministic Rules Engine
 * Maps Razorpay and gateway error codes directly to a structured failure taxonomy.
 * Operates with ZERO external network dependencies and 100% testable deterministic logic.
 */
export function diagnoseTier1(errorCode: string, errorDescription: string): Tier1Result {
  const code = (errorCode || '').toUpperCase();
  const desc = (errorDescription || '').toUpperCase();

  // Rule 1: Hard Declines (Stolen, lost, closed accounts, fraud)
  if (
    code.includes('STOLEN') ||
    code.includes('FRAUD') ||
    code.includes('HARD_DECLINE') ||
    desc.includes('STOLEN') ||
    desc.includes('BLOCKED') ||
    desc.includes('CLOSED ACCOUNT') ||
    desc.includes('PICK UP CARD')
  ) {
    return {
      category: 'HARD_DECLINE',
      ruleMatched: 'RULE_HARD_DECLINE_TERMINAL',
      defaultPlaybook: {
        category: 'HARD_DECLINE',
        recommended_action: 'Terminal stop. Immediate cancellation notification. No gateway retries allowed.',
        action_type: 'MANUAL_DISMISS',
        confidence_score: 1.0,
        explanation: 'Card marked as lost/stolen or account closed. Gateway retries prohibited to protect merchant reputation.',
        retry_delay_hours: 0,
        max_allowed_retries: 0,
        customer_outreach_copy: {
          subject: 'Action Required: Your subscription has been paused',
          body: 'We were unable to process your subscription renewal due to a terminal decline from your issuing bank. Please log in to update your payment method to restore access.',
          cta_text: 'Update Payment Method'
        }
      }
    };
  }

  // Rule 2: Card Expiration
  if (
    code.includes('EXPIRED') ||
    code.includes('EXPIRY') ||
    desc.includes('EXPIRED') ||
    desc.includes('EXPIRATION DATE')
  ) {
    return {
      category: 'CARD_EXPIRATION',
      ruleMatched: 'RULE_CARD_EXPIRATION',
      defaultPlaybook: {
        category: 'CARD_EXPIRATION',
        recommended_action: 'Send secure self-serve card update link to customer.',
        action_type: 'CARD_UPDATE_EMAIL',
        confidence_score: 0.95,
        explanation: 'Card expiration date has passed. Direct retries on expired token will fail.',
        retry_delay_hours: 24,
        max_allowed_retries: 2,
        customer_outreach_copy: {
          subject: 'Your card on file has expired',
          body: 'Your recent subscription charge failed because your payment card has expired. Please update your card details in seconds.',
          cta_text: 'Update Expired Card'
        }
      }
    };
  }

  // Rule 3: 3DS / Authentication Challenge
  if (
    code.includes('AUTHENTICATION') ||
    code.includes('3DS') ||
    code.includes('OTP') ||
    desc.includes('AUTHENTICATION FAILED') ||
    desc.includes('OTP TIMEOUT') ||
    desc.includes('3D SECURE')
  ) {
    return {
      category: 'AUTH_CHALLENGE',
      ruleMatched: 'RULE_3DS_AUTH_CHALLENGE',
      defaultPlaybook: {
        category: 'AUTH_CHALLENGE',
        recommended_action: 'Dispatch 1-click Razorpay payment authorization link via SMS / Email.',
        action_type: 'PAYMENT_LINK_SMS',
        confidence_score: 0.90,
        explanation: 'Bank requested 3DS step-up authentication which timed out or was abandoned.',
        retry_delay_hours: 4,
        max_allowed_retries: 2,
        customer_outreach_copy: {
          subject: 'Complete 1-click authentication for your subscription',
          body: 'Your subscription charge requires 3D Secure authentication from your bank. Click below to quickly approve.',
          cta_text: 'Authorize Payment Now'
        }
      }
    };
  }

  // Rule 4: Soft Declines (Insufficient funds, temporary network/gateway glitch) - Default
  return {
    category: 'SOFT_DECLINE',
    ruleMatched: 'RULE_SOFT_DECLINE_SMART_RETRY',
    defaultPlaybook: {
      category: 'SOFT_DECLINE',
      recommended_action: 'Schedule smart gateway retry in optimal payment window (e.g. salary morning window).',
      action_type: 'GATEWAY_RETRY',
      confidence_score: 0.85,
      explanation: 'Temporary soft decline or insufficient balance. High probability of recovery on scheduled retry.',
      retry_delay_hours: 12,
      max_allowed_retries: 3,
      customer_outreach_copy: {
        subject: 'We were unable to process your payment',
        body: 'We encountered a temporary payment decline. We will automatically retry shortly, or you can complete payment now.',
        cta_text: 'View Payment Details'
      }
    }
  };
}
