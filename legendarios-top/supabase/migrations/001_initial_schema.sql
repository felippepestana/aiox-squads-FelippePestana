-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Hakunas (equipe médica/staff)
CREATE TABLE hakunas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'hakuna',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Senderistas (participantes)
CREATE TABLE senderistas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  data_nascimento DATE NOT NULL,
  tipo_sanguineo TEXT,
  peso_kg DECIMAL(5,1),
  altura_cm DECIMAL(5,1),
  imc DECIMAL(4,1) GENERATED ALWAYS AS (
    CASE
      WHEN peso_kg IS NOT NULL AND altura_cm IS NOT NULL AND altura_cm > 0
      THEN ROUND((peso_kg / ((altura_cm / 100.0) * (altura_cm / 100.0)))::NUMERIC, 1)
      ELSE NULL
    END
  ) STORED,
  plano_saude BOOLEAN NOT NULL DEFAULT false,
  qual_plano TEXT,
  comorbidades TEXT[] NOT NULL DEFAULT '{}',
  classificacao_risco TEXT NOT NULL,
  exames_exigidos TEXT[] NOT NULL DEFAULT '{}',
  upload_token UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  nfc_tag_id TEXT,
  status TEXT NOT NULL DEFAULT 'pendente',
  motivo_reprovacao TEXT,
  orientacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Exames
CREATE TABLE exames (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  senderista_id UUID NOT NULL REFERENCES senderistas(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  arquivo_url TEXT NOT NULL,
  validado BOOLEAN,
  motivo_reprovacao TEXT,
  validado_por UUID REFERENCES hakunas(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Prontuários
CREATE TABLE prontuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  senderista_id UUID NOT NULL REFERENCES senderistas(id) ON DELETE CASCADE,
  hakuna_id UUID REFERENCES hakunas(id),
  queixas TEXT,
  condutas TEXT,
  fotos_urls TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_senderistas_status ON senderistas(status);
CREATE INDEX idx_senderistas_risco ON senderistas(classificacao_risco);
CREATE INDEX idx_senderistas_nome ON senderistas(nome);
CREATE INDEX idx_exames_senderista ON exames(senderista_id);
CREATE INDEX idx_prontuarios_senderista ON prontuarios(senderista_id);

-- Auto update_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER senderistas_updated_at
  BEFORE UPDATE ON senderistas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE senderistas ENABLE ROW LEVEL SECURITY;
ALTER TABLE exames ENABLE ROW LEVEL SECURITY;
ALTER TABLE prontuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE hakunas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public insert senderistas" ON senderistas FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth read senderistas" ON senderistas FOR SELECT USING (true);
CREATE POLICY "Auth update senderistas" ON senderistas FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Public insert exames" ON exames FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth read exames" ON exames FOR SELECT USING (true);
CREATE POLICY "Auth update exames" ON exames FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Public insert prontuarios" ON prontuarios FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth read prontuarios" ON prontuarios FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Auth all hakunas" ON hakunas USING (auth.role() = 'authenticated');
