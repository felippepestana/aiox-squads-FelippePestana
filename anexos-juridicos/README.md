# Anexos Jurídicos — Materiais de Origem

Esta pasta recebe os materiais enviados (skills, petições modelo, PDFs de
framework, branding) para ingestão no ecossistema Legal Performance.

> Os arquivos do `Downloads` local não são acessíveis ao agente na nuvem.
> Faça commit dos arquivos nas subpastas abaixo (ou anexe um `.zip` no chat) e
> a ingestão será concluída conforme o mapeamento.

## Estrutura sugerida

| Subpasta | Conteúdo | Destino na ingestão |
|---|---|---|
| `skills/` | Arquivos `.skill` (cisão, elaboração de peças, relatórios, checklist) | `squads/squad-juridico-legal-performance/tasks/` e `checklists/` |
| `peticoes-modelo/` | Petições `.docx` (revisional, execução, contestação, etc.) | `squads/squad-juridico-legal-performance/templates/` (biblioteca de peças) |
| `frameworks/` | PDFs de roadmap, priorização e hierarquia de agentes | `squads/.../data/` (referência) e backlog |
| `branding/` | Logos, `design-md`, identidade visual | `analista-processual-web/public/` + design tokens |
| `prd/` | PRDs (ex.: cobrança condominial) | novos use cases / squads |

## Mapeamento já implementado (sem depender dos anexos)

- 8 use cases (UC-LP-001..008) no produto web: `analista-processual-web/src/lib/agents/use-cases.ts`
- Função harmonizadora: `harmonizeLegalRequest()` em `legal-performance-orchestrator.ts`
- Design system da marca: `analista-processual-web/src/lib/design/tokens.ts`
- Registry do ecossistema atualizado: `.aiox/squad-runtime/ecosystem-registry.yaml`

## Não commitar

- Segredos, API keys, `.env`, credenciais.
- `openssl-4.0.0.tar.gz` (sem relação com o objetivo jurídico).
