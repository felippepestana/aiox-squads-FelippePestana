-- =============================================================================
-- APEX Plataforma de Cursos Livres - core schema (draft v0.1)
-- Target: PostgreSQL 16. Extensions required: citext, pg_trgm, btree_gist.
-- Conventions:
--   * one Postgres schema per product module (see docs/apex-cursos-livres/12-modelo-de-dados.md)
--   * every business table carries tenant_id and is protected by RLS (see section 99)
--   * money is stored as bigint cents + ISO currency (default BRL)
--   * critical parent/child pairs use composite FKs (tenant_id, id) so rows of
--     different tenants can never be linked
--   * vector search lives in 002_ai_vector.sql (requires the pgvector extension)
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE SCHEMA IF NOT EXISTS platform;
CREATE SCHEMA IF NOT EXISTS iam;
CREATE SCHEMA IF NOT EXISTS catalog;
CREATE SCHEMA IF NOT EXISTS media;
CREATE SCHEMA IF NOT EXISTS crm;
CREATE SCHEMA IF NOT EXISTS growth;
CREATE SCHEMA IF NOT EXISTS commerce;
CREATE SCHEMA IF NOT EXISTS lms;
CREATE SCHEMA IF NOT EXISTS live;
CREATE SCHEMA IF NOT EXISTS engage;
CREATE SCHEMA IF NOT EXISTS ai;
CREATE SCHEMA IF NOT EXISTS ops;
CREATE SCHEMA IF NOT EXISTS analytics;

-- -----------------------------------------------------------------------------
-- 00. Platform
-- -----------------------------------------------------------------------------

-- Tenant id of the current request/session; set by the app with SET LOCAL app.tenant_id.
CREATE OR REPLACE FUNCTION platform.current_tenant() RETURNS uuid
LANGUAGE sql STABLE AS $$
  SELECT NULLIF(current_setting('app.tenant_id', true), '')::uuid
$$;

CREATE OR REPLACE FUNCTION platform.set_updated_at() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END $$;

CREATE TABLE platform.tenants (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]{3,63}$'),
  name        text NOT NULL,
  status      text NOT NULL DEFAULT 'active' CHECK (status IN ('active','suspended','closed')),
  settings    jsonb NOT NULL DEFAULT '{}',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE platform.feature_flags (
  tenant_id   uuid NOT NULL REFERENCES platform.tenants(id),
  key         text NOT NULL,
  enabled     boolean NOT NULL DEFAULT false,
  rollout     jsonb NOT NULL DEFAULT '{}',
  updated_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (tenant_id, key)
);

-- Transactional outbox: written in the same transaction as the state change.
CREATE TABLE platform.outbox_events (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id      uuid NOT NULL REFERENCES platform.tenants(id),
  aggregate_type text NOT NULL,
  aggregate_id   uuid NOT NULL,
  event_type     text NOT NULL,           -- e.g. order.paid
  event_version  int  NOT NULL DEFAULT 1,
  payload        jsonb NOT NULL,
  occurred_at    timestamptz NOT NULL DEFAULT now(),
  published_at   timestamptz,
  attempts       int NOT NULL DEFAULT 0,
  last_error     text
);
CREATE INDEX outbox_unpublished_idx ON platform.outbox_events (occurred_at) WHERE published_at IS NULL;

CREATE TABLE platform.webhook_endpoints (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES platform.tenants(id),
  url         text NOT NULL CHECK (url ~ '^https://'),
  secret_hash text NOT NULL,
  events      text[] NOT NULL DEFAULT '{}',
  active      boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, id)
);

CREATE TABLE platform.webhook_deliveries (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id        uuid NOT NULL REFERENCES platform.tenants(id),
  endpoint_id      uuid NOT NULL,
  event_id         uuid NOT NULL REFERENCES platform.outbox_events(id),
  status           text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','delivered','failed','dead')),
  attempts         int NOT NULL DEFAULT 0,
  last_status_code int,
  next_attempt_at  timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, endpoint_id) REFERENCES platform.webhook_endpoints (tenant_id, id)
);
CREATE INDEX webhook_deliveries_due_idx ON platform.webhook_deliveries (next_attempt_at) WHERE status IN ('pending','failed');

CREATE TABLE platform.api_keys (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    uuid NOT NULL REFERENCES platform.tenants(id),
  name         text NOT NULL,
  key_hash     text NOT NULL UNIQUE,      -- only the hash is stored
  scopes       text[] NOT NULL DEFAULT '{}',
  last_used_at timestamptz,
  expires_at   timestamptz,
  revoked_at   timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- Append-only audit trail (UPDATE/DELETE blocked by trigger below).
CREATE TABLE platform.audit_logs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES platform.tenants(id),
  occurred_at timestamptz NOT NULL DEFAULT now(),
  actor_type  text NOT NULL CHECK (actor_type IN ('user','agent','system','api_key')),
  actor_id    text NOT NULL,
  action      text NOT NULL,
  target_type text,
  target_id   text,
  metadata    jsonb NOT NULL DEFAULT '{}',
  ip          inet,
  request_id  text
);
CREATE INDEX audit_logs_target_idx ON platform.audit_logs (tenant_id, target_type, target_id, occurred_at DESC);
CREATE INDEX audit_logs_actor_idx  ON platform.audit_logs (tenant_id, actor_type, actor_id, occurred_at DESC);

CREATE TABLE platform.idempotency_keys (
  tenant_id       uuid NOT NULL REFERENCES platform.tenants(id),
  key             text NOT NULL,
  request_hash    text NOT NULL,
  response_status int,
  response_body   jsonb,
  created_at      timestamptz NOT NULL DEFAULT now(),
  expires_at      timestamptz NOT NULL DEFAULT now() + interval '48 hours',
  PRIMARY KEY (tenant_id, key)
);

-- -----------------------------------------------------------------------------
-- 01. IAM
-- -----------------------------------------------------------------------------

CREATE TABLE iam.users (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id         uuid NOT NULL REFERENCES platform.tenants(id),
  email             citext NOT NULL,
  email_verified_at timestamptz,
  password_hash     text,                  -- null for passwordless / social accounts
  status            text NOT NULL DEFAULT 'active' CHECK (status IN ('pending','active','blocked','deleted')),
  locale            text NOT NULL DEFAULT 'pt-BR',
  timezone          text NOT NULL DEFAULT 'America/Sao_Paulo',
  last_login_at     timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, email),
  UNIQUE (tenant_id, id)
);

-- Sensitive fields are encrypted by the application (envelope encryption);
-- document_hash is an HMAC used for deduplication/search without exposing the CPF.
CREATE TABLE iam.person_profiles (
  user_id       uuid PRIMARY KEY REFERENCES iam.users(id) ON DELETE CASCADE,
  tenant_id     uuid NOT NULL REFERENCES platform.tenants(id),
  full_name     text,
  display_name  text,
  document_type text CHECK (document_type IN ('cpf','cnpj')),
  document_hash bytea,
  document_enc  bytea,
  birth_date    date,
  phone_e164    text CHECK (phone_e164 ~ '^\+[1-9][0-9]{7,14}$'),
  address       jsonb,
  age_status    text NOT NULL DEFAULT 'unknown'
                CHECK (age_status IN ('unknown','adult_declared','adult_verified','minor_with_guardian')),
  avatar_url    text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX person_profiles_document_uq ON iam.person_profiles (tenant_id, document_hash) WHERE document_hash IS NOT NULL;

CREATE TABLE iam.roles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES platform.tenants(id),
  key         text NOT NULL,
  name        text NOT NULL,
  permissions text[] NOT NULL DEFAULT '{}',
  is_system   boolean NOT NULL DEFAULT false,
  UNIQUE (tenant_id, key),
  UNIQUE (tenant_id, id)
);

CREATE TABLE iam.memberships (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  uuid NOT NULL REFERENCES platform.tenants(id),
  user_id    uuid NOT NULL,
  role_id    uuid NOT NULL,
  scope_type text NOT NULL DEFAULT 'tenant' CHECK (scope_type IN ('tenant','product','cohort')),
  scope_id   uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, user_id) REFERENCES iam.users (tenant_id, id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id, role_id) REFERENCES iam.roles (tenant_id, id),
  CHECK ((scope_type = 'tenant') = (scope_id IS NULL))
);
CREATE UNIQUE INDEX memberships_uq ON iam.memberships
  (tenant_id, user_id, role_id, scope_type, COALESCE(scope_id, '00000000-0000-0000-0000-000000000000'::uuid));

CREATE TABLE iam.consent_versions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    uuid NOT NULL REFERENCES platform.tenants(id),
  kind         text NOT NULL CHECK (kind IN ('terms','privacy','cookies','refund_policy','marketing_email',
                                             'marketing_whatsapp','marketing_sms','ai_memory','recording','affiliate_terms')),
  version      text NOT NULL,
  content_hash text NOT NULL,
  published_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, kind, version),
  UNIQUE (tenant_id, id)
);

-- Proof of consent (who, what version, when, from where). contact_id links to crm.contacts (added later).
CREATE TABLE iam.consents (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id          uuid NOT NULL REFERENCES platform.tenants(id),
  user_id            uuid,
  contact_id         uuid,
  consent_version_id uuid NOT NULL,
  granted            boolean NOT NULL,
  granted_at         timestamptz NOT NULL DEFAULT now(),
  revoked_at         timestamptz,
  ip                 inet,
  user_agent         text,
  source             text NOT NULL DEFAULT 'web',
  FOREIGN KEY (tenant_id, user_id) REFERENCES iam.users (tenant_id, id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id, consent_version_id) REFERENCES iam.consent_versions (tenant_id, id),
  CHECK (user_id IS NOT NULL OR contact_id IS NOT NULL),
  UNIQUE (tenant_id, id)
);
CREATE INDEX consents_user_idx ON iam.consents (tenant_id, user_id, consent_version_id);

CREATE TABLE iam.guardianships (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id        uuid NOT NULL REFERENCES platform.tenants(id),
  guardian_user_id uuid NOT NULL,
  minor_user_id    uuid NOT NULL,
  status           text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','verified','revoked')),
  verified_at      timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, guardian_user_id) REFERENCES iam.users (tenant_id, id),
  FOREIGN KEY (tenant_id, minor_user_id)    REFERENCES iam.users (tenant_id, id),
  CHECK (guardian_user_id <> minor_user_id),
  UNIQUE (tenant_id, guardian_user_id, minor_user_id)
);

CREATE TABLE iam.sessions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    uuid NOT NULL REFERENCES platform.tenants(id),
  user_id      uuid NOT NULL,
  device       jsonb NOT NULL DEFAULT '{}',
  ip           inet,
  created_at   timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  expires_at   timestamptz NOT NULL,
  revoked_at   timestamptz,
  FOREIGN KEY (tenant_id, user_id) REFERENCES iam.users (tenant_id, id) ON DELETE CASCADE
);
CREATE INDEX sessions_user_idx ON iam.sessions (tenant_id, user_id) WHERE revoked_at IS NULL;

CREATE TABLE iam.mfa_factors (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES platform.tenants(id),
  user_id     uuid NOT NULL,
  kind        text NOT NULL CHECK (kind IN ('totp','webauthn')),
  secret_enc  bytea NOT NULL,
  label       text,
  verified_at timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, user_id) REFERENCES iam.users (tenant_id, id) ON DELETE CASCADE
);

-- -----------------------------------------------------------------------------
-- 02. Media
-- -----------------------------------------------------------------------------

CREATE TABLE media.assets (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid NOT NULL REFERENCES platform.tenants(id),
  kind            text NOT NULL CHECK (kind IN ('video','audio','image','document','ebook','certificate','export','caption')),
  provider        text NOT NULL,           -- e.g. mux, bunny, s3
  provider_ref    text,
  storage_key     text,
  mime_type       text,
  size_bytes      bigint CHECK (size_bytes >= 0),
  duration_seconds int CHECK (duration_seconds >= 0),
  status          text NOT NULL DEFAULT 'uploading' CHECK (status IN ('uploading','processing','ready','failed','deleted')),
  captions        jsonb NOT NULL DEFAULT '[]',
  checksum_sha256 text,
  protection      jsonb NOT NULL DEFAULT '{}',   -- signed URL policy, DRM, watermark
  created_by      uuid REFERENCES iam.users(id),
  created_at      timestamptz NOT NULL DEFAULT now(),
  deleted_at      timestamptz,
  UNIQUE (tenant_id, id)
);

