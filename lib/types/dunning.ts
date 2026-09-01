export type FailureCategory = 
  | 'SOFT_DECLINE'       // Insufficient funds, temporary bank slowdown -> Retry later, smart window
  | 'HARD_DECLINE'       // Card stolen/blocked, account closed -> Immediate escalation, no gateway retries
  | 'AUTH_CHALLENGE'     // 3DS OTP expired, step-up auth required -> Send direct authorization link
  | 'CARD_EXPIRATION';   // Expiry date passed -> Smart card update link & email workflow

export type RecoveryStatus = 
  | 'PENDING'
  | 'DIAGNOSED'
  | 'RECOVERY_INITIATED'
  | 'RECOVERED'
  | 'EXHAUSTED'
  | 'MANUALLY_DISMISSED';

export type StoppedReason = 
  | 'PAYMENT_RECOVERED'
  | 'MAX_RETRIES_EXHAUSTED'
  | 'MANUALLY_DISMISSED'
  | 'HARD_DECLINE_TERMINAL';

export type DiagnosisSource = 
  | 'TIER_1_DETERMINISTIC'
  | 'TIER_2_AI'
  | 'TIER_1_FALLBACK';

export interface Subscription {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  plan_name: string;
  amount: number;
  currency: string;
  status: 'ACTIVE' | 'PAST_DUE' | 'CANCELLED';
  created_at: string;
}

export interface AIPlaybook {
  category: FailureCategory;
  recommended_action: string;
  action_type: 'GATEWAY_RETRY' | 'PAYMENT_LINK_SMS' | 'CARD_UPDATE_EMAIL' | 'MANUAL_DISMISS';
  confidence_score: number;
  explanation: string;
  customer_outreach_copy?: {
    subject: string;
    body: string;
    cta_text: string;
  };
  retry_delay_hours: number;
  max_allowed_retries: number;
}

export interface FailureEvent {
  id: string;
  subscription_id: string;
  subscription?: Subscription;
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  error_code: string;
  error_description: string;
  failure_category: FailureCategory;
  recovery_status: RecoveryStatus;
  stopped_reason: StoppedReason | null;
  retry_count: number;
  max_retries: number;
  ai_playbook: AIPlaybook | null;
  created_at: string;
  updated_at: string;
}

export interface RecoveryAttempt {
  id: string;
  failure_event_id: string;
  attempt_number: number;
  recovery_action: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  gateway_response: Record<string, any>;
  executed_at: string;
}

export interface AuditLog {
  id: string;
  failure_event_id: string;
  action: string;
  diagnosis_source: DiagnosisSource;
  payload: Record<string, any>;
  created_at: string;
}

export interface EnrichedAuditLog extends AuditLog {
  failure?: FailureEvent;
  customer_name?: string;
  customer_email?: string;
  amount?: number;
  currency?: string;
  plan_name?: string;
  error_code?: string;
  failure_category?: FailureCategory;
}

export interface RecoveryMetrics {
  total_failed_count: number;
  total_failed_revenue: number;
  total_recovered_count: number;
  total_recovered_revenue: number;
  recovery_rate_percentage: number;
  active_workflows_count: number;
  category_breakdown: Record<FailureCategory, { count: number; revenue: number; recovered: number }>;
}
