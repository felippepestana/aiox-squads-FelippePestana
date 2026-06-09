# Task: Route a People Need to the Owning Module (route-need)

**Executor:** apex-talent-chief
**Elicit:** The user's people/HR need
**Mode:** Deterministic classification + routing
**Output:** Routing decision (lifecycle stage → module + handoff + expectation)

Backs the `*route` command. Classifies a need into one employee-lifecycle stage
and routes to the module that owns it, before offering any generic advice.

## Inputs Required

- `need`: Descrição da necessidade do usuário (texto livre)
- `context`: Contexto opcional (cargo, área, urgência)

## Elicitation

Ask user:
1. "Qual é a necessidade? (descreva em uma frase)"
2. "Há contexto — cargo, área, prazo?"

## Execution Steps

1. **Name the stage**: Classificar em UMA etapa do ciclo de vida (atrair, contratar, integrar, desenvolver, engajar, operar, analisar) — ver `data/lifecycle-orchestration.md`
2. **Find the owner**: Identificar o módulo dono da etapa
3. **Set expectation**: Descrever o que o módulo realmente entrega (tasks/workflow), sem prometer além (heurística Capability Honesty)
4. **Name the handoff**: Se houver próxima etapa provável, citar o dado de handoff que fluirá
5. **Check scope**: Se a necessidade não cabe nas 11 áreas, dizer explicitamente e sugerir o mais próximo
6. **Route**: Encaminhar ao `<module>-chief`

## Output Format

```yaml
routing_decision:
  need: "Preciso avaliar o desempenho do time de vendas neste trimestre"
  routed_by: "apex-talent-chief"
  timestamp: "2026-06-09T12:00:00Z"

  lifecycle_stage: "DESENVOLVER"
  owning_module: "performa"
  rationale: "Avaliação de desempenho/ciclo é o domínio de performa (avaliação, 9-box, calibração)."
  module_delivers:
    - "Avaliação 90/180/360, posição 9-box, PDI"
    - "Gate de calibração contra viés de linguagem"
  likely_next:
    - to: "academy"
      handoff: "Gaps de competência do ciclo → trilha de desenvolvimento 70-20-10"
  handoff_to_agent: "performa-chief"
  expectation_note: "performa apoia a decisão; a nota final é do gestor responsável."

  # Caso fora de escopo:
  # in_scope: false
  # nearest_module: "—"
  # note: "Essa necessidade está fora das 11 áreas atuais; o mais próximo é <module>."
```

## Veto Conditions

- Não rotear sem nomear a etapa do ciclo de vida primeiro
- Não prometer capacidade além do que o módulo dono entrega
- Não decidir pela pessoa — o gate/decisão é do módulo e do humano responsável

## Completion Criteria

✅ Etapa do ciclo de vida nomeada
✅ Módulo dono identificado com rationale
✅ Expectativa de entrega ajustada (sem overpromise)
✅ Handoff provável citado quando aplicável
✅ Encaminhamento ao `<module>-chief` (ou aviso de fora de escopo)
