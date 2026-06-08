-- G6 security: restrict all writes to verified hakunas or service_role
-- Addresses: any OTP-authenticated user could bypass API and write directly to DB.

-- Helper: true only if the authenticated user's email is in the hakunas table
-- (used in WITH CHECK / USING clauses below)

-- ── senderistas ────────────────────────────────────────────────────────────────
-- Triagem and import routes now use admin client; revoke public insert.
DROP POLICY IF EXISTS "Public insert senderistas" ON senderistas;
CREATE POLICY "Service role insert senderistas" ON senderistas
  FOR INSERT TO service_role WITH CHECK (true);

-- Updates (approval, status, check-in) must come from a verified hakuna session.
DROP POLICY IF EXISTS "Auth update senderistas" ON senderistas;
CREATE POLICY "Hakuna update senderistas" ON senderistas
  FOR UPDATE TO authenticated
  USING  (EXISTS (SELECT 1 FROM hakunas WHERE email = auth.email()))
  WITH CHECK (EXISTS (SELECT 1 FROM hakunas WHERE email = auth.email()));

-- ── exames ─────────────────────────────────────────────────────────────────────
-- Upload route now uses admin client; revoke public insert.
DROP POLICY IF EXISTS "Public insert exames" ON exames;
CREATE POLICY "Service role insert exames" ON exames
  FOR INSERT TO service_role WITH CHECK (true);

-- Exam validation (approve/reject) must come from a verified hakuna.
DROP POLICY IF EXISTS "Auth update exames" ON exames;
CREATE POLICY "Hakuna update exames" ON exames
  FOR UPDATE TO authenticated
  USING  (EXISTS (SELECT 1 FROM hakunas WHERE email = auth.email()))
  WITH CHECK (EXISTS (SELECT 1 FROM hakunas WHERE email = auth.email()));

-- ── mensagens_apoio ────────────────────────────────────────────────────────────
-- Family insert: keep anon INSERT (public portal still needs it as fallback).
-- Mark-as-read must come from a verified hakuna.
DROP POLICY IF EXISTS "Auth update mensagens" ON mensagens_apoio;
CREATE POLICY "Hakuna update mensagens" ON mensagens_apoio
  FOR UPDATE TO authenticated
  USING  (EXISTS (SELECT 1 FROM hakunas WHERE email = auth.email()))
  WITH CHECK (EXISTS (SELECT 1 FROM hakunas WHERE email = auth.email()));

-- ── atividades_top ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Auth manage atividades" ON atividades_top;
CREATE POLICY "Hakuna manage atividades" ON atividades_top
  FOR ALL TO authenticated
  USING  (EXISTS (SELECT 1 FROM hakunas WHERE email = auth.email()))
  WITH CHECK (EXISTS (SELECT 1 FROM hakunas WHERE email = auth.email()));

-- ── participacoes ──────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Auth manage participacoes" ON participacoes;
CREATE POLICY "Hakuna manage participacoes" ON participacoes
  FOR ALL TO authenticated
  USING  (EXISTS (SELECT 1 FROM hakunas WHERE email = auth.email()))
  WITH CHECK (EXISTS (SELECT 1 FROM hakunas WHERE email = auth.email()));

-- ── prontuarios ────────────────────────────────────────────────────────────────
-- Sync route uses authenticated session; restrict to verified hakunas only.
DROP POLICY IF EXISTS "Auth insert prontuarios" ON prontuarios;
CREATE POLICY "Hakuna insert prontuarios" ON prontuarios
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM hakunas WHERE email = auth.email()));
