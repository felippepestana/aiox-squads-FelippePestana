# Task: Assemble Cross-Module Dataset (assemble-dataset)

**Executor:** data-weaver
**Elicit:** Decision/question, time window, segments, source modules
**Mode:** Deterministic ingestion + join validation
**Output:** Unified dataset manifest (YAML) with freshness, coverage and suppressed groups

## Inputs Required

- `decision`: A decisão que a análise informa (texto)
- `window`: Janela temporal (ex: 2026-01 a 2026-06)
- `segments`: Cortes desejados (ex: área, função, filial)
- `source_modules`: Fontes a cruzar (chronos | performa | pulse | peopleops | onboard | all)

## Elicitation

Ask user:
1. "Qual decisão esta análise vai informar?"
2. "Qual a janela temporal? (ex: Jan–Jun/2026)"
3. "Quais segmentos? (área, função, filial)"
4. "Quais módulos cruzar? (chronos, performa, pulse, peopleops, onboard)"

## Execution Steps

1. **Ingest Sources**: Carregar sinais de cada módulo-fonte para a janela
2. **Resolve Keys**: Casar `employee_id` + `período` + `filial`; medir taxa de match
3. **Validate Joins**: Se match < 95%, ALERT com a taxa (não PASS silencioso)
4. **Declare Freshness**: Registrar timestamp do dado mais recente por fonte; flag STALE se > 7 dias
5. **Minimize**: Trazer só campos necessários à decisão; atributo sensível só com finalidade de auditoria (LGPD Art. 11)
6. **Mark Small Groups**: Marcar grupos com n < 5 como `SUPPRESS` para o ethics-gate
7. **Output**: Manifesto do dataset com cobertura, frescor e supressões

## Output Format

```yaml
dataset_manifest:
  decision: "Onde concentrar retenção no 2º semestre?"
  window: "2026-01..2026-06"
  segments: ["area", "funcao"]
  assembled_by: "data-weaver"
  timestamp: "2026-06-30T23:59:59Z"

  sources:
    - module: "chronos"
      signals: ["horas_extra", "super_jornada_flag", "absenteismo"]
      freshness: "2026-06-30"
      coverage_pct: 98.2
      status: "OK"
    - module: "performa"
      signals: ["nota_ciclo", "posicao_9box", "progressao"]
      freshness: "2026-06-15"
      coverage_pct: 91.0
      status: "OK"
    - module: "pulse"
      signals: ["enps", "engajamento_trend"]
      freshness: "2026-06-28"
      coverage_pct: 84.5
      status: "OK"
    - module: "peopleops"
      signals: ["headcount", "custo_pessoal", "evento_turnover"]
      freshness: "2026-06-30"
      coverage_pct: 100.0
      status: "OK"

  join:
    key: ["employee_id", "periodo", "filial"]
    match_rate_pct: 96.4
    status: "PASS"

  suppressed_groups:
    - segment: "area=Jurídico"
      n: 3
      reason: "n < 5 — supressão de privacidade"

  minimization:
    sensitive_attributes_included: false
    note: "Atributos protegidos não ingeridos (decisão não é auditoria de diversidade)."
```

## Veto Conditions

- No VETO na montagem (informacional), MAS:
- Se match < 80%, retorne BLOCK: dataset não confiável para conclusão
- Atributo sensível ingerido sem finalidade declarada → flag para ethics-gate (provável VETO)

## Completion Criteria

✅ Fontes ingeridas para a janela
✅ Chaves resolvidas e taxa de match declarada
✅ Frescor e cobertura por fonte registrados
✅ Minimização aplicada (só campos necessários)
✅ Grupos n < 5 marcados como SUPPRESS
✅ Manifesto pronto para metric-smith e risk-modeler
