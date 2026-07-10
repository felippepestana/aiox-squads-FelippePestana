# Task: Gerar Relatório Executivo de KPIs

**Executor:** `kpi-council-reporter`
**Squad:** `jurisenergy-recovery`

## Objetivo

Consolidar resultados operacionais em KPIs executivos e narrativa de Conselho, com foco em melhoria dos indicadores da pesquisa e prova de ROI.

## Inputs

- Dados processuais, financeiros e operacionais; resultados, acordos, condenações; DATAJUD e bases internas.

## Passos

1. Consolidar KPIs do catálogo (`data/kpi-indicators.yaml`).
2. Separar dados confirmados, estimados e pendentes — rotular estimativas.
3. Declarar fonte, período e método de cada indicador.
4. Gerar alertas de tendência e pontos de decisão priorizados.
5. Redigir narrativa executiva (template `kpi-council-report-tmpl.md`): o que melhorou, o que piorou, o que decidir.

## Critérios de Aceite

- [ ] Confirmado, estimado e pendente separados em todo KPI (QG-JR-008).
- [ ] Limitações metodológicas declaradas.
- [ ] Sem dados pessoais desnecessários no relatório (QG-JR-007).
- [ ] Pontos de decisão explícitos para o Conselho.

## Observações de Segurança

- Nunca apresentar estimativa como dado confirmado.
- Relatório passa por validação humana antes da distribuição.
