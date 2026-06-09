# Task: Map a Multi-Stage Request to the Module Chain (map-lifecycle)

**Executor:** apex-talent-chief
**Elicit:** A request that spans more than one lifecycle stage
**Mode:** Deterministic chaining + handoff mapping
**Output:** Ordered module chain with handoff data between each step

Backs the `*lifecycle` command. When a need crosses stages (e.g., "hire and
onboard a sales rep"), sequences the owning modules and makes the handoff data
explicit, so the chain runs as one flow rather than disconnected silos.

## Inputs Required

- `request`: Pedido que atravessa etapas (texto livre)
- `role_context`: Cargo/área alvo (opcional)

## Elicitation

Ask user:
1. "Qual é o objetivo de ponta a ponta?"
2. "Para qual cargo/área?"

## Execution Steps

1. **Decompose**: Quebrar o pedido nas etapas do ciclo de vida envolvidas (ver `data/lifecycle-orchestration.md`)
2. **Order**: Sequenciar as etapas (atrair → contratar → integrar → desenvolver → engajar → operar → analisar)
3. **Assign owners**: Mapear cada etapa ao módulo dono
4. **Wire handoffs**: Para cada transição, citar o dado de handoff canônico
5. **Note gates**: Marcar os quality gates do caminho (ex: viés no talent-compass)
6. **Output**: Cadeia ordenada pronta para iniciar pelo primeiro módulo

## Output Format

```yaml
lifecycle_map:
  request: "Contratar um analista financeiro e já deixar a integração e o plano de desenvolvimento prontos"
  mapped_by: "apex-talent-chief"
  timestamp: "2026-06-09T12:00:00Z"

  chain:
    - step: 1
      stage: "CONTRATAR"
      module: "talent-compass"
      delivers: "Vaga por objetivos → entrevista → scorecard → gate de viés"
      gate: "fairness-gate (veto antes da decisão)"
      handoff_out: "Perfil do contratado + scorecard + objetivos de performance"
    - step: 2
      stage: "INTEGRAR"
      module: "onboard"
      delivers: "Jornada 30/60/90 personalizada por cargo e perfil"
      handoff_in: "Perfil do contratado + scorecard"
      handoff_out: "Marcos de integração"
    - step: 3
      stage: "DESENVOLVER"
      module: "academy"
      delivers: "Trilha 70-20-10 a partir dos gaps do scorecard"
      handoff_in: "Competências abaixo do alvo (scorecard) + marcos de onboard"
      gate: "learning-gate (pedagógico)"

  start_at: "talent-compass-chief"
  note: "Cada etapa só decide via seu gate + humano responsável. O orquestrador costura, não decide."
```

## Veto Conditions

- Não inverter a ordem natural do ciclo (fundamento antes de avançado)
- Não omitir o dado de handoff entre etapas (a cadeia quebra sem ele)
- Não prometer entrega de um módulo além do que ele realmente faz

## Completion Criteria

✅ Pedido decomposto em etapas do ciclo de vida
✅ Etapas ordenadas e mapeadas ao módulo dono
✅ Handoff explícito em cada transição
✅ Quality gates do caminho marcados
✅ Ponto de início (primeiro `<module>-chief`) definido