-- -----------------------------------------------------------------------------
-- 03. Catalog
-- -----------------------------------------------------------------------------

CREATE TABLE catalog.instructors (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    uuid NOT NULL REFERENCES platform.tenants(id),
  user_id      uuid NOT NULL,
  display_name text NOT NULL,
  bio          text,
  status       text NOT NULL DEFAULT 'invited' CHECK (status IN ('invited','active','suspended')),
  kyc_status   text NOT NULL DEFAULT 'pending' CHECK (kyc_status IN ('pending','verified','rejected')),
  contract_id  uuid,                         -- FK to ops.contracts added below
  created_at   timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, user_id) REFERENCES iam.users (tenant_id, id),
  UNIQUE (tenant_id, user_id),
  UNIQUE (tenant_id, id)
);

CREATE TABLE catalog.categories (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES platform.tenants(id),
  parent_id uuid REFERENCES catalog.categories(id),
  slug      text NOT NULL,
  name      text NOT NULL,
  position  int NOT NULL DEFAULT 0,
  UNIQUE (tenant_id, slug),
  UNIQUE (tenant_id, id)
);

CREATE TABLE catalog.products (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id         uuid NOT NULL REFERENCES platform.tenants(id),
  type              text NOT NULL CHECK (type IN ('course','track','ebook','webinar','workshop','mentoring',
                                                 'subscription','event','exam','bundle','digital_resource',
                                                 'gift_card','corporate_license')),
  slug              text NOT NULL,
  title             text NOT NULL,
  summary           text,
  description       text,
  level             text CHECK (level IN ('beginner','intermediate','advanced','all')),
  language          text NOT NULL DEFAULT 'pt-BR',
  workload_minutes  int CHECK (workload_minutes > 0),
  status            text NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft','in_review','scheduled','published','paused','archived')),
  compliance_status text NOT NULL DEFAULT 'pending'
                    CHECK (compliance_status IN ('pending','approved','blocked','needs_legal_review')),
  cover_asset_id    uuid,
  owner_user_id     uuid REFERENCES iam.users(id),
  scheduled_at      timestamptz,
  published_at      timestamptz,
  seo               jsonb NOT NULL DEFAULT '{}',
  metadata          jsonb NOT NULL DEFAULT '{}',
  version           int NOT NULL DEFAULT 1,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, cover_asset_id) REFERENCES media.assets (tenant_id, id),
  UNIQUE (tenant_id, slug),
  UNIQUE (tenant_id, id),
  -- Compliance Guardian gate: nothing can be published without approval.
  CHECK (status <> 'published' OR compliance_status = 'approved')
);
CREATE INDEX products_listing_idx ON catalog.products (tenant_id, status, type);
CREATE INDEX products_title_trgm_idx ON catalog.products USING gin (title gin_trgm_ops);

CREATE TABLE catalog.product_categories (
  tenant_id   uuid NOT NULL REFERENCES platform.tenants(id),
  product_id  uuid NOT NULL,
  category_id uuid NOT NULL,
  PRIMARY KEY (product_id, category_id),
  FOREIGN KEY (tenant_id, product_id)  REFERENCES catalog.products (tenant_id, id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id, category_id) REFERENCES catalog.categories (tenant_id, id) ON DELETE CASCADE
);

CREATE TABLE catalog.product_instructors (
  tenant_id         uuid NOT NULL REFERENCES platform.tenants(id),
  product_id        uuid NOT NULL,
  instructor_id     uuid NOT NULL,
  role              text NOT NULL DEFAULT 'lead' CHECK (role IN ('lead','co','guest','mentor')),
  revenue_share_bps int NOT NULL DEFAULT 0 CHECK (revenue_share_bps BETWEEN 0 AND 10000),
  PRIMARY KEY (product_id, instructor_id),
  FOREIGN KEY (tenant_id, product_id)    REFERENCES catalog.products (tenant_id, id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id, instructor_id) REFERENCES catalog.instructors (tenant_id, id)
);

CREATE TABLE catalog.offers (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id        uuid NOT NULL REFERENCES platform.tenants(id),
  product_id       uuid NOT NULL,
  name             text NOT NULL,
  kind             text NOT NULL CHECK (kind IN ('one_time','installments','subscription','free')),
  price_cents      bigint NOT NULL CHECK (price_cents >= 0),
  currency         char(3) NOT NULL DEFAULT 'BRL',
  installments_max int NOT NULL DEFAULT 1 CHECK (installments_max BETWEEN 1 AND 24),
  interest_bps     int NOT NULL DEFAULT 0 CHECK (interest_bps >= 0),
  billing_interval text CHECK (billing_interval IN ('month','quarter','year')),
  trial_days       int NOT NULL DEFAULT 0 CHECK (trial_days >= 0),
  access_rule      jsonb NOT NULL DEFAULT '{"type":"lifetime"}',
  valid_from       timestamptz,
  valid_to         timestamptz,
  -- 7 calendar days is the legal minimum for distance sales (CDC art. 49); extended guarantees are allowed.
  guarantee_days   int NOT NULL DEFAULT 7 CHECK (guarantee_days >= 7),
  max_seats        int CHECK (max_seats > 0),
  audience         jsonb NOT NULL DEFAULT '{}',
  status           text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','active','paused','ended')),
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, product_id) REFERENCES catalog.products (tenant_id, id),
  CHECK ((kind = 'subscription') = (billing_interval IS NOT NULL)),
  CHECK (kind <> 'free' OR price_cents = 0),
  CHECK (valid_to IS NULL OR valid_from IS NULL OR valid_to > valid_from),
  UNIQUE (tenant_id, id)
);
CREATE INDEX offers_product_idx ON catalog.offers (tenant_id, product_id, status);

CREATE TABLE catalog.bundle_items (
  tenant_id         uuid NOT NULL REFERENCES platform.tenants(id),
  bundle_product_id uuid NOT NULL,
  item_product_id   uuid NOT NULL,
  position          int NOT NULL DEFAULT 0,
  PRIMARY KEY (bundle_product_id, item_product_id),
  FOREIGN KEY (tenant_id, bundle_product_id) REFERENCES catalog.products (tenant_id, id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id, item_product_id)   REFERENCES catalog.products (tenant_id, id),
  CHECK (bundle_product_id <> item_product_id)
);

CREATE TABLE catalog.coupons (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id        uuid NOT NULL REFERENCES platform.tenants(id),
  code             citext NOT NULL,
  percent_bps      int CHECK (percent_bps BETWEEN 1 AND 10000),
  fixed_cents      bigint CHECK (fixed_cents > 0),
  max_redemptions  int CHECK (max_redemptions > 0),
  redeemed_count   int NOT NULL DEFAULT 0 CHECK (redeemed_count >= 0),
  valid_from       timestamptz,
  valid_to         timestamptz,
  applies_to       jsonb NOT NULL DEFAULT '{}',   -- product ids / collections / first purchase only
  stackable        boolean NOT NULL DEFAULT false,
  affiliate_id     uuid,                          -- FK to growth.affiliates added below
  active           boolean NOT NULL DEFAULT true,
  created_at       timestamptz NOT NULL DEFAULT now(),
  CHECK ((percent_bps IS NOT NULL) <> (fixed_cents IS NOT NULL)),
  CHECK (max_redemptions IS NULL OR redeemed_count <= max_redemptions),
  UNIQUE (tenant_id, code),
  UNIQUE (tenant_id, id)
);

-- Verified-buyer reviews only (order_id FK added after commerce.orders exists).
CREATE TABLE catalog.reviews (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  uuid NOT NULL REFERENCES platform.tenants(id),
  product_id uuid NOT NULL,
  user_id    uuid NOT NULL,
  order_id   uuid NOT NULL,
  rating     smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body       text,
  status     text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','published','hidden')),
  created_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, product_id) REFERENCES catalog.products (tenant_id, id),
  FOREIGN KEY (tenant_id, user_id)    REFERENCES iam.users (tenant_id, id),
  UNIQUE (tenant_id, product_id, user_id)
);

-- Configurable term lists for the Compliance Guardian (see docs 07 section 4.2 and 08 section 6.3).
CREATE TABLE catalog.compliance_terms (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  uuid NOT NULL REFERENCES platform.tenants(id),
  term       text NOT NULL,
  match_type text NOT NULL DEFAULT 'word' CHECK (match_type IN ('exact','word','regex')),
  category   text NOT NULL CHECK (category IN ('regulated_education_equivalence','government_recognition',
                                               'result_promise','regulated_profession','false_scarcity','other')),
  severity   text NOT NULL CHECK (severity IN ('block','review','warn')),
  rationale  text,
  active     boolean NOT NULL DEFAULT true,
  UNIQUE (tenant_id, term, match_type)
);

CREATE TABLE catalog.compliance_findings (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES platform.tenants(id),
  target_type text NOT NULL,                    -- product, landing_page, message, certificate_template...
  target_id   uuid NOT NULL,
  field       text,
  term_id     uuid REFERENCES catalog.compliance_terms(id),
  layer       text NOT NULL CHECK (layer IN ('L1','L2','L3','L4','L5','L6','L7')),
  severity    text NOT NULL CHECK (severity IN ('block','review','warn')),
  excerpt     text,
  status      text NOT NULL DEFAULT 'open' CHECK (status IN ('open','fixed','accepted','overridden')),
  decided_by  uuid REFERENCES iam.users(id),
  decided_at  timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX compliance_findings_target_idx ON catalog.compliance_findings (tenant_id, target_type, target_id, status);

-- -----------------------------------------------------------------------------
-- 04. CRM (contacts first: commerce references it)
-- -----------------------------------------------------------------------------

CREATE TABLE crm.contacts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid NOT NULL REFERENCES platform.tenants(id),
  user_id         uuid,
  email           citext,
  phone_e164      text CHECK (phone_e164 ~ '^\+[1-9][0-9]{7,14}$'),
  full_name       text,
  lifecycle_stage text NOT NULL DEFAULT 'lead'
                  CHECK (lifecycle_stage IN ('subscriber','lead','mql','opportunity','customer','promoter','inactive')),
  score           int NOT NULL DEFAULT 0,
  source          jsonb NOT NULL DEFAULT '{}',
  owner_user_id   uuid REFERENCES iam.users(id),
  tags            text[] NOT NULL DEFAULT '{}',
  custom          jsonb NOT NULL DEFAULT '{}',
  anonymized_at   timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, user_id) REFERENCES iam.users (tenant_id, id),
  UNIQUE (tenant_id, id)
);
CREATE UNIQUE INDEX contacts_email_uq ON crm.contacts (tenant_id, email) WHERE email IS NOT NULL AND anonymized_at IS NULL;
CREATE INDEX contacts_tags_idx ON crm.contacts USING gin (tags);

ALTER TABLE iam.consents
  ADD CONSTRAINT consents_contact_fk FOREIGN KEY (tenant_id, contact_id) REFERENCES crm.contacts (tenant_id, id) ON DELETE CASCADE;

CREATE TABLE crm.companies (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  uuid NOT NULL REFERENCES platform.tenants(id),
  name       text NOT NULL,
  cnpj_hash  bytea,
  size_band  text,
  custom     jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, id)
);

CREATE TABLE crm.pipelines (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES platform.tenants(id),
  key       text NOT NULL,
  name      text NOT NULL,
  UNIQUE (tenant_id, key),
  UNIQUE (tenant_id, id)
);

CREATE TABLE crm.pipeline_stages (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES platform.tenants(id),
  pipeline_id uuid NOT NULL,
  name        text NOT NULL,
  position    int NOT NULL,
  is_won      boolean NOT NULL DEFAULT false,
  is_lost     boolean NOT NULL DEFAULT false,
  FOREIGN KEY (tenant_id, pipeline_id) REFERENCES crm.pipelines (tenant_id, id) ON DELETE CASCADE,
  UNIQUE (pipeline_id, position),
  UNIQUE (tenant_id, id),
  CHECK (NOT (is_won AND is_lost))
);

