# Task: Audit Compliance — CLT + eSocial (audit-compliance)

**Executor:** compliance-gate  
**Elicit:** All prior outputs (registration, shifts, bank, anomalies), eSocial setup from peopleops  
**Mode:** Deterministic audit (rule-based validation)  
**Output:** Compliance verdict (PASS | VETO + reason), audit trail, eSocial mappability

## Inputs Required

- `period`: MM/YYYY
- `registration_report`: From run-registration
- `shift_schedule`: From manage-shifts
- `bank_report`: From calculate-hours
- `anomaly_report`: From detect-anomalies
- `esocial_setup`: From peopleops (S-2200, S-2240 event mapping)
- `clt_rules`: CLT articles to validate (default: Art. 5, 58-67, 219)

## Elicitation

Ask user (or auto-execute from prior tasks):
1. "Todos os relatórios anteriores prontos? (registration, shifts, bank, anomalies)"
2. "Qual é o setup de eSocial de peopleops?"

## Execution Steps

1. **CLT Audit**: Validate against key articles
   - Art. 5: Jornada não exceda 8h/day ou 44h/week (ou contrato)
   - Art. 66: Interjornada mínimo 11h
   - Art. 67: Repouso semanal 24h (mínimo 1 domingo/mês)
   - Art. 59: Extras limitadas a 2h/dia ou compensadas com banco
   - Art. 219: Aviso prévio para mudança de turno
   
2. **eSocial Audit**: Check S-2200 (jornada base) and S-2240 (events)
   - S-2200 fields populated and coherent with registration
   - S-2240 events (absence, anomaly, etc.) mappable
   - No critical fields missing
   
3. **Audit Trail**: Verify 100% traceability
   - All changes logged with user, timestamp, reason
   - Original data preserved (immutable)
   - Sequence is logical
   
4. **Coherence Check**: Bank of hours vs. payroll setup
   - Divergence < 5% (rounding tolerance)
   - If > 5%, sync required before gate PASS
   
5. **Anomaly Gate**: HIGH-risk anomalies must be investigated
   - If unresolved HIGH-risk anomaly, VETO until investigation complete
   
6. **Output**: PASS or VETO with detailed reasoning

## Output Format

```yaml
compliance_audit:
  period: "06/2026"
  filial: "SP"
  audited_by: "compliance-gate"
  timestamp: "2026-06-30T23:59:59Z"
  
  clt_audit:
    checks:
      - article: "Art. 5"
        rule: "Jornada diária <= 8h (ou contrato), semanal <= 44h"
        status: "PASS"
        findings: "45 employees checked; 44 within limits, 1 exception (EMP020, 54h — flagged as super-jornada, under review)"
        
      - article: "Art. 66"
        rule: "Interjornada >= 11h"
        status: "PASS"
        findings: "2 interjornada violations detected in shift_schedule (EMP015: 8.5h). Shift-officer flagged; rebalancing suggested. No employees allowed to work without remediation."
        
      - article: "Art. 67"
        rule: "Repouso semanal 24h (mínimo 1 domingo/mês)"
        status: "PASS"
        findings: "Calendar check: all employees have mínimo 1 domingo/mês. No violations."
        
      - article: "Art. 59"
        rule: "Extras <= 2h/dia OU compensadas com banco"
        status: "PASS"
        findings: "2 employees exceed 2h/dia média. Bank-manager flagged as passivos (right to compensation). No violation if compensation provided."
        
      - article: "Art. 468"
        rule: "Mudança de turno requer consentimento mútuo (30 dias aviso)"
        status: "PASS"
        findings: "0 unscheduled turno changes in this period. N/A."
  
  esocial_audit:
    s2200_status: "PASS"
    findings: "S-2200 jornada base aligned with registration. All fields populated. 0 critical gaps."
    
    s2240_status: "PASS"
    findings: "S-2240 events: 5 absence events (férias 3, licença 1, falta 1). All mappable to bank_report categories. 0 unmappable events."
    
    overall_esocial_status: "PASS"
    notes: "Period ready for eSocial transmission (5º dia útil deadline not at risk)."
  
  audit_trail_status: "PASS"
  findings: "100% traceability verified. All changes logged (user, timestamp, reason). Original data preserved."
  
  coherence_check:
    bank_calculated: -40
    payroll_expected: -25
    difference: -15
    difference_pct: 60
    coherence_status: "ALERT"
    recommendation: "Divergência > 5%. Sincronize com peopleops-chief antes de liberar."
    blocker: true  # Will trigger VETO
  
  anomaly_gate:
    high_risk_anomalies: 1
    - id: "ANM_002"
      type: "fadiga_super_jornada"
      employee: "EMP020"
      status: "FLAGGED"
      investigation_required: true
      recommendation: "Gestor area to confirm: excepcional ou padrão? Se padrão, rebalancear ou compensar."
    
    gate_status: "ALERT"
    notes: "1 HIGH-risk anomaly flagged. Recommend gestor review + documentation of decision before PASS."
  
  verdict: "VETO"
  reasons:
    - "Coherence divergence > 5% (banco -40 vs. payroll -25). Sync with peopleops-chief required."
    - "1 HIGH-risk anomaly unresolved (EMP020 super-jornada). Requires investigation/documentation."
  
  remediation_steps:
    1. "Sync with peopleops-chief: resolve -15h bank divergence (ferias/afastamento mismatch?)"
    2. "Gestor area review: EMP020 super-jornada (54h/week). Document if excepcional or provide rebalancing plan."
    3. "Resubmit audit once remediation complete."
  
  resubmit_at: "WAITING FOR REMEDIATION"
```

**Alternative: PASS verdict**

```yaml
verdict: "PASS"
findings:
  - "CLT audit: All articles compliant."
  - "eSocial audit: S-2200/S-2240 ready for transmission."
  - "Audit trail: 100% rastreável."
  - "Coherence: Bank matches payroll (±2%)."
  - "Anomalies: No HIGH-risk unresolved issues."

status: "LIBERADO PARA FOLHA"
next_action: "Período pronto para processamento de folha + eSocial transmission (peopleops-chief)"
approved_by: "compliance-gate"
timestamp: "2026-06-30T23:59:59Z"
```

## Veto Conditions (Mandatory Blocks)

- **CLT violation unresolved** → VETO (must remediate)
- **eSocial unmappable events** → VETO (cannot transmit)
- **Audit trail < 100% complete** → VETO (integrity risk)
- **Coherence divergence > 5%** → VETO (sync with payroll first)
- **HIGH-risk anomaly unresolved** → VETO (requires investigation/documentation)

## Completion Criteria

✅ CLT articles 5, 58-67, 219 validated  
✅ eSocial S-2200/S-2240 mappability confirmed  
✅ Audit trail 100% complete  
✅ Coherence check passed (or remediation documented)  
✅ Anomalies: no unresolved HIGH-risk issues  
✅ Verdict (PASS/VETO) issued with reasoning  
✅ If PASS: ready for peopleops (payroll + eSocial transmission)
