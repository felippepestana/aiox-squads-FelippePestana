# Pulse — Clima & Engajamento

> 🟢 **Ativo.** Módulo construído da plataforma [Apex-Talent](../apex-talent/). É a **escuta organizacional contínua**: desenha pesquisas de clima/eNPS/pulse sem viés, analisa temas e sentimento, detecta sinais de desengajamento cedo e transforma resultados em planos de ação com dono — com um **gate de anonimato** obrigatório (tamanho mínimo de grupo + reidentificação) antes de publicar qualquer corte. A ação é da liderança; a IA é suporte à decisão.

## Área

**Clima & Engajamento** — parte da suíte de RH AI-native Apex-Talent.

Escuta contínua ponta a ponta: desenho de instrumentos, análise de temas/sentimento/eNPS, sinais precoces por segmento, planos de ação priorizados e auditoria de anonimato.

## Princípio central

**Uma pesquisa que você não age é pior do que nenhuma pesquisa.** Toda análise lidera com temas (a média esconde a história) e todo ciclo termina em 2-3 ações com dono e prazo. O anonimato dos respondentes é protegido **by design**: nenhum corte abaixo do tamanho mínimo de grupo, nenhuma reidentificação, citações sempre anônimas. Nada é publicado sem passar pelo `anonymity-gate`. Personalidade/comportamento é apenas contexto, **nunca filtro** de seleção ou remuneração.

## Agentes

| Agente | Tier | Papel |
|--------|------|-------|
| `pulse-chief` | T0 | Orquestra o ciclo; enquadra a necessidade; impõe o gate de anonimato |
| `survey-designer` | T1 | Instrumentos de clima/eNPS/pulse sem viés (anonimato by design) |
| `sentiment-analyst` | T1 | Temas, sentimento e eNPS (citações anônimas, cortes seguros) |
| `signal-scout` | T2 | Sinais precoces de desengajamento por segmento (sinal, não ruído) |
| `action-planner` | T2 | Plano de ação priorizado, com dono, prazo e fechamento de loop |
| `anonymity-gate` | T3 | **Gate de anonimato** — tamanho mínimo de grupo + reidentificação (poder de veto) |

## Fluxo (workflow `wf-listening-cycle`)

```text
INTAKE ─▶ SURVEY DESIGN ─▶ ANALYSIS ─▶ SIGNALS & ACTION ─▶ ANONYMITY GATE
chief      survey-          sentiment-   signal-scout /      anonymity-gate (veto)
           designer         analyst       action-planner
```

## Como usar

Selecione `pulse:pulse-chief` no chatbot ou na web e descreva a necessidade.

Comandos do Chief:

- `*design-survey` — desenha um instrumento de clima/eNPS/pulse sem viés
- `*analyze-results` — análise de temas + sentimento
- `*detect-signals` — sinais precoces de desengajamento por segmento
- `*action-plan` — plano de ação priorizado e com dono
- `*enps` — calcula e interpreta o eNPS
- `*anonymity-audit` — roda o gate de anonimato (PASS/VETO)
- `*help` — lista os comandos
- `*exit` — encerra o agente

## Conexões com a plataforma

- **→ `performa`** — sinais de engajamento conectam a desempenho, crescimento e 1:1s.
- **→ `peopleops`** — um sinal pode apontar para DP/folha (ex.: padrões de pay ou afastamento).
- **↔ `profiler-dna`** — contexto comportamental é apenas consultivo, nunca filtro.
- **→ `apex-talent`** — necessidades fora de clima/engajamento voltam pelo orquestrador da plataforma.

## Documentação de referência

- [`data/engagement-frameworks.md`](data/engagement-frameworks.md) — eNPS, Gallup Q12 e drivers.
- [`data/survey-design-principles.md`](data/survey-design-principles.md) — desenho sem viés, escalas, anonimato by design.
- [`data/sentiment-analysis-methodology.md`](data/sentiment-analysis-methodology.md) — codificação temática e citações seguras.
- [`data/anonymity-ethics.md`](data/anonymity-ethics.md) — tamanho mínimo de grupo, reidentificação, consentimento.

## Minutas / impressos

- [`templates/listening-summary.md`](templates/listening-summary.md) — resumo de escuta para fechar o loop (imprimível, publicar após PASS).

## Guardrail de anonimato

- [`checklists/anonymity-gate.md`](checklists/anonymity-gate.md) — checklist PASS/VETO do `anonymity-gate`.

## Referência

Baseado em: *eNPS*, *Gallup Q12* e prática de escuta contínua (survey-to-action, fechamento de loop), com salvaguardas de anonimato (tamanho mínimo de grupo, controle de reidentificação) e o princípio de comportamento como contexto, nunca filtro.