CREATE TABLE crm.deals (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    uuid NOT NULL REFERENCES platform.tenants(id),
  pipeline_id  uuid NOT NULL,
  stage_id     uuid NOT NULL,
  contact_id   uuid,
  company_id   uuid,
  title        text NOT NULL,
  amount_cents bigint CHECK (amount_cents >= 0),
  owner_user_id uuid REFERENCES iam.users(id),
  status       text NOT NULL DEFAULT 'open' CHECK (status IN ('open','won','lost')),
  lost_reason  text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  closed_at    timestamptz,
  FOREIGN KEY (tenant_id, pipeline_id) REFERENCES crm.pipelines (tenant_id, id),
  FOREIGN KEY (tenant_id, stage_id)    REFERENCES crm.pipeline_stages (tenant_id, id),
  FOREIGN KEY (tenant_id, contact_id)  REFERENCES crm.contacts (tenant_id, id),
  FOREIGN KEY (tenant_id, company_id)  REFERENCES crm.companies (tenant_id, id),
  CHECK (status <> 'lost' OR lost_reason IS NOT NULL)
);
CREATE INDEX deals_board_idx ON crm.deals (tenant_id, pipeline_id, stage_id) WHERE status = 'open';

CREATE TABLE crm.activities (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  uuid NOT NULL REFERENCES platform.tenants(id),
  contact_id uuid,
  deal_id    uuid REFERENCES crm.deals(id),
  kind       text NOT NULL,                 -- note, call, email, whatsapp, page_view, purchase...
  payload    jsonb NOT NULL DEFAULT '{}',
  actor_type text NOT NULL DEFAULT 'user' CHECK (actor_type IN ('user','agent','system','contact')),
  actor_id   text,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, contact_id) REFERENCES crm.contacts (tenant_id, id)
);
CREATE INDEX activities_contact_idx ON crm.activities (tenant_id, contact_id, occurred_at DESC);

CREATE TABLE crm.conversations (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid NOT NULL REFERENCES platform.tenants(id),
  contact_id      uuid NOT NULL,
  channel         text NOT NULL CHECK (channel IN ('whatsapp','instagram','email','webchat','form')),
  status          text NOT NULL DEFAULT 'open' CHECK (status IN ('open','pending','resolved','spam')),
  assignee_user_id uuid REFERENCES iam.users(id),
  handled_by      text NOT NULL DEFAULT 'human' CHECK (handled_by IN ('human','ai','mixed')),
  last_message_at timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, contact_id) REFERENCES crm.contacts (tenant_id, id),
  UNIQUE (tenant_id, id)
);
CREATE INDEX conversations_inbox_idx ON crm.conversations (tenant_id, status, last_message_at DESC);

CREATE TABLE crm.conversation_messages (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid NOT NULL REFERENCES platform.tenants(id),
  conversation_id uuid NOT NULL,
  direction       text NOT NULL CHECK (direction IN ('in','out','internal')),
  author_type     text NOT NULL CHECK (author_type IN ('contact','user','agent_ai','system')),
  author_id       text,
  body            text,
  attachments     jsonb NOT NULL DEFAULT '[]',
  provider_ref    text,
  sent_at         timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, conversation_id) REFERENCES crm.conversations (tenant_id, id) ON DELETE CASCADE
);
CREATE INDEX conversation_messages_idx ON crm.conversation_messages (tenant_id, conversation_id, sent_at);

CREATE TABLE crm.tasks (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     uuid NOT NULL REFERENCES platform.tenants(id),
  assignee_id   uuid REFERENCES iam.users(id),
  related_type  text,
  related_id    uuid,
  title         text NOT NULL,
  due_at        timestamptz,
  status        text NOT NULL DEFAULT 'open' CHECK (status IN ('open','done','canceled')),
  created_by_type text NOT NULL DEFAULT 'user' CHECK (created_by_type IN ('user','agent','workflow')),
  created_at    timestamptz NOT NULL DEFAULT now(),
  completed_at  timestamptz
);
CREATE INDEX tasks_queue_idx ON crm.tasks (tenant_id, assignee_id, due_at) WHERE status = 'open';

-- -----------------------------------------------------------------------------
-- 05. Growth (affiliates first: commerce and coupons reference it)
-- -----------------------------------------------------------------------------

CREATE TABLE growth.affiliates (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id      uuid NOT NULL REFERENCES platform.tenants(id),
  user_id        uuid NOT NULL,
  code           citext NOT NULL,
  status         text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','suspended')),
  commission_bps int NOT NULL DEFAULT 0 CHECK (commission_bps BETWEEN 0 AND 10000),
  cookie_days    int NOT NULL DEFAULT 30 CHECK (cookie_days BETWEEN 1 AND 365),
  terms_version_id uuid,
  approved_at    timestamptz,
  created_at     timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, user_id) REFERENCES iam.users (tenant_id, id),
  FOREIGN KEY (tenant_id, terms_version_id) REFERENCES iam.consent_versions (tenant_id, id),
  UNIQUE (tenant_id, code),
  UNIQUE (tenant_id, user_id),
  UNIQUE (tenant_id, id)
);

ALTER TABLE catalog.coupons
  ADD CONSTRAINT coupons_affiliate_fk FOREIGN KEY (tenant_id, affiliate_id) REFERENCES growth.affiliates (tenant_id, id);

CREATE TABLE growth.affiliate_links (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    uuid NOT NULL REFERENCES platform.tenants(id),
  affiliate_id uuid NOT NULL,
  product_id   uuid,
  slug         text NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, affiliate_id) REFERENCES growth.affiliates (tenant_id, id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id, product_id)   REFERENCES catalog.products (tenant_id, id),
  UNIQUE (tenant_id, slug)
);

-- -----------------------------------------------------------------------------
-- 06. Commerce
-- -----------------------------------------------------------------------------

CREATE TABLE commerce.payout_accounts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES platform.tenants(id),
  owner_type  text NOT NULL CHECK (owner_type IN ('instructor','affiliate','tenant')),
  owner_id    uuid NOT NULL,
  kind        text NOT NULL CHECK (kind IN ('pix','bank_account')),
  details_enc bytea NOT NULL,                -- encrypted by the application
  verified_at timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, id)
);

CREATE TABLE commerce.checkout_sessions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    uuid NOT NULL REFERENCES platform.tenants(id),
  user_id      uuid,
  contact_id   uuid,
  items        jsonb NOT NULL DEFAULT '[]',
  coupon_code  citext,
  status       text NOT NULL DEFAULT 'open' CHECK (status IN ('open','converted','abandoned','expired')),
  utm          jsonb NOT NULL DEFAULT '{}',
  expires_at   timestamptz NOT NULL DEFAULT now() + interval '2 hours',
  abandoned_at timestamptz,
  recovered_at timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, user_id)    REFERENCES iam.users (tenant_id, id),
  FOREIGN KEY (tenant_id, contact_id) REFERENCES crm.contacts (tenant_id, id),
  UNIQUE (tenant_id, id)
);
CREATE INDEX checkout_open_idx ON commerce.checkout_sessions (tenant_id, created_at) WHERE status = 'open';

CREATE TABLE commerce.orders (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id        uuid NOT NULL REFERENCES platform.tenants(id),
  number           bigint GENERATED ALWAYS AS IDENTITY,
  user_id          uuid,
  contact_id       uuid,
  status           text NOT NULL DEFAULT 'created'
                   CHECK (status IN ('created','pending','paid','delivered','partially_refunded','refunded','canceled','disputed')),
  currency         char(3) NOT NULL DEFAULT 'BRL',
  subtotal_cents   bigint NOT NULL CHECK (subtotal_cents >= 0),
  discount_cents   bigint NOT NULL DEFAULT 0 CHECK (discount_cents >= 0),
  total_cents      bigint NOT NULL CHECK (total_cents >= 0),
  coupon_id        uuid,
  affiliate_id     uuid,
  utm              jsonb NOT NULL DEFAULT '{}',
  ip               inet,
  terms_consent_id uuid,                    -- proof of acceptance at checkout
  paid_at          timestamptz,
  delivered_at     timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, user_id)          REFERENCES iam.users (tenant_id, id),
  FOREIGN KEY (tenant_id, contact_id)       REFERENCES crm.contacts (tenant_id, id),
  FOREIGN KEY (tenant_id, coupon_id)        REFERENCES catalog.coupons (tenant_id, id),
  FOREIGN KEY (tenant_id, affiliate_id)     REFERENCES growth.affiliates (tenant_id, id),
  FOREIGN KEY (tenant_id, terms_consent_id) REFERENCES iam.consents (tenant_id, id),
  CHECK (total_cents = subtotal_cents - discount_cents),
  CHECK (user_id IS NOT NULL OR contact_id IS NOT NULL),
  UNIQUE (tenant_id, id)
);
CREATE INDEX orders_user_idx ON commerce.orders (tenant_id, user_id, created_at DESC);
CREATE INDEX orders_status_idx ON commerce.orders (tenant_id, status, created_at DESC);

ALTER TABLE catalog.reviews
  ADD CONSTRAINT reviews_order_fk FOREIGN KEY (tenant_id, order_id) REFERENCES commerce.orders (tenant_id, id);

CREATE TABLE commerce.order_items (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id        uuid NOT NULL REFERENCES platform.tenants(id),
  order_id         uuid NOT NULL,
  offer_id         uuid NOT NULL,
  product_id       uuid NOT NULL,
  kind             text NOT NULL DEFAULT 'main' CHECK (kind IN ('main','bump','upsell','downsell')),
  quantity         int NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price_cents bigint NOT NULL CHECK (unit_price_cents >= 0),
  discount_cents   bigint NOT NULL DEFAULT 0 CHECK (discount_cents >= 0),
  total_cents      bigint NOT NULL CHECK (total_cents >= 0),
  FOREIGN KEY (tenant_id, order_id)   REFERENCES commerce.orders (tenant_id, id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id, offer_id)   REFERENCES catalog.offers (tenant_id, id),
  FOREIGN KEY (tenant_id, product_id) REFERENCES catalog.products (tenant_id, id),
  CHECK (total_cents = unit_price_cents * quantity - discount_cents),
  UNIQUE (tenant_id, id)
);
CREATE INDEX order_items_order_idx ON commerce.order_items (tenant_id, order_id);

CREATE TABLE commerce.payments (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    uuid NOT NULL REFERENCES platform.tenants(id),
  order_id     uuid NOT NULL,
  psp          text NOT NULL,
  psp_ref      text NOT NULL,
  method       text NOT NULL CHECK (method IN ('pix','card','boleto','wallet','store_credit')),
  status       text NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending','authorized','paid','failed','canceled','refunded','expired')),
  amount_cents bigint NOT NULL CHECK (amount_cents > 0),
  installments int NOT NULL DEFAULT 1 CHECK (installments BETWEEN 1 AND 24),
  fee_cents    bigint NOT NULL DEFAULT 0 CHECK (fee_cents >= 0),
  paid_at      timestamptz,
  failure_code text,
  raw          jsonb NOT NULL DEFAULT '{}',
  created_at   timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, order_id) REFERENCES commerce.orders (tenant_id, id),
  UNIQUE (tenant_id, psp, psp_ref),         -- webhook idempotency anchor
  UNIQUE (tenant_id, id)
);
CREATE INDEX payments_order_idx ON commerce.payments (tenant_id, order_id);

CREATE TABLE commerce.refunds (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id                uuid NOT NULL REFERENCES platform.tenants(id),
  order_id                 uuid NOT NULL,
  payment_id               uuid NOT NULL,
  amount_cents             bigint NOT NULL CHECK (amount_cents > 0),
  reason                   text,
  status                   text NOT NULL DEFAULT 'requested'
                           CHECK (status IN ('requested','approved','denied','processing','completed','failed')),
  within_withdrawal_period boolean NOT NULL DEFAULT false,   -- CDC art. 49 window
  auto_approved            boolean NOT NULL DEFAULT false,
  requested_by             uuid REFERENCES iam.users(id),
  requested_at             timestamptz NOT NULL DEFAULT now(),
  decided_by               uuid REFERENCES iam.users(id),
  decided_at               timestamptz,
  psp_ref                  text,
  FOREIGN KEY (tenant_id, order_id)   REFERENCES commerce.orders (tenant_id, id),
  FOREIGN KEY (tenant_id, payment_id) REFERENCES commerce.payments (tenant_id, id),
  CHECK (NOT auto_approved OR within_withdrawal_period)
);

