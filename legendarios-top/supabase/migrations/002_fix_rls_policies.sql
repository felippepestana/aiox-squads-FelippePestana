-- Fix prontuarios: require authentication to insert (campo app syncs authenticated)
DROP POLICY IF EXISTS "Public insert prontuarios" ON prontuarios;
CREATE POLICY "Auth insert prontuarios" ON prontuarios
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Exames: allow only known tipo values at DB level
ALTER TABLE exames ADD CONSTRAINT exames_tipo_check
  CHECK (tipo IN ('atestado_cg', 'atestado_cardio', 'teste_esteira'));
