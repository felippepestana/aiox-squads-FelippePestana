# Task: Check Eligibility & Guide Enrollment (check-eligibility)

**Executor:** eligibility-checker
**Elicit:** Employee data, benefit, CCT context
**Mode:** Deterministic rule evaluation
**Output:** Eligibility result (YAML) with rule trace and enrollment steps

## Inputs Required

- `employee`: Dados de vínculo (tipo de contrato, tempo de casa, dependentes) — de peopleops
- `benefit`: Benefício a avaliar (ou "all")
- `cct_context`: Convenção/acordo coletivo da categoria

## Elicitation

Ask user:
1. "Qual o vínculo, tempo de casa e dependentes? (ou puxar de peopleops)"
2. "Qual benefício avaliar? (ou todos)"
3. "Qual a CCT/ACT da categoria?"

## Execution Steps

1. **Apply Rules**: Avaliar regras determinísticas (vínculo, tempo de casa, dependentes, CCT)
2. **Trace Each Rule**: Citar a regra que sustenta cada veredito de elegibilidade
3. **Declare Carência/Window**: Explicitar carência e janela de adesão
4. **Check CCT**: Confirmar benefícios obrigatórios por convenção
5. **Prepare Enrollment**: Passos de adesão (executados só após PASS do gate + consentimento)
6. **Output**: Resultado de elegibilidade + roteiro de adesão

## Output Format

```yaml
eligibility_result:
  employee_ref: "EMP_anon_001"
  checked_by: "eligibility-checker"
  timestamp: "2026-06-08T12:00:00Z"
  determinism: "same situation → same eligibility"

  evaluations:
    - benefit_id: "BEN_VR"
      eligible: true
      rule_trace: "CLT + CCT — VR obrigatório para o vínculo CLT desta categoria"
      carencia: "nenhuma"
      enrollment_window: "imediata"
    - benefit_id: "BEN_SAUDE"
      eligible: true
      rule_trace: "Elegível após admissão; dependentes elegíveis: cônjuge + filhos até 21 (ou 24 universitário)"
      carencia: "conforme ANS (parto 300 dias; demais 24h–180 dias)"
      enrollment_window: "30 dias da admissão ou evento de vida"
    - benefit_id: "BEN_PREV"
      eligible: false
      rule_trace: "Previdência exige >= 6 meses de casa; colaborador tem 2 meses"
      reconsider_at: "6 meses de admissão"

  cct_mandatory: ["BEN_VR"]

  enrollment_steps:
    - "1. Confirmar consentimento explícito (consent-gate PASS)"
    - "2. Selecionar dependentes (se aplicável)"
    - "3. Revisar custo/coparticipação em linguagem clara"
    - "4. Confirmar adesão; registrar no audit trail"
  note: "Adesão só após PASS do consent-gate e consentimento ativo. Nenhuma opção pré-marcada."
```

## Veto Conditions

- No VETO na checagem, MAS:
- CCT desconhecida → ALERT, confirmar com peopleops
- Carência escondida (não declarada) → corrigir antes da adesão
- Adesão NÃO ocorre sem PASS do consent-gate + consentimento

## Completion Criteria

✅ Regras determinísticas aplicadas e rastreadas
✅ Carência e janela declaradas explicitamente
✅ Benefícios obrigatórios por CCT identificados
✅ Roteiro de adesão preparado (sem pré-marcação)
✅ Resultado pronto para fit-advisor e consent-gate
