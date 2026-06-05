---
name: mural-vida-extraordinaria
description: >-
  Composição multimodal de imagens para o Mural Da Vida Extraordinária: combinar
  refs com papéis (identity, environment, activity, body_pose, style, location) e
  prompt para gerar cenas preservando identidade. Use ao combinar várias fotos,
  transferir traços pessoais para nova cena, ou orquestrar o squad/API Mural.
---

# Mural Da Vida Extraordinária

## Quando usar

- Usuário quer **juntar características** de imagem X em cena inspirada por Y, W, Z
- Transferir **identidade** para corpo/atividade/ambiente diferentes
- Automatizar geração via squad, API ou CLI

## Papéis (`ImageRole`)

| Papel | Preservar vs reinterpretar |
|-------|---------------------------|
| `identity` | **Preservar** — obrigatório |
| `environment` | Reinterpretar cenário |
| `activity` | Reinterpretar ação |
| `body_pose` | Reinterpretar corpo/pose |
| `style` | Reinterpretar estética |
| `location` | Reinterpretar local |

## Pipeline (5 passos)

1. **Intake** — validar prompt + refs (`identity` ≥ 1)
2. **Extração** — Claude vision → `ReferenceAnalysis[]` por ref
3. **Brief** — `identity_lock` + `scene_spec` → `generation_prompt`
4. **Geração** — Gemini com refs inline + `responseModalities: TEXT, IMAGE`
5. **QA** — checklist em `squads/mural-vida-extraordinaria/checklists/mural-output-gate.md`

## Contrato JSON

```json
{
  "prompt": "string",
  "references": [
    {
      "id": "x",
      "role": "identity",
      "mimeType": "image/jpeg",
      "dataBase64": "<base64 sem prefixo ou com data:uri>"
    }
  ],
  "options": { "variants": 2, "aspectRatio": "16:9" }
}
```

**MuralBrief** (saída da análise): `identity_lock`, `scene_spec`, `generation_prompt`, `negative_constraints`, `quality_checks`.

## Regras de prompt

- Separar claramente **preservar** (identity) e **reinterpretar** (cena)
- Vetos: não alterar etnia/idade/gênero sem pedido; sem texto ilegível; sem anatomia incorreta

## Integração

| Canal | Como |
|-------|------|
| Squad | `@mural-vida-extraordinaria:mural-chief` → `*mural-compor` |
| API | `POST /api/mural/compose` (portal `web/`) |
| CLI | `cd web && npm run mural:compose -- --prompt "..." --identity ref.jpg` |
| Skill data | `squads/mural-vida-extraordinaria/data/image-roles.yaml` |

## Env

- `ANTHROPIC_API_KEY` — análise
- `GOOGLE_API_KEY` ou `GEMINI_API_KEY` — geração
- `MURAL_GEMINI_MODEL` — opcional
- `MURAL_DEMO_MODE=1` — modo offline: análise sintética + pôster SVG do brief (sem chaves)

## Multi-agente

Tier 0 `mural-chief` (`*mural-compor`, `*mural-analisar`, `*mural-serie`) → Tier 1 paralelo (`trait-extractor`, `scene-composer`) → `prompt-architect` → Tier 2 `image-generator`, `quality-curator` → Tier 3 `asset-archivist`. Workflow: `squads/mural-vida-extraordinaria/workflows/wf-mural-compose.yaml`.
