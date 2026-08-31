# Exports do catálogo de agentes

Este diretório contém artefatos gerados a partir das definições de agentes em `squads/*/agents/*.md`.

## Arquivos

- `agentes-detalhado.json`: catálogo estruturado para integração, auditoria e automações.
- `agentes-detalhado.md`: versão editorial em Markdown para leitura humana.
- `agentes-detalhado.pdf`: versão portátil para download, impressão ou compartilhamento.

## Como regenerar

Execute a partir da raiz do repositório:

```bash
python scripts/export-agent-catalog.py
```

Para builds determinísticos, informe `--generated-at` ou defina `SOURCE_DATE_EPOCH`:

```bash
python scripts/export-agent-catalog.py --generated-at 2026-06-21T00:00:00+00:00
```

## Validações recomendadas

```bash
python -m json.tool exports/agentes-detalhado.json >/tmp/agentes-detalhado.validated.json
python scripts/validate-agent-catalog.py
```

## Estrutura do JSON

O JSON usa `schema_version` e contém:

- `source`: padrão de arquivos analisados.
- `summary`: totais globais.
- `squads`: resumo por squad.
- `agents`: lista normalizada com finalidade, skills, interação, comandos e qualidade de metadados.
- `warnings`: avisos de parse/geração.
