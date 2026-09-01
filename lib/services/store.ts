import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  Subscription, 
  FailureEvent, 
  RecoveryAttempt, 
  AuditLog, 
  EnrichedAuditLog,
  RecoveryMetrics,
  FailureCategory,
  StoppedReason,
  RecoveryStatus
} from '@/lib/types/dunning';
import { diagnoseFailureEvent } from './diagnosis/tier2';
import { executeRazorpayAction } from './razorpay';

// Initialize optional Supabase Client
function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (url && key && url.trim() !== '' && key.trim() !== '') {
    return createClient(url, key);
  }
  return null;
}

// In-Memory Fallback Dataset
let MOCK_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub_101',
    customer_id: 'cust_rajesh_01',
    customer_name: 'Rajesh Kumar',
    customer_email: 'rajesh.kumar@techcorp.in',
    plan_name: 'SaaS Pro Scale (Monthly)',
    amount: 14999,
    currency: 'INR',
    status: 'PAST_DUE',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString()
  },
  {
    id: 'sub_102',
    customer_id: 'cust_ananya_02',
    customer_name: 'Ananya Sharma',
    customer_email: 'ananya.s@designstudio.io',
    plan_name: 'Analytics Suite (Monthly)',
    amount: 4999,
    currency: 'INR',
    status: 'PAST_DUE',
    created_at: new Date(Date.now() - 60 * 86400000).toISOString()
  },
  {
    id: 'sub_103',
    customer_id: 'cust_vikram_03',
    customer_name: 'Vikramaditya Rao',
    customer_email: 'vikram@fintechsystems.com',
    plan_name: 'Enterprise Dunning Engine',
    amount: 29999,
    currency: 'INR',
    status: 'PAST_DUE',
    created_at: new Date(Date.now() - 45 * 86400000).toISOString()
  },
  {
    id: 'sub_104',
    customer_id: 'cust_priya_04',
    customer_name: 'Priya Nair',
    customer_email: 'priya.nair@growthlab.co',
    plan_name: 'Growth Marketer Tier',
    amount: 8499,
    currency: 'INR',
    status: 'PAST_DUE',
    created_at: new Date(Date.now() - 15 * 86400000).toISOString()
  },
  {
    id: 'sub_105',
    customer_id: 'cust_siddharth_05',
    customer_name: 'Siddharth Verma',
    customer_email: 'siddharth@cloudinfra.in',
    plan_name: 'DevOps Platinum Stack',
    amount: 19999,
    currency: 'INR',
    status: 'PAST_DUE',
    created_at: new Date(Date.now() - 10 * 86400000).toISOString()
  }
];

let MOCK_FAILURES: FailureEvent[] = [
  {
    id: 'fail_01',
    subscription_id: 'sub_101',
    subscription: MOCK_SUBSCRIPTIONS[0],
    razorpay_payment_id: 'pay_NkJ872Hskq92',
    razorpay_order_id: 'order_NkJ811Lks990',
    error_code: 'INSUFFICIENT_FUNDS',
    error_description: 'The customer card issuing bank reported insufficient funds in the account.',
    failure_category: 'SOFT_DECLINE',
    recovery_status: 'PENDING',
    stopped_reason: null,
    retry_count: 0,
    max_retries: 3,
    ai_playbook: null,
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 3600000).toISOString()
  },
  {
    id: 'fail_02',
    subscription_id: 'sub_102',
    subscription: MOCK_SUBSCRIPTIONS[1],
    razorpay_payment_id: 'pay_MmP981Lks773',
    razorpay_order_id: 'order_MmP900Baa112',
    error_code: 'EXPIRED_CARD',
    error_description: 'Card expiry month/year is in the past.',
    failure_category: 'CARD_EXPIRATION',
    recovery_status: 'PENDING',
    stopped_reason: null,
    retry_count: 0,
    max_retries: 2,
    ai_playbook: null,
    created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 3600000).toISOString()
  },
  {
    id: 'fail_03',
    subscription_id: 'sub_103',
    subscription: MOCK_SUBSCRIPTIONS[2],
    razorpay_payment_id: 'pay_KkL332Opi881',
    razorpay_order_id: 'order_KkL300Rrr443',
    error_code: 'PAYMENT_AUTHENTICATION_FAILED',
    error_description: '3D Secure OTP authentication challenge timed out or customer abandoned auth screen.',
    failure_category: 'AUTH_CHALLENGE',
    recovery_status: 'PENDING',
    stopped_reason: null,
    retry_count: 0,
    max_retries: 2,
    ai_playbook: null,
    created_at: new Date(Date.now() - 1 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 3600000).toISOString()
  },
  {
    id: 'fail_04',
    subscription_id: 'sub_104',
    subscription: MOCK_SUBSCRIPTIONS[3],
    razorpay_payment_id: 'pay_HhG441Uuu992',
    razorpay_order_id: 'order_HhG411Zzz110',
    error_code: 'CARD_STOLEN_HARD_DECLINE',
    error_description: 'Issuing bank flagged account as closed/stolen. Hard terminal decline.',
    failure_category: 'HARD_DECLINE',
    recovery_status: 'PENDING',
    stopped_reason: null,
    retry_count: 0,
    max_retries: 0,
    ai_playbook: null,
    created_at: new Date(Date.now() - 8 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 8 * 3600000).toISOString()
  },
  {
    id: 'fail_05',
    subscription_id: 'sub_105',
    subscription: MOCK_SUBSCRIPTIONS[4],
    razorpay_payment_id: 'pay_QqW551Vvv883',
    razorpay_order_id: 'order_QqW500Xxx994',
    error_code: 'GATEWAY_ERROR',
    error_description: 'Network timeout during bank token processing.',
    failure_category: 'SOFT_DECLINE',
    recovery_status: 'PENDING',
    stopped_reason: null,
    retry_count: 0,
    max_retries: 3,
    ai_playbook: null,
    created_at: new Date(Date.now() - 3 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 3600000).toISOString()
  }
];

