# Performa — Gestão de Desempenho

> 🟢 **Módulo ativo** da plataforma [Apex-Talent](../apex-talent/). Gestão de desempenho **por evidência**, com calibração de viés.

Performa transforma "como essa pessoa está indo?" em respostas **ancoradas em evidência, calibradas e acionáveis**: avaliações 90/180/360, matriz 9-Box explicável, OKRs por resultado, PDI personalizado e 1:1.

**Princípios:** competência/evidência decide; **personalidade (via `profiler-dna`) é contexto, peso 0**; toda nota passa por um **gate de calibração/viés**; promoções e remuneração permanecem **decisões humanas**.

## Cadeia de comando (tiers)

| Tier | Agente | Papel |
|------|--------|-------|
| 0 | `performa-chief` | Orquestra o ciclo de desempenho |
| 1 | `review-runner` | Avaliações 90/180/360 por evidência |
| 1 | `ninebox-plotter` | Matriz 9-Box (desempenho × potencial) |
| 2 | `okr-architect` | OKRs por resultado (não tarefas) |
| 2 | `pdi-builder` | PDI personalizado (consome `profiler-dna`) |
| 3 | `calibration-gate` | Gate de calibração/viés — **veto** |

## Escala de avaliação

`1 — below` · `2 — developing` · `3 — meets` · `4 — exceeds` · `5 — outstanding` — **toda nota ancorada em evidência recente** (ver [`data/rating-anchors.md`](data/rating-anchors.md)). Sem exemplo → "evidência insuficiente", não um 3.

## Fluxo (workflow `wf-performance-cycle`)

```text
SETUP ─▶ REVIEW (evidência) ─▶ 9-BOX ─▶ CALIBRAR (veto) ─▶ DESENVOLVER (PDI + OKRs + 1:1)
```

## Como usar

Selecione `performa:performa-chief` no chatbot ou na web.

Comandos do Chief:

- `*run-cycle` — ciclo completo
- `*run-review` — avaliação 90/180/360
- `*plot-9box` — posicionamento na matriz 9-Box
- `*draft-okr` — OKRs por resultado
- `*build-pdi` — plano de desenvolvimento
- `*prep-1on1` — pauta de 1:1
- `*calibrate` — gate de calibração/viés
- `*help` / `*exit`

## Conexão com outros módulos

- **profiler-dna:** fornece contexto comportamental (peso 0) para PDI e 1:1.
- **org-architect:** competências e expectativas por cargo alimentam as avaliações.
- **academy:** gaps do PDI viram trilhas de aprendizagem.
- **talent-compass:** continuidade do scorecard de contratação → desenvolvimento.

## Referências

- John Doerr — *Measure What Matters* (OKRs)
- Matriz 9-Box (desempenho × potencial)
- Feedback **SBI** (ver [`data/feedback-sbi.md`](data/feedback-sbi.md))
- Práticas de feedback contínuo (Feedz/Lattice)
