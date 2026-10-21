-- =============================================================================
-- Behavioural checks for 001_schema.sql. Run after loading the schema:
--   psql -v ON_ERROR_STOP=1 -f 001_schema.sql && psql -v ON_ERROR_STOP=1 -f verify_001.sql
-- Everything runs inside one transaction that is rolled back, so nothing is persisted.
-- Must be executed by a superuser (it seeds two tenants, then switches to the
-- non-bypass application role apex_app to prove that RLS and grants really work).
-- =============================================================================
\set ON_ERROR_STOP on
\set QUIET on
SET client_min_messages = notice;

BEGIN;

CREATE FUNCTION pg_temp.expect_error(p_sql text, p_state text, p_label text) RETURNS void
LANGUAGE plpgsql AS $$
BEGIN
  BEGIN
    EXECUTE p_sql;
  EXCEPTION WHEN OTHERS THEN
    IF SQLSTATE = p_state THEN
      RAISE NOTICE 'ok   - %', p_label;
      RETURN;
    END IF;
    RAISE EXCEPTION 'FAIL - % (expected %, got %: %)', p_label, p_state, SQLSTATE, SQLERRM;
  END;
  RAISE EXCEPTION 'FAIL - % (no error was raised)', p_label;
END $$;

CREATE FUNCTION pg_temp.expect_true(p_cond boolean, p_label text) RETURNS void
LANGUAGE plpgsql AS $$
BEGIN
  IF p_cond IS TRUE THEN
    RAISE NOTICE 'ok   - %', p_label;
  ELSE
    RAISE EXCEPTION 'FAIL - %', p_label;
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- Seed (superuser: bypasses RLS) - tenant B owns one product/offer/user.
-- ---------------------------------------------------------------------------
INSERT INTO platform.tenants (id, slug, name) VALUES
  ('aaaaaaaa-0000-0000-0000-000000000001', 'tenant-a', 'Tenant A'),
  ('bbbbbbbb-0000-0000-0000-000000000002', 'tenant-b', 'Tenant B');

INSERT INTO iam.users (id, tenant_id, email) VALUES
  ('bbbbbbbb-1111-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000002', 'b@example.com');
INSERT INTO catalog.products (id, tenant_id, type, slug, title, status, compliance_status) VALUES
  ('bbbbbbbb-2222-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000002', 'course', 'curso-b', 'Curso B', 'published', 'approved');
INSERT INTO catalog.offers (id, tenant_id, product_id, name, kind, price_cents, status) VALUES
  ('bbbbbbbb-3333-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000002', 'bbbbbbbb-2222-0000-0000-000000000001', 'Oferta B', 'one_time', 9900, 'active');

SELECT pg_temp.expect_true((SELECT count(*) FROM pg_roles WHERE rolname = 'apex_app' AND NOT rolbypassrls) = 1,
  'application role exists and cannot bypass RLS');

-- ---------------------------------------------------------------------------
-- From here on we act as the application, scoped to tenant A.
-- ---------------------------------------------------------------------------
SET LOCAL ROLE apex_app;
SELECT set_config('app.tenant_id', 'aaaaaaaa-0000-0000-0000-000000000001', true);