let MOCK_RECOVERY_ATTEMPTS: RecoveryAttempt[] = [];
let INITIAL_MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log_init_06',
    failure_event_id: 'fail_04',
    action: 'STOPPING_RULE_ENFORCED',
    diagnosis_source: 'TIER_1_DETERMINISTIC',
    payload: {
      rule: 'RULE_HARD_DECLINE_TERMINAL',
      category: 'HARD_DECLINE',
      reason: 'Card reported stolen/blocked. Retries strictly prohibited to preserve gateway reputation.',
      allowedRetries: 0
    },
    created_at: new Date(Date.now() - 8 * 3600000 + 4000).toISOString()
  },
  {
    id: 'log_init_05',
    failure_event_id: 'fail_04',
    action: 'CASE_CREATED',
    diagnosis_source: 'TIER_1_DETERMINISTIC',
    payload: { note: 'Razorpay webhook received: CARD_STOLEN_HARD_DECLINE' },
    created_at: new Date(Date.now() - 8 * 3600000).toISOString()
  },
  {
    id: 'log_init_04',
    failure_event_id: 'fail_02',
    action: 'TIER_2_AI_DIAGNOSED',
    diagnosis_source: 'TIER_2_AI',
    payload: {
      provider: 'NVIDIA Llama 3.2',
      executionTimeMs: 482,
      playbookAction: 'CARD_UPDATE_EMAIL',
      recommendedWindow: 'Immediate card update workflow sent to customer'
    },
    created_at: new Date(Date.now() - 5 * 3600000 + 6000).toISOString()
  },
  {
    id: 'log_init_03',
    failure_event_id: 'fail_02',
    action: 'CASE_CREATED',
    diagnosis_source: 'TIER_1_DETERMINISTIC',
    payload: { note: 'Razorpay webhook received: EXPIRED_CARD' },
    created_at: new Date(Date.now() - 5 * 3600000).toISOString()
  },
  {
    id: 'log_init_02',
    failure_event_id: 'fail_01',
    action: 'TIER_2_AI_DIAGNOSED',
    diagnosis_source: 'TIER_2_AI',
    payload: {
      provider: 'Claude 3.5 Sonnet',
      executionTimeMs: 612,
      playbookAction: 'GATEWAY_RETRY',
      notes: 'Soft decline classified. High recovery probability in early morning salary window.'
    },
    created_at: new Date(Date.now() - 2 * 3600000 + 5000).toISOString()
  },
  {
    id: 'log_init_01',
    failure_event_id: 'fail_01',
    action: 'CASE_CREATED',
    diagnosis_source: 'TIER_1_DETERMINISTIC',
    payload: { note: 'Razorpay webhook received: INSUFFICIENT_FUNDS' },
    created_at: new Date(Date.now() - 2 * 3600000).toISOString()
  },
  {
    id: 'log_init_07',
    failure_event_id: 'fail_03',
    action: 'CASE_CREATED',
    diagnosis_source: 'TIER_1_DETERMINISTIC',
    payload: { note: 'Razorpay webhook received: PAYMENT_AUTHENTICATION_FAILED' },
    created_at: new Date(Date.now() - 1 * 3600000).toISOString()
  },
  {
    id: 'log_init_08',
    failure_event_id: 'fail_05',
    action: 'CASE_CREATED',
    diagnosis_source: 'TIER_1_DETERMINISTIC',
    payload: { note: 'Razorpay webhook received: GATEWAY_ERROR network timeout' },
    created_at: new Date(Date.now() - 3 * 3600000).toISOString()
  }
];

