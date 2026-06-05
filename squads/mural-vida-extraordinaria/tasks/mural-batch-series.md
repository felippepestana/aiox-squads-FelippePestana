# mural-batch-series

## Task Anatomy

| Field | Value |
|-------|-------|
| **task_id** | mural-batch-series |
| **purpose** | Série de cenas com mesma ref identity e prompts variados |
| **executor** | Hybrid |
| **execution_type** | Hybrid |
| **input** | identity ref fixa, lista de prompts/cenas |
| **output** | múltiplos jobs com manifestos |
| **acceptance_criteria** | Identidade consistente entre variantes da série |

## Action items

1. Fixar references identity
2. Para cada prompt da série: `mural-compose.mjs` ou API compose
3. Comparar gate QA entre jobs