CREATE TABLE commerce.chargebacks (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  uuid NOT NULL REFERENCES platform.tenants(id),
  payment_id uuid NOT NULL,
  psp_ref    text NOT NULL,
  status     text NOT NULL DEFAULT 'open' CHECK (status IN ('open','evidence_submitted','won','lost','accepted')),
  due_at     timestamptz,
  evidence   jsonb NOT NULL DEFAULT '{}',
  outcome_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, payment_id) REFERENCES commerce.payments (tenant_id, id),
  UNIQUE (tenant_id, psp_ref)
);

CREATE TABLE commerce.subscriptions (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id            uuid NOT NULL REFERENCES platform.tenants(id),
  user_id              uuid NOT NULL,
  offer_id             uuid NOT NULL,
  status               text NOT NULL DEFAULT 'trialing'
                       CHECK (status IN ('trialing','active','past_due','paused','canceled','expired')),
  current_period_start timestamptz,
  current_period_end   timestamptz,
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  canceled_at          timestamptz,
  cancel_reason        text,
  payment_method       text CHECK (payment_method IN ('card','pix_automatico','boleto')),
  psp_ref              text,
  trial_ends_at        timestamptz,
  created_at           timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, user_id)  REFERENCES iam.users (tenant_id, id),
  FOREIGN KEY (tenant_id, offer_id) REFERENCES catalog.offers (tenant_id, id),
  UNIQUE (tenant_id, id)
);
CREATE UNIQUE INDEX subscriptions_one_live_uq ON commerce.subscriptions (tenant_id, user_id, offer_id)
  WHERE status IN ('trialing','active','past_due','paused');

CREATE TABLE commerce.subscription_invoices (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid NOT NULL REFERENCES platform.tenants(id),
  subscription_id uuid NOT NULL,
  period_start    timestamptz NOT NULL,
  period_end      timestamptz NOT NULL,
  status          text NOT NULL DEFAULT 'open' CHECK (status IN ('open','paid','past_due','void')),
  amount_cents    bigint NOT NULL CHECK (amount_cents >= 0),
  due_at          timestamptz NOT NULL,
  paid_at         timestamptz,
  attempt_count   int NOT NULL DEFAULT 0,
  next_attempt_at timestamptz,
  payment_id      uuid,
  FOREIGN KEY (tenant_id, subscription_id) REFERENCES commerce.subscriptions (tenant_id, id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id, payment_id)      REFERENCES commerce.payments (tenant_id, id),
  UNIQUE (subscription_id, period_start)
);
CREATE INDEX invoices_retry_idx ON commerce.subscription_invoices (next_attempt_at) WHERE status IN ('open','past_due');

-- Seat reservation with TTL (prevents overselling of limited offers).
CREATE TABLE commerce.seat_holds (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           uuid NOT NULL REFERENCES platform.tenants(id),
  offer_id            uuid NOT NULL,
  checkout_session_id uuid,
  quantity            int NOT NULL DEFAULT 1 CHECK (quantity > 0),
  expires_at          timestamptz NOT NULL,
  released_at         timestamptz,
  converted_order_id  uuid,
  FOREIGN KEY (tenant_id, offer_id)            REFERENCES catalog.offers (tenant_id, id),
  FOREIGN KEY (tenant_id, checkout_session_id) REFERENCES commerce.checkout_sessions (tenant_id, id),
  FOREIGN KEY (tenant_id, converted_order_id)  REFERENCES commerce.orders (tenant_id, id)
);
CREATE INDEX seat_holds_active_idx ON commerce.seat_holds (tenant_id, offer_id) WHERE released_at IS NULL;

CREATE TABLE commerce.ledger_accounts (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES platform.tenants(id),
  code      text NOT NULL,
  name      text NOT NULL,
  kind      text NOT NULL CHECK (kind IN ('asset','liability','revenue','expense','equity')),
  UNIQUE (tenant_id, code),
  UNIQUE (tenant_id, id)
);

-- Append-only double-entry ledger; every txn_id must balance (checked at commit).
CREATE TABLE commerce.ledger_entries (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    uuid NOT NULL REFERENCES platform.tenants(id),
  txn_id       uuid NOT NULL,
  account_id   uuid NOT NULL,
  direction    char(1) NOT NULL CHECK (direction IN ('D','C')),
  amount_cents bigint NOT NULL CHECK (amount_cents > 0),
  currency     char(3) NOT NULL DEFAULT 'BRL',
  ref_type     text,
  ref_id       uuid,
  memo         text,
  occurred_at  timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, account_id) REFERENCES commerce.ledger_accounts (tenant_id, id)
);
CREATE INDEX ledger_txn_idx ON commerce.ledger_entries (tenant_id, txn_id);
CREATE INDEX ledger_ref_idx ON commerce.ledger_entries (tenant_id, ref_type, ref_id);

CREATE TABLE commerce.fiscal_documents (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id          uuid NOT NULL REFERENCES platform.tenants(id),
  order_id           uuid NOT NULL,
  kind               text NOT NULL DEFAULT 'nfse' CHECK (kind IN ('nfse','receipt')),
  number             text,
  status             text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','issued','rejected','canceled')),
  provider_ref       text,
  issued_at          timestamptz,
  canceled_at        timestamptz,
  error              jsonb,
  document_asset_id  uuid,
  created_at         timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, order_id)          REFERENCES commerce.orders (tenant_id, id),
  FOREIGN KEY (tenant_id, document_asset_id) REFERENCES media.assets (tenant_id, id)
);
CREATE INDEX fiscal_pending_idx ON commerce.fiscal_documents (tenant_id, status) WHERE status IN ('pending','rejected');

CREATE TABLE commerce.payouts (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id         uuid NOT NULL REFERENCES platform.tenants(id),
  payout_account_id uuid NOT NULL,
  beneficiary_type  text NOT NULL CHECK (beneficiary_type IN ('instructor','affiliate')),
  beneficiary_id    uuid NOT NULL,
  status            text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled','approved','paid','failed','canceled')),
  amount_cents      bigint NOT NULL CHECK (amount_cents > 0),
  scheduled_for     date NOT NULL,
  approved_by       uuid REFERENCES iam.users(id),
  approved_at       timestamptz,
  paid_at           timestamptz,
  statement         jsonb NOT NULL DEFAULT '{}',
  FOREIGN KEY (tenant_id, payout_account_id) REFERENCES commerce.payout_accounts (tenant_id, id),
  UNIQUE (tenant_id, id),
  CHECK (status NOT IN ('approved','paid') OR approved_by IS NOT NULL)
);

CREATE TABLE commerce.payout_items (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    uuid NOT NULL REFERENCES platform.tenants(id),
  payout_id    uuid NOT NULL,
  source_type  text NOT NULL CHECK (source_type IN ('order_item','affiliate_commission')),
  source_id    uuid NOT NULL,
  amount_cents bigint NOT NULL,
  FOREIGN KEY (tenant_id, payout_id) REFERENCES commerce.payouts (tenant_id, id) ON DELETE CASCADE,
  UNIQUE (tenant_id, source_type, source_id)       -- an earning is paid only once
);

CREATE TABLE commerce.gift_cards (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           uuid NOT NULL REFERENCES platform.tenants(id),
  code                citext NOT NULL,
  initial_cents       bigint NOT NULL CHECK (initial_cents > 0),
  balance_cents       bigint NOT NULL CHECK (balance_cents >= 0),
  expires_at          timestamptz,
  purchaser_user_id   uuid REFERENCES iam.users(id),
  redeemed_by_user_id uuid REFERENCES iam.users(id),
  status              text NOT NULL DEFAULT 'active' CHECK (status IN ('active','redeemed','expired','canceled')),
  CHECK (balance_cents <= initial_cents),
  UNIQUE (tenant_id, code)
);

CREATE TABLE growth.affiliate_commissions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    uuid NOT NULL REFERENCES platform.tenants(id),
  affiliate_id uuid NOT NULL,
  order_id     uuid NOT NULL,
  amount_cents bigint NOT NULL CHECK (amount_cents >= 0),
  status       text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','paid','reversed')),
  release_at   timestamptz NOT NULL,                -- after the guarantee period
  created_at   timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, affiliate_id) REFERENCES growth.affiliates (tenant_id, id),
  FOREIGN KEY (tenant_id, order_id)     REFERENCES commerce.orders (tenant_id, id),
  UNIQUE (tenant_id, affiliate_id, order_id)
);
CREATE INDEX affiliate_commissions_release_idx ON growth.affiliate_commissions (release_at) WHERE status = 'pending';

-- -----------------------------------------------------------------------------
-- 07. LMS
-- -----------------------------------------------------------------------------

CREATE TABLE lms.courses (
  product_id       uuid PRIMARY KEY,
  tenant_id        uuid NOT NULL REFERENCES platform.tenants(id),
  objectives       text[] NOT NULL DEFAULT '{}',
  prerequisites    jsonb NOT NULL DEFAULT '[]',
  completion_rule  jsonb NOT NULL DEFAULT '{"min_progress":1.0,"min_score":0.7}',
  drip_mode        text NOT NULL DEFAULT 'none' CHECK (drip_mode IN ('none','by_date','by_days','by_completion')),
  FOREIGN KEY (tenant_id, product_id) REFERENCES catalog.products (tenant_id, id) ON DELETE CASCADE
);

CREATE TABLE lms.modules (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    uuid NOT NULL REFERENCES platform.tenants(id),
  product_id   uuid NOT NULL,
  title        text NOT NULL,
  position     int NOT NULL,
  release_rule jsonb NOT NULL DEFAULT '{}',
  FOREIGN KEY (tenant_id, product_id) REFERENCES catalog.products (tenant_id, id) ON DELETE CASCADE,
  UNIQUE (product_id, position) DEFERRABLE INITIALLY DEFERRED,
  UNIQUE (tenant_id, id)
);

CREATE TABLE lms.lessons (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id        uuid NOT NULL REFERENCES platform.tenants(id),
  module_id        uuid NOT NULL,
  title            text NOT NULL,
  kind             text NOT NULL CHECK (kind IN ('video','text','audio','document','ebook','quiz','assignment','embed','live')),
  position         int NOT NULL,
  duration_seconds int CHECK (duration_seconds >= 0),
  content          jsonb NOT NULL DEFAULT '{}',
  asset_id         uuid,
  required         boolean NOT NULL DEFAULT true,
  version          int NOT NULL DEFAULT 1,
  release_rule     jsonb NOT NULL DEFAULT '{}',
  published        boolean NOT NULL DEFAULT false,
  FOREIGN KEY (tenant_id, module_id) REFERENCES lms.modules (tenant_id, id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id, asset_id)  REFERENCES media.assets (tenant_id, id),
  UNIQUE (module_id, position) DEFERRABLE INITIALLY DEFERRED,
  UNIQUE (tenant_id, id)
);

CREATE TABLE lms.track_items (
  tenant_id     uuid NOT NULL REFERENCES platform.tenants(id),
  track_product_id uuid NOT NULL,
  item_product_id  uuid NOT NULL,
  position      int NOT NULL,
  required      boolean NOT NULL DEFAULT true,
  PRIMARY KEY (track_product_id, item_product_id),
  FOREIGN KEY (tenant_id, track_product_id) REFERENCES catalog.products (tenant_id, id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id, item_product_id)  REFERENCES catalog.products (tenant_id, id),
  CHECK (track_product_id <> item_product_id)
);

CREATE TABLE lms.cohorts (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id      uuid NOT NULL REFERENCES platform.tenants(id),
  product_id     uuid NOT NULL,
  name           text NOT NULL,
  starts_at      timestamptz NOT NULL,
  ends_at        timestamptz,
  capacity       int CHECK (capacity > 0),
  tutor_user_id  uuid REFERENCES iam.users(id),
  FOREIGN KEY (tenant_id, product_id) REFERENCES catalog.products (tenant_id, id),
  CHECK (ends_at IS NULL OR ends_at > starts_at),
  UNIQUE (tenant_id, id)
);

