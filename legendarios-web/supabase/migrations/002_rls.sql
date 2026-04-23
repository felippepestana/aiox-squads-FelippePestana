-- ─────────────────────────────────────────────────────────────────────────────
-- Row Level Security (RLS) — Legendários Platform
-- Modelo: coordenadores veem apenas seus eventos/cidades autorizados
-- ─────────────────────────────────────────────────────────────────────────────

-- Helper: retorna role do usuário autenticado
CREATE OR REPLACE FUNCTION user_role()
RETURNS TEXT AS $$
  SELECT role FROM perfis WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper: retorna cidades autorizadas do usuário
CREATE OR REPLACE FUNCTION user_cidade_ids()
RETURNS UUID[] AS $$
  SELECT COALESCE(cidades_ids, ARRAY[]::UUID[]) FROM perfis WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper: admin check
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT user_role() = 'admin';
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ─── Habilitar RLS ────────────────────────────────────────────────────────────

ALTER TABLE cidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE lotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE participantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE inscricoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE campanhas ENABLE ROW LEVEL SECURITY;
ALTER TABLE sequencias_mensagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE influenciadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE voluntarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklists_operacionais ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE relatorios ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversas_ia ENABLE ROW LEVEL SECURITY;
ALTER TABLE lgpd_consentimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfis ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks_log ENABLE ROW LEVEL SECURITY;

-- ─── CIDADES ──────────────────────────────────────────────────────────────────

-- Todos os usuários autenticados leem cidades (seleção de cidade)
CREATE POLICY "cidades_select" ON cidades
  FOR SELECT TO authenticated USING (true);

-- Apenas admins modificam
CREATE POLICY "cidades_admin" ON cidades
  FOR ALL TO authenticated USING (is_admin());

-- ─── EVENTOS ──────────────────────────────────────────────────────────────────

-- Coordenadores veem apenas eventos de suas cidades; admins veem tudo
CREATE POLICY "eventos_select" ON eventos
  FOR SELECT TO authenticated
  USING (
    is_admin()
    OR cidade_id = ANY(user_cidade_ids())
  );

CREATE POLICY "eventos_write" ON eventos
  FOR INSERT TO authenticated WITH CHECK (is_admin());

CREATE POLICY "eventos_update" ON eventos
  FOR UPDATE TO authenticated
  USING (is_admin() OR cidade_id = ANY(user_cidade_ids()));

-- ─── LOTES ────────────────────────────────────────────────────────────────────

CREATE POLICY "lotes_select" ON lotes
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM eventos e
      WHERE e.id = lotes.evento_id
        AND (is_admin() OR e.cidade_id = ANY(user_cidade_ids()))
    )
  );

CREATE POLICY "lotes_write" ON lotes
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM eventos e
      WHERE e.id = lotes.evento_id
        AND (is_admin() OR e.cidade_id = ANY(user_cidade_ids()))
    )
  );

-- ─── PARTICIPANTES / ALUMNI ───────────────────────────────────────────────────

-- Coordenadores veem participantes de seus eventos
CREATE POLICY "participantes_select" ON participantes
  FOR SELECT TO authenticated
  USING (
    is_admin()
    OR EXISTS (
      SELECT 1 FROM inscricoes i
      JOIN eventos e ON e.id = i.evento_id
      WHERE i.participante_id = participantes.id
        AND e.cidade_id = ANY(user_cidade_ids())
    )
  );

-- Apenas service role ou admin inserem (via webhook)
CREATE POLICY "participantes_insert" ON participantes
  FOR INSERT TO authenticated WITH CHECK (is_admin());

CREATE POLICY "participantes_update" ON participantes
  FOR UPDATE TO authenticated
  USING (is_admin());

-- ─── INSCRIÇÕES ───────────────────────────────────────────────────────────────

CREATE POLICY "inscricoes_select" ON inscricoes
  FOR SELECT TO authenticated
  USING (
    is_admin()
    OR EXISTS (
      SELECT 1 FROM eventos e
      WHERE e.id = inscricoes.evento_id
        AND e.cidade_id = ANY(user_cidade_ids())
    )
  );

