-- Create private storage buckets for medical and personal data
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('exames',      'exames',      false, 10485760,  ARRAY['application/pdf', 'image/jpeg', 'image/png']),
  ('prontuarios', 'prontuarios', false, 10485760,  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']),
  ('mensagens',   'mensagens',   false, 52428800,  ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime', 'video/webm', 'audio/mpeg', 'audio/mp4', 'audio/ogg', 'audio/wav'])
ON CONFLICT (id) DO UPDATE SET public = false;

-- ── exames ─────────────────────────────────────────────────────────────────
-- Upload is done server-side via service-role (unauthenticated senderista flow)
CREATE POLICY "exames_insert_service_role" ON storage.objects
  FOR INSERT TO service_role
  WITH CHECK (bucket_id = 'exames');

-- Hakunas (authenticated) can read and generate signed URLs
CREATE POLICY "exames_select_authenticated" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'exames');

-- ── prontuarios ────────────────────────────────────────────────────────────
-- Campo app syncs as authenticated user
CREATE POLICY "prontuarios_insert_authenticated" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'prontuarios');

CREATE POLICY "prontuarios_select_authenticated" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'prontuarios');

-- ── mensagens ──────────────────────────────────────────────────────────────
-- Upload and cleanup done server-side via service-role (unauthenticated family flow)
CREATE POLICY "mensagens_insert_service_role" ON storage.objects
  FOR INSERT TO service_role
  WITH CHECK (bucket_id = 'mensagens');

CREATE POLICY "mensagens_delete_service_role" ON storage.objects
  FOR DELETE TO service_role
  USING (bucket_id = 'mensagens');

-- Hakunas (authenticated) can read and generate signed URLs
CREATE POLICY "mensagens_select_authenticated" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'mensagens');