-- An enrollment is the entitlement that links a person to a product.
CREATE TABLE lms.enrollments (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     uuid NOT NULL REFERENCES platform.tenants(id),
  user_id       uuid NOT NULL,
  product_id    uuid NOT NULL,
  offer_id      uuid,
  order_item_id uuid,
  subscription_id uuid,
  cohort_id     uuid,
  status        text NOT NULL DEFAULT 'active' CHECK (status IN ('active','completed','suspended','revoked','expired')),
  source        text NOT NULL DEFAULT 'purchase' CHECK (source IN ('purchase','subscription','manual','b2b','gift','import')),
  starts_at     timestamptz NOT NULL DEFAULT now(),
  ends_at       timestamptz,
  completed_at  timestamptz,
  revoked_reason text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, user_id)         REFERENCES iam.users (tenant_id, id),
  FOREIGN KEY (tenant_id, product_id)      REFERENCES catalog.products (tenant_id, id),
  FOREIGN KEY (tenant_id, offer_id)        REFERENCES catalog.offers (tenant_id, id),
  FOREIGN KEY (tenant_id, order_item_id)   REFERENCES commerce.order_items (tenant_id, id),
  FOREIGN KEY (tenant_id, subscription_id) REFERENCES commerce.subscriptions (tenant_id, id),
  FOREIGN KEY (tenant_id, cohort_id)       REFERENCES lms.cohorts (tenant_id, id),
  CHECK (ends_at IS NULL OR ends_at > starts_at),
  UNIQUE (tenant_id, id)
);
-- At most one live enrollment per person and product.
CREATE UNIQUE INDEX enrollments_one_live_uq ON lms.enrollments (tenant_id, user_id, product_id)
  WHERE status IN ('active','suspended');
CREATE INDEX enrollments_user_idx ON lms.enrollments (tenant_id, user_id, status);

CREATE TABLE lms.lesson_progress (
  tenant_id     uuid NOT NULL REFERENCES platform.tenants(id),
  enrollment_id uuid NOT NULL,
  lesson_id     uuid NOT NULL,
  status        text NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress','completed')),
  watched_seconds int NOT NULL DEFAULT 0 CHECK (watched_seconds >= 0),
  last_position_seconds int NOT NULL DEFAULT 0 CHECK (last_position_seconds >= 0),
  completed_at  timestamptz,
  updated_at    timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (enrollment_id, lesson_id),
  FOREIGN KEY (tenant_id, enrollment_id) REFERENCES lms.enrollments (tenant_id, id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id, lesson_id)     REFERENCES lms.lessons (tenant_id, id) ON DELETE CASCADE,
  CHECK ((status = 'completed') = (completed_at IS NOT NULL))
);

CREATE TABLE lms.questions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES platform.tenants(id),
  product_id  uuid,
  kind        text NOT NULL CHECK (kind IN ('single_choice','multiple_choice','true_false','matching','fill_blank','essay','file_upload')),
  prompt      text NOT NULL,
  options     jsonb NOT NULL DEFAULT '[]',
  answer      jsonb,
  explanation text,
  difficulty  smallint CHECK (difficulty BETWEEN 1 AND 5),
  tags        text[] NOT NULL DEFAULT '{}',
  created_at  timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, product_id) REFERENCES catalog.products (tenant_id, id),
  UNIQUE (tenant_id, id)
);

CREATE TABLE lms.assessments (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     uuid NOT NULL REFERENCES platform.tenants(id),
  product_id    uuid NOT NULL,
  lesson_id     uuid,
  title         text NOT NULL,
  passing_score numeric(5,4) NOT NULL DEFAULT 0.7000 CHECK (passing_score BETWEEN 0 AND 1),
  max_attempts  int CHECK (max_attempts > 0),
  time_limit_seconds int CHECK (time_limit_seconds > 0),
  shuffle       boolean NOT NULL DEFAULT true,
  feedback_mode text NOT NULL DEFAULT 'immediate' CHECK (feedback_mode IN ('immediate','after_submit','after_close')),
  FOREIGN KEY (tenant_id, product_id) REFERENCES catalog.products (tenant_id, id),
  FOREIGN KEY (tenant_id, lesson_id)  REFERENCES lms.lessons (tenant_id, id),
  UNIQUE (tenant_id, id)
);

CREATE TABLE lms.assessment_questions (
  tenant_id     uuid NOT NULL REFERENCES platform.tenants(id),
  assessment_id uuid NOT NULL,
  question_id   uuid NOT NULL,
  position      int NOT NULL,
  weight        numeric(6,2) NOT NULL DEFAULT 1 CHECK (weight > 0),
  PRIMARY KEY (assessment_id, question_id),
  FOREIGN KEY (tenant_id, assessment_id) REFERENCES lms.assessments (tenant_id, id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id, question_id)   REFERENCES lms.questions (tenant_id, id)
);

CREATE TABLE lms.attempts (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     uuid NOT NULL REFERENCES platform.tenants(id),
  enrollment_id uuid NOT NULL,
  assessment_id uuid NOT NULL,
  attempt_no    int NOT NULL CHECK (attempt_no > 0),
  status        text NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress','submitted','graded','void')),
  score         numeric(5,4) CHECK (score BETWEEN 0 AND 1),
  answers       jsonb NOT NULL DEFAULT '{}',
  started_at    timestamptz NOT NULL DEFAULT now(),
  submitted_at  timestamptz,
  FOREIGN KEY (tenant_id, enrollment_id) REFERENCES lms.enrollments (tenant_id, id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id, assessment_id) REFERENCES lms.assessments (tenant_id, id),
  UNIQUE (enrollment_id, assessment_id, attempt_no)
);

CREATE TABLE lms.submissions (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     uuid NOT NULL REFERENCES platform.tenants(id),
  enrollment_id uuid NOT NULL,
  lesson_id     uuid NOT NULL,
  files         jsonb NOT NULL DEFAULT '[]',
  text_body     text,
  submitted_at  timestamptz NOT NULL DEFAULT now(),
  grade         numeric(5,4) CHECK (grade BETWEEN 0 AND 1),
  feedback      text,
  graded_by_type text CHECK (graded_by_type IN ('user','agent_ai')),
  graded_by     text,
  FOREIGN KEY (tenant_id, enrollment_id) REFERENCES lms.enrollments (tenant_id, id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id, lesson_id)     REFERENCES lms.lessons (tenant_id, id)
);

CREATE TABLE lms.certificate_templates (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  uuid NOT NULL REFERENCES platform.tenants(id),
  product_id uuid,
  name       text NOT NULL,
  layout     jsonb NOT NULL,
  -- Mandatory statements checked by the Guardian (e.g. "curso livre", workload, no government seals).
  required_statements jsonb NOT NULL DEFAULT '{"free_course_label":true}',
  created_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, product_id) REFERENCES catalog.products (tenant_id, id)
);

CREATE TABLE lms.certificates (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id        uuid NOT NULL REFERENCES platform.tenants(id),
  enrollment_id    uuid,
  user_id          uuid NOT NULL,
  product_id       uuid NOT NULL,
  kind             text NOT NULL CHECK (kind IN ('completion','participation','track','certification')),
  code             text NOT NULL,                   -- public verification code
  holder_name      text NOT NULL,                   -- snapshot at issuance
  workload_minutes int NOT NULL CHECK (workload_minutes > 0),
  issued_at        timestamptz NOT NULL DEFAULT now(),
  status           text NOT NULL DEFAULT 'valid' CHECK (status IN ('valid','revoked')),
  revoked_at       timestamptz,
  revoked_reason   text,
  pdf_asset_id     uuid,
  credential       jsonb,                           -- Open Badges 3.0 / verifiable credential payload
  FOREIGN KEY (tenant_id, enrollment_id) REFERENCES lms.enrollments (tenant_id, id),
  FOREIGN KEY (tenant_id, user_id)       REFERENCES iam.users (tenant_id, id),
  FOREIGN KEY (tenant_id, product_id)    REFERENCES catalog.products (tenant_id, id),
  FOREIGN KEY (tenant_id, pdf_asset_id)  REFERENCES media.assets (tenant_id, id),
  CHECK ((status = 'revoked') = (revoked_at IS NOT NULL)),
  UNIQUE (tenant_id, code)
);
-- No duplicate completion certificate for the same enrollment.
CREATE UNIQUE INDEX certificates_completion_uq ON lms.certificates (tenant_id, enrollment_id, kind) WHERE enrollment_id IS NOT NULL;

CREATE TABLE lms.lesson_comments (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  uuid NOT NULL REFERENCES platform.tenants(id),
  lesson_id  uuid NOT NULL,
  user_id    uuid NOT NULL,
  parent_id  uuid REFERENCES lms.lesson_comments(id),
  body       text NOT NULL,
  author_kind text NOT NULL DEFAULT 'student' CHECK (author_kind IN ('student','instructor','tutor_ai','staff')),
  status     text NOT NULL DEFAULT 'published' CHECK (status IN ('published','hidden','pending')),
  created_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, lesson_id) REFERENCES lms.lessons (tenant_id, id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id, user_id)   REFERENCES iam.users (tenant_id, id)
);
CREATE INDEX lesson_comments_idx ON lms.lesson_comments (tenant_id, lesson_id, created_at);

-- -----------------------------------------------------------------------------
-- 08. Live events
-- -----------------------------------------------------------------------------

CREATE TABLE live.events (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           uuid NOT NULL REFERENCES platform.tenants(id),
  product_id          uuid,
  parent_event_id     uuid REFERENCES live.events(id),
  kind                text NOT NULL CHECK (kind IN ('webinar','workshop','class','mentoring_group','summit','session')),
  title               text NOT NULL,
  mode                text NOT NULL DEFAULT 'live' CHECK (mode IN ('live','evergreen')),
  starts_at           timestamptz NOT NULL,
  ends_at             timestamptz NOT NULL,
  timezone            text NOT NULL DEFAULT 'America/Sao_Paulo',
  capacity            int CHECK (capacity > 0),
  room_provider       text,
  room_ref            text,
  recording_asset_id  uuid,
  status              text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','scheduled','live','ended','canceled')),
  settings            jsonb NOT NULL DEFAULT '{}',
  created_at          timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, product_id)         REFERENCES catalog.products (tenant_id, id),
  FOREIGN KEY (tenant_id, recording_asset_id) REFERENCES media.assets (tenant_id, id),
  CHECK (ends_at > starts_at),
  UNIQUE (tenant_id, id)
);
CREATE INDEX events_calendar_idx ON live.events (tenant_id, starts_at) WHERE status IN ('scheduled','live');

CREATE TABLE live.registrations (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     uuid NOT NULL REFERENCES platform.tenants(id),
  event_id      uuid NOT NULL,
  user_id       uuid,
  contact_id    uuid,
  ticket_code   text NOT NULL,
  status        text NOT NULL DEFAULT 'registered' CHECK (status IN ('registered','waitlist','attended','no_show','canceled')),
  source        text,
  order_item_id uuid,
  registered_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, event_id)      REFERENCES live.events (tenant_id, id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id, user_id)       REFERENCES iam.users (tenant_id, id),
  FOREIGN KEY (tenant_id, contact_id)    REFERENCES crm.contacts (tenant_id, id),
  FOREIGN KEY (tenant_id, order_item_id) REFERENCES commerce.order_items (tenant_id, id),
  CHECK (user_id IS NOT NULL OR contact_id IS NOT NULL),
  UNIQUE (tenant_id, ticket_code),
  UNIQUE (tenant_id, id)
);
CREATE UNIQUE INDEX registrations_user_uq ON live.registrations (event_id, user_id) WHERE user_id IS NOT NULL AND status <> 'canceled';

CREATE TABLE live.attendance (
  registration_id uuid PRIMARY KEY,
  tenant_id       uuid NOT NULL REFERENCES platform.tenants(id),
  first_joined_at timestamptz,
  last_left_at    timestamptz,
  seconds_present int NOT NULL DEFAULT 0 CHECK (seconds_present >= 0),
  interactions    jsonb NOT NULL DEFAULT '{}',
  FOREIGN KEY (tenant_id, registration_id) REFERENCES live.registrations (tenant_id, id) ON DELETE CASCADE
);

CREATE TABLE live.event_cues (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  uuid NOT NULL REFERENCES platform.tenants(id),
  event_id   uuid NOT NULL,
  at_second  int NOT NULL CHECK (at_second >= 0),
  kind       text NOT NULL CHECK (kind IN ('offer','poll','resource','chat_prompt')),
  payload    jsonb NOT NULL DEFAULT '{}',
  FOREIGN KEY (tenant_id, event_id) REFERENCES live.events (tenant_id, id) ON DELETE CASCADE
);

