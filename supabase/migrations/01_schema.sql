-- DunningPilot Database Schema Migration

-- 1. Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    plan_name TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    status TEXT NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, PAST_DUE, CANCELLED
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Failure Events Table
CREATE TABLE IF NOT EXISTS failure_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    razorpay_payment_id TEXT NOT NULL,
    razorpay_order_id TEXT,
    error_code TEXT NOT NULL,
    error_description TEXT NOT NULL,
    failure_category TEXT NOT NULL, -- SOFT_DECLINE, HARD_DECLINE, AUTH_CHALLENGE, CARD_EXPIRATION
    recovery_status TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, DIAGNOSED, RECOVERY_INITIATED, RECOVERED, EXHAUSTED, MANUALLY_DISMISSED
    stopped_reason TEXT, -- PAYMENT_RECOVERED, MAX_RETRIES_EXHAUSTED, MANUALLY_DISMISSED
    retry_count INT NOT NULL DEFAULT 0,
    max_retries INT NOT NULL DEFAULT 3,
    ai_playbook JSONB, -- Stored diagnosis playbook, outreach copy, & confidence
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Recovery Attempts Table
CREATE TABLE IF NOT EXISTS recovery_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    failure_event_id UUID NOT NULL REFERENCES failure_events(id) ON DELETE CASCADE,
    attempt_number INT NOT NULL,
    recovery_action TEXT NOT NULL, -- GATEWAY_RETRY, PAYMENT_LINK_SMS, CARD_UPDATE_EMAIL, MANUAL_DISMISS
    status TEXT NOT NULL, -- SUCCESS, FAILED, PENDING
    gateway_response JSONB,
    executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Audit Log Table
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    failure_event_id UUID NOT NULL REFERENCES failure_events(id) ON DELETE CASCADE,
    action TEXT NOT NULL, -- CASE_CREATED, TIER1_DIAGNOSED, TIER2_AI_DIAGNOSED, RECOVERY_ATTEMPTED, STOPPING_RULE_ENFORCED
    diagnosis_source TEXT NOT NULL, -- TIER_1_DETERMINISTIC, TIER_2_AI, TIER_1_FALLBACK
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for high performance querying
CREATE INDEX IF NOT EXISTS idx_failure_events_subscription ON failure_events(subscription_id);
CREATE INDEX IF NOT EXISTS idx_failure_events_status ON failure_events(recovery_status);
CREATE INDEX IF NOT EXISTS idx_failure_events_category ON failure_events(failure_category);
CREATE INDEX IF NOT EXISTS idx_recovery_attempts_event ON recovery_attempts(failure_event_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_event ON audit_log(failure_event_id);
