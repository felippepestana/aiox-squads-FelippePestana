-- Transmissao Multicam — Initial Schema
-- Run against a Supabase project (free tier covers this workload).
-- Enable pgcrypto for gen_random_uuid().
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ─────────────────────────────────────────
-- OBS connection settings (single row)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS obs_settings (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  host        text        NOT NULL DEFAULT 'localhost',
  port        integer     NOT NULL DEFAULT 4455,
  -- Password stored as bcrypt hash; the plain-text password is NEVER persisted.
  -- The panel stores it in sessionStorage only for the current session.
  use_tls     boolean     NOT NULL DEFAULT false,
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Ensure at most one row exists.
CREATE UNIQUE INDEX IF NOT EXISTS obs_settings_singleton ON obs_settings ((true));

-- ─────────────────────────────────────────
-- Google Meet / Workspace settings
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS meet_settings (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_email             text,
  default_room_url          text,
  auto_record               boolean NOT NULL DEFAULT true,
  studio_effects_disabled   boolean NOT NULL DEFAULT true,
  live_streaming_enabled    boolean NOT NULL DEFAULT false,
  workspace_admin_email     text,
  max_participants          integer DEFAULT 300,
  notes                     text,
  updated_at                timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS meet_settings_singleton ON meet_settings ((true));

-- ─────────────────────────────────────────
-- Camera configuration (one row per camera)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS camera_configs (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  camera_id      text        UNIQUE NOT NULL,   -- CAM1 … CAM4
  display_name   text        NOT NULL,
  usb_port       text,                          -- e.g. "USB-A rear top-left"
  vid            text        NOT NULL DEFAULT '3564',
  role           text        NOT NULL DEFAULT 'speaker'
                             CHECK (role IN ('speaker','slides','host','reserve')),
  preset_1_name  text        NOT NULL DEFAULT 'wide',
  preset_2_name  text        NOT NULL DEFAULT 'medium',
  preset_3_name  text        NOT NULL DEFAULT 'close',
  auto_track     boolean     NOT NULL DEFAULT true,
  notes          text,
  updated_at     timestamptz NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────
-- Microphone / audio channel mapping
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mic_channels (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel        integer     NOT NULL,          -- 1-based physical channel
  label          text        NOT NULL,
  input_name     text        NOT NULL,          -- OBS input name
  camera_id      text        REFERENCES camera_configs(camera_id),
  role           text        NOT NULL DEFAULT 'speaker'
                             CHECK (role IN ('speaker','host','aux')),
  threshold_db   numeric     NOT NULL DEFAULT -40,
  updated_at     timestamptz NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────
-- API credentials (encrypted at rest via Supabase Vault or app-side AES)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS api_credentials (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name    text        NOT NULL,         -- e.g. "google_meet", "prometheus"
  credential_type text        NOT NULL          -- "api_key" | "oauth_token" | "webhook_secret"
                              CHECK (credential_type IN ('api_key','oauth_token','webhook_secret','other')),
  value_hint      text,                         -- last 4 chars of value (display only)
  description     text,
  expires_at      timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────
-- Events (broadcast sessions)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title                 text        NOT NULL,
  session_topic         text,
  scheduled_at          timestamptz,
  duration_min          integer     DEFAULT 60,
  status                text        NOT NULL DEFAULT 'planned'
                                    CHECK (status IN ('planned','live','completed','cancelled')),
  standby_countdown_min integer     NOT NULL DEFAULT 5,
  meet_room_url         text,
  notes                 text,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────
-- Switch log (camera switch history)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS switch_logs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id      uuid        REFERENCES events(id) ON DELETE SET NULL,
  switched_at   timestamptz NOT NULL DEFAULT now(),
  from_scene    text,
  to_scene      text        NOT NULL,
  trigger       text        NOT NULL DEFAULT 'manual'
                            CHECK (trigger IN ('audio','motion','manual','operator','failover','standby')),
  operator_name text,
  latency_ms    integer
);

CREATE INDEX IF NOT EXISTS switch_logs_event_id_idx ON switch_logs (event_id);
CREATE INDEX IF NOT EXISTS switch_logs_switched_at_idx ON switch_logs (switched_at DESC);

-- ─────────────────────────────────────────
-- Row-Level Security (all tables locked to authenticated users only)
-- ─────────────────────────────────────────
ALTER TABLE obs_settings    ENABLE ROW LEVEL SECURITY;
ALTER TABLE meet_settings   ENABLE ROW LEVEL SECURITY;
ALTER TABLE camera_configs  ENABLE ROW LEVEL SECURITY;
ALTER TABLE mic_channels    ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE events          ENABLE ROW LEVEL SECURITY;
ALTER TABLE switch_logs     ENABLE ROW LEVEL SECURITY;

-- All tables: authenticated users may read and write.
-- Adjust to your org's auth strategy if needed.
CREATE POLICY "authenticated_all" ON obs_settings    FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON meet_settings   FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON camera_configs  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON mic_channels    FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON api_credentials FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON events          FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON switch_logs     FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Allow the F6 engine (service role) to INSERT switch_logs without a session.
CREATE POLICY "service_insert_switch_logs" ON switch_logs
  FOR INSERT TO service_role WITH CHECK (true);
