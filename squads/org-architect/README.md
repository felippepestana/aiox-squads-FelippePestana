# Org-Architect — Cargos, Salários & Org Design

> 🟢 **Ativo.** Módulo construído da plataforma [Apex-Talent](../apex-talent/). É a **espinha dorsal** da arquitetura de pessoas: define cargos skills-based, faixas salariais explicáveis, estrutura organizacional e a decisão 4R — com um **gate de equidade salarial** obrigatório antes de qualquer publicação. Alimenta o `talent-compass` (definição de vaga) e o `performa` (níveis e competências).

## Área

**Cargos, Salários & Org Design** — parte da suíte de RH AI-native Apex-Talent.

Arquitetura organizacional ponta a ponta: descrições de cargo skills-based, plano de carreira, faixas salariais com benchmarking, organograma (spans & layers), decisão 4R (Redesign → Reskill → Retain → Recruit) para gaps de capacidade e auditoria de equidade salarial.

## Princípio central

**Remuneração mapeia cargo, skills e impacto — nunca atributos protegidos.** A IA é suporte à decisão; decisões individuais de pay e nível ficam com humanos responsáveis, e questões legais de remuneração passam por revisão jurídica. Nada de bandas ou níveis é publicado sem passar pelo `equity-gate`.

## Agentes

| Agente | Tier | Papel |
|--------|------|-------|
| `org-architect-chief` | T0 | Orquestra o fluxo; enquadra a necessidade; impõe o gate de equidade |
| `role-designer` | T1 | Descrição de cargo skills-based, success profile e plano de carreira |
| `comp-strategist` | T1 | Faixas salariais, leveling e benchmarking (explicáveis linha a linha) |
| `org-modeler` | T2 | Organograma, spans & layers, diagnóstico de estrutura |
| `fourr-advisor` | T2 | Decisão 4R — recrutar é o resíduo, não o reflexo |
| `equity-gate` | T3 | **Gate de equidade salarial** (auditoria com poder de veto) |

## Fluxo (workflow `wf-org-design`)

```text
INTAKE ─▶ ROLE DESIGN ─▶ LEVELING & BANDS ─▶ STRUCTURE / 4R ─▶ PAY EQUITY GATE ─▶ PUBLISH
chief      role-designer    comp-strategist     org-modeler /      equity-gate (veto)
                                                 fourr-advisor
```

## Como usar

Selecione `org-architect:org-architect-chief` no chatbot ou na web e descreva a necessidade.

Comandos do Chief:

- `*write-jd` — descrição de cargo skills-based + success profile
- `*set-bands` — define/benchmark faixas salariais + leveling
- `*model-org` — modela a estrutura (spans & layers)
- `*4r` — aplica o framework 4R a um gap de capacidade
- `*pay-equity` — roda a auditoria de equidade salarial
- `*help` — lista os comandos
- `*exit` — encerra o agente

## Conexões com a plataforma

- **→ `talent-compass`** — um cargo definido vira vaga + roteiro de entrevista.
- **→ `performa`** — níveis e competências alimentam mérito, promoção e calibração.
- **→ `academy`** — a trilha de **reskill** do 4R vira plano de aprendizagem.
- **→ `pulse` / `performa`** — o **retain** do 4R conecta engajamento e crescimento.
- **→ `peopleops`** — mudanças de contrato/folha decorrentes de enquadramento.

## Documentação de referência

- [`data/skills-based-job-architecture.md`](data/skills-based-job-architecture.md) — job architecture skills-based.
- [`data/4r-framework.md`](data/4r-framework.md) — o framework 4R (Bersin).
- [`data/compensation-benchmarking.md`](data/compensation-benchmarking.md) — bandas, midpoint, spread, compa-ratio.
- [`data/pay-equity-methodology.md`](data/pay-equity-methodology.md) — método de auditoria de equidade.

## Minutas / impressos

- [`templates/role-leveling-letter.md`](templates/role-leveling-letter.md) — carta de enquadramento / movimentação de cargo (imprimível).

## Referência

Baseado em: *Josh Bersin 4R (Redesign, Reskill, Retain, Recruit) + skills-based job architecture*, design de remuneração (leveling, benchmarking, compa-ratio) e metodologia de equidade salarial.
