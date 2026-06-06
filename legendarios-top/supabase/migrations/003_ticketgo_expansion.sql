-- Expand senderistas with TICKETGO fields + add new tables

ALTER TABLE senderistas
  ADD COLUMN IF NOT EXISTS cpf TEXT,
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS estado TEXT,
  ADD COLUMN IF NOT EXISTS cidade TEXT,
  ADD COLUMN IF NOT EXISTS profissao TEXT,
  ADD COLUMN IF NOT EXISTS tamanho_camisa TEXT,
  ADD COLUMN IF NOT EXISTS cond_fisica_autorelatada INTEGER CHECK (cond_fisica_autorelatada BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS restricao_alimentar BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS instagram TEXT,
  ADD COLUMN IF NOT EXISTS nome_conjuge TEXT,
  ADD COLUMN IF NOT EXISTS whatsapp_conjuge TEXT,
  ADD COLUMN IF NOT EXISTS email_conjuge TEXT,
  ADD COLUMN IF NOT EXISTS nome_acompanhante TEXT,
  ADD COLUMN IF NOT EXISTS cond_medica_detalhada TEXT,
  ADD COLUMN IF NOT EXISTS uso_medicamento BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS medicamentos TEXT,
  ADD COLUMN IF NOT EXISTS vai_acompanhado BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS tipo_participante TEXT NOT NULL DEFAULT 'senderista',
  ADD COLUMN IF NOT EXISTS familia TEXT,
  ADD COLUMN IF NOT EXISTS igreja TEXT,
  ADD COLUMN IF NOT EXISTS codigo_ingresso TEXT,
  ADD COLUMN IF NOT EXISTS ticketgo_id BIGINT,
  ADD COLUMN IF NOT EXISTS evento_nome TEXT,
  ADD COLUMN IF NOT EXISTS valor_bilhete DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS status_ingresso TEXT NOT NULL DEFAULT 'ativo',
  ADD COLUMN IF NOT EXISTS status_presenca TEXT NOT NULL DEFAULT 'ausente',
  ADD COLUMN IF NOT EXISTS data_cadastro_origem TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS mensagens_token UUID NOT NULL DEFAULT gen_random_uuid();

ALTER TABLE senderistas
  ADD CONSTRAINT senderistas_cpf_unique UNIQUE (cpf),
  ADD CONSTRAINT senderistas_ticketgo_id_unique UNIQUE (ticketgo_id),
  ADD CONSTRAINT senderistas_mensagens_token_unique UNIQUE (mensagens_token);

CREATE INDEX IF NOT EXISTS idx_senderistas_cpf ON senderistas(cpf);
CREATE INDEX IF NOT EXISTS idx_senderistas_ticketgo_id ON senderistas(ticketgo_id);
CREATE INDEX IF NOT EXISTS idx_senderistas_mensagens_token ON senderistas(mensagens_token);
CREATE INDEX IF NOT EXISTS idx_senderistas_tipo ON senderistas(tipo_participante);
CREATE INDEX IF NOT EXISTS idx_senderistas_status_presenca ON senderistas(status_presenca);

-- Family messages portal
CREATE TABLE IF NOT EXISTS mensagens_apoio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  senderista_id UUID NOT NULL REFERENCES senderistas(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('carta', 'foto', 'video', 'audio')),
  titulo TEXT,
  conteudo TEXT,
  arquivo_url TEXT,
  enviado_por TEXT NOT NULL,
  visualizado BOOLEAN NOT NULL DEFAULT false,
  visualizado_em TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mensagens_senderista ON mensagens_apoio(senderista_id);

-- Event activities / checkpoints
CREATE TABLE IF NOT EXISTS atividades_top (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('predica', 'hidratacao', 'acampamento', 'checkpoint', 'chegada', 'saida', 'outro')),
  descricao TEXT,
  localizacao_lat DECIMAL(9,6),
  localizacao_lng DECIMAL(9,6),
  hora_planejada TIMESTAMPTZ,
  hora_real TIMESTAMPTZ,
  evento_nome TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Checkpoint log: who passed where and when
CREATE TABLE IF NOT EXISTS participacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  senderista_id UUID NOT NULL REFERENCES senderistas(id) ON DELETE CASCADE,
  atividade_id UUID NOT NULL REFERENCES atividades_top(id),
  tipo TEXT NOT NULL CHECK (tipo IN ('entrada', 'saida')),
  hakuna_id UUID REFERENCES hakunas(id),
  registrado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  notas TEXT
);

CREATE INDEX IF NOT EXISTS idx_participacoes_senderista ON participacoes(senderista_id);
CREATE INDEX IF NOT EXISTS idx_participacoes_atividade ON participacoes(atividade_id);

-- RLS for new tables
ALTER TABLE mensagens_apoio ENABLE ROW LEVEL SECURITY;
ALTER TABLE atividades_top ENABLE ROW LEVEL SECURITY;
ALTER TABLE participacoes ENABLE ROW LEVEL SECURITY;

-- mensagens_apoio: public insert (family submits messages), auth reads
CREATE POLICY "Public insert mensagens" ON mensagens_apoio FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth read mensagens" ON mensagens_apoio FOR SELECT USING (true);
CREATE POLICY "Auth update mensagens" ON mensagens_apoio FOR UPDATE USING (auth.role() = 'authenticated');

-- atividades_top: auth manages, public reads
CREATE POLICY "Public read atividades" ON atividades_top FOR SELECT USING (true);
CREATE POLICY "Auth manage atividades" ON atividades_top FOR ALL USING (auth.role() = 'authenticated');

-- participacoes: auth only
CREATE POLICY "Auth manage participacoes" ON participacoes FOR ALL USING (auth.role() = 'authenticated');
