-- DunningPilot Demo Seed Script
-- Run this in Supabase SQL Editor if you want to populate your live Supabase DB with initial demo data

-- 1. Insert Demo Subscriptions
INSERT INTO subscriptions (id, customer_id, customer_name, customer_email, plan_name, amount, currency, status, created_at)
VALUES 
  ('11111111-1111-1111-1111-111111111101', 'cust_rajesh_01', 'Rajesh Kumar', 'rajesh.kumar@techcorp.in', 'SaaS Pro Scale (Monthly)', 14999.00, 'INR', 'PAST_DUE', NOW() - INTERVAL '30 days'),
  ('11111111-1111-1111-1111-111111111102', 'cust_ananya_02', 'Ananya Sharma', 'ananya.s@designstudio.io', 'Analytics Suite (Monthly)', 4999.00, 'INR', 'PAST_DUE', NOW() - INTERVAL '60 days'),
  ('11111111-1111-1111-1111-111111111103', 'cust_vikram_03', 'Vikramaditya Rao', 'vikram@fintechsystems.com', 'Enterprise Dunning Engine', 29999.00, 'INR', 'PAST_DUE', NOW() - INTERVAL '45 days'),
  ('11111111-1111-1111-1111-111111111104', 'cust_priya_04', 'Priya Nair', 'priya.nair@growthlab.co', 'Growth Marketer Tier', 8499.00, 'INR', 'PAST_DUE', NOW() - INTERVAL '15 days'),
  ('11111111-1111-1111-1111-111111111105', 'cust_siddharth_05', 'Siddharth Verma', 'siddharth@cloudinfra.in', 'DevOps Platinum Stack', 19999.00, 'INR', 'PAST_DUE', NOW() - INTERVAL '10 days')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Demo Failure Events
INSERT INTO failure_events (id, subscription_id, razorpay_payment_id, razorpay_order_id, error_code, error_description, failure_category, recovery_status, stopped_reason, retry_count, max_retries, ai_playbook, created_at, updated_at)
VALUES
  (
    '22222222-2222-2222-2222-222222222201',
    '11111111-1111-1111-1111-111111111101',
    'pay_NkJ872Hskq92',
    'order_NkJ811Lks990',
    'INSUFFICIENT_FUNDS',
    'The customer card issuing bank reported insufficient funds in the account.',
    'SOFT_DECLINE',
    'PENDING',
    NULL,
    0,
    3,
    NULL,
    NOW() - INTERVAL '2 hours',
    NOW() - INTERVAL '2 hours'
  ),
  (
    '22222222-2222-2222-2222-222222222202',
    '11111111-1111-1111-1111-111111111102',
    'pay_MmP981Lks773',
    'order_MmP900Baa112',
    'EXPIRED_CARD',
    'Card expiry month/year is in the past.',
    'CARD_EXPIRATION',
    'PENDING',
    NULL,
    0,
    2,
    NULL,
    NOW() - INTERVAL '5 hours',
    NOW() - INTERVAL '5 hours'
  ),
  (
    '22222222-2222-2222-2222-222222222203',
    '11111111-1111-1111-1111-111111111103',
    'pay_KkL332Opi881',
    'order_KkL300Rrr443',
    'PAYMENT_AUTHENTICATION_FAILED',
    '3D Secure OTP authentication challenge timed out or customer abandoned auth screen.',
    'AUTH_CHALLENGE',
    'PENDING',
    NULL,
    0,
    2,
    NULL,
    NOW() - INTERVAL '1 hour',
    NOW() - INTERVAL '1 hour'
  ),
  (
    '22222222-2222-2222-2222-222222222204',
    '11111111-1111-1111-1111-111111111104',
    'pay_HhG441Uuu992',
    'order_HhG411Zzz110',
    'CARD_STOLEN_HARD_DECLINE',
    'Issuing bank flagged account as closed/stolen. Hard terminal decline.',
    'HARD_DECLINE',
    'PENDING',
    NULL,
    0,
    0,
    NULL,
    NOW() - INTERVAL '8 hours',
    NOW() - INTERVAL '8 hours'
  ),
  (
    '22222222-2222-2222-2222-222222222205',
    '11111111-1111-1111-1111-111111111105',
    'pay_QqW551Vvv883',
    'order_QqW500Xxx994',
    'GATEWAY_ERROR',
    'Network timeout during bank token processing.',
    'SOFT_DECLINE',
    'PENDING',
    NULL,
    0,
    3,
    NULL,
    NOW() - INTERVAL '3 hours',
    NOW() - INTERVAL '3 hours'
  )
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Initial Audit Logs
INSERT INTO audit_log (id, failure_event_id, action, diagnosis_source, payload, created_at)
VALUES
  (
    '33333333-3333-3333-3333-333333333301',
    '22222222-2222-2222-2222-222222222204',
    'CASE_CREATED',
    'TIER_1_DETERMINISTIC',
    '{"note": "Razorpay webhook received: CARD_STOLEN_HARD_DECLINE"}'::jsonb,
    NOW() - INTERVAL '8 hours'
  ),
  (
    '33333333-3333-3333-3333-333333333302',
    '22222222-2222-2222-2222-222222222202',
    'CASE_CREATED',
    'TIER_1_DETERMINISTIC',
    '{"note": "Razorpay webhook received: EXPIRED_CARD"}'::jsonb,
    NOW() - INTERVAL '5 hours'
  ),
  (
    '33333333-3333-3333-3333-333333333303',
    '22222222-2222-2222-2222-222222222201',
    'CASE_CREATED',
    'TIER_1_DETERMINISTIC',
    '{"note": "Razorpay webhook received: INSUFFICIENT_FUNDS"}'::jsonb,
    NOW() - INTERVAL '2 hours'
  )
ON CONFLICT (id) DO NOTHING;
