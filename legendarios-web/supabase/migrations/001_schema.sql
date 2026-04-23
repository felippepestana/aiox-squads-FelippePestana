-- ─────────────────────────────────────────────────────────────────────────────
-- Legendários Platform — Schema Completo
-- Plataforma full-service de IA para o Movimento Legendários
-- ─────────────────────────────────────────────────────────────────────────────

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- pg_cron only available in production/Cloud Supabase — skip locally
DO $$ BEGIN
  CREATE EXTENSION IF NOT EXISTS "pg_cron";
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'pg_cron not available — scheduled jobs disabled in local dev';
END $$;

-- ─── CIDADES ──────────────────────────────────────────────────────────────────

CREATE TABLE cidades (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome            TEXT NOT NULL,
  estado          CHAR(2) NOT NULL,
  regiao          TEXT NOT NULL CHECK (regiao IN ('Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul')),
  score_maturidade INT DEFAULT 0 CHECK (score_maturidade BETWEEN 0 AND 10),
  score_potencial  INT DEFAULT 0 CHECK (score_potencial BETWEEN 0 AND 10),
  populacao        INT,
  ativa            BOOLEAN DEFAULT true,
  notas            TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Seed: benchmark + evento alvo
INSERT INTO cidades (nome, estado, regiao, score_maturidade, score_potencial, notas) VALUES
  ('Balneário Camboriú', 'SC', 'Sul', 10, 10, 'Sede brasileira — Igreja Embaixada. TOP #555 e #644 realizados. Benchmark máximo.'),
  ('Porto Velho', 'RO', 'Norte', 3, 8, '1ª edição amazônica — TOP Destemidos Pioneiros 2026. Crescimento alto potencial.'),
  ('Manaus', 'AM', 'Norte', 2, 9, 'Segunda cidade amazônica — candidata expansão imediata.'),
  ('Campo Grande', 'MS', 'Centro-Oeste', 4, 7, 'Centro-Oeste — boa base cristã evangélica.'),
  ('Belém', 'PA', 'Norte', 2, 8, 'Capital do Pará — potencial Norte/Amazônia.');

-- ─── EVENTOS ──────────────────────────────────────────────────────────────────

CREATE TYPE tipo_evento AS ENUM ('TOP', 'REM', 'LEGADO');
CREATE TYPE status_evento AS ENUM (
  'planejamento', 'inscricoes_abertas', 'esgotado',
  'em_andamento', 'encerrado', 'cancelado'
);

CREATE TABLE eventos (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome                   TEXT NOT NULL,
  tipo                   tipo_evento NOT NULL,
  cidade_id              UUID REFERENCES cidades(id),
  data_inicio            DATE,
  data_fim               DATE,
  capacidade_meta        INT NOT NULL DEFAULT 100,
  capacidade_minima      INT NOT NULL DEFAULT 30,
  status                 status_evento NOT NULL DEFAULT 'planejamento',
  budget_marketing       DECIMAL(12,2),
  local                  TEXT,
  descricao              TEXT,
  plataforma_inscricao   TEXT NOT NULL DEFAULT 'ticket_and_go',
  ticket_and_go_event_id TEXT UNIQUE,
  sympla_event_id        TEXT UNIQUE,
  url_inscricao          TEXT,
  numero_top             INT,
  configuracoes          JSONB NOT NULL DEFAULT '{}',
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger: atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_eventos_updated_at
  BEFORE UPDATE ON eventos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── LOTES ────────────────────────────────────────────────────────────────────

CREATE TYPE status_lote AS ENUM ('pendente', 'ativo', 'encerrado', 'esgotado');

CREATE TABLE lotes (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evento_id              UUID NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  numero                 INT NOT NULL,
  nome                   TEXT NOT NULL,
  preco                  DECIMAL(10,2) NOT NULL CHECK (preco >= 0),
  vagas                  INT NOT NULL CHECK (vagas > 0),
  vendidas               INT NOT NULL DEFAULT 0 CHECK (vendidas >= 0),
  data_inicio_venda      TIMESTAMPTZ,
  data_fim_venda         TIMESTAMPTZ,
  gatilho_quantidade     INT,
  status                 status_lote NOT NULL DEFAULT 'pendente',
  ticket_and_go_lote_id  TEXT,
  visivel_publicamente   BOOLEAN DEFAULT true,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (evento_id, numero),
  CHECK (vendidas <= vagas)
);

-- Função: incrementar vendidas atomicamente (usada pelo webhook)
CREATE OR REPLACE FUNCTION incrementar_vendidas(lote_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE lotes SET vendidas = vendidas + 1 WHERE id = lote_id;
  -- Auto-encerrar se esgotado
  UPDATE lotes SET status = 'esgotado'
  WHERE id = lote_id AND vendidas >= vagas;
END;
$$ LANGUAGE plpgsql;

-- ─── PARTICIPANTES (Alumni) ───────────────────────────────────────────────────

CREATE TYPE status_conjugal AS ENUM ('casado', 'solteiro', 'divorciado', 'viuvo');

CREATE TABLE participantes (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome                      TEXT NOT NULL,
  email                     TEXT UNIQUE,
  telefone                  TEXT,
  whatsapp                  TEXT,
  cpf                       TEXT,
  status_conjugal           status_conjugal,
  tem_filhos                BOOLEAN,
  faixa_etaria              TEXT,
  cidade                    TEXT,
  estado                    CHAR(2),
  como_conheceu             TEXT,
  instagram                 TEXT,
  profissao                 TEXT,
  score_engajamento         INT NOT NULL DEFAULT 0 CHECK (score_engajamento BETWEEN 0 AND 100),
  -- LGPD campos críticos
  lgpd_comunicacao          BOOLEAN NOT NULL DEFAULT false,
  lgpd_imagem               BOOLEAN NOT NULL DEFAULT false,
  lgpd_dados_perfil         BOOLEAN NOT NULL DEFAULT false,
  lgpd_data_consentimento   TIMESTAMPTZ,
  lgpd_data_expiracao       TIMESTAMPTZ,  -- 6 meses após evento
  lgpd_opt_out_at           TIMESTAMPTZ,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_participantes_updated_at
  BEFORE UPDATE ON participantes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── INSCRIÇÕES ───────────────────────────────────────────────────────────────

CREATE TYPE status_inscricao AS ENUM (
  'pendente', 'confirmada', 'cancelada', 'estornada', 'presente'
);

CREATE TYPE metodo_pagamento AS ENUM (
  'pix', 'cartao_credito', 'cartao_debito', 'boleto'
);

CREATE TABLE inscricoes (
  id                         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participante_id            UUID NOT NULL REFERENCES participantes(id),
  evento_id                  UUID NOT NULL REFERENCES eventos(id),
  lote_id                    UUID NOT NULL REFERENCES lotes(id),
  status                     status_inscricao NOT NULL DEFAULT 'pendente',
  valor_pago                 DECIMAL(10,2),
  metodo_pagamento           metodo_pagamento,
  ticket_and_go_ticket_id    TEXT UNIQUE,
  pix_codigo                 TEXT,
  pix_vencimento             TIMESTAMPTZ,
  checkin_realizado_at       TIMESTAMPTZ,
  cancelado_motivo           TEXT,
  created_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (participante_id, evento_id)
);

CREATE TRIGGER trg_inscricoes_updated_at
  BEFORE UPDATE ON inscricoes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── CAMPANHAS DE MARKETING ───────────────────────────────────────────────────

CREATE TYPE tipo_campanha AS ENUM (
  'meta_ads', 'instagram', 'whatsapp', 'email', 'influenciador', 'youtube', 'indicacao'
);

CREATE TYPE status_campanha AS ENUM ('rascunho', 'ativo', 'pausado', 'concluido');

CREATE TABLE campanhas (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evento_id       UUID NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  nome            TEXT NOT NULL,
  tipo            tipo_campanha NOT NULL,
  status          status_campanha NOT NULL DEFAULT 'rascunho',
  fase            TEXT,
  periodo         TEXT,
  budget_alocado  DECIMAL(10,2),
  gasto_atual     DECIMAL(10,2) NOT NULL DEFAULT 0,
  impressoes      BIGINT NOT NULL DEFAULT 0,
  cliques         BIGINT NOT NULL DEFAULT 0,
  leads           INT NOT NULL DEFAULT 0,
  conversoes      INT NOT NULL DEFAULT 0,
  ctr             DECIMAL(5,2),
  cpl             DECIMAL(10,2),
  roas            DECIMAL(6,2),
  meta_ads_id     TEXT,
  configuracoes   JSONB NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── SEQUÊNCIAS DE MENSAGENS (WhatsApp + Email) ───────────────────────────────

CREATE TYPE canal_mensagem AS ENUM ('whatsapp', 'email');

CREATE TABLE sequencias_mensagens (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evento_id        UUID NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  canal            canal_mensagem NOT NULL,
  fase             TEXT NOT NULL,
  numero_mensagem  INT NOT NULL,
  assunto          TEXT,
  preview_text     TEXT,
  conteudo         TEXT NOT NULL,
  dias_relativo    INT NOT NULL DEFAULT 0,
  horario_envio    TIME,
  status           TEXT NOT NULL DEFAULT 'pendente',
  enviada_at       TIMESTAMPTZ,
  destinatarios    INT DEFAULT 0,
  aberturas        INT DEFAULT 0,
  cliques          INT DEFAULT 0,
  respostas        INT DEFAULT 0,
  lgpd_canal       TEXT NOT NULL DEFAULT 'opt-in ativo obrigatório',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── INFLUENCIADORES ──────────────────────────────────────────────────────────

CREATE TYPE tier_influenciador AS ENUM ('nano', 'micro', 'mid', 'macro', 'mega');

CREATE TABLE influenciadores (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome                  TEXT NOT NULL,
  instagram             TEXT,
  youtube               TEXT,
  tiktok                TEXT,
  email_contato         TEXT,
  seguidores_instagram  INT,
  seguidores_youtube    INT,
  seguidores_tiktok     INT,
  nicho                 TEXT[],
  cidade                TEXT,
  estado                CHAR(2),
  tier                  tier_influenciador,
  valor_story           DECIMAL(10,2),
  valor_feed            DECIMAL(10,2),
  valor_reels           DECIMAL(10,2),
  taxa_engajamento      DECIMAL(5,2),
  score_fit             INT CHECK (score_fit BETWEEN 0 AND 10),
  verificado            BOOLEAN DEFAULT false,
  famoso_participante   BOOLEAN DEFAULT false,
  contratado_eventos    UUID[],
  notas                 TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Famosos verificados (prova social gratuita)
INSERT INTO influenciadores (nome, instagram, seguidores_instagram, tier, verificado, famoso_participante, nicho, notas) VALUES
  ('Neymar Santos Sr. (Neymar Pai)', '@neymarpaizao', 5000000, 'macro', true, true, ARRAY['esporte','familia'], 'Pai do Neymar Jr. — participante verificado TOP'),
  ('Joel Jota', '@joeljota', 6000000, 'mega', true, true, ARRAY['liderança','palestrante','cristao'], 'Influencer liderança — participante verificado TOP'),
  ('Thiago Nigro (Primo Rico)', '@thiago.nigro', 8000000, 'mega', true, true, ARRAY['financas','empreendedorismo'], 'Influencer financeiro — participante verificado TOP'),
  ('Pablo Marçal', '@pablomarcal', 14000000, 'mega', true, true, ARRAY['empreendedorismo','politica','coach'], 'Empresário e político — participante verificado TOP'),
  ('Eliezer', '@eliezer', 6000000, 'mega', true, true, ARRAY['entretenimento','familia'], 'Ex-BBB — participante verificado TOP'),
  ('Ronaldo Jacaré', NULL, 500000, 'mid', true, true, ARRAY['esporte','mma'], 'Lutador MMA — participante verificado TOP'),
  ('Kaká Diniz', NULL, 500000, 'mid', true, true, ARRAY['empreendedorismo','familia'], 'Empresário — participante verificado TOP'),
  ('Tirulipa', NULL, 2000000, 'macro', true, true, ARRAY['entretenimento','humor'], 'Comediante — participante verificado TOP'),
  ('Tiago Brunet', NULL, 1000000, 'macro', true, true, ARRAY['cristao','palestrante','youtube'], 'Pastor e palestrante — participante verificado TOP'),
  ('Caio Carneiro', NULL, 500000, 'mid', true, true, ARRAY['cristao','familia'], 'Influencer cristão — participante verificado TOP');

-- ─── VOLUNTÁRIOS ──────────────────────────────────────────────────────────────

CREATE TABLE voluntarios (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evento_id           UUID NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  participante_id     UUID REFERENCES participantes(id),
  nome                TEXT NOT NULL,
  email               TEXT,
  funcao              TEXT NOT NULL,
  status              TEXT NOT NULL DEFAULT 'convidado' CHECK (status IN ('convidado', 'confirmado', 'cancelou')),
  briefing_enviado    BOOLEAN NOT NULL DEFAULT false,
  briefing_enviado_at TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── CHECKLISTS OPERACIONAIS ─────────────────────────────────────────────────

CREATE TABLE checklists_operacionais (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evento_id  UUID NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  nome       TEXT NOT NULL,
  fase       TEXT NOT NULL CHECK (fase IN ('D-2', 'D-1', 'D-day', 'D+1')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE checklist_itens (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  checklist_id   UUID NOT NULL REFERENCES checklists_operacionais(id) ON DELETE CASCADE,
  codigo         TEXT NOT NULL,
  descricao      TEXT NOT NULL,
  categoria      TEXT,
  eh_veto        BOOLEAN NOT NULL DEFAULT false,
  concluido      BOOLEAN NOT NULL DEFAULT false,
  concluido_at   TIMESTAMPTZ,
  concluido_por  TEXT,
  observacao     TEXT,
  ordem          INT NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── RELATÓRIOS ───────────────────────────────────────────────────────────────

CREATE TYPE tipo_relatorio AS ENUM ('semanal', 'final', 'marketing', 'financeiro', 'operacional');

CREATE TABLE relatorios (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evento_id      UUID NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  tipo           tipo_relatorio NOT NULL,
  semana_numero  INT,
  titulo         TEXT,
  dados          JSONB NOT NULL DEFAULT '{}',
  arquivo_path   TEXT,
  status_geral   TEXT CHECK (status_geral IN ('verde', 'amarelo', 'vermelho')),
  gerado_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── CONVERSAS IA ──────────────────────────────────────────────────────────────

CREATE TABLE conversas_ia (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID REFERENCES auth.users(id),
  evento_id        UUID REFERENCES eventos(id),
  agente           TEXT NOT NULL,
  use_case         TEXT,
  mensagens        JSONB NOT NULL DEFAULT '[]',
  tokens_usados    INT NOT NULL DEFAULT 0,
  custo_estimado   DECIMAL(10,6) NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_conversas_ia_updated_at
  BEFORE UPDATE ON conversas_ia
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── LGPD CONSENTIMENTOS ──────────────────────────────────────────────────────

CREATE TABLE lgpd_consentimentos (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participante_id  UUID NOT NULL REFERENCES participantes(id),
  tipo             TEXT NOT NULL CHECK (tipo IN ('comunicacao', 'imagem', 'dados_perfil')),
  consentido       BOOLEAN NOT NULL,
  canal            TEXT,
  ip_address       INET,
  user_agent       TEXT,
  consentido_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revogado_at      TIMESTAMPTZ
);

-- ─── WEBHOOK LOG ──────────────────────────────────────────────────────────────

CREATE TABLE webhooks_log (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fonte        TEXT NOT NULL,
  evento       TEXT NOT NULL,
  payload      JSONB,
  processado   BOOLEAN NOT NULL DEFAULT false,
  erro         TEXT,
  received_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── PERFIS (auth.users extension) ───────────────────────────────────────────

CREATE TABLE perfis (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome         TEXT,
  email        TEXT,
  role         TEXT NOT NULL DEFAULT 'coordenador' CHECK (role IN ('admin', 'coordenador', 'voluntario')),
  cidades_ids  UUID[],
  avatar_url   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-criar perfil quando usuário é criado no Supabase Auth
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO perfis (id, email, nome)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── VIEWS ÚTEIS ─────────────────────────────────────────────────────────────

-- View: KPIs do evento
CREATE VIEW vw_evento_kpis AS
SELECT
  e.id AS evento_id,
  e.nome,
  e.tipo,
  e.status,
  e.capacidade_meta,
  COUNT(i.id) FILTER (WHERE i.status IN ('confirmada', 'presente')) AS inscritos_confirmados,
  COUNT(i.id) FILTER (WHERE i.status = 'presente') AS presentes,
  SUM(i.valor_pago) FILTER (WHERE i.status IN ('confirmada', 'presente')) AS receita_bruta,
  AVG(i.valor_pago) FILTER (WHERE i.status IN ('confirmada', 'presente')) AS ticket_medio,
  ROUND(
    COUNT(i.id) FILTER (WHERE i.status IN ('confirmada', 'presente'))::DECIMAL
    / NULLIF(e.capacidade_meta, 0) * 100, 1
  ) AS pct_meta
FROM eventos e
LEFT JOIN inscricoes i ON i.evento_id = e.id
GROUP BY e.id;

-- View: Segmentação de alumni
CREATE VIEW vw_alumni_segmentacao AS
SELECT
  p.id,
  p.nome,
  p.status_conjugal,
  p.tem_filhos,
  p.faixa_etaria,
  p.score_engajamento,
  p.lgpd_comunicacao,
  p.lgpd_imagem,
  COUNT(i.id) AS eventos_participados,
  SUM(i.valor_pago) FILTER (WHERE i.status IN ('confirmada', 'presente')) AS ltv_realizado,
  CASE
    WHEN p.status_conjugal = 'casado' AND p.tem_filhos THEN 'casados-pais'
    WHEN p.status_conjugal = 'casado' AND NOT COALESCE(p.tem_filhos, false) THEN 'casados-sem-filhos'
    WHEN p.score_engajamento >= 40 THEN 'lideres'
    ELSE 'solteiros-jovens'
  END AS segmento
FROM participantes p
LEFT JOIN inscricoes i ON i.participante_id = p.id
GROUP BY p.id;

-- ─── ÍNDICES ──────────────────────────────────────────────────────────────────

CREATE INDEX idx_eventos_cidade_id ON eventos (cidade_id);
CREATE INDEX idx_eventos_status ON eventos (status);
CREATE INDEX idx_lotes_evento_id ON lotes (evento_id);
CREATE INDEX idx_lotes_status ON lotes (status);
CREATE INDEX idx_inscricoes_evento_id ON inscricoes (evento_id);
CREATE INDEX idx_inscricoes_participante_id ON inscricoes (participante_id);
CREATE INDEX idx_inscricoes_status ON inscricoes (status);
CREATE INDEX idx_participantes_email ON participantes (email);
CREATE INDEX idx_campanhas_evento_id ON campanhas (evento_id);
CREATE INDEX idx_webhooks_log_fonte ON webhooks_log (fonte, received_at DESC);
CREATE INDEX idx_conversas_ia_evento_id ON conversas_ia (evento_id, created_at DESC);