CREATE TABLE live.mentoring_slots (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid NOT NULL REFERENCES platform.tenants(id),
  instructor_id   uuid NOT NULL,
  starts_at       timestamptz NOT NULL,
  ends_at         timestamptz NOT NULL,
  status          text NOT NULL DEFAULT 'open' CHECK (status IN ('open','booked','done','canceled')),
  registration_id uuid,
  FOREIGN KEY (tenant_id, instructor_id)   REFERENCES catalog.instructors (tenant_id, id),
  FOREIGN KEY (tenant_id, registration_id) REFERENCES live.registrations (tenant_id, id),
  CHECK (ends_at > starts_at),
  EXCLUDE USING gist (instructor_id WITH =, tstzrange(starts_at, ends_at) WITH &&) WHERE (status <> 'canceled')
);

-- -----------------------------------------------------------------------------
-- 09. Engagement
-- -----------------------------------------------------------------------------

CREATE TABLE engage.spaces (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  uuid NOT NULL REFERENCES platform.tenants(id),
  product_id uuid,
  name       text NOT NULL,
  visibility text NOT NULL DEFAULT 'members' CHECK (visibility IN ('public','members','private')),
  rules      text,
  created_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, product_id) REFERENCES catalog.products (tenant_id, id),
  UNIQUE (tenant_id, id)
);

CREATE TABLE engage.posts (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  uuid NOT NULL REFERENCES platform.tenants(id),
  space_id   uuid NOT NULL,
  author_id  uuid NOT NULL,
  parent_id  uuid REFERENCES engage.posts(id),   -- null = top-level post, otherwise a comment
  body       text NOT NULL,
  status     text NOT NULL DEFAULT 'published' CHECK (status IN ('published','pending','hidden','removed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, space_id)  REFERENCES engage.spaces (tenant_id, id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id, author_id) REFERENCES iam.users (tenant_id, id)
);
CREATE INDEX posts_feed_idx ON engage.posts (tenant_id, space_id, created_at DESC) WHERE parent_id IS NULL;

CREATE TABLE engage.reactions (
  tenant_id   uuid NOT NULL REFERENCES platform.tenants(id),
  post_id     uuid NOT NULL REFERENCES engage.posts(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL,
  kind        text NOT NULL DEFAULT 'like',
  created_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, user_id, kind),
  FOREIGN KEY (tenant_id, user_id) REFERENCES iam.users (tenant_id, id)
);

CREATE TABLE engage.gamification_rules (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  uuid NOT NULL REFERENCES platform.tenants(id),
  event_type text NOT NULL,                      -- e.g. lesson.completed
  points     int NOT NULL CHECK (points <> 0),
  limits     jsonb NOT NULL DEFAULT '{}',        -- caps per day/week (anti-abuse)
  active     boolean NOT NULL DEFAULT true,
  minors_enabled boolean NOT NULL DEFAULT false, -- engagement mechanics disabled for minors by default
  UNIQUE (tenant_id, event_type)
);

CREATE TABLE engage.points_ledger (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid NOT NULL REFERENCES platform.tenants(id),
  user_id         uuid NOT NULL,
  delta           int NOT NULL CHECK (delta <> 0),
  reason          text NOT NULL,
  source_event_id uuid,
  created_at      timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, user_id) REFERENCES iam.users (tenant_id, id)
);
CREATE UNIQUE INDEX points_ledger_event_uq ON engage.points_ledger (tenant_id, user_id, source_event_id, reason) WHERE source_event_id IS NOT NULL;

CREATE TABLE engage.badges (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES platform.tenants(id),
  key       text NOT NULL,
  name      text NOT NULL,
  criteria  jsonb NOT NULL DEFAULT '{}',
  UNIQUE (tenant_id, key),
  UNIQUE (tenant_id, id)
);

CREATE TABLE engage.user_badges (
  tenant_id  uuid NOT NULL REFERENCES platform.tenants(id),
  user_id    uuid NOT NULL,
  badge_id   uuid NOT NULL,
  awarded_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, badge_id),
  FOREIGN KEY (tenant_id, user_id)  REFERENCES iam.users (tenant_id, id),
  FOREIGN KEY (tenant_id, badge_id) REFERENCES engage.badges (tenant_id, id)
);

CREATE TABLE engage.notifications (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  uuid NOT NULL REFERENCES platform.tenants(id),
  user_id    uuid NOT NULL,
  channel    text NOT NULL CHECK (channel IN ('in_app','push','email','whatsapp','sms')),
  template   text NOT NULL,
  payload    jsonb NOT NULL DEFAULT '{}',
  status     text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','sent','delivered','failed','suppressed')),
  sent_at    timestamptz,
  read_at    timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, user_id) REFERENCES iam.users (tenant_id, id)
);
CREATE INDEX notifications_user_idx ON engage.notifications (tenant_id, user_id, created_at DESC);

-- -----------------------------------------------------------------------------
-- 10. Growth (marketing)
-- -----------------------------------------------------------------------------

CREATE TABLE growth.segments (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  uuid NOT NULL REFERENCES platform.tenants(id),
  name       text NOT NULL,
  definition jsonb NOT NULL,
  dynamic    boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, id)
);

CREATE TABLE growth.campaigns (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    uuid NOT NULL REFERENCES platform.tenants(id),
  name         text NOT NULL,
  channel      text NOT NULL CHECK (channel IN ('email','whatsapp','sms','push')),
  status       text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','pending_approval','scheduled','sending','sent','canceled')),
  segment_id   uuid,
  template_ref text,
  scheduled_at timestamptz,
  approved_by  uuid REFERENCES iam.users(id),
  stats        jsonb NOT NULL DEFAULT '{}',
  created_at   timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, segment_id) REFERENCES growth.segments (tenant_id, id),
  -- Mass sends always need a human approval (docs 08 section 5.2).
  CHECK (status NOT IN ('scheduled','sending','sent') OR approved_by IS NOT NULL),
  UNIQUE (tenant_id, id)
);

CREATE TABLE growth.messages (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    uuid NOT NULL REFERENCES platform.tenants(id),
  contact_id   uuid NOT NULL,
  campaign_id  uuid,
  channel      text NOT NULL CHECK (channel IN ('email','whatsapp','sms','push')),
  template_ref text,
  status       text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','sent','delivered','opened','clicked','bounced','complained','failed','suppressed')),
  provider_ref text,
  consent_id   uuid,                              -- consent that authorized this send
  sent_at      timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, contact_id)  REFERENCES crm.contacts (tenant_id, id),
  FOREIGN KEY (tenant_id, campaign_id) REFERENCES growth.campaigns (tenant_id, id),
  FOREIGN KEY (tenant_id, consent_id)  REFERENCES iam.consents (tenant_id, id)
);
CREATE INDEX messages_contact_idx ON growth.messages (tenant_id, contact_id, created_at DESC);

CREATE TABLE growth.landing_pages (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    uuid NOT NULL REFERENCES platform.tenants(id),
  product_id   uuid,
  slug         text NOT NULL,
  status       text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','in_review','published','archived')),
  compliance_status text NOT NULL DEFAULT 'pending' CHECK (compliance_status IN ('pending','approved','blocked')),
  blocks       jsonb NOT NULL DEFAULT '[]',
  version      int NOT NULL DEFAULT 1,
  published_at timestamptz,
  FOREIGN KEY (tenant_id, product_id) REFERENCES catalog.products (tenant_id, id),
  CHECK (status <> 'published' OR compliance_status = 'approved'),
  UNIQUE (tenant_id, slug)
);

CREATE TABLE growth.funnels (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    uuid NOT NULL REFERENCES platform.tenants(id),
  name         text NOT NULL,
  template_key text,                               -- FN-01 .. FN-10
  status       text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','active','paused','archived')),
  definition   jsonb NOT NULL DEFAULT '{}',
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE growth.attribution_touches (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    uuid NOT NULL REFERENCES platform.tenants(id),
  contact_id   uuid,
  anonymous_id text,
  utm          jsonb NOT NULL DEFAULT '{}',
  referrer     text,
  landing_url  text,
  affiliate_id uuid,
  touched_at   timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, contact_id)   REFERENCES crm.contacts (tenant_id, id),
  FOREIGN KEY (tenant_id, affiliate_id) REFERENCES growth.affiliates (tenant_id, id),
  CHECK (contact_id IS NOT NULL OR anonymous_id IS NOT NULL)
);
CREATE INDEX touches_lookup_idx ON growth.attribution_touches (tenant_id, anonymous_id, touched_at DESC);

CREATE TABLE growth.experiments (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  uuid NOT NULL REFERENCES platform.tenants(id),
  key        text NOT NULL,
  hypothesis text NOT NULL,
  variants   jsonb NOT NULL,
  metric     text NOT NULL,
  status     text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','running','stopped','concluded')),
  started_at timestamptz,
  ended_at   timestamptz,
  UNIQUE (tenant_id, key),
  UNIQUE (tenant_id, id)
);

CREATE TABLE growth.experiment_assignments (
  tenant_id     uuid NOT NULL REFERENCES platform.tenants(id),
  experiment_id uuid NOT NULL,
  subject_id    text NOT NULL,                   -- user id or anonymous id
  variant       text NOT NULL,
  assigned_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (experiment_id, subject_id),
  FOREIGN KEY (tenant_id, experiment_id) REFERENCES growth.experiments (tenant_id, id) ON DELETE CASCADE
);

CREATE TABLE growth.referrals (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id         uuid NOT NULL REFERENCES platform.tenants(id),
  referrer_user_id  uuid NOT NULL,
  referred_user_id  uuid,
  code              text NOT NULL,
  status            text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','qualified','rewarded','rejected')),
  reward            jsonb NOT NULL DEFAULT '{}',
  created_at        timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, referrer_user_id) REFERENCES iam.users (tenant_id, id),
  FOREIGN KEY (tenant_id, referred_user_id) REFERENCES iam.users (tenant_id, id),
  CHECK (referrer_user_id <> referred_user_id),
  UNIQUE (tenant_id, code)
);

-- -----------------------------------------------------------------------------
-- 11. Operations
-- -----------------------------------------------------------------------------

CREATE TABLE ops.workflows (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  uuid NOT NULL REFERENCES platform.tenants(id),
  key        text NOT NULL,                      -- e.g. WF-ORD-01
  name       text NOT NULL,
  domain     text NOT NULL CHECK (domain IN ('order','finance','support','academic','instructor','content','compliance','growth','tech')),
  trigger    jsonb NOT NULL,
  definition jsonb NOT NULL,
  version    int NOT NULL DEFAULT 1,
  status     text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','active','paused','archived')),
  owner_user_id uuid REFERENCES iam.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, key, version),
  UNIQUE (tenant_id, id)
);

CREATE TABLE ops.workflow_runs (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id        uuid NOT NULL REFERENCES platform.tenants(id),
  workflow_id      uuid NOT NULL,
  trigger_event_id uuid REFERENCES platform.outbox_events(id),
  status           text NOT NULL DEFAULT 'running' CHECK (status IN ('running','waiting_approval','succeeded','failed','canceled')),
  idempotency_key  text NOT NULL,
  context          jsonb NOT NULL DEFAULT '{}',
  error            jsonb,
  started_at       timestamptz NOT NULL DEFAULT now(),
  finished_at      timestamptz,
  FOREIGN KEY (tenant_id, workflow_id) REFERENCES ops.workflows (tenant_id, id),
  UNIQUE (tenant_id, workflow_id, idempotency_key),     -- same trigger never runs twice
  UNIQUE (tenant_id, id)
);
CREATE INDEX workflow_runs_status_idx ON ops.workflow_runs (tenant_id, status, started_at DESC);

CREATE TABLE ops.workflow_steps (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES platform.tenants(id),
  run_id      uuid NOT NULL,
  step_key    text NOT NULL,
  status      text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','running','succeeded','failed','skipped','waiting_approval')),
  attempts    int NOT NULL DEFAULT 0,
  input       jsonb,
  output      jsonb,
  started_at  timestamptz,
  finished_at timestamptz,
  FOREIGN KEY (tenant_id, run_id) REFERENCES ops.workflow_runs (tenant_id, id) ON DELETE CASCADE,
  UNIQUE (run_id, step_key)
);

