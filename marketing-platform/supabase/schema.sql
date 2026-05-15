-- Marketing Platform v1 Schema
-- Deploy via: supabase db push  OR  paste in Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Clinics ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clinics (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  contact       TEXT NOT NULL DEFAULT '',
  tagline       TEXT NOT NULL DEFAULT '',
  logo_url      TEXT,
  color_primary TEXT NOT NULL DEFAULT '#1B4F72',
  color_accent  TEXT NOT NULL DEFAULT '#D4AF37',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Procedures ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS procedures (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id    UUID REFERENCES clinics(id) ON DELETE CASCADE,
  slug         TEXT UNIQUE NOT NULL,
  name         TEXT NOT NULL,
  short_name   TEXT NOT NULL,
  audience     TEXT NOT NULL CHECK (audience IN ('feminino', 'masculino', 'misto')),
  description  TEXT NOT NULL DEFAULT '',
  color_primary TEXT NOT NULL DEFAULT '#1B4F72',
  color_accent  TEXT NOT NULL DEFAULT '#4FC3F7',
  icon          TEXT NOT NULL DEFAULT '◆',
  active        BOOLEAN NOT NULL DEFAULT TRUE,
  order_index   INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Slides ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS slides (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  procedure_id     UUID NOT NULL REFERENCES procedures(id) ON DELETE CASCADE,
  order_index      INT NOT NULL DEFAULT 0,
  duration_seconds INT NOT NULL DEFAULT 15,
  type             TEXT NOT NULL CHECK (type IN ('gancho','definicao','procedimentos','beneficios','cta')),
  title            TEXT NOT NULL,
  subtitle         TEXT,
  body             TEXT[],
  cta_text         TEXT,
  image_url        TEXT,
  active           BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Media ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS media (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id  UUID REFERENCES clinics(id) ON DELETE CASCADE,
  file_url   TEXT NOT NULL,
  file_type  TEXT,
  alt_text   TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Row Level Security ─────────────────────────────────────────────────
ALTER TABLE clinics    ENABLE ROW LEVEL SECURITY;
ALTER TABLE procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE slides     ENABLE ROW LEVEL SECURITY;
ALTER TABLE media      ENABLE ROW LEVEL SECURITY;

-- Public read for display (anon can read active content)
CREATE POLICY "Public read clinics"
  ON clinics FOR SELECT TO anon USING (TRUE);

CREATE POLICY "Public read procedures"
  ON procedures FOR SELECT TO anon USING (active = TRUE);

CREATE POLICY "Public read slides"
  ON slides FOR SELECT TO anon USING (active = TRUE);

-- Admin full access (authenticated users)
CREATE POLICY "Admin full clinics"
  ON clinics FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Admin full procedures"
  ON procedures FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Admin full slides"
  ON slides FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Admin full media"
  ON media FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- ── Seed data ──────────────────────────────────────────────────────────
INSERT INTO clinics (name, contact, tagline)
VALUES ('[NOME DA CLÍNICA]', '[CONTATO]', 'Estética avançada com cuidado personalizado')
ON CONFLICT DO NOTHING;

-- Procedures and slides are managed via the admin interface or seeded via API
