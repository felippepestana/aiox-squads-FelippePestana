# Task: Model Predictive Turnover/Burnout Risk (model-risk)

**Executor:** risk-modeler
**Elicit:** Dataset manifest, metrics report, risk type, cohort
**Mode:** Cross-signal predictive scoring (aggregate only)
**Output:** Risk model report (YAML) — aggregate risk, drivers, confidence

## Inputs Required

- `dataset_manifest`: From assemble-dataset (>= 2 fontes-módulo)
- `metrics_report`: From compute-metrics
- `risk_type`: turnover | burnout | both
- `cohort`: Nível de agregação (área, função, coorte) — nunca individual

## Elicitation

Ask user:
1. "Modelar risco de turnover, burnout ou ambos?"
2. "Em qual nível de coorte? (área, função, tempo de casa) — sempre agregado, n >= 5"
3. "Qual janela de horizonte? (ex: risco nos próximos 90 dias)"

## Execution Steps

1. **Verify Cross-Signal**: Exigir >= 2 fontes (ex: chronos fadiga + pulse engajamento). Fonte única → ALERT, recusar
2. **Select Features**: Usar drivers acionáveis; EXCLUIR atributos protegidos (raça, gênero, idade, PCD, saúde)
3. **Score by Cohort**: Computar risco agregado por coorte (>= 5); nunca nominal
4. **State Confidence**: Declarar features, peso relativo, tamanho de amostra e confiança (low/medium/high)
5. **Identify Drivers**: Apontar drivers acionáveis (super-jornada, estagnação, queda de eNPS)
6. **Output**: Relatório de risco agregado com confiança e drivers

## Output Format

```yaml
risk_model:
  risk_type: "turnover+burnout"
  horizon: "90 dias"
  modeled_by: "risk-modeler"
  timestamp: "2026-06-30T23:59:59Z"
  framing: "Sinal agregado de apoio — NÃO é veredito individual"

  features_used:
    - { feature: "super_jornada_freq", source: "chronos", weight: 0.30 }
    - { feature: "enps_trend", source: "pulse", weight: 0.30 }
    - { feature: "progressao_estagnada", source: "performa", weight: 0.25 }
    - { feature: "absenteismo", source: "chronos", weight: 0.15 }
  protected_attributes_used: false
  protected_note: "Atributos protegidos excluídos como preditores (entram só na auditoria de viés do ethics-gate)."

  cohort_risk:
    - cohort: "area=Comercial"
      n: 60
      risk_level: "MEDIUM"
      confidence: "medium"
      drivers:
        - "eNPS em queda (−8 no semestre)"
        - "progressão estagnada em 40% da coorte"
      recommendation: "Revisar plano de carreira + 1:1 estruturado. Sinal de apoio, não corte."
    - cohort: "area=Engenharia"
      n: 85
      risk_level: "MEDIUM"
      confidence: "medium"
      drivers:
        - "super-jornada recorrente (fadiga)"
      recommendation: "Rebalancear carga (sync com chronos). Investigar antes de concluir."
    - cohort: "area=Suporte"
      n: 40
      risk_level: "LOW"
      confidence: "high"
      drivers: []

  limits:
    - "Janela de 6 meses; sazonalidade não totalmente controlada."
    - "Correlação, não causa: drivers são associações, não provas causais."
    - "Confiança média: validar com gestores antes de agir."
```

## Veto Conditions

- VETO (delegado ao ethics-gate) se: corte individual/nominal, atributo protegido como feature, cohort n < 5
- Fonte única (sem cruzamento) → recusar com ALERT "validade insuficiente"

## Completion Criteria

✅ >= 2 fontes-módulo combinadas
✅ Atributos protegidos excluídos como preditores
✅ Risco computado por coorte (>= 5), nunca individual
✅ Confiança e features declaradas
✅ Drivers acionáveis apontados
✅ Limites (correlação ≠ causa) explícitos
✅ Relatório pronto para ethics-gate
