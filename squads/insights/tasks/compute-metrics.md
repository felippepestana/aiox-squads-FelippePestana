# Task: Compute People Metrics & Dashboard (compute-metrics)

**Executor:** metric-smith
**Elicit:** Dataset manifest, metrics requested, segments
**Mode:** Deterministic mathematical
**Output:** Metrics report + dashboard (YAML), each KPI with formula and source

## Inputs Required

- `dataset_manifest`: From assemble-dataset
- `metrics`: KPIs a computar (headcount | turnover | absenteismo | custo | tenure | enps | all)
- `segments`: Cortes (respeitando n >= 5)
- `benchmark`: Período anterior / referência (opcional)

## Elicitation

Ask user:
1. "Quais métricas? (headcount, turnover, absenteísmo, custo, tenure, eNPS, todas)"
2. "Cortar por quais segmentos?"
3. "Comparar com qual período/benchmark?"

## Execution Steps

1. **Load Dataset**: Usar o manifesto montado (não reingerir)
2. **Compute KPIs**: Cada métrica com fórmula explícita do glossário (data/people-metrics-glossary.md)
3. **Segment**: Cortar por segmento; suprimir células n < 5 (mostrar "suprimido (n<5)")
4. **Distinguish**: Turnover voluntário vs. involuntário; anualizar janelas parciais
5. **Benchmark**: Comparar com período anterior normalizando a base
6. **Output**: Dashboard determinístico, cada número com fórmula e fonte

## Output Format

```yaml
metrics_report:
  window: "2026-01..2026-06"
  computed_by: "metric-smith"
  timestamp: "2026-06-30T23:59:59Z"
  determinism: "same inputs → same outputs"

  kpis:
    - name: "headcount_medio"
      value: 320
      formula: "(headcount_inicio + headcount_fim) / 2"
      source: "peopleops"
    - name: "turnover_anualizado"
      value_pct: 14.0
      breakdown: { voluntario_pct: 10.0, involuntario_pct: 4.0 }
      formula: "(desligamentos no período / headcount médio) * (12 / meses na janela)"
      source: "peopleops"
      note: "Janela de 6 meses anualizada (×2)"
    - name: "absenteismo_pct"
      value_pct: 3.2
      formula: "horas de ausência não programada / horas previstas"
      source: "chronos"
    - name: "custo_pessoal"
      value: 4820000
      currency: "BRL"
      formula: "soma de folha + encargos no período"
      source: "peopleops"
    - name: "enps_agregado"
      value: 32
      formula: "% promotores − % detratores"
      source: "pulse"

  segments:
    - segment: "area=Engenharia"
      n: 85
      turnover_anualizado_pct: 19.0
      absenteismo_pct: 2.8
      enps: 21
    - segment: "area=Comercial"
      n: 60
      turnover_anualizado_pct: 22.0
      absenteismo_pct: 4.1
      enps: 12
    - segment: "area=Jurídico"
      n: 3
      status: "suprimido (n<5)"

  benchmark:
    vs_previous_semester:
      turnover_delta_pp: 2.0
      enps_delta: -5
    note: "Mesma definição/janela; bases comparáveis."
```

## Veto Conditions

- No VETO na computação, MAS:
- Célula com n < 5 NÃO pode ser exibida (suprimir)
- Métrica sem fórmula citada → retornar para correção (não liberar)

## Completion Criteria

✅ KPIs computados com fórmula explícita e fonte
✅ Turnover separado em voluntário/involuntário e anualizado
✅ Segmentos cortados com supressão de n < 5
✅ Benchmark normalizado quando disponível
✅ Determinismo garantido (mesmos inputs → mesmo output)
✅ Dashboard pronto para risk-modeler e ethics-gate
