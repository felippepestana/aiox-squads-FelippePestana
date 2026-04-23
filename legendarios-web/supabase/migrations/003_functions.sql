-- ─────────────────────────────────────────────────────────────────────────────
-- Supabase Edge Functions calls + pg_cron automation
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── Verificação automática de dual triggers ──────────────────────────────────
-- Encerra lotes quando quantidade OU data é atingida (primeiro dos dois)

CREATE OR REPLACE FUNCTION verificar_dual_triggers()
RETURNS void AS $$
BEGIN
  -- Encerrar por data
  UPDATE lotes
  SET status = 'encerrado'
  WHERE status = 'ativo'
    AND data_fim_venda < NOW();

  -- Encerrar por quantidade
  UPDATE lotes
  SET status = 'esgotado'
  WHERE status = 'ativo'
    AND gatilho_quantidade IS NOT NULL
    AND vendidas >= gatilho_quantidade;

  -- Ativar próximo lote após encerrar o atual
  WITH eventos_com_lote_ativo AS (
    SELECT DISTINCT evento_id FROM lotes WHERE status = 'ativo'
  )
  UPDATE lotes l
  SET status = 'ativo'
  FROM (
    SELECT l2.id,
           ROW_NUMBER() OVER (PARTITION BY l2.evento_id ORDER BY l2.numero) AS rn
    FROM lotes l2
    WHERE l2.status = 'pendente'
      AND NOT EXISTS (
        SELECT 1 FROM eventos_com_lote_ativo ea WHERE ea.evento_id = l2.evento_id
      )
  ) sub
  WHERE l.id = sub.id AND sub.rn = 1;
END;
$$ LANGUAGE plpgsql;

-- Rodar a cada 15 minutos via pg_cron (produção)
DO $$ BEGIN
  PERFORM cron.schedule(
    'verificar-dual-triggers',
    '*/15 * * * *',
    $q$ SELECT verificar_dual_triggers(); $q$
  );
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'pg_cron unavailable — dual trigger check must be run manually in local dev';
END $$;

-- ─── Calcular score de engajamento do alumni ─────────────────────────────────

CREATE OR REPLACE FUNCTION calcular_score_engajamento(p_id UUID)
RETURNS INT AS $$
DECLARE
  score INT := 0;
  p participantes%ROWTYPE;
BEGIN
  SELECT * INTO p FROM participantes WHERE id = p_id;

  -- Eventos participados (10 pts cada)
  score := score + (
    SELECT COUNT(*) * 10
    FROM inscricoes
    WHERE participante_id = p_id AND status = 'presente'
  );

  -- RPM frequente (5 pts estimado por evento)
  -- Indicações convertidas (50 pts cada) — via UTM tracking
  -- Depoimento dado (15 pts)
  -- Compartilhamento em redes (10 pts)

  RETURN LEAST(score, 100);
END;
$$ LANGUAGE plpgsql;

-- ─── Gerar relatório KPI semanal ─────────────────────────────────────────────

CREATE OR REPLACE FUNCTION gerar_relatorio_semanal(p_evento_id UUID, p_semana INT)
RETURNS UUID AS $$
DECLARE
  kpis JSONB;
  relatorio_id UUID;
  v_evento eventos%ROWTYPE;
BEGIN
  SELECT * INTO v_evento FROM eventos WHERE id = p_evento_id;

  SELECT jsonb_build_object(
    'semana', p_semana,
    'inscritos_confirmados', COUNT(i.id) FILTER (WHERE i.status IN ('confirmada', 'presente')),
    'receita_bruta', COALESCE(SUM(i.valor_pago) FILTER (WHERE i.status IN ('confirmada', 'presente')), 0),
    'ticket_medio', COALESCE(AVG(i.valor_pago) FILTER (WHERE i.status IN ('confirmada', 'presente')), 0),
    'pct_meta', ROUND(COUNT(i.id) FILTER (WHERE i.status IN ('confirmada', 'presente'))::DECIMAL / NULLIF(v_evento.capacidade_meta, 0) * 100, 1),
    'por_metodo_pagamento', jsonb_object_agg(
      COALESCE(i.metodo_pagamento::TEXT, 'pendente'),
      COUNT(i.id)
    ),
    'gerado_em', NOW()
  ) INTO kpis
  FROM inscricoes i
  WHERE i.evento_id = p_evento_id;

  INSERT INTO relatorios (evento_id, tipo, semana_numero, titulo, dados, status_geral)
  VALUES (
    p_evento_id,
    'semanal',
    p_semana,
    'Relatório Semanal — Semana ' || p_semana,
    kpis,
    CASE
      WHEN (kpis->>'pct_meta')::DECIMAL >= 90 THEN 'verde'
      WHEN (kpis->>'pct_meta')::DECIMAL >= 70 THEN 'amarelo'
      ELSE 'vermelho'
    END
  )
  RETURNING id INTO relatorio_id;

  RETURN relatorio_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── LGPD: expirar consentimentos vencidos ───────────────────────────────────