CREATE POLICY "inscricoes_write" ON inscricoes
  FOR ALL TO authenticated
  USING (
    is_admin()
    OR EXISTS (
      SELECT 1 FROM eventos e
      WHERE e.id = inscricoes.evento_id
        AND e.cidade_id = ANY(user_cidade_ids())
    )
  );

-- ─── CAMPANHAS ────────────────────────────────────────────────────────────────

CREATE POLICY "campanhas_access" ON campanhas
  FOR ALL TO authenticated
  USING (
    is_admin()
    OR EXISTS (
      SELECT 1 FROM eventos e
      WHERE e.id = campanhas.evento_id
        AND e.cidade_id = ANY(user_cidade_ids())
    )
  );

-- ─── INFLUENCIADORES ──────────────────────────────────────────────────────────

-- Todos leem (banco de influenciadores compartilhado)
CREATE POLICY "influenciadores_select" ON influenciadores
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "influenciadores_write" ON influenciadores
  FOR ALL TO authenticated USING (is_admin());

-- ─── CONVERSAS IA ──────────────────────────────────────────────────────────────

-- Usuários veem apenas suas próprias conversas
CREATE POLICY "conversas_ia_select" ON conversas_ia
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "conversas_ia_insert" ON conversas_ia
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- ─── PERFIS ───────────────────────────────────────────────────────────────────

CREATE POLICY "perfis_own" ON perfis
  FOR SELECT TO authenticated USING (id = auth.uid() OR is_admin());

CREATE POLICY "perfis_update_own" ON perfis
  FOR UPDATE TO authenticated USING (id = auth.uid() OR is_admin());

-- ─── LGPD ────────────────────────────────────────────────────────────────────

-- Leitura: apenas admin ou owner
CREATE POLICY "lgpd_access" ON lgpd_consentimentos
  FOR ALL TO authenticated USING (is_admin());

-- ─── WEBHOOKS LOG ─────────────────────────────────────────────────────────────

CREATE POLICY "webhooks_admin" ON webhooks_log
  FOR ALL TO authenticated USING (is_admin());

-- Acesso demais tabelas via service_role (sem RLS)
-- checklist_itens, checklists_operacionais, sequencias_mensagens, relatorios, voluntarios

CREATE POLICY "checklists_access" ON checklists_operacionais
  FOR ALL TO authenticated
  USING (
    is_admin()
    OR EXISTS (
      SELECT 1 FROM eventos e
      WHERE e.id = checklists_operacionais.evento_id
        AND e.cidade_id = ANY(user_cidade_ids())
    )
  );

CREATE POLICY "checklist_itens_access" ON checklist_itens
  FOR ALL TO authenticated
  USING (
    is_admin()
    OR EXISTS (
      SELECT 1 FROM checklists_operacionais co
      JOIN eventos e ON e.id = co.evento_id
      WHERE co.id = checklist_itens.checklist_id
        AND e.cidade_id = ANY(user_cidade_ids())
    )
  );

CREATE POLICY "sequencias_access" ON sequencias_mensagens
  FOR ALL TO authenticated
  USING (
    is_admin()
    OR EXISTS (
      SELECT 1 FROM eventos e
      WHERE e.id = sequencias_mensagens.evento_id
        AND e.cidade_id = ANY(user_cidade_ids())
    )
  );

CREATE POLICY "relatorios_access" ON relatorios
  FOR ALL TO authenticated
  USING (
    is_admin()
    OR EXISTS (
      SELECT 1 FROM eventos e
      WHERE e.id = relatorios.evento_id
        AND e.cidade_id = ANY(user_cidade_ids())
    )
  );

CREATE POLICY "voluntarios_access" ON voluntarios
  FOR ALL TO authenticated
  USING (
    is_admin()
    OR EXISTS (
      SELECT 1 FROM eventos e
      WHERE e.id = voluntarios.evento_id
        AND e.cidade_id = ANY(user_cidade_ids())
    )
  );
