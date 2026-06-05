# Exemplos — Mural Da Vida Extraordinária

Artefatos funcionais gerados em **modo demo** (offline, sem chaves de IA).

| Arquivo | Descrição |
|---------|-----------|
| `demo-request.json` | Requisição de exemplo (4 referências com papéis + prompt) |
| `demo-mural.svg` | Saída gerada pelo pipeline (pôster do brief) |

## Reproduzir

```bash
cd web
MURAL_DEMO_MODE=1 npm run dev:server
# em outro terminal:
curl -s -X POST http://127.0.0.1:8787/api/mural/compose \
  -H "Content-Type: application/json" \
  -d @../squads/mural-vida-extraordinaria/examples/demo-request.json
```

Com chaves reais (`ANTHROPIC_API_KEY` + `GOOGLE_API_KEY`), a mesma requisição produz
imagens fotorealistas via Gemini em vez do pôster SVG de demonstração.
