# Task: Detect Jornada Anomalies (detect-anomalies)

**Executor:** alert-warden  
**Elicit:** Period, registration data, team context  
**Mode:** Pattern recognition (statistical + rule-based)  
**Output:** Anomaly report (YAML), classification by type/risk, context

## Inputs Required

- `period`: MM/YYYY
- `registration_data`: From run-registration (full punch timeline)
- `team_context`: Average hours/patterns for comparison (ex: team median 40h/week)
- `classification_rules`: Anomaly types to detect (pattern | fatigue | inconsistency | all)

## Elicitation

Ask user:
1. "Qual período? (MM/YYYY)"
2. "Tipos de anomalia a detectar? (padrões, fadiga, inconsistências, todas)"
3. "Há contexto de equipe para comparação?" (ex: horário padrão, padrões conhecidos)

## Execution Steps

1. **Load Registration**: Use espelho de ponto + bank calculation
2. **Detect Patterns**: Identify recurring patterns (same time ±5min, 20+ occurrences → likely machine bias or vício)
3. **Detect Fatigue Signals**: Flag super-jornadas (>50h/week, >10h/day, 5+ consecutive heavy days)
4. **Detect Inconsistency**: Flag geo anomalies, timestamp gaps, unusual clock-out times
5. **Classify by Risk**: Categorize each anomaly as low/medium/high based on legal/health/fraud implications
6. **Provide Context**: For each anomaly, explain: frequency, comparison to team baseline, interpretation
7. **Output**: Anomaly report ranked by risk

## Output Format

```yaml
anomaly_report:
  period: "06/2026"
  filial: "SP"
  detected_by: "alert-warden"
  timestamp: "2026-06-30T23:59:59Z"
  
  summary:
    total_employees: 45
    employees_with_anomalies: 8
    total_anomalies: 12
    by_risk:
      high: 2
      medium: 6
      low: 4
  
  anomalies:
    - id: "ANM_001"
      type: "pattern_time"
      employee_id: "EMP010"
      description: "Sempre registra entrada às 09:00 ± 30 segundos (24 ocorrências)"
      frequency: "daily"
      occurrences: 24
      risk_level: "MEDIUM"
      context: "Padrão excessivamente regular. Possíveis causas: máquina em mesmo local; vício de entrada."
      recommendation: "Auditar: entrada manual vs. automática? Máquina mal configurada?"
      
    - id: "ANM_002"
      type: "fatigue_super_jornada"
      employee_id: "EMP020"
      description: "5 dias consecutivos com 10.5h+: 2026-06-03 a 2026-06-07"
      frequency: "1 week"
      occurrences: 1
      hours_per_day: [10.5, 11.0, 10.8, 11.2, 10.5]
      total_super_jornada: 54h
      risk_level: "HIGH"
      context: "Acumulado semanal: 54h (team median: 40h). Risco de burnout/fatiga."
      recommendation: "Verifique com gestor: foi excepcional ou padrão? Se padrão, requerer rebalanceamento ou compensação."
      integration: "Passar para insights (predictive burnout/turnover)"
      
    - id: "ANM_003"
      type: "inconsistency_geo"
      employee_id: "EMP005"
      date: "2026-06-15"
      description: "Geo punch 2026-06-15 09:05 detectada a 18km da filial esperada"
      location: "18km away from usual location"
      risk_level: "LOW"
      context: "Pode ser: trabalho remoto, reunião externa, erro de sistema. Padrão isolado (primeira ocorrência)."
      recommendation: "Sem ação imediata; monitorar padrão futuro."
      
    - id: "ANM_004"
      type: "falta_isolada"
      employee_id: "EMP015"
      date: "2026-06-10"
      description: "Falta não-autorizada (nenhum ponto registrado, sem licença marcada)"
      context: "Isolada (1 ocorrência no período). Colega próximo trabalhou normalmente (não é feriado/evento)."
      risk_level: "MEDIUM"
      recommendation: "Contatar colaborador: motivo? Marcação de licença? Integrar com peopleops para ação."
  
  summary_by_risk:
    high:
      - "ANM_002: Fatiga super-jornada (EMP020, 54h/semana)"
    medium:
      - "ANM_001: Padrão de entrada excessivamente regular (EMP010)"
      - "ANM_004: Falta não-autorizada (EMP015)"
    low:
      - "ANM_003: Geo inconsistência isolada (EMP005)"
  
  next_actions:
    - "HIGH risks: Escalate to compliance-gate + gestor área"
    - "MEDIUM risks: Investigar; documentar contexto"
    - "LOW risks: Monitor; sem ação imediata"
```

## Veto Conditions

- No VETO at anomaly detection (detection is informational)
- HIGH risk anomalies must be passed to compliance-gate for evaluation

## Completion Criteria

✅ Patterns detected (recurring times, inconsistencies)  
✅ Fatigue signals flagged with context  
✅ Geo anomalies identified  
✅ All anomalies classified by risk (low/medium/high)  
✅ Context provided (frequency, comparison to baseline, interpretation)  
✅ Recommendations included  
✅ Report ready for compliance-gate + insights integration
