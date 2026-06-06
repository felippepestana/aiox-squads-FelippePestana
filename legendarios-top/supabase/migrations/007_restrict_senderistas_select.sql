-- Restrict senderistas SELECT to authenticated users only.
-- Public-facing API routes (triagem, exames token, mensagens token) now
-- use the service-role client for senderista lookups, so anon access is
-- no longer needed and would expose PII to anyone with the anon key.
DROP POLICY IF EXISTS "Auth read senderistas" ON senderistas;
CREATE POLICY "Auth read senderistas" ON senderistas
  FOR SELECT USING (auth.role() = 'authenticated');
