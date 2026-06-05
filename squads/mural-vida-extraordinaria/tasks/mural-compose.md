# mural-compose

## Task Anatomy

| Field | Value |
|-------|-------|
| **task_id** | mural-compose |
| **purpose** | Composição multimodal completa: refs + prompt → imagens geradas |
| **executor** | Agent (orchestrated) + API |
| **execution_type** | Hybrid |
| **input** | prompt, references[] com role + imagem, options.variants |
| **output** | MuralBrief, assets PNG, manifest.json |
| **acceptance_criteria** | identity presente; ≥1 imagem gerada; gate QA ≥70 |

## Action items

1. Validar refs (identity obrigatório) — mural-chief
2. Extrair traits (identity) — trait-extractor (parallel)
3. Sintetizar cena (demais refs) — scene-composer (parallel)
4. Montar brief — prompt-architect
5. Gerar variantes — image-generator via `POST /api/mural/compose`
6. Curar saída — quality-curator
7. Arquivar — asset-archivist

## API

```bash
curl -X POST http://127.0.0.1:8787/api/mural/compose \
  -H "Content-Type: application/json" \
  -d @request.json
```