INSERT INTO iam.users (id, tenant_id, email) VALUES
  ('aaaaaaaa-1111-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'Aluna@Example.com');

-- 1. Row level security ------------------------------------------------------
SELECT pg_temp.expect_true((SELECT count(*) FROM iam.users) = 1, 'RLS: tenant A sees only its own users');
SELECT pg_temp.expect_true((SELECT count(*) FROM catalog.products) = 0, 'RLS: tenant A cannot see tenant B products');
SELECT pg_temp.expect_error(
  $$INSERT INTO iam.users (tenant_id, email) VALUES ('bbbbbbbb-0000-0000-0000-000000000002', 'x@example.com')$$,
  '42501', 'RLS: cannot write rows into another tenant');
SELECT pg_temp.expect_error(
  $$INSERT INTO iam.users (tenant_id, email) VALUES ('aaaaaaaa-0000-0000-0000-000000000001', 'aluna@example.com')$$,
  '23505', 'emails are case-insensitive unique per tenant (citext)');

-- Same session without a tenant must see nothing (fail closed).
SELECT set_config('app.tenant_id', '', true);
SELECT pg_temp.expect_true((SELECT count(*) FROM iam.users) = 0, 'RLS: no tenant set => no rows (fail closed)');
SELECT set_config('app.tenant_id', 'aaaaaaaa-0000-0000-0000-000000000001', true);

-- 2. Catalog rules --------------------------------------------------------------
INSERT INTO catalog.products (id, tenant_id, type, slug, title) VALUES
  ('aaaaaaaa-2222-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'course', 'curso-a', 'Curso A');

SELECT pg_temp.expect_error(
  $$UPDATE catalog.products SET status = 'published' WHERE id = 'aaaaaaaa-2222-0000-0000-000000000001'$$,
  '23514', 'Guardian gate: cannot publish without compliance approval');

UPDATE catalog.products SET compliance_status = 'approved' WHERE id = 'aaaaaaaa-2222-0000-0000-000000000001';
UPDATE catalog.products SET status = 'published' WHERE id = 'aaaaaaaa-2222-0000-0000-000000000001';

SELECT pg_temp.expect_error(
  $$INSERT INTO catalog.offers (tenant_id, product_id, name, kind, price_cents, guarantee_days)
    VALUES ('aaaaaaaa-0000-0000-0000-000000000001', 'aaaaaaaa-2222-0000-0000-000000000001', 'x', 'one_time', 100, 3)$$,
  '23514', 'offers: guarantee below the 7-day legal minimum is rejected');
SELECT pg_temp.expect_error(
  $$INSERT INTO catalog.offers (tenant_id, product_id, name, kind, price_cents)
    VALUES ('aaaaaaaa-0000-0000-0000-000000000001', 'aaaaaaaa-2222-0000-0000-000000000001', 'x', 'subscription', 100)$$,
  '23514', 'offers: subscription requires a billing interval');

INSERT INTO catalog.offers (id, tenant_id, product_id, name, kind, price_cents, status) VALUES
  ('aaaaaaaa-3333-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'aaaaaaaa-2222-0000-0000-000000000001', 'Oferta A', 'one_time', 19900, 'active');

-- Cross-tenant reference through composite FK (offer belongs to tenant B).
SELECT pg_temp.expect_error(
  $$INSERT INTO catalog.offers (tenant_id, product_id, name, kind, price_cents)
    VALUES ('aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-2222-0000-0000-000000000001', 'x', 'one_time', 100)$$,
  '23503', 'composite FK: offer cannot point to another tenant''s product');

-- 3. Orders, payments, enrollments ------------------------------------------------
INSERT INTO commerce.orders (id, tenant_id, user_id, status, subtotal_cents, discount_cents, total_cents) VALUES
  ('aaaaaaaa-4444-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001',
   'aaaaaaaa-1111-0000-0000-000000000001', 'pending', 19900, 0, 19900);

SELECT pg_temp.expect_error(
  $$INSERT INTO commerce.orders (tenant_id, user_id, subtotal_cents, discount_cents, total_cents)
    VALUES ('aaaaaaaa-0000-0000-0000-000000000001', 'aaaaaaaa-1111-0000-0000-000000000001', 1000, 100, 1000)$$,
  '23514', 'orders: total must equal subtotal - discount');
SELECT pg_temp.expect_error(
  $$INSERT INTO commerce.orders (tenant_id, subtotal_cents, total_cents)
    VALUES ('aaaaaaaa-0000-0000-0000-000000000001', 1000, 1000)$$,
  '23514', 'orders: need a user or a contact');

SELECT pg_temp.expect_error(
  $$INSERT INTO commerce.order_items (tenant_id, order_id, offer_id, product_id, unit_price_cents, total_cents)
    VALUES ('aaaaaaaa-0000-0000-0000-000000000001', 'aaaaaaaa-4444-0000-0000-000000000001',
            'bbbbbbbb-3333-0000-0000-000000000001', 'aaaaaaaa-2222-0000-0000-000000000001', 9900, 9900)$$,
  '23503', 'composite FK: order item cannot use another tenant''s offer');

INSERT INTO commerce.order_items (id, tenant_id, order_id, offer_id, product_id, unit_price_cents, total_cents) VALUES
  ('aaaaaaaa-5555-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'aaaaaaaa-4444-0000-0000-000000000001',
   'aaaaaaaa-3333-0000-0000-000000000001', 'aaaaaaaa-2222-0000-0000-000000000001', 19900, 19900);

INSERT INTO commerce.payments (id, tenant_id, order_id, psp, psp_ref, method, amount_cents) VALUES
  ('aaaaaaaa-6666-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'aaaaaaaa-4444-0000-0000-000000000001',
   'psp_x', 'pay_123', 'pix', 19900);
SELECT pg_temp.expect_error(
  $$INSERT INTO commerce.payments (tenant_id, order_id, psp, psp_ref, method, amount_cents)
    VALUES ('aaaaaaaa-0000-0000-0000-000000000001', 'aaaaaaaa-4444-0000-0000-000000000001', 'psp_x', 'pay_123', 'pix', 19900)$$,
  '23505', 'payments: duplicate PSP reference rejected (webhook idempotency anchor)');

SELECT pg_temp.expect_error(
  $$INSERT INTO commerce.refunds (tenant_id, order_id, payment_id, amount_cents, auto_approved, within_withdrawal_period)
    VALUES ('aaaaaaaa-0000-0000-0000-000000000001', 'aaaaaaaa-4444-0000-0000-000000000001',
            'aaaaaaaa-6666-0000-0000-000000000001', 19900, true, false)$$,
  '23514', 'refunds: auto-approval only inside the withdrawal period');

INSERT INTO lms.enrollments (id, tenant_id, user_id, product_id, order_item_id) VALUES
  ('aaaaaaaa-7777-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'aaaaaaaa-1111-0000-0000-000000000001',
   'aaaaaaaa-2222-0000-0000-000000000001', 'aaaaaaaa-5555-0000-0000-000000000001');
SELECT pg_temp.expect_error(
  $$INSERT INTO lms.enrollments (tenant_id, user_id, product_id)
    VALUES ('aaaaaaaa-0000-0000-0000-000000000001', 'aaaaaaaa-1111-0000-0000-000000000001', 'aaaaaaaa-2222-0000-0000-000000000001')$$,
  '23505', 'enrollments: one live enrollment per person and product');

-- 4. Certificates --------------------------------------------------------------------
INSERT INTO lms.certificates (tenant_id, enrollment_id, user_id, product_id, kind, code, holder_name, workload_minutes) VALUES
  ('aaaaaaaa-0000-0000-0000-000000000001', 'aaaaaaaa-7777-0000-0000-000000000001', 'aaaaaaaa-1111-0000-0000-000000000001',
   'aaaaaaaa-2222-0000-0000-000000000001', 'completion', 'APX-TEST-0001', 'Aluna Teste', 480);
SELECT pg_temp.expect_error(
  $$INSERT INTO lms.certificates (tenant_id, enrollment_id, user_id, product_id, kind, code, holder_name, workload_minutes)
    VALUES ('aaaaaaaa-0000-0000-0000-000000000001', 'aaaaaaaa-7777-0000-0000-000000000001', 'aaaaaaaa-1111-0000-0000-000000000001',
            'aaaaaaaa-2222-0000-0000-000000000001', 'completion', 'APX-TEST-0002', 'Aluna Teste', 480)$$,
  '23505', 'certificates: no duplicate completion certificate per enrollment');
SELECT pg_temp.expect_error(
  $$UPDATE lms.certificates SET status = 'revoked' WHERE code = 'APX-TEST-0001'$$,
  '23514', 'certificates: revocation needs a revocation timestamp');

-- 5. Ledger -----------------------------------------------------------------------------
INSERT INTO commerce.ledger_accounts (id, tenant_id, code, name, kind) VALUES
  ('aaaaaaaa-8888-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', '1.1', 'PSP receivable', 'asset'),
  ('aaaaaaaa-8888-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000001', '4.1', 'Course revenue', 'revenue');

INSERT INTO commerce.ledger_entries (tenant_id, txn_id, account_id, direction, amount_cents) VALUES
  ('aaaaaaaa-0000-0000-0000-000000000001', 'aaaaaaaa-9999-0000-0000-000000000001', 'aaaaaaaa-8888-0000-0000-000000000001', 'D', 19900),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'aaaaaaaa-9999-0000-0000-000000000001', 'aaaaaaaa-8888-0000-0000-000000000002', 'C', 19900);
SET CONSTRAINTS ALL IMMEDIATE;
SELECT pg_temp.expect_true(true, 'ledger: a balanced transaction is accepted');
SET CONSTRAINTS ALL DEFERRED;

SELECT pg_temp.expect_error(
  $$INSERT INTO commerce.ledger_entries (tenant_id, txn_id, account_id, direction, amount_cents)
    VALUES ('aaaaaaaa-0000-0000-0000-000000000001', 'aaaaaaaa-9999-0000-0000-000000000002', 'aaaaaaaa-8888-0000-0000-000000000001', 'D', 500);
    SET CONSTRAINTS ALL IMMEDIATE$$,
  '23514', 'ledger: an unbalanced transaction is rejected');

SELECT pg_temp.expect_error(
  $$UPDATE commerce.ledger_entries SET amount_cents = 1 WHERE amount_cents = 19900$$,
  '42501', 'ledger: entries are append-only for the application role');

-- 6. Audit log -------------------------------------------------------------------------------
INSERT INTO platform.audit_logs (tenant_id, actor_type, actor_id, action, target_type, target_id) VALUES
  ('aaaaaaaa-0000-0000-0000-000000000001', 'user', 'aaaaaaaa-1111-0000-0000-000000000001', 'order.refund.requested', 'order', 'x');
SELECT pg_temp.expect_error(
  $$DELETE FROM platform.audit_logs$$, '42501', 'audit: application role cannot delete audit rows');

-- 7. Marketing / AI / ops guards -----------------------------------------------------------------
SELECT pg_temp.expect_error(
  $$INSERT INTO growth.campaigns (tenant_id, name, channel, status)
    VALUES ('aaaaaaaa-0000-0000-0000-000000000001', 'Black', 'email', 'sent')$$,
  '23514', 'campaigns: mass send requires a human approval');

INSERT INTO ai.agents (id, tenant_id, key, name) VALUES
  ('aaaaaaaa-aaaa-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'AG-01', 'APEX Tutor');
SELECT pg_temp.expect_error(
  $$INSERT INTO ai.agent_versions (tenant_id, agent_id, version, config, status)
    VALUES ('aaaaaaaa-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-0000-0000-000000000001', 1, '{}', 'active')$$,
  '23514', 'agents: an active version needs an approver');

SELECT pg_temp.expect_error(
  $$INSERT INTO ai.knowledge_chunks (tenant_id, source_id, content, visibility)
    VALUES ('aaaaaaaa-0000-0000-0000-000000000001', gen_random_uuid(), 'x', 'public')$$,
  '23503', 'RAG: chunks must reference an existing source');

INSERT INTO ai.knowledge_sources (id, tenant_id, product_id, source_type, source_ref) VALUES
  ('aaaaaaaa-dddd-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001',
   'aaaaaaaa-2222-0000-0000-000000000001', 'lesson_transcript', 'lesson-1');
SELECT pg_temp.expect_error(
  $$INSERT INTO ai.knowledge_chunks (tenant_id, source_id, content, visibility)
    VALUES ('aaaaaaaa-0000-0000-0000-000000000001', 'aaaaaaaa-dddd-0000-0000-000000000001', 'x', 'entitled')$$,
  '23514', 'RAG: non-public chunks must be bound to a product (entitlement filter)');
INSERT INTO ai.knowledge_chunks (tenant_id, source_id, product_id, content, t_start, t_end) VALUES
  ('aaaaaaaa-0000-0000-0000-000000000001', 'aaaaaaaa-dddd-0000-0000-000000000001',
   'aaaaaaaa-2222-0000-0000-000000000001', 'A fotossíntese converte luz em energia química.', 10, 42);
SELECT pg_temp.expect_true(
  (SELECT count(*) FROM ai.knowledge_chunks WHERE tsv @@ plainto_tsquery('portuguese', 'fotossíntese')) = 1,
  'RAG: Portuguese full-text search works on chunks');

SELECT pg_temp.expect_error(
  $$INSERT INTO ops.kb_articles (tenant_id, slug, title, body, status)
    VALUES ('aaaaaaaa-0000-0000-0000-000000000001', 'x', 'x', 'x', 'published')$$,
  '23514', 'KB: AI-drafted articles cannot be published without human review');

INSERT INTO ops.dsar_requests (id, tenant_id, user_id, kind) VALUES
  ('aaaaaaaa-bbbb-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'aaaaaaaa-1111-0000-0000-000000000001', 'access');
SELECT pg_temp.expect_true(
  (SELECT due_at - received_at FROM ops.dsar_requests WHERE id = 'aaaaaaaa-bbbb-0000-0000-000000000001') = interval '15 days',
  'DSAR: default deadline is 15 days');
SELECT pg_temp.expect_error(
  $$UPDATE ops.dsar_requests SET status = 'denied_with_reason' WHERE id = 'aaaaaaaa-bbbb-0000-0000-000000000001'$$,
  '23514', 'DSAR: a denial must record its reason');

-- 8. Live: mentoring slots cannot overlap ----------------------------------------------------------
RESET ROLE;
INSERT INTO catalog.instructors (id, tenant_id, user_id, display_name) VALUES
  ('aaaaaaaa-cccc-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'aaaaaaaa-1111-0000-0000-000000000001', 'Prof. A');
INSERT INTO live.mentoring_slots (tenant_id, instructor_id, starts_at, ends_at) VALUES
  ('aaaaaaaa-0000-0000-0000-000000000001', 'aaaaaaaa-cccc-0000-0000-000000000001', '2030-01-01 10:00+00', '2030-01-01 11:00+00');
SELECT pg_temp.expect_error(
  $$INSERT INTO live.mentoring_slots (tenant_id, instructor_id, starts_at, ends_at)
    VALUES ('aaaaaaaa-0000-0000-0000-000000000001', 'aaaaaaaa-cccc-0000-0000-000000000001', '2030-01-01 10:30+00', '2030-01-01 11:30+00')$$,
  '23P01', 'mentoring: overlapping slots for one instructor are rejected');

-- 9. Append-only also holds for superusers (trigger) --------------------------------------------------
SELECT pg_temp.expect_error(
  $$UPDATE platform.audit_logs SET action = 'tampered'$$, '42501', 'audit: trigger blocks updates even for superusers');

-- 10. Analytics partitions ----------------------------------------------------------------------------------
INSERT INTO analytics.events (tenant_id, occurred_at, name) VALUES
  ('aaaaaaaa-0000-0000-0000-000000000001', now(), 'lesson.completed');
SELECT pg_temp.expect_true(
  (SELECT tableoid::regclass::text FROM analytics.events LIMIT 1) = format('analytics.events_%s', to_char(now(), 'YYYY_MM')),
  'analytics: events land in the current monthly partition');

ROLLBACK;
\echo 'ALL SCHEMA CHECKS PASSED'
