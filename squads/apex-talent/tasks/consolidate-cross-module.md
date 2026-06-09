# Task: Consolidate a Cross-Module View (consolidate-cross-module)

**Executor:** apex-talent-chief
**Elicit:** The cross-module question + the modules' outputs
**Mode:** Synthesis (respecting source-module gates)
**Output:** Consolidated view/report → workspace/apex-talent/cross-module-report.md

Realizes the SYNTHESIZE phase: when the value is in the crossing (a 360 view, a
retention picture, succession readiness), the orchestrator stitches the modules'
outputs into one report — without re-deciding what each module's gate already
governs, and respecting each source's privacy/ethics constraints.

## Inputs Required

- `question`: A pergunta cross-módulo (ex: "qual a visão 360 desta área?")
- `module_outputs`: Saídas relevantes dos módulos-fonte (ex: performa, pulse, chronos, academy)
- `scope`: Recorte (área, coorte) — respeitando tamanho mínimo de grupo dos módulos-fonte

## Elicitation

Ask user:
1. "Qual a pergunta que cruza módulos?"
2. "Quais módulos têm dado relevante? (performa, pulse, chronos, insights, academy, ...)"
3. "Qual o recorte (área/coorte)?"

## Execution Steps

1. **Frame the crossing**: Definir a visão (360 do colaborador, risco de retenção, prontidão de sucessão — ver `data/lifecycle-orchestration.md`)
2. **Gather sources**: Reunir as saídas dos módulos-fonte (sem refazer o trabalho deles)
3. **Respect gates**: Honrar os gates dos módulos-fonte (ex: `insights` n≥5 e sem veredito individual; `benefits-hub` sigilo de escolhas)
4. **Synthesize**: Costurar numa narrativa coerente, citando a fonte de cada peça
5. **Flag conflicts**: Sinalizar divergências entre módulos (ex: alto desempenho + baixo engajamento)
6. **Output**: Relatório consolidado em `workspace/apex-talent/cross-module-report.md`

## Output Format

```yaml
cross_module_report:
  question: "Visão 360 da área Comercial neste semestre"
  consolidated_by: "apex-talent-chief"
  timestamp: "2026-06-09T12:00:00Z"
  scope: { area: "Comercial", cohort_size: 60 }
  output_path: "workspace/apex-talent/cross-module-report.md"

  sources:
    - module: "performa"
      view: "Desempenho médio estável; 40% da coorte com progressão estagnada"
    - module: "pulse"
      view: "eNPS −8 no semestre"
    - module: "chronos"
      view: "Super-jornada recorrente em parte da coorte"
    - module: "insights"
      view: "Risco de turnover MEDIUM (confiança média) — sinal agregado de apoio"

  synthesis: >-
    A área combina desempenho estável com sinais de risco (engajamento em queda +
    estagnação + fadiga). Recomendação de apoio: revisar carreira (org-architect) e
    rebalancear carga (chronos); trilha de desenvolvimento (academy) para a estagnação.

  conflicts_flagged:
    - "Desempenho estável vs. engajamento em queda — investigar causa antes de agir."

  gates_respected:
    - "insights: agregado (n=60 ≥ 5), sem veredito individual"

  decision_owner: "Liderança da área + RH — o orquestrador consolida, não decide."
```

## Veto Conditions

- Não violar gates dos módulos-fonte (ex: expor dado individual que o `insights` agrega)
- Não apresentar correlação como causa na síntese
- Não decidir pela área — consolidação é insumo de decisão humana

## Completion Criteria

✅ Visão cross-módulo enquadrada
✅ Fontes reunidas e citadas (sem refazer o trabalho dos módulos)
✅ Gates de privacidade/ética dos módulos-fonte respeitados
✅ Síntese coerente com conflitos sinalizados
✅ Relatório gravado em `workspace/apex-talent/cross-module-report.md`