-- Central approval inbox for humans-in-the-loop (workflows, agents, finance).
CREATE TABLE ops.approvals (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id      uuid NOT NULL REFERENCES platform.tenants(id),
  kind           text NOT NULL,                  -- refund_out_of_period, coupon_over_limit, publish_page, bulk_send...
  requester_type text NOT NULL CHECK (requester_type IN ('user','agent','workflow')),
  requester_id   text NOT NULL,
  payload        jsonb NOT NULL,
  status         text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','expired')),
  required_approvals int NOT NULL DEFAULT 1 CHECK (required_approvals BETWEEN 1 AND 3),
  decisions      jsonb NOT NULL DEFAULT '[]',    -- [{user_id, decision, at, note}]
  expires_at     timestamptz,
  created_at     timestamptz NOT NULL DEFAULT now(),
  decided_at     timestamptz
);
CREATE INDEX approvals_pending_idx ON ops.approvals (tenant_id, created_at) WHERE status = 'pending';

CREATE TABLE ops.tickets (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id          uuid NOT NULL REFERENCES platform.tenants(id),
  contact_id         uuid NOT NULL,
  conversation_id    uuid,
  channel            text NOT NULL,
  category           text NOT NULL CHECK (category IN ('access','payment','refund','certificate','content','technical','live_event','privacy','partners','other')),
  priority           text NOT NULL DEFAULT 'p3' CHECK (priority IN ('p1','p2','p3')),
  status             text NOT NULL DEFAULT 'open' CHECK (status IN ('open','pending_customer','escalated','resolved','closed')),
  assignee_user_id   uuid REFERENCES iam.users(id),
  sla_due_at         timestamptz,
  resolved_by        text CHECK (resolved_by IN ('ai','human')),
  csat               smallint CHECK (csat BETWEEN 1 AND 5),
  created_at         timestamptz NOT NULL DEFAULT now(),
  resolved_at        timestamptz,
  FOREIGN KEY (tenant_id, contact_id)      REFERENCES crm.contacts (tenant_id, id),
  FOREIGN KEY (tenant_id, conversation_id) REFERENCES crm.conversations (tenant_id, id),
  UNIQUE (tenant_id, id)
);
CREATE INDEX tickets_queue_idx ON ops.tickets (tenant_id, status, priority, sla_due_at) WHERE status IN ('open','escalated');

CREATE TABLE ops.ticket_messages (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES platform.tenants(id),
  ticket_id   uuid NOT NULL,
  author_type text NOT NULL CHECK (author_type IN ('contact','user','agent_ai','system')),
  author_id   text,
  body        text NOT NULL,
  internal    boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, ticket_id) REFERENCES ops.tickets (tenant_id, id) ON DELETE CASCADE
);

CREATE TABLE ops.kb_articles (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id        uuid NOT NULL REFERENCES platform.tenants(id),
  slug             text NOT NULL,
  title            text NOT NULL,
  body             text NOT NULL,
  status           text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','in_review','published','archived')),
  source_ticket_id uuid,
  reviewed_by      uuid REFERENCES iam.users(id),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, source_ticket_id) REFERENCES ops.tickets (tenant_id, id),
  CHECK (status <> 'published' OR reviewed_by IS NOT NULL),     -- humans approve what AI drafts
  UNIQUE (tenant_id, slug)
);

CREATE TABLE ops.dsar_requests (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES platform.tenants(id),
  user_id     uuid,
  contact_id  uuid,
  kind        text NOT NULL CHECK (kind IN ('access','correction','anonymization','deletion','portability','consent_revocation','information')),
  status      text NOT NULL DEFAULT 'received' CHECK (status IN ('received','identity_verification','in_progress','completed','denied_with_reason')),
  received_at timestamptz NOT NULL DEFAULT now(),
  due_at      timestamptz NOT NULL DEFAULT now() + interval '15 days',
  completed_at timestamptz,
  handler_user_id uuid REFERENCES iam.users(id),
  outcome     jsonb NOT NULL DEFAULT '{}',   -- what was deleted/retained and the legal basis for retention
  FOREIGN KEY (tenant_id, user_id)    REFERENCES iam.users (tenant_id, id),
  FOREIGN KEY (tenant_id, contact_id) REFERENCES crm.contacts (tenant_id, id),
  CHECK (user_id IS NOT NULL OR contact_id IS NOT NULL),
  CHECK (status <> 'denied_with_reason' OR outcome ? 'reason')
);
CREATE INDEX dsar_due_idx ON ops.dsar_requests (tenant_id, due_at) WHERE status NOT IN ('completed','denied_with_reason');

-- Record of processing activities (ROPA) and vendor register.
CREATE TABLE ops.processing_activities (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid NOT NULL REFERENCES platform.tenants(id),
  name            text NOT NULL,
  purpose         text NOT NULL,
  legal_basis     text NOT NULL,
  data_categories text[] NOT NULL DEFAULT '{}',
  retention       text NOT NULL,
  processors      text[] NOT NULL DEFAULT '{}',
  involves_minors boolean NOT NULL DEFAULT false,
  uses_ai         boolean NOT NULL DEFAULT false,
  dpia_ref        text,
  reviewed_at     timestamptz
);

CREATE TABLE ops.vendors (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id          uuid NOT NULL REFERENCES platform.tenants(id),
  name               text NOT NULL,
  category           text NOT NULL,                -- psp, video, live, email, whatsapp, fiscal, llm, cloud...
  dpa_signed_at      date,
  data_location      text,
  transfer_mechanism text,
  no_training_clause boolean,
  risk_level         text CHECK (risk_level IN ('low','medium','high')),
  reviewed_at        date,
  UNIQUE (tenant_id, name)
);

CREATE TABLE ops.incidents (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id        uuid NOT NULL REFERENCES platform.tenants(id),
  kind             text NOT NULL CHECK (kind IN ('security','privacy','availability','payment','content')),
  severity         text NOT NULL CHECK (severity IN ('sev1','sev2','sev3','sev4')),
  status           text NOT NULL DEFAULT 'open' CHECK (status IN ('open','contained','resolved','postmortem')),
  detected_at      timestamptz NOT NULL DEFAULT now(),
  resolved_at      timestamptz,
  timeline         jsonb NOT NULL DEFAULT '[]',
  regulator_notified_at timestamptz,
  data_subjects_notified_at timestamptz
);

CREATE TABLE ops.content_projects (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES platform.tenants(id),
  product_id  uuid,
  stage       text NOT NULL DEFAULT 'briefing'
              CHECK (stage IN ('briefing','script','recording','editing','captions','review','compliance','published')),
  assignee_id uuid REFERENCES iam.users(id),
  due_at      timestamptz,
  checklist   jsonb NOT NULL DEFAULT '{}',
  updated_at  timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, product_id) REFERENCES catalog.products (tenant_id, id)
);

CREATE TABLE ops.contracts (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id         uuid NOT NULL REFERENCES platform.tenants(id),
  party_type        text NOT NULL CHECK (party_type IN ('instructor','affiliate','b2b','vendor')),
  party_id          uuid NOT NULL,
  kind              text NOT NULL,
  status            text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','sent','signed','terminated','expired')),
  signed_at         timestamptz,
  document_asset_id uuid,
  terms             jsonb NOT NULL DEFAULT '{}',   -- revenue share, term, IP license scope
  created_at        timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, document_asset_id) REFERENCES media.assets (tenant_id, id),
  CHECK (status <> 'signed' OR signed_at IS NOT NULL),
  UNIQUE (tenant_id, id)
);

ALTER TABLE catalog.instructors
  ADD CONSTRAINT instructors_contract_fk FOREIGN KEY (tenant_id, contract_id) REFERENCES ops.contracts (tenant_id, id);

-- -----------------------------------------------------------------------------
-- 12. AI
-- -----------------------------------------------------------------------------

CREATE TABLE ai.agents (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           uuid NOT NULL REFERENCES platform.tenants(id),
  key                 text NOT NULL,                  -- AG-01 .. AG-15
  name                text NOT NULL,
  risk_level          text NOT NULL DEFAULT 'medium' CHECK (risk_level IN ('low','medium','high')),
  autonomy_level      smallint NOT NULL DEFAULT 0 CHECK (autonomy_level BETWEEN 0 AND 3),
  status              text NOT NULL DEFAULT 'disabled' CHECK (status IN ('disabled','simulation','active','paused')),
  monthly_budget_cents bigint NOT NULL DEFAULT 0 CHECK (monthly_budget_cents >= 0),
  kill_switch         boolean NOT NULL DEFAULT false,
  UNIQUE (tenant_id, key),
  UNIQUE (tenant_id, id)
);

CREATE TABLE ai.agent_versions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    uuid NOT NULL REFERENCES platform.tenants(id),
  agent_id     uuid NOT NULL,
  version      int NOT NULL,
  config       jsonb NOT NULL,                        -- prompt ref, model routing, tools, policies
  eval_report  jsonb,
  status       text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','evaluated','approved','active','retired')),
  approved_by  uuid REFERENCES iam.users(id),
  created_at   timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, agent_id) REFERENCES ai.agents (tenant_id, id) ON DELETE CASCADE,
  CHECK (status NOT IN ('approved','active') OR approved_by IS NOT NULL),
  UNIQUE (agent_id, version),
  UNIQUE (tenant_id, id)
);

CREATE TABLE ai.tool_definitions (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id      uuid NOT NULL REFERENCES platform.tenants(id),
  key            text NOT NULL,                       -- search_course_content, request_refund...
  input_schema   jsonb NOT NULL,
  side_effect    text NOT NULL CHECK (side_effect IN ('read','write_light','financial','external_message','publish')),
  approval_level smallint NOT NULL DEFAULT 1 CHECK (approval_level BETWEEN 0 AND 3),
  UNIQUE (tenant_id, key),
  UNIQUE (tenant_id, id)
);

CREATE TABLE ai.agent_tools (
  tenant_id            uuid NOT NULL REFERENCES platform.tenants(id),
  agent_id             uuid NOT NULL,
  tool_id              uuid NOT NULL,
  max_calls_per_hour   int CHECK (max_calls_per_hour > 0),
  requires_approval    boolean NOT NULL DEFAULT true,
  PRIMARY KEY (agent_id, tool_id),
  FOREIGN KEY (tenant_id, agent_id) REFERENCES ai.agents (tenant_id, id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id, tool_id)  REFERENCES ai.tool_definitions (tenant_id, id)
);

CREATE TABLE ai.runs (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id        uuid NOT NULL REFERENCES platform.tenants(id),
  agent_version_id uuid NOT NULL,
  subject_user_id  uuid,
  channel          text,
  status           text NOT NULL DEFAULT 'running' CHECK (status IN ('running','completed','failed','blocked','handed_off')),
  tokens_in        int NOT NULL DEFAULT 0 CHECK (tokens_in >= 0),
  tokens_out       int NOT NULL DEFAULT 0 CHECK (tokens_out >= 0),
  cost_micros      bigint NOT NULL DEFAULT 0 CHECK (cost_micros >= 0),   -- millionths of BRL
  latency_ms       int,
  trace_id         text,
  started_at       timestamptz NOT NULL DEFAULT now(),
  finished_at      timestamptz,
  FOREIGN KEY (tenant_id, agent_version_id) REFERENCES ai.agent_versions (tenant_id, id),
  FOREIGN KEY (tenant_id, subject_user_id)  REFERENCES iam.users (tenant_id, id),
  UNIQUE (tenant_id, id)
);
CREATE INDEX runs_agent_idx ON ai.runs (tenant_id, agent_version_id, started_at DESC);

CREATE TABLE ai.tool_calls (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES platform.tenants(id),
  run_id      uuid NOT NULL,
  step        int NOT NULL,
  tool_key    text NOT NULL,
  input       jsonb NOT NULL,
  output      jsonb,
  status      text NOT NULL DEFAULT 'proposed' CHECK (status IN ('proposed','awaiting_approval','approved','rejected','executed','failed')),
  approval_id uuid REFERENCES ops.approvals(id),
  created_at  timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, run_id) REFERENCES ai.runs (tenant_id, id) ON DELETE CASCADE,
  UNIQUE (run_id, step)
);

