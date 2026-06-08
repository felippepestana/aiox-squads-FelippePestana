# Task: Audit Ethics & Privacy Gate (audit-ethics)

**Executor:** ethics-gate
**Elicit:** All prior outputs (dataset, metrics, risk model)
**Mode:** Deterministic compliance audit
**Output:** Ethics verdict (YAML) — PASS or VETO with remediation

## Inputs Required

- `dataset_manifest`: From assemble-dataset
- `metrics_report`: From compute-metrics
- `risk_model`: From model-risk (se houver predição)
- `intended_use`: Para que o insight será usado (decisão de negócio)

## Elicitation

Ask user (se ainda não informado):
1. "Para que decisão este insight será usado?"
2. "Algum corte por atributo protegido (raça, gênero, idade, PCD)?"
3. "O resultado afeta seleção, promoção ou desligamento?"

## Execution Steps

1. **Group Size**: Verificar n >= 5 em TODO corte exibido. Qualquer n < 5 → VETO
2. **Protected Attributes**: Confirmar que atributo protegido não foi usado como preditor/filtro de desvantagem (permitido só para auditoria de equidade com finalidade declarada)
3. **Individual Verdict**: Bloquear predição nominal/individual com propósito não-apoio → VETO
4. **Disparate Impact**: Se afeta seleção/promoção/desligamento, rodar regra dos 4/5 (taxa do grupo protegido >= 80% da maior taxa). Se < 80%, flag adverse impact → VETO até justificativa de validade
5. **LGPD**: Confirmar finalidade, minimização e base legal para dado sensível (Art. 7/11)
6. **Audit Trail**: Exigir trilha 100% (fontes, fórmulas, features, confiança, timestamp, user)
7. **Verdict**: Emitir PASS ou VETO com razão + remediação

## Output Format

```yaml
ethics_audit:
  audited_by: "ethics-gate"
  timestamp: "2026-06-30T23:59:59Z"
  intended_use: "Priorização de ações de retenção (apoio)"

  checks:
    min_group_size:
      threshold: 5
      smallest_displayed_group: 40
      passed: true
    protected_as_predictor:
      used: false
      passed: true
    individual_verdict:
      nominal_prediction_present: false
      passed: true
    disparate_impact:
      applicable: false
      reason: "Uso é apoio à retenção, não seleção/promoção/desligamento"
      passed: true
    lgpd:
      purpose_declared: true
      minimization_applied: true
      sensitive_data_basis: "n/a (sem dado sensível)"
      passed: true
    audit_trail:
      complete: true
      passed: true

  verdict: "PASS"
  clearance_statement: "Insight liberado para narrativa executiva. Uso restrito a apoio à retenção."
  next_action: "Handoff to narrative-author"

  # --- Exemplo de VETO ---
  # verdict: "VETO"
  # reasons:
  #   - "Corte de turnover por raça/cor exibiu grupo n=3 (< 5)"
  #   - "Risk model trouxe ranking individual de risco de saída"
  # remediation_steps:
  #   - "Agregar grupo protegido para n >= 5 ou suprimir a célula"
  #   - "Remover ranking nominal; reapresentar como risco de coorte (apoio)"
  # resubmit: "Reapresente após remediação"
```

## Veto Conditions (mandatory — no bypass)

- Qualquer grupo exibido com n < 5 → **VETO**
- Atributo protegido usado como preditor/filtro de desvantagem → **VETO**
- Predição individual/nominal com propósito não-apoio → **VETO**
- Adverse impact (regra dos 4/5 < 80%) sem justificativa de validade → **VETO**
- Audit trail incompleto → **VETO**
- Diante de violação dura: é **VETO**, nunca "PASS com ressalva"

## Completion Criteria

✅ Tamanho mínimo de grupo verificado
✅ Uso de atributo protegido auditado
✅ Risco de veredito individual checado
✅ Impacto desproporcional avaliado (quando aplicável)
✅ LGPD (finalidade, minimização, base legal) confirmada
✅ Audit trail 100% validado
✅ Veredito PASS ou VETO com remediação emitido
