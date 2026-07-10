# Task: Construir Relatório de KPIs

**Executor:** `kpi-board-reporter`
**Squad:** `jurisenergy-recovery`

## Objetivo

Consolidar dados processuais, financeiros e operacionais em KPIs executivos, alertas e narrativa de Conselho, com prova de ROI contra a baseline.

## Inputs

- Dados processuais, financeiros, operacionais, resultados, acordos, condenações, DATAJUD e bases internas.

## Passos

1. Consolidar KPIs do mapa de indicadores (data/kpi-map.yaml).
2. Rotular cada dado: confirmado, estimado ou pendente.
3. Comparar com baseline da due diligence e período anterior.
4. Gerar alertas de desvio com hipótese de causa e frente responsável.
5. Redigir narrativa executiva com pontos de decisão (templates/kpi-executive-report-tmpl.md).
6. Declarar limitações metodológicas.

## Critérios de Aceite

- [ ] Todo KPI com fonte, período, amostra e status.
- [ ] Estimativas nunca apresentadas como confirmadas.
- [ ] Narrativa fecha com pontos de decisão.
- [ ] Limitações metodológicas em seção própria.

## Observações de Segurança

- Relatório executivo passa por revisão humana antes de distribuição ao Conselho.
