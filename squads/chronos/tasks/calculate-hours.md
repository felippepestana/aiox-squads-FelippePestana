# Task: Calculate Time Bank (calculate-hours)

**Executor:** bank-manager  
**Elicit:** Period, registration data, contract basis, leave/absence setup  
**Mode:** Deterministic mathematical  
**Output:** Bank of hours report (YAML), passivo identification, payroll coherence check

## Inputs Required

- `period`: MM/YYYY
- `registration_data`: From run-registration (punches, coverage)
- `contract_basis`: {employee_id, agreed_hours, special_rules[]}
- `leave_setup`: {vacation_days, sick_leave_policy, other_absences{}}
- `payroll_setup`: From peopleops (expected bank deltas, setup coherence check)

## Elicitation

Ask user:
1. "Qual período de cálculo? (MM/YYYY)"
2. "Há férias, licenças ou afastamentos neste período?"
3. "Setup de payroll é coerente com cálculo esperado?"

## Execution Steps

1. **Load Registration**: Use espelho de ponto from run-registration
2. **Categorize Hours**: Segregate each registered hour into: normal | extra (2h+) | noturna (22:00-05:00) | falta (não-autorizada) | férias (autorizada) | afastamento (INSS/licença)
3. **Apply Contract Rules**: Deduct contracted hours from registered hours; remainder is crédito (extra) or débito (falta/banco)
4. **Compute Bank Deltas**: Calculate net bank change: +X crédito (extras), -Y débito (faltas), -Z utilizado (banco pré-existente usado)
5. **Identify Passivos**: Flag cases where: extra > legal limit (Art. 59), banco negativo, absence without authorization
6. **Validate Coherence**: Compare total bank output with peopleops expected deltas (tolerance ±5%)
7. **Output**: Bank report + passivo list + coherence status

## Output Format

```yaml
bank_calculation:
  period: "06/2026"
  filial: "SP"
  calculated_by: "bank-manager"
  timestamp: "2026-06-30T23:59:59Z"
  
  summary:
    total_employees: 45
    total_hours_registered: 8760
    total_contracted: 7200
    total_bank_change: +156  # +extra -faltas -utilizado
    
  by_employee:
    - employee_id: "EMP001"
      contracted_hours: 160  # 8h × 20 days
      registered_hours: 175
      breakdown:
        normal: 160
        extra: 15
        noturna: 0
        falta: 0
        ferias: 0
        afastamento: 0
      bank_change: +15  # 175 - 160
      passivos: []
      notes: ""
      
    - employee_id: "EMP002"
      contracted_hours: 160
      registered_hours: 120  # 6 days falta
      breakdown:
        normal: 120
        extra: 0
        noturna: 0
        falta: 40
        ferias: 0
        afastamento: 0
      bank_change: -40  # 120 - 160 (débito por falta)
      passivos:
        - type: "unauthorized_absence"
          hours: 40
          recommendation: "Deduct from bank or salary (per contract)"
      notes: "Não-autorizada: 2026-06-10, 2026-06-17 completos"

  passivos_summary:
    total_cases: 3
    by_type:
      - type: "extra_over_limit"
        count: 2
        employees: ["EMP010", "EMP020"]
        total_excess_hours: 22
        legal_consequence: "Right to compensation (50% adicional) or banco"
      - type: "banco_negativo"
        count: 0
      - type: "unauthorized_absence"
        count: 1
        employees: ["EMP002"]
        total_hours: 40

  coherence_check:
    expected_from_payroll: -25  # peopleops forecast
    calculated: -40
    difference: -15
    difference_pct: 60
    coherence_status: "ALERT"
    recommendation: "Divergência > 5%. Sincronize com peopleops. Verificar: férias, afastamentos, setup."
  
  next_action: "If coherence OK: pass to compliance-gate. If divergence: sync with peopleops-chief."
```

## Veto Conditions

- Coherence divergence > 5% → ALERT (block until reconciled with peopleops)
- Calculation determinism violated → VETO (same input must yield same output)
- Leave/absence setup missing for unexcused absence → ALERT (cannot compute passivo)

## Completion Criteria

✅ Hours categorized correctly  
✅ Bank deltas computed deterministically  
✅ Passivos identified with consequence  
✅ Coherence checked against payroll setup  
✅ Report ready for compliance-gate audit
