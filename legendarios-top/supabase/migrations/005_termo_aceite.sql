ALTER TABLE senderistas
  ADD COLUMN IF NOT EXISTS termo_aceito BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS termo_aceito_em TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_senderistas_termo ON senderistas(termo_aceito);
