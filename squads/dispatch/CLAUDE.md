# Dispatch Squad — Parallel Execution Engine

## Single Entry Point

```
@dispatch-chief {story/PRD/task list}
```

**Filosofia central: "Never contaminate the main context. Always subagents. Always."**

Dispatch decompõe qualquer trabalho em sub-tasks atômicas, otimiza em waves DAG, e executa via subagents — 43-58x mais barato que executar no contexto principal Opus.

---

## Pipeline de Execução

```
Input              Decompose          Wave Plan          Route & Execute
Story/PRD     →    Atomic tasks  →    DAG waves    →     Subagents (Haiku)
(free text ok)     (Python worker)    (topological)      Parallel execution
```

## Comandos

| Comando | O que faz |
|---------|-----------|
| `*dispatch {story}` | Pipeline completo — decompor → planejar → executar |
| `*plan {story}` | Apenas planejamento — mostra decomposição e waves |
| `*execute {manifest}` | Executar a partir de wave manifest pré-construído |
| `*batch {list}` | Batch dispatch de lista de tasks |
| `*verify` | Verificar resultados e gerar relatório de conclusão |
| `*cost` | Breakdown de custo da última execução |

## Agentes

| Agente | Mente Clonada | Papel |
|--------|---------------|-------|
| `@dispatch-chief` | Gene Kim | Orquestrador — recebe missão, coordena |
| `@wave-planner` | Reinertsen + Goldratt | DAG optimization, wave structuring |
| `@task-router` | — | Registry-based routing para agentes |
| `@quality-gate` | Deming + Pedro Valério | Pre/post execution gates |

## Economia de Custos

| Contexto | Custo Relativo |
|----------|----------------|
| Execução no Opus principal | 1x (baseline) |
| Execução via Dispatch (Haiku subagents) | ~0.02-0.03x |
| **Economia** | **43-58x** |

## Quality Gates

- **Pre-Execution:** Story suficientemente detalhada, tasks atômicas validadas
- **Post-Execution:** Todos os resultados verificados, nenhuma task órfã
- **Haiku Prompt Validation:** Prompts de subagent contêm contexto completo

## Regras de Roteamento

O `@task-router` usa o registro de agentes para matching semântico:
- Tasks de código → `@dev`
- Tasks de QA → `@qa`
- Tasks de arquitetura → `@architect`
- Tasks frontend → `@apex` ou agentes Apex específicos
- Tasks de dados → `@data-engineer`

---

*Dispatch Squad v1.0.0 — CODE > LLM | Never contaminate the main context*
