# Task: Register Time Punches (run-registration)

**Executor:** time-tracker  
**Elicit:** Period, employee roster, data sources (biometric, geo, mobile systems)  
**Mode:** Deterministic (consolidation + validation)  
**Output:** Registration report (coverage %, anomalies, espelho de ponto JSON/YAML)

## Inputs Required

- `period`: MM/YYYY (e.g., "06/2026")
- `filial`: Branch code (e.g., "SP" for São Paulo)
- `employee_scope`: List of employees or all (all | specific_ids[])
- `data_sources`: Which systems to consolidate (biometric | geo | mobile | all)
- `validation_rules`: Strictness (strict | lenient) — default strict

## Elicitation

Ask user:
1. "Qual período e filial?"
2. "Todos os colaboradores ou um grupo específico?"
3. "Quais fontes de ponto? (biometria, geo, mobile, todas)"
4. "Validação estrita ou leniente?" (default: estrita)

## Execution Steps

1. **Consolidate**: Fetch punch records from all specified sources
2. **Deduplicate**: Remove duplicates within 5-minute window (same employee, same time)
3. **Order**: Sort by employee_id, then timestamp (monotonic)
4. **Validate Monotonicity**: Check each employee's timestamps are increasing; flag if out-of-order
5. **Validate Geo** (if applicable): Check coordinates within expected geofence; flag if anomalous
6. **Validate Coverage**: Calculate % of expected working days covered for each employee; flag if < 80%
7. **Generate Espelho**: Produce official punch record (PDF + JSON/YAML)

## Output Format

```yaml
registration_report:
  period: "06/2026"
  filial: "SP"
  consolidation_timestamp: "2026-06-30T23:59:59Z"
  
  summary:
    total_employees: 45
    total_punches: 1234
    coverage_pct: 96.5
    status: "PASS" # or "ALERT"
  
  validation:
    duplicates_removed: 5
    monotonicity_violations: 0
    geo_anomalies: 2
    coverage_alerts: 3  # employees with < 80% coverage
  
  coverage_by_employee:
    - employee_id: "EMP001"
      coverage_pct: 98.5
      days_covered: 21  # of 22 working days
      notes: ""
    - employee_id: "EMP002"
      coverage_pct: 72.0
      days_covered: 16
      notes: "2026-06-15, 2026-06-22 missing (vacation)"
  
  anomalies: []
  # [
  #   { type: "geo_anomaly", employee_id: "EMP010", timestamp: "2026-06-15T09:05:00Z", location: "20km away from expected" },
  #   { type: "coverage_alert", employee_id: "EMP012", coverage_pct: 65, reason: "6 days missing" }
  # ]
  
  espelho_de_ponto_path: "workspace/registrations/espelho_SP_06-2026.pdf"
  data_export_path: "workspace/registrations/punches_SP_06-2026.json"
```

## Veto Conditions

- Coverage < 60% for any employee without documented reason (e.g., vacation, leave) → ALERT, not VETO
- Monotonicity violation → ALERT (data integrity issue, but not blocking)
- Data source unavailable → VETO (cannot proceed without consolidation)

## Completion Criteria

✅ Punches consolidated from all specified sources  
✅ Duplicates removed, timestamps ordered  
✅ Coverage validated  
✅ Espelho de ponto generated (PDF + data export)  
✅ Anomalies flagged with context  
✅ Report ready for shift-officer and bank-manager
