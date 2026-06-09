# Handoff Apex — Dashboard Jurídico Legal Performance

Pacote de implementação frontend para o squad **`apex`**, derivado do brief aprovado em [`examples/expected-outputs/brief-dashboard-juridico.md`](../../examples/expected-outputs/brief-dashboard-juridico.md) e do [`DESIGN_GUIDE.md`](../../DESIGN_GUIDE.md).

## Status

| Item | Status |
|---|---|
| Brief UC-LP-008 | Baseline em `expected-outputs/` |
| Wireframes | [`wireframes.md`](wireframes.md) |
| Critérios de aceite | [`acceptance-criteria.md`](acceptance-criteria.md) |
| Prompt de entrada | [`apex-entry-prompt.md`](apex-entry-prompt.md) |
| App alvo | [`analista-processual-web/`](../../../../analista-processual-web/) (Next.js 15 + shadcn) |

**Implementação:** usar `*apex-quick` ou `*apex-go` no repositório `analista-processual-web`, após confirmação do usuário no checklist de readiness.

## Escopo da primeira entrega (MVP)

1. **Dashboard home** — KPIs, prazos críticos, riscos altos, pendências de revisão.
2. **Detalhe do caso** — abas: visão geral, documentos, timeline, riscos, quality gates, exportação.
3. **Upload wizard** — passo a passo com validação e lacunas.
4. **Evidence drawer** — painel lateral com fonte/trecho/confiabilidade.
5. **Human review banner** — bloqueio de exportação até aprovação.

## Fora de escopo (MVP)

- Integração LLM/agentes em produção (já parcial em `src/lib/agents/`).
- Perícia forense completa (UC-LP-007).
- Deploy Vercel (ver [`docs/deploy/vercel.md`](../../../../docs/deploy/vercel.md)).

## Como acionar o Apex

```text
@apex Implementar o handoff em squads/squad-juridico-legal-performance/handoff/apex/
no projeto analista-processual-web. Ler apex-entry-prompt.md, wireframes.md e acceptance-criteria.md.
Seguir DESIGN_GUIDE do squad jurídico. Não alterar lógica de agentes nesta sprint.
```

## Validação pós-implementação

```bash
bash squads/squad-juridico-legal-performance/scripts/run-smoke-baselines.sh
```

Para entregáveis Markdown gerados pelo squad, validar com:

```bash
bash squads/squad-juridico-legal-performance/scripts/validate-deliverable.sh <arquivo.md> --profile auto
```

## Referências cruzadas

- Task Apex: `squads/apex/tasks/apex-handoff-protocol.md`
- Pipeline sugerido: `*apex-quick` (MVP) → `*discover-a11y` → `*apex-review`
- Tokens: alinhar a `analista-processual-web/src/app/globals.css` e Tailwind existentes
