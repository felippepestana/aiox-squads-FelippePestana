# Task: Audit Consent & Privacy Gate (audit-consent)

**Executor:** consent-gate
**Elicit:** Recommendation, enrollment intent, consent status
**Mode:** Deterministic privacy/consent audit
**Output:** Consent verdict (YAML) — PASS or VETO with remediation

## Inputs Required

- `recommendation`: From recommend-benefits
- `eligibility_result`: From check-eligibility
- `consent_record`: Registro de consentimento explícito da pessoa
- `health_data_use`: Como o dado de saúde (se houver) foi usado

## Elicitation

Ask user (se necessário):
1. "Há consentimento explícito e ativo para esta adesão?"
2. "Algum dado de saúde foi usado? Para qual finalidade?"
3. "A adesão envolve dependentes/terceiros?"

## Execution Steps

1. **Consent Check**: Confirmar consentimento explícito e ativo (sem pré-marcação/auto-enroll)
2. **Health Minimization**: Confirmar que dado de saúde foi usado só para a adesão consentida
3. **Third-Party Privacy**: Confirmar que nenhuma escolha de terceiro foi exposta
4. **Scope Check**: Confirmar que não houve aconselhamento fiscal/jurídico/médico
5. **Audit Trail**: Confirmar trilha 100% (consentimento, finalidade, base legal, timestamp, user)
6. **Verdict**: Emitir PASS ou VETO com razão + remediação

## Output Format

```yaml
consent_audit:
  audited_by: "consent-gate"
  timestamp: "2026-06-08T12:00:00Z"

  checks:
    explicit_consent:
      present: true
      method: "confirmação ativa (não pré-marcado)"
      passed: true
    health_data_minimization:
      health_data_used: true
      purpose: "inclusão de dependente no plano (adesão consentida)"
      used_beyond_purpose: false
      passed: true
    third_party_privacy:
      others_elections_exposed: false
      passed: true
    advice_scope:
      tax_legal_medical_advice_given: false
      passed: true
    audit_trail:
      complete: true
      passed: true

  verdict: "PASS"
  clearance_statement: "Adesão autorizada. Consentimento explícito, dado de saúde minimizado, sigilo preservado."
  next_action: "Handoff to eligibility-checker for guided enrollment"

  # --- Exemplo de VETO ---
  # verdict: "VETO"
  # reasons:
  #   - "Opção de plano de saúde pré-marcada (sem consentimento ativo)"
  #   - "Condição médica declarada usada para recomendação não relacionada"
  # remediation_steps:
  #   - "Remover pré-marcação; obter consentimento explícito antes de inscrever"
  #   - "Restringir uso do dado de saúde à finalidade de adesão consentida"
  # resubmit: "Reapresente após remediação"
```

## Veto Conditions (mandatory — no bypass)

- Ausência de consentimento explícito / opção pré-marcada / auto-enroll → **VETO**
- Dado de saúde usado além da adesão consentida → **VETO**
- Exposição de escolha de benefício de terceiro → **VETO**
- Aconselhamento fiscal/jurídico/médico fora de escopo → **VETO**
- Audit trail incompleto → **VETO**
- Diante de uso indevido de dado sensível ou falta de consentimento: é **VETO**, nunca "PASS com ressalva"

## Completion Criteria

✅ Consentimento explícito verificado
✅ Minimização de dado de saúde confirmada
✅ Sigilo de terceiros preservado
✅ Ausência de aconselhamento fora de escopo confirmada
✅ Audit trail 100% validado
✅ Veredito PASS ou VETO com remediação emitido