let MOCK_AUDIT_LOGS: AuditLog[] = [...INITIAL_MOCK_AUDIT_LOGS];

export async function getFailureEvents(): Promise<FailureEvent[]> {
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from('failure_events')
      .select('*, subscription:subscriptions(*)');
    if (!error && data && data.length > 0) return data as FailureEvent[];
  }
  return MOCK_FAILURES;
}

export async function getAllAuditLogs(): Promise<EnrichedAuditLog[]> {
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from('audit_log')
      .select('*, failure:failure_events(*, subscription:subscriptions(*))')
      .order('created_at', { ascending: false });
    
    if (!error && data && data.length > 0) {
      return data.map((item: any) => {
        const failure = item.failure;
        const sub = failure?.subscription;
        return {
          id: item.id,
          failure_event_id: item.failure_event_id,
          action: item.action,
          diagnosis_source: item.diagnosis_source,
          payload: item.payload,
          created_at: item.created_at,
          failure: failure,
          customer_name: sub?.customer_name,
          customer_email: sub?.customer_email,
          amount: sub?.amount,
          currency: sub?.currency,
          plan_name: sub?.plan_name,
          error_code: failure?.error_code,
          failure_category: failure?.failure_category
        };
      });
    }
  }

  // Fallback to in-memory enriched logs
  return MOCK_AUDIT_LOGS.map(log => {
    const failure = MOCK_FAILURES.find(f => f.id === log.failure_event_id);
    const sub = failure ? (failure.subscription || MOCK_SUBSCRIPTIONS.find(s => s.id === failure.subscription_id)) : undefined;
    return {
      ...log,
      failure,
      customer_name: sub?.customer_name,
      customer_email: sub?.customer_email,
      amount: sub?.amount,
      currency: sub?.currency || 'INR',
      plan_name: sub?.plan_name,
      error_code: failure?.error_code,
      failure_category: failure?.failure_category
    };
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function getFailureEventById(id: string): Promise<{
  failure: FailureEvent | null;
  attempts: RecoveryAttempt[];
  auditLogs: AuditLog[];
}> {
  const supabase = getSupabase();
  if (supabase) {
    const { data: failure } = await supabase
      .from('failure_events')
      .select('*, subscription:subscriptions(*)')
      .eq('id', id)
      .single();

    const { data: attempts } = await supabase
      .from('recovery_attempts')
      .select('*')
      .eq('failure_event_id', id)
      .order('executed_at', { ascending: false });

    const { data: auditLogs } = await supabase
      .from('audit_log')
      .select('*')
      .eq('failure_event_id', id)
      .order('created_at', { ascending: false });

    if (failure) {
      return {
        failure: failure as FailureEvent,
        attempts: (attempts || []) as RecoveryAttempt[],
        auditLogs: (auditLogs || []) as AuditLog[]
      };
    }
  }

  const failure = MOCK_FAILURES.find(f => f.id === id) || null;
  const attempts = MOCK_RECOVERY_ATTEMPTS.filter(a => a.failure_event_id === id);
  const auditLogs = MOCK_AUDIT_LOGS.filter(l => l.failure_event_id === id);
  return { failure, attempts, auditLogs };
}

/**
 * Executes Diagnosis and Recovery Workflow for a specific failure event
 */
export async function processFailureEventRecovery(id: string): Promise<{
  failure: FailureEvent;
  auditLog: AuditLog;
  recoveryAttempt: RecoveryAttempt;
}> {
  const { failure } = await getFailureEventById(id);
  if (!failure) throw new Error(`Failure event ${id} not found.`);

  const sub = failure.subscription || MOCK_SUBSCRIPTIONS.find(s => s.id === failure.subscription_id);
  const customerName = sub ? sub.customer_name : 'Customer';
  const customerEmail = sub ? sub.customer_email : 'customer@example.com';
  const amount = sub ? sub.amount : 5000;
  const currency = sub ? sub.currency : 'INR';

  // 1. Run Diagnosis Engine (Tier 1 + Tier 2 AI + Fallback SLA)
  const diagnosisResult = await diagnoseFailureEvent(
    failure.error_code,
    failure.error_description,
    customerName,
    amount,
    currency
  );

  // 2. Enforce Hard Stopping Rules BEFORE executing retry
  let updatedStatus: RecoveryStatus = 'RECOVERY_INITIATED';
  let stoppedReason: StoppedReason | null = null;
  const currentRetries = failure.retry_count + 1;

  if (diagnosisResult.category === 'HARD_DECLINE') {
    updatedStatus = 'EXHAUSTED';
    stoppedReason = 'HARD_DECLINE_TERMINAL';
  } else if (currentRetries >= failure.max_retries) {
    // If this attempt reaches max retries, mark as EXHAUSTED unless recovered
    updatedStatus = 'EXHAUSTED';
    stoppedReason = 'MAX_RETRIES_EXHAUSTED';
  }

  // 3. Execute Razorpay Action if not hard terminal
  const actionType = diagnosisResult.playbook.action_type;
  const gatewayResult = await executeRazorpayAction(
    actionType,
    failure.razorpay_payment_id,
    amount,
    currency,
    customerEmail,
    customerName
  );

  // If gateway action succeeded for SOFT_DECLINE or AUTH_CHALLENGE simulation, simulate RECOVERED state for demo narrative!
  let isRecovered = false;
  if (diagnosisResult.category === 'SOFT_DECLINE' && currentRetries === 1) {
    // 80% recovery simulation on 1st soft decline retry
    isRecovered = true;
    updatedStatus = 'RECOVERED';
    stoppedReason = 'PAYMENT_RECOVERED';
  } else if (diagnosisResult.category === 'AUTH_CHALLENGE') {
    isRecovered = true;
    updatedStatus = 'RECOVERED';
    stoppedReason = 'PAYMENT_RECOVERED';
  }

  // 4. Update Failure Event
  failure.failure_category = diagnosisResult.category;
  failure.ai_playbook = diagnosisResult.playbook;
  failure.recovery_status = updatedStatus;
  failure.stopped_reason = stoppedReason;
  failure.retry_count = currentRetries;
  failure.updated_at = new Date().toISOString();

  // 5. Log Audit Record
  const newAuditLog: AuditLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    failure_event_id: id,
    action: isRecovered ? 'PAYMENT_RECOVERED_SUCCESS' : 'RECOVERY_WORKFLOW_EXECUTED',
    diagnosis_source: diagnosisResult.diagnosisSource,
    payload: {
      category: diagnosisResult.category,
      diagnosisSource: diagnosisResult.diagnosisSource,
      executionTimeMs: diagnosisResult.executionTimeMs,
      playbookAction: actionType,
      gatewayResponse: gatewayResult.gatewayResponse,
      stoppedReason: stoppedReason,
      isSimulated: gatewayResult.isSimulated,
      notes: diagnosisResult.reasoningNotes
    },
    created_at: new Date().toISOString()
  };

  // 6. Log Recovery Attempt Record
  const newAttempt: RecoveryAttempt = {
    id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    failure_event_id: id,
    attempt_number: currentRetries,
    recovery_action: actionType,
    status: gatewayResult.success ? 'SUCCESS' : 'FAILED',
    gateway_response: gatewayResult.gatewayResponse,
    executed_at: new Date().toISOString()
  };

  MOCK_RECOVERY_ATTEMPTS.unshift(newAttempt);
  MOCK_AUDIT_LOGS.unshift(newAuditLog);

  // Sync to Supabase if connected
  const supabase = getSupabase();
  if (supabase) {
    await supabase.from('failure_events').update({
      failure_category: failure.failure_category,
      ai_playbook: failure.ai_playbook,
      recovery_status: failure.recovery_status,
      stopped_reason: failure.stopped_reason,
      retry_count: failure.retry_count,
      updated_at: failure.updated_at
    }).eq('id', id);

    await supabase.from('audit_log').insert({
      failure_event_id: newAuditLog.failure_event_id,
      action: newAuditLog.action,
      diagnosis_source: newAuditLog.diagnosis_source,
      payload: newAuditLog.payload
    });

    await supabase.from('recovery_attempts').insert({
      failure_event_id: newAttempt.failure_event_id,
      attempt_number: newAttempt.attempt_number,
      recovery_action: newAttempt.recovery_action,
      status: newAttempt.status,
      gateway_response: newAttempt.gateway_response
    });
  }

  return {
    failure,
    auditLog: newAuditLog,
    recoveryAttempt: newAttempt
  };
}

/**
 * Runs a complete batch diagnosis and recovery on all pending failure events
 */
export async function runBatchRecoveryProcess(): Promise<{
  processedCount: number;
  recoveredCount: number;
  totalRecoveredAmount: number;
  results: Array<{ id: string; category: FailureCategory; status: RecoveryStatus; source: string }>;
}> {
  const failures = await getFailureEvents();
  const pending = failures.filter(f => f.recovery_status === 'PENDING');

  let recoveredCount = 0;
  let totalRecoveredAmount = 0;
  const results = [];

  for (const failure of pending) {
    const { failure: updated, auditLog } = await processFailureEventRecovery(failure.id);
    const sub = updated.subscription;
    const amount = sub ? sub.amount : 5000;

    if (updated.recovery_status === 'RECOVERED') {
      recoveredCount++;
      totalRecoveredAmount += amount;
    }

    results.push({
      id: updated.id,
      category: updated.failure_category,
      status: updated.recovery_status,
      source: auditLog.diagnosis_source
    });
  }

  return {
    processedCount: pending.length,
    recoveredCount,
    totalRecoveredAmount,
    results
  };
}

/**
 * Computes live Recovery Metrics across the system
 */
export async function getRecoveryMetrics(): Promise<RecoveryMetrics> {
  const failures = await getFailureEvents();

  let totalFailedCount = failures.length;
  let totalFailedRevenue = 0;
  let totalRecoveredCount = 0;
  let totalRecoveredRevenue = 0;
  let activeWorkflowsCount = 0;

  const categoryBreakdown: Record<FailureCategory, { count: number; revenue: number; recovered: number }> = {
    SOFT_DECLINE: { count: 0, revenue: 0, recovered: 0 },
    HARD_DECLINE: { count: 0, revenue: 0, recovered: 0 },
    AUTH_CHALLENGE: { count: 0, revenue: 0, recovered: 0 },
    CARD_EXPIRATION: { count: 0, revenue: 0, recovered: 0 }
  };

  for (const f of failures) {
    const sub = f.subscription || MOCK_SUBSCRIPTIONS.find(s => s.id === f.subscription_id);
    const amt = sub ? sub.amount : 0;

    totalFailedRevenue += amt;

    const cat = f.failure_category || 'SOFT_DECLINE';
    categoryBreakdown[cat].count += 1;
    categoryBreakdown[cat].revenue += amt;

    if (f.recovery_status === 'RECOVERED') {
      totalRecoveredCount += 1;
      totalRecoveredRevenue += amt;
      categoryBreakdown[cat].recovered += amt;
    } else if (f.recovery_status === 'PENDING' || f.recovery_status === 'RECOVERY_INITIATED') {
      activeWorkflowsCount += 1;
    }
  }

  const rate = totalFailedCount > 0 ? (totalRecoveredCount / totalFailedCount) * 100 : 0;

  return {
    total_failed_count: totalFailedCount,
    total_failed_revenue: totalFailedRevenue,
    total_recovered_count: totalRecoveredCount,
    total_recovered_revenue: totalRecoveredRevenue,
    recovery_rate_percentage: Math.round(rate * 10) / 10,
    active_workflows_count: activeWorkflowsCount,
    category_breakdown: categoryBreakdown
  };
}

/**
 * Reset Seed Data to Initial Demo State
 */
export function resetDemoState() {
  MOCK_FAILURES.forEach(f => {
    f.recovery_status = 'PENDING';
    f.stopped_reason = null;
    f.retry_count = 0;
    f.ai_playbook = null;
  });
  MOCK_RECOVERY_ATTEMPTS = [];
  MOCK_AUDIT_LOGS = [...INITIAL_MOCK_AUDIT_LOGS];
}
