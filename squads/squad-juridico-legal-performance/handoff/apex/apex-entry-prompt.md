# Prompt de entrada — @apex

Copie o bloco abaixo ao acionar o squad Apex no repositório `analista-processual-web`.

---

```text
@apex

Contexto: handoff do Squad Jurídico Legal Performance (UC-LP-008).
Leia antes de codar:
- squads/squad-juridico-legal-performance/handoff/apex/README.md
- squads/squad-juridico-legal-performance/handoff/apex/wireframes.md
- squads/squad-juridico-legal-performance/handoff/apex/acceptance-criteria.md
- squads/squad-juridico-legal-performance/DESIGN_GUIDE.md
- squads/squad-juridico-legal-performance/examples/expected-outputs/brief-dashboard-juridico.md

Objetivo (MVP): evoluir analista-processual-web (Next.js 15 + shadcn já instalado)
para dashboard jurídico com:
1) Home com KPIs (prazos 7d, riscos altos, revisão pendente) e tabela de casos com gates
2) Detalhe do caso com abas: visão geral, documentos, timeline, riscos, quality gates
3) Human review banner + exportação bloqueada até gates/revisão OK (mock state OK)
4) Evidence drawer reutilizável (fonte, trecho, tipo, confiabilidade)
5) Evoluir /dashboard/nova-analise como upload wizard 3 passos com lacunas

Restrições:
- Reutilizar componentes em src/components/ui e layout existente
- WCAG AA; risco com ícone+texto, não só cor
- Não implementar backend novo nesta sprint; dados mock onde API incompleta
- Não remover fluxo de agentes em src/lib/agents
- Tokens via CSS variables / Tailwind theme, sem hex hardcoded em componentes novos

Pipeline sugerido: *apex-scan → apresentar plano → *apex-quick após meu "sim"

Ao concluir, rodar npm run build e listar critérios de acceptance-criteria.md atendidos.
```

---

## Checklist pós-execução (humano)

1. Revisar PR com foco em a11y e estados bloqueados.
2. Rodar `bash squads/squad-juridico-legal-performance/scripts/run-smoke-baselines.sh`.
3. Deploy preview Vercel conforme `docs/deploy/vercel.md`.
