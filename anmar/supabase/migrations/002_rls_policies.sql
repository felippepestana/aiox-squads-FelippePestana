-- ============================================================
-- Clínica Anmar — Row Level Security (LGPD compliance)
-- ============================================================

ALTER TABLE clinics       ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches      ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_profiles ENABLE ROW LEVEL SECURITY;

-- Helper: get clinic_id for the authenticated user
CREATE OR REPLACE FUNCTION auth_clinic_id()
RETURNS UUID LANGUAGE sql STABLE AS $$
  SELECT clinic_id FROM staff_profiles
  WHERE user_id = auth.uid() AND active = true
  LIMIT 1;
$$;

-- Helper: is current user an admin?
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM staff_profiles
    WHERE user_id = auth.uid()
      AND role = 'admin'
      AND active = true
  );
$$;

-- ============================================================
-- clinics: users can read their own clinic
-- ============================================================
CREATE POLICY "staff can read own clinic"
  ON clinics FOR SELECT
  USING (id = auth_clinic_id());

CREATE POLICY "admin can update own clinic"
  ON clinics FOR UPDATE
  USING (id = auth_clinic_id() AND is_admin());

-- ============================================================
-- branches: same clinic
-- ============================================================
CREATE POLICY "staff can read branches"
  ON branches FOR SELECT
  USING (clinic_id = auth_clinic_id());

CREATE POLICY "admin can manage branches"
  ON branches FOR ALL
  USING (clinic_id = auth_clinic_id() AND is_admin());

-- ============================================================
-- staff_profiles: admins manage all; others read same clinic
-- ============================================================
CREATE POLICY "staff can read colleagues"
  ON staff_profiles FOR SELECT
  USING (clinic_id = auth_clinic_id());

CREATE POLICY "admin can insert staff"
  ON staff_profiles FOR INSERT
  WITH CHECK (clinic_id = auth_clinic_id() AND is_admin());

CREATE POLICY "admin can update staff"
  ON staff_profiles FOR UPDATE
  USING (clinic_id = auth_clinic_id() AND is_admin());

-- Users can read their own profile even if not admin
CREATE POLICY "user can read own profile"
  ON staff_profiles FOR SELECT
  USING (user_id = auth.uid());

-- ============================================================
-- Seed: bootstrap clinic (run once via Supabase dashboard)
-- ============================================================
-- INSERT INTO clinics (name) VALUES ('Clínica Anmar');
-- Then: INSERT INTO staff_profiles (clinic_id, full_name, cpf, role, user_id)
--       VALUES ('<clinic_id>', 'Admin', '00000000000', 'admin', auth.uid());
