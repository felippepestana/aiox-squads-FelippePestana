# Onboard — Onboarding & Integração

> 🟢 **Módulo ativo** da plataforma [Apex-Talent](../apex-talent/). Transforma uma boa contratação em um(a) bom(a) contribuinte nos **primeiros 90 dias**.

Onboard cria uma **jornada 30/60/90 personalizada** por cargo e perfil comportamental, coordena **checklists dinâmicos, documentos e contrato**, oferece um **buddy/IA** de dúvidas e faz **acompanhamento proativo** dos marcos. Carrega o contexto da contratação (`talent-compass`) e o perfil (`profiler-dna`, **peso 0**).

**Princípios:** personaliza por cargo + contexto (personalidade é **peso 0**, orienta e não julga); **aumenta o gestor — não o substitui**; acompanha proativamente (onboarding falha em silêncio); consentimento, acessibilidade e inclusão com **gate de veto**.

## Cadeia de comando (tiers)

| Tier | Agente | Papel |
|------|--------|-------|
| 0 | `onboard-chief` | Orquestra a jornada de integração |
| 1 | `journey-architect` | Jornada 30/60/90 personalizada |
| 1 | `checklist-runner` | Checklists dinâmicos, documentos e contrato |
| 2 | `buddy-ai` | Buddy/IA de dúvidas (augmenta o gestor) |
| 2 | `milestone-tracker` | Acompanhamento 30/60/90 + risco proativo |
| 3 | `inclusion-gate` | Gate de consentimento/acessibilidade/inclusão — **veto** |

## Fluxo (workflow `wf-onboarding-journey`)

```text
INTAKE ─▶ JORNADA 30/60/90 ─▶ CHECKLIST/DOCS ─▶ INCLUSÃO (veto) ─▶ RODAR (buddy + acompanhamento)
```

## Como usar

Selecione `onboard:onboard-chief` no chatbot ou na web.

Comandos do Chief:

- `*build-journey` — jornada 30/60/90 personalizada
- `*checklist` — checklist dinâmico + documentos + contrato
- `*buddy` — responder dúvida do novo colaborador
- `*track-30-60-90` — acompanhar marcos e riscos
- `*inclusion-review` — gate de inclusão/consentimento
- `*help` / `*exit`

## Conexão com outros módulos

- **talent-compass:** fornece o relatório do candidato (forças + gaps de ramp).
- **profiler-dna:** fornece contexto comportamental (peso 0) para personalizar a jornada.
- **peopleops:** recebe a admissão digital / eSocial / folha (handoff).
- **benefits-hub:** elegibilidade/adesão de benefícios.
- **performa:** aos 90 dias, transição para o ciclo de desempenho.

## Minutas

[`templates/welcome-letter.md`](templates/welcome-letter.md) — carta de boas-vindas (pré-boarding).

## Referências

- Michael Watkins — *The First 90 Days* (ver [`data/first-90-days-methodology.md`](data/first-90-days-methodology.md))
- Boas práticas de onboarding e acessibilidade/inclusão ([`data/accessibility-inclusion.md`](data/accessibility-inclusion.md))
