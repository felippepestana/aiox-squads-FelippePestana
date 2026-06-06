-- Restrict hakunas to SELECT-only for authenticated users.
-- The policy "Auth all hakunas" (no FOR clause) allowed any authenticated user
-- to INSERT/UPDATE/DELETE any hakunas row, creating a privilege escalation path.
-- All writes to hakunas must go through the service-role admin client.
DROP POLICY IF EXISTS "Auth all hakunas" ON hakunas;
CREATE POLICY "Auth read hakunas" ON hakunas
  FOR SELECT USING (auth.role() = 'authenticated');
