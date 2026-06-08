# Task: Recommend Benefits by Life Moment (recommend-benefits)

**Executor:** fit-advisor
**Elicit:** Life moment, shared profile context, eligibility result
**Mode:** Personalized fit (anti-overselling)
**Output:** Recommendation (Markdown) — few, relevant, with the "why"

## Inputs Required

- `life_moment`: Momento de vida (parentalidade | mudança | saúde | finanças | educação)
- `shared_context`: Contexto que a pessoa compartilhou voluntariamente (com finalidade)
- `eligibility_result`: From check-eligibility (só recomendar o elegível)
- `consent_status`: Consentimento para usar o contexto pessoal

## Elicitation

Ask user:
1. "Qual o momento de vida ou necessidade atual?"
2. "Há algo do seu contexto que você quer considerar? (opcional, com sua permissão)"
3. (interno) Confirmar elegibilidade antes de recomendar

## Execution Steps

1. **Anchor on Moment**: Ancorar a recomendação no momento de vida
2. **Filter Eligible**: Recomendar só o que a pessoa é elegível
3. **Select Few**: Escolher 2–4 benefícios certos (não o catálogo)
4. **Explain Why**: Justificar por que cada um cabe AGORA
5. **Respect Consent**: Usar só o contexto compartilhado para essa finalidade
6. **Output**: Recomendação enxuta com o porquê

## Output Format

```markdown
# Recomendação de Benefícios — Momento: Parentalidade
**Para:** (colaborador) · **Base:** contexto compartilhado com consentimento · **Data:** 2026-06-08

> Recomendo **poucos e certos** para o seu momento agora — não o catálogo inteiro.

## 1. Plano de Saúde — incluir dependente (novo filho)
**Por que cabe agora:** novo filho elegível como dependente; janela de evento de vida (30 dias).
**Atenção:** carência ANS para parto não se aplica ao recém-nascido incluído no prazo.

## 2. Auxílio-Creche / Reembolso
**Por que cabe agora:** apoio direto ao custo de creche nos primeiros meses.

## 3. Programa de Apoio (EAP) — apoio à parentalidade
**Por que cabe agora:** suporte psicológico/orientação na transição (uso confidencial).

---
**Não recomendei** previdência e gympass agora — não são o foco deste momento (evito overselling).
**Próximo passo:** se quiser seguir com algum, conduzo a adesão após seu consentimento explícito.

<!-- Privacidade: contexto de saúde usado SÓ para esta recomendação consentida. -->
```

## Veto Conditions

- No VETO na recomendação, MAS (consent-gate VETA se):
- Dado de saúde usado além desta finalidade consentida
- Recomendação inferiu condição de saúde sem consentimento
- Recomendou benefício inelegível

## Completion Criteria

✅ Recomendação ancorada no momento de vida
✅ Apenas benefícios elegíveis
✅ Poucos e relevantes (2–4), sem overselling
✅ "Por que cabe agora" em cada item
✅ Contexto pessoal usado só com consentimento e para a finalidade
✅ Recomendação pronta para consent-gate