CREATE TABLE ai.chat_threads (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  uuid NOT NULL REFERENCES platform.tenants(id),
  user_id    uuid NOT NULL,
  agent_id   uuid NOT NULL,
  context    jsonb NOT NULL DEFAULT '{}',      -- product, lesson, mode
  created_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, user_id)  REFERENCES iam.users (tenant_id, id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id, agent_id) REFERENCES ai.agents (tenant_id, id),
  UNIQUE (tenant_id, id)
);

CREATE TABLE ai.chat_messages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  uuid NOT NULL REFERENCES platform.tenants(id),
  thread_id  uuid NOT NULL,
  role       text NOT NULL CHECK (role IN ('user','assistant','system')),
  content    text NOT NULL,                    -- PII is redacted before long-term retention
  citations  jsonb NOT NULL DEFAULT '[]',      -- [{lesson_id, t_start, t_end, source_id}]
  feedback   smallint CHECK (feedback IN (-1, 1)),
  run_id     uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, thread_id) REFERENCES ai.chat_threads (tenant_id, id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id, run_id)    REFERENCES ai.runs (tenant_id, id)
);
CREATE INDEX chat_messages_thread_idx ON ai.chat_messages (tenant_id, thread_id, created_at);

CREATE TABLE ai.knowledge_sources (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES platform.tenants(id),
  product_id  uuid,
  source_type text NOT NULL CHECK (source_type IN ('lesson_transcript','lesson_text','pdf','faq','policy','kb_article')),
  source_ref  text NOT NULL,
  version     int NOT NULL DEFAULT 1,
  status      text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','indexed','failed','removed')),
  indexed_at  timestamptz,
  FOREIGN KEY (tenant_id, product_id) REFERENCES catalog.products (tenant_id, id),
  UNIQUE (tenant_id, source_type, source_ref, version),
  UNIQUE (tenant_id, id)
);

-- Chunks for retrieval. The embedding column is added by 002_ai_vector.sql (pgvector).
-- product_id is mandatory: retrieval is always filtered by the caller's entitlements.
CREATE TABLE ai.knowledge_chunks (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES platform.tenants(id),
  source_id   uuid NOT NULL,
  product_id  uuid,
  lesson_id   uuid,
  content     text NOT NULL,
  t_start     int CHECK (t_start >= 0),
  t_end       int CHECK (t_end >= 0),
  visibility  text NOT NULL DEFAULT 'entitled' CHECK (visibility IN ('public','entitled','staff')),
  metadata    jsonb NOT NULL DEFAULT '{}',
  tsv         tsvector GENERATED ALWAYS AS (to_tsvector('portuguese', content)) STORED,
  FOREIGN KEY (tenant_id, source_id) REFERENCES ai.knowledge_sources (tenant_id, id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id, product_id) REFERENCES catalog.products (tenant_id, id),
  CHECK (t_end IS NULL OR t_start IS NULL OR t_end >= t_start),
  CHECK (visibility = 'public' OR product_id IS NOT NULL)
);
CREATE INDEX knowledge_chunks_product_idx ON ai.knowledge_chunks (tenant_id, product_id);
CREATE INDEX knowledge_chunks_tsv_idx ON ai.knowledge_chunks USING gin (tsv);

CREATE TABLE ai.eval_sets (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  uuid NOT NULL REFERENCES platform.tenants(id),
  agent_id   uuid NOT NULL,
  product_id uuid,
  name       text NOT NULL,
  FOREIGN KEY (tenant_id, agent_id)   REFERENCES ai.agents (tenant_id, id),
  FOREIGN KEY (tenant_id, product_id) REFERENCES catalog.products (tenant_id, id),
  UNIQUE (tenant_id, id)
);

CREATE TABLE ai.eval_cases (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES platform.tenants(id),
  eval_set_id uuid NOT NULL,
  input       jsonb NOT NULL,
  expected    jsonb NOT NULL,                  -- expected answer / source / refusal flag
  category    text NOT NULL DEFAULT 'qa' CHECK (category IN ('qa','refusal','injection','policy','tone')),
  FOREIGN KEY (tenant_id, eval_set_id) REFERENCES ai.eval_sets (tenant_id, id) ON DELETE CASCADE
);

CREATE TABLE ai.eval_runs (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id        uuid NOT NULL REFERENCES platform.tenants(id),
  eval_set_id      uuid NOT NULL,
  agent_version_id uuid NOT NULL,
  metrics          jsonb NOT NULL,             -- grounding, accuracy, refusal_rate, injection_success...
  passed           boolean NOT NULL,
  created_at       timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, eval_set_id)      REFERENCES ai.eval_sets (tenant_id, id),
  FOREIGN KEY (tenant_id, agent_version_id) REFERENCES ai.agent_versions (tenant_id, id)
);

CREATE TABLE ai.credit_wallets (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     uuid NOT NULL REFERENCES platform.tenants(id),
  owner_type    text NOT NULL CHECK (owner_type IN ('tenant','instructor','user')),
  owner_id      uuid NOT NULL,
  balance_credits bigint NOT NULL DEFAULT 0 CHECK (balance_credits >= 0),
  UNIQUE (tenant_id, owner_type, owner_id),
  UNIQUE (tenant_id, id)
);

CREATE TABLE ai.credit_transactions (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  uuid NOT NULL REFERENCES platform.tenants(id),
  wallet_id  uuid NOT NULL,
  delta      bigint NOT NULL CHECK (delta <> 0),
  reason     text NOT NULL,
  run_id     uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, wallet_id) REFERENCES ai.credit_wallets (tenant_id, id),
  FOREIGN KEY (tenant_id, run_id)    REFERENCES ai.runs (tenant_id, id)
);

-- Learning memory requires explicit consent (iam.consents) and can be erased by the user.
CREATE TABLE ai.memory_items (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  uuid NOT NULL REFERENCES platform.tenants(id),
  user_id    uuid NOT NULL,
  kind       text NOT NULL CHECK (kind IN ('level','gap','preference','goal')),
  content    text NOT NULL,
  consent_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, user_id)    REFERENCES iam.users (tenant_id, id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id, consent_id) REFERENCES iam.consents (tenant_id, id)
);

-- -----------------------------------------------------------------------------
-- 13. Analytics (monthly partitions)
-- -----------------------------------------------------------------------------

CREATE TABLE analytics.events (
  id            uuid NOT NULL DEFAULT gen_random_uuid(),
  tenant_id     uuid NOT NULL REFERENCES platform.tenants(id),
  occurred_at   timestamptz NOT NULL,
  name          text NOT NULL,
  user_id       uuid,
  anonymous_id  text,
  session_id    text,
  properties    jsonb NOT NULL DEFAULT '{}',
  consent_scope text NOT NULL DEFAULT 'essential' CHECK (consent_scope IN ('essential','analytics','marketing')),
  PRIMARY KEY (id, occurred_at)
) PARTITION BY RANGE (occurred_at);
CREATE TABLE analytics.events_default PARTITION OF analytics.events DEFAULT;
CREATE INDEX events_name_time_idx ON analytics.events (tenant_id, name, occurred_at DESC);

CREATE OR REPLACE FUNCTION analytics.ensure_month_partition(p_month date) RETURNS void
LANGUAGE plpgsql AS $$
DECLARE
  v_start date := date_trunc('month', p_month)::date;
  v_end   date := (date_trunc('month', p_month) + interval '1 month')::date;
  v_name  text := format('events_%s', to_char(v_start, 'YYYY_MM'));
BEGIN
  IF to_regclass(format('analytics.%I', v_name)) IS NULL THEN
    EXECUTE format('CREATE TABLE analytics.%I PARTITION OF analytics.events FOR VALUES FROM (%L) TO (%L)',
                   v_name, v_start, v_end);
  END IF;
END $$;

SELECT analytics.ensure_month_partition(date_trunc('month', now())::date);
SELECT analytics.ensure_month_partition((date_trunc('month', now()) + interval '1 month')::date);

-- -----------------------------------------------------------------------------
-- 90. Integrity triggers
-- -----------------------------------------------------------------------------

-- Ledger: every transaction must balance (debits = credits) at commit time.
CREATE OR REPLACE FUNCTION commerce.assert_txn_balanced() RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE
  v_debit  bigint;
  v_credit bigint;
BEGIN
  SELECT COALESCE(SUM(amount_cents) FILTER (WHERE direction = 'D'), 0),
         COALESCE(SUM(amount_cents) FILTER (WHERE direction = 'C'), 0)
    INTO v_debit, v_credit
    FROM commerce.ledger_entries
   WHERE tenant_id = NEW.tenant_id AND txn_id = NEW.txn_id;
  IF v_debit <> v_credit THEN
    RAISE EXCEPTION 'ledger transaction % is unbalanced (debit=%, credit=%)', NEW.txn_id, v_debit, v_credit
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NULL;
END $$;

CREATE CONSTRAINT TRIGGER ledger_balanced_trg
  AFTER INSERT ON commerce.ledger_entries
  DEFERRABLE INITIALLY DEFERRED
  FOR EACH ROW EXECUTE FUNCTION commerce.assert_txn_balanced();

-- Append-only tables: corrections are made with new (reversing) rows.
CREATE OR REPLACE FUNCTION platform.forbid_mutation() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION '% is append-only (% not allowed)', TG_TABLE_SCHEMA || '.' || TG_TABLE_NAME, TG_OP
    USING ERRCODE = 'insufficient_privilege';
END $$;

CREATE TRIGGER audit_logs_append_only BEFORE UPDATE OR DELETE ON platform.audit_logs
  FOR EACH ROW EXECUTE FUNCTION platform.forbid_mutation();
CREATE TRIGGER ledger_entries_append_only BEFORE UPDATE OR DELETE ON commerce.ledger_entries
  FOR EACH ROW EXECUTE FUNCTION platform.forbid_mutation();

-- updated_at maintenance for every table that has the column.
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT c.table_schema, c.table_name
      FROM information_schema.columns c
      JOIN information_schema.tables t
        ON t.table_schema = c.table_schema AND t.table_name = c.table_name AND t.table_type = 'BASE TABLE'
     WHERE c.column_name = 'updated_at'
       AND c.table_schema IN ('platform','iam','catalog','media','crm','growth','commerce','lms','live','engage','ai','ops','analytics')
  LOOP
    EXECUTE format('CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I.%I FOR EACH ROW EXECUTE FUNCTION platform.set_updated_at()',
                   r.table_schema, r.table_name);
  END LOOP;
END $$;

-- -----------------------------------------------------------------------------
-- 99. Row Level Security (tenant isolation)
-- -----------------------------------------------------------------------------

DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT n.nspname AS schema_name, c.relname AS table_name
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      JOIN pg_attribute a ON a.attrelid = c.oid AND a.attname = 'tenant_id' AND NOT a.attisdropped
     WHERE c.relkind IN ('r','p')
       AND NOT c.relispartition
       AND n.nspname IN ('platform','iam','catalog','media','crm','growth','commerce','lms','live','engage','ai','ops','analytics')
  LOOP
    EXECUTE format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY', r.schema_name, r.table_name);
    EXECUTE format('ALTER TABLE %I.%I FORCE ROW LEVEL SECURITY', r.schema_name, r.table_name);
    EXECUTE format(
      'CREATE POLICY tenant_isolation ON %I.%I USING (tenant_id = platform.current_tenant()) WITH CHECK (tenant_id = platform.current_tenant())',
      r.schema_name, r.table_name);
  END LOOP;
END $$;

ALTER TABLE platform.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform.tenants FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_self ON platform.tenants USING (id = platform.current_tenant());

-- Application role: no BYPASSRLS, least privilege. Tables that must stay append-only get no UPDATE/DELETE.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'apex_app') THEN
    CREATE ROLE apex_app NOLOGIN NOBYPASSRLS;
  END IF;
END $$;

GRANT USAGE ON SCHEMA platform, iam, catalog, media, crm, growth, commerce, lms, live, engage, ai, ops, analytics TO apex_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA platform, iam, catalog, media, crm, growth, commerce, lms, live, engage, ai, ops, analytics TO apex_app;
REVOKE UPDATE, DELETE ON platform.audit_logs, commerce.ledger_entries FROM apex_app;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA commerce TO apex_app;
GRANT EXECUTE ON FUNCTION platform.current_tenant() TO apex_app;
