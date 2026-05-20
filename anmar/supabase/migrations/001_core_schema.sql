-- ============================================================
-- Clínica Anmar — Fase 1: Schema Core
-- ============================================================

-- Enum: staff roles
CREATE TYPE staff_role AS ENUM (
  'admin',
  'doctor',
  'nurse',
  'biomedical',
  'receptionist',
  'viewer'
);

-- ============================================================
-- CLÍNICAS
-- ============================================================
CREATE TABLE clinics (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  cnpj        TEXT UNIQUE,
  address     JSONB,
  contact     JSONB,
  settings    JSONB DEFAULT '{}',
  active      BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- FILIAIS
-- ============================================================
CREATE TABLE branches (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id   UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  address     JSONB,
  active      BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- COLABORADORES (M1.2.1.1)
-- ============================================================
CREATE TABLE staff_profiles (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id             UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  user_id               UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name             TEXT NOT NULL,
  cpf                   TEXT NOT NULL,
  role                  staff_role NOT NULL DEFAULT 'receptionist',
  professional_register TEXT,
  specialties           TEXT[] DEFAULT '{}',
  email                 TEXT,
  phone                 TEXT,
  birth_date            DATE,
  hourly_cost           NUMERIC(10,2),
  branch_id             UUID REFERENCES branches(id),
  active                BOOLEAN DEFAULT true,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(clinic_id, cpf)
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER staff_updated_at
  BEFORE UPDATE ON staff_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_staff_clinic    ON staff_profiles(clinic_id);
CREATE INDEX idx_staff_user      ON staff_profiles(user_id);
CREATE INDEX idx_staff_role      ON staff_profiles(clinic_id, role);
CREATE INDEX idx_staff_active    ON staff_profiles(clinic_id, active);
CREATE INDEX idx_branches_clinic ON branches(clinic_id);