CREATE OR REPLACE FUNCTION expirar_consentimentos_lgpd()
RETURNS void AS $$
BEGIN
  -- Revogar opt-in para participantes cujo consentimento expirou (6 meses pós-evento)
  UPDATE participantes
  SET lgpd_comunicacao = false,
      lgpd_imagem = false,
      lgpd_opt_out_at = NOW()
  WHERE lgpd_data_expiracao < NOW()
    AND lgpd_opt_out_at IS NULL
    AND (lgpd_comunicacao = true OR lgpd_imagem = true);

  -- Registrar revogações em lgpd_consentimentos
  INSERT INTO lgpd_consentimentos (participante_id, tipo, consentido, canal)
  SELECT id, 'comunicacao', false, 'expiracao_automatica_lgpd'
  FROM participantes
  WHERE lgpd_data_expiracao < NOW()
    AND lgpd_opt_out_at IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Rodar diariamente às 3h (produção)
DO $$ BEGIN
  PERFORM cron.schedule(
    'expirar-lgpd',
    '0 3 * * *',
    $q$ SELECT expirar_consentimentos_lgpd(); $q$
  );
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'pg_cron unavailable — LGPD expiry must be run manually in local dev';
END $$;

-- ─── Projeção financeira ──────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION projecao_financeira(
  p_evento_id UUID,
  OUT pessimista JSONB,
  OUT realista JSONB,
  OUT otimista JSONB
) AS $$
DECLARE
  v_evento eventos%ROWTYPE;
  v_kpis RECORD;
  ticket_medio DECIMAL;
BEGIN
  SELECT * INTO v_evento FROM eventos WHERE id = p_evento_id;

  SELECT
    COUNT(i.id) FILTER (WHERE i.status IN ('confirmada', 'presente')) AS confirmados,
    AVG(i.valor_pago) FILTER (WHERE i.status IN ('confirmada', 'presente')) AS ticket_medio_atual
  INTO v_kpis
  FROM inscricoes i
  WHERE i.evento_id = p_evento_id;

  ticket_medio := COALESCE(v_kpis.ticket_medio_atual, 1390);

  pessimista := jsonb_build_object(
    'cenario', 'Pessimista',
    'ocupacao_pct', 60,
    'participantes', ROUND(v_evento.capacidade_meta * 0.6),
    'receita_bruta', ROUND(v_evento.capacidade_meta * 0.6 * ticket_medio),
    'receita_liquida', ROUND(v_evento.capacidade_meta * 0.6 * ticket_medio * 0.72),
    'margem', 72
  );

  realista := jsonb_build_object(
    'cenario', 'Realista',
    'ocupacao_pct', 80,
    'participantes', ROUND(v_evento.capacidade_meta * 0.8),
    'receita_bruta', ROUND(v_evento.capacidade_meta * 0.8 * ticket_medio),
    'receita_liquida', ROUND(v_evento.capacidade_meta * 0.8 * ticket_medio * 0.78),
    'margem', 78
  );

  otimista := jsonb_build_object(
    'cenario', 'Otimista',
    'ocupacao_pct', 95,
    'participantes', ROUND(v_evento.capacidade_meta * 0.95),
    'receita_bruta', ROUND(v_evento.capacidade_meta * 0.95 * ticket_medio),
    'receita_liquida', ROUND(v_evento.capacidade_meta * 0.95 * ticket_medio * 0.84),
    'margem', 84
  );
END;
$$ LANGUAGE plpgsql;
