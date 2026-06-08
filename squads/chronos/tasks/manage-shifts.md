# Task: Manage Shifts (manage-shifts)

**Executor:** shift-officer  
**Elicit:** Period, shift definitions, conflicts  
**Mode:** Deterministic validation + suggestion  
**Output:** Shift schedule (YAML), conflict report, rebalancing suggestions

## Inputs Required

- `period`: MM/YYYY
- `filial`: Branch code
- `shift_definitions`: Current or proposed shifts (array: {employee_id, start_time, end_time, days[]})
- `contract_basis`: Employee contracts (array: {employee_id, agreed_hours, special_rules[]})
- `action`: "validate" | "update" | "suggest-rebalance"

## Elicitation

Ask user:
1. "Qual é o período e filial?"
2. "Você quer validar escalas existentes, atualizar ou receber sugestões de rebalanceamento?"
3. "Há novos contratos ou mudanças de horário?"

## Execution Steps

1. **Load Current Shifts**: Fetch existing schedule or accept proposed one
2. **Validate Against Contract**: Check each shift matches employee's contracted hours
3. **Detect Overlaps**: Ensure same employee not in 2+ shifts simultaneously
4. **Check Interjornada**: Ensure 11-hour minimum rest between shifts for same employee
5. **Detect Super-Jornadas**: Flag shifts > 10h or patterns of 5+ consecutive 10h+ days
6. **Suggest Rebalance**: If overlaps/violations found, recommend adjustments
7. **Output**: Updated schedule + conflict report

## Output Format

```yaml
shift_schedule:
  period: "06/2026"
  filial: "SP"
  timestamp: "2026-06-08T10:30:00Z"
  
  summary:
    total_employees: 45
    total_shifts: 87
    conflicts_detected: 2
    compliance_status: "ALERT"  # or PASS
  
  shifts:
    - employee_id: "EMP001"
      date: "2026-06-01"
      start_time: "09:00"
      end_time: "17:00"
      duration_hours: 8
      contract_hours: 8
      match_contract: true
    - employee_id: "EMP002"
      date: "2026-06-01"
      start_time: "08:00"
      end_time: "17:00"
      duration_hours: 9
      contract_hours: 8
      match_contract: false
      note: "Matches proposed 1h overtime"
  
  conflicts:
    - type: "overlap"
      employee_id: "EMP010"
      dates: ["2026-06-05", "2026-06-12"]
      conflict_detail: "Scheduled 09:00-17:00 AND 16:00-00:00 same day"
      severity: "HIGH"
    - type: "interjornada_violation"
      employee_id: "EMP015"
      date_pair: ["2026-06-10", "2026-06-11"]
      rest_hours: 8.5
      required_hours: 11
      severity: "HIGH"
    - type: "super_jornada"
      employee_id: "EMP020"
      pattern: "5 consecutive days 10h+"
      severity: "MEDIUM"
      note: "Health/safety risk"
  
  rebalancing_suggestions:
    - conflict_id: "EMP010_overlap"
      suggestion: "Move 2026-06-12 evening shift to 2026-06-13"
      rationale: "Reduces overlap and improves interjornada for EMP010"
    - conflict_id: "EMP015_interjornada"
      suggestion: "Start 2026-06-11 at 10:00 instead of 09:00 (+1h rest)"
      rationale: "Restores 11h minimum rest"
  
  compliance_status: "ALERT"
  next_action: "Review suggestions above; apply changes and revalidate"
```

## Veto Conditions

- Overlap violation (same employee 2+ shifts same day) → ALERT + suggest rebalance
- Interjornada < 11h → ALERT + suggest rebalance
- Super-jornada pattern flagged → MEDIUM alert; operator can choose to proceed or adjust
- No VETO at shift level (but shift-officer recommends fixes)

## Completion Criteria

✅ All shifts validated against contracts  
✅ Overlaps detected and reported  
✅ Interjornada violations flagged  
✅ Super-jornada patterns identified  
✅ Rebalancing suggestions provided  
✅ Schedule ready for time-tracker consolidation
