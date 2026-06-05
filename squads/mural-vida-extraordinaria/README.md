# Mural Da Vida Extraordinária

Gerador de imagens por **composição multimodal**: combine várias fotos de referência com papéis distintos e um prompt para criar cenas novas preservando identidade visual.

## Ativação

```text
@mural-vida-extraordinaria:mural-chief
```

Comandos: `*mural-compose`, `*mural-analyze`, `*mural-batch`

## Papéis de referência

| Papel | Uso |
|-------|-----|
| `identity` | **Obrigatório** — traços pessoais a preservar |
| `environment` | Cenário, clima, fundo |
| `activity` | Ação, esporte, contexto |
| `body_pose` | Corpo, pose, físico |
| `style` | Paleta, iluminação, estética |
| `location` | Local, geografia |

## Variáveis de ambiente

| Variável | Descrição |
|----------|-----------|
| `ANTHROPIC_API_KEY` | Análise das referências (Claude) |
| `GOOGLE_API_KEY` ou `GEMINI_API_KEY` | Geração de imagem (Gemini) |
| `MURAL_GEMINI_MODEL` | Modelo (padrão: `gemini-2.0-flash-preview-image-generation`) |
| `MURAL_OUTPUT_DIR` | Pasta de saída (padrão: `web/data/mural-output`) |

## API (portal web)

Com o servidor em `http://127.0.0.1:8787`:

- `POST /api/mural/analyze` — brief sem gerar
- `POST /api/mural/compose` — pipeline completo
- `POST /api/mural/compose?async=1` — job assíncrono
- `GET /api/mural/jobs/:id` — status
- `GET /api/mural/jobs/:id/assets/:file` — imagem PNG

## Automação CLI

```bash
cd web
npm run mural:compose -- \
  --prompt "Pessoa da identity correndo na praia ao amanhecer" \
  --identity ./refs/pessoa.jpg \
  --environment ./refs/praia.jpg \
  --activity ./refs/corrida.jpg \
  --variants 2 \
  --out ./output/mural-run-1
```

## Exemplo conceitual

- **X** (identity): rosto e traços da pessoa  
- **Y** (environment): praia ao amanhecer  
- **W** (activity): corrida  
- **Z** (body_pose): corpo atlético em movimento  

Prompt: *"Inserir a identidade de X no corpo e cena inspirados por W e Z, no ambiente de Y."*

## Estrutura

```text
squads/mural-vida-extraordinaria/
├── agents/          # 7 agentes (tiers 0–3)
├── tasks/
├── templates/
├── data/
├── checklists/
├── workflows/
└── scripts/
```

Skill Cursor: `.cursor/skills/mural-vida-extraordinaria/SKILL.md`
