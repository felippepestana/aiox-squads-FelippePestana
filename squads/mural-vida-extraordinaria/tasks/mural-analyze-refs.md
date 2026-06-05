# mural-analyze-refs

## Task Anatomy

| Field | Value |
|-------|-------|
| **task_id** | mural-analyze-refs |
| **purpose** | Extrair análises e brief sem gerar imagem |
| **executor** | Agent |
| **execution_type** | Agent |
| **input** | prompt, references[] |
| **output** | brief, analyses |
| **acceptance_criteria** | JSON brief com identity_lock e generation_prompt |

## Action items

1. Validar papéis
2. `POST /api/mural/analyze` com body MuralComposeRequest
3. Revisar brief com usuário antes de gerar
