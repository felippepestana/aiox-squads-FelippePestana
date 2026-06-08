-- G5: token expiration via event date
-- Exame upload closes 3 days before evento_data.
-- Family messages close 1 day after evento_data.
ALTER TABLE senderistas ADD COLUMN IF NOT EXISTS evento_data DATE;

-- G4: differentiated roles for hakunas
ALTER TABLE hakunas
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'apoio'
  CHECK (role IN ('médico', 'coordenador', 'apoio'));
