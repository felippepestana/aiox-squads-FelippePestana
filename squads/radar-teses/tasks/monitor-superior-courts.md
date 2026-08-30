# Task: monitor-superior-courts

**Agente:** superior-courts-monitor · **Saída:** fichas de tese (thesis-dossier-tmpl, seções 1-4)

## Objetivo
Varrer STF e STJ e capturar teses fixadas (súmulas, repercussão geral, repetitivos, IRDR confirmado, IAC) com enunciado literal, fundamentos e alcance.

## Passos
1. Consultar fontes oficiais (data/sources-and-guardrails.yaml): painel de repercussão geral do STF, painel de precedentes qualificados do STJ, pesquisa de súmulas, DJe.
2. Para cada tese nova ou alterada desde a última varredura, extrair: identificação (tema/súmula, órgão, relator, datas), enunciado literal, fundamentos normativos e jurisprudenciais, situação (mérito julgado? trânsito? embargos? modulação?).
3. Redigir 2+ casos exemplificativos concretos de aplicação (perfis distintos de beneficiário).
4. Atribuir ID RT-AAAA-NNN e status "detectada"; entregar ao radar-chief.

## Critérios de aceite
- [ ] Enunciado conferido em fonte oficial, com URL e data de verificação
- [ ] Situação processual explícita (trânsito/embargos/modulação)
- [ ] Casos exemplificativos com perfil, situação fática e efeito prático
