# Performa — Gestão de Desempenho

> 🟡 **Em desenvolvimento (esqueleto).** Este módulo da plataforma [Apex-Talent](../apex-talent/) disponibiliza hoje apenas o agente **Chief** (`performa-chief`), que faz o intake da área e escopa o fluxo de especialistas a ser construído. Os agentes especialistas, tarefas e modelos serão adicionados nas próximas iterações.

## Área

**Gestão de Desempenho** — parte da suíte de RH AI-native Apex-Talent.

Gestão de desempenho ponta a ponta: avaliações 90/180/360, matriz 9-Box, PDI, OKRs, feedback contínuo, 1:1, ciclos e calibração.

## Funcionalidades-alvo

- Avaliação 90° / 180° / 360°
- Matriz 9-Box
- PDI (Plano de Desenvolvimento Individual)
- OKR / metas e acompanhamento
- Feedback contínuo e 1:1
- Ciclos e calibração
- Planejamento de sucessão

## Diferencial de IA

Veja o [mapa de oportunidades de IA](../apex-talent/data/ai-opportunity-map.md) para o detalhe da abordagem AI-native desta área.

## Como usar

Selecione `performa:performa-chief` no chatbot ou na web.

Comandos do Chief:

- `*run-review — Conduct a 90/180/360 review`
- `*plot-9box — Position on the 9-box with rationale`
- `*build-pdi — Generate a development plan`
- `*draft-okr — Draft and audit OKRs`
- `*prep-1on1 — Build a 1:1 agenda`
- `*help` — lista os comandos
- `*exit` — encerra o agente

## Roteiro

1. **Agora:** Chief (intake + escopo do fluxo). ✅
2. **Próximo:** agentes especialistas (Tier 1/2), tarefas e modelos da área.
3. **Depois:** workflow `wf-*` e integração de dados com os demais módulos.

## Referência

Baseado em: *Feedz/Lattice practices + 9-Box + OKR (John Doerr — Measure What Matters)*.
