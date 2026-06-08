# Task: Generate Executive Narrative (generate-narrative)

**Executor:** narrative-author
**Elicit:** Metrics report, risk model, ethics verdict (must be PASS)
**Mode:** Data storytelling (correlation≠causation enforced)
**Output:** Executive narrative (Markdown) — decision-first, limits explicit

## Inputs Required

- `metrics_report`: From compute-metrics
- `risk_model`: From model-risk (se houver)
- `ethics_verdict`: From audit-ethics — **deve ser PASS**
- `audience`: Público (board, gestores de área, RH)

## Elicitation

Ask user:
1. "Para quem é a narrativa? (board, gestores, RH)"
2. "Qual a decisão central a apoiar?"

## Execution Steps

1. **Gate Check**: Confirmar `ethics_verdict == PASS`. Se PENDING/VETO, recusar e devolver ao chief
2. **Lead with Decision**: Abrir com recomendação + confiança (executivo lê a conclusão primeiro)
3. **Show Evidence**: Métricas e drivers que sustentam a recomendação
4. **Mark Causality**: Cada afirmação rotulada como correlação OU causa (default: correlação)
5. **State Limits**: Seção "o que este dado NÃO diz" + confiança
6. **Output**: Narrativa executiva pronta para apresentação

## Output Format

```markdown
# Leitura Executiva — Retenção 2º Semestre/2026
**Público:** Board · **Confiança geral:** Média · **Janela:** Jan–Jun/2026

## Recomendação (confiança média)
Concentrar esforço de retenção em **Comercial** e **Engenharia** no 2º semestre,
via plano de carreira (Comercial) e rebalanceamento de carga (Engenharia).

## Evidência
- Turnover anualizado: 14% (10% voluntário). Comercial 22% e Engenharia 19% acima da média.
- Comercial: eNPS −8 no semestre + 40% da coorte com progressão estagnada *(correlação)*.
- Engenharia: super-jornada recorrente (sinal de fadiga via chronos) *(correlação)*.

## Correlação, não causa
"Quem teve progressão estagnada saiu mais" é **associação**, não prova de causa —
não houve experimento controlado. Tratar como hipótese a testar, não como certeza.

## O que este dado NÃO diz
- Não identifica indivíduos em risco (sinal é por coorte, para apoio).
- Não controla totalmente sazonalidade do semestre.
- Não estabelece causa; drivers são pontos de partida para investigação.

## Próximos passos sugeridos
1. 1:1 estruturado nas duas áreas (validar drivers com gestores).
2. Revisar plano de carreira no Comercial (org-architect).
3. Rebalancear carga em Engenharia (chronos) e remedir em 90 dias.
```

## Veto Conditions

- Se `ethics_verdict != PASS` → recusar geração (devolver ao chief)
- Afirmação de causa sem desenho causal → corrigir para correlação antes de liberar

## Completion Criteria

✅ Ethics verdict PASS confirmado antes de narrar
✅ Narrativa lidera com decisão + confiança
✅ Evidência sustenta a recomendação
✅ Cada afirmação marcada como correlação ou causa
✅ Seção "o que o dado NÃO diz" presente
✅ Próximos passos acionáveis incluídos
