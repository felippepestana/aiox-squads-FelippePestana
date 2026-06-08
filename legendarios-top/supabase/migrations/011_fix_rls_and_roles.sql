-- P1: Restrict exames SELECT to authenticated users only
-- Without TO authenticated, anon JWT can read all exam metadata and file paths
DROP POLICY IF EXISTS "Auth read exames" ON exames;
CREATE POLICY "Auth read exames" ON exames
  FOR SELECT TO authenticated USING (true);

-- P1: Restrict mensagens_apoio SELECT to authenticated users only
-- Without TO authenticated, anon JWT can read family letter content, sender names, file paths
DROP POLICY IF EXISTS "Auth read mensagens" ON mensagens_apoio;
CREATE POLICY "Auth read mensagens" ON mensagens_apoio
  FOR SELECT TO authenticated USING (true);

-- P2: Fix hakunas.role — migration 009 ADD COLUMN IF NOT EXISTS was a no-op because
-- migration 001 already created the column with DEFAULT 'hakuna' and no CHECK constraint.
-- Update legacy values before adding the constraint.
UPDATE hakunas SET role = 'apoio' WHERE role = 'hakuna';
ALTER TABLE hakunas ALTER COLUMN role SET DEFAULT 'apoio';
ALTER TABLE hakunas ADD CONSTRAINT hakunas_role_check
  CHECK (role IN ('médico', 'coordenador', 'apoio'));
