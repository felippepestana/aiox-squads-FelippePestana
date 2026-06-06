# Profiler-DNA — Inteligência Comportamental

> 🟢 **Módulo ativo** da plataforma [Apex-Talent](../apex-talent/). É o **motor comportamental transversal** — reutilizável por R&S, onboarding, desempenho e gestão.

Profiler-DNA mapeia **estilo de trabalho (DISC)**, **traços (Big Five/OCEAN)** e oferece uma **lente de desenvolvimento (Eneagrama)**, sintetizando tudo em um perfil acionável para **comunicação, gestão e onboarding**.

**Princípio inegociável:** é **contexto de desenvolvimento, peso 0** — nunca filtro de seleção, promoção ou remuneração. Todo perfil passa por um **gate de ética/consentimento/anti-estereótipo** com poder de veto.

## Cadeia de comando (tiers)

| Tier | Agente | Papel |
|------|--------|-------|
| 0 | `profiler-dna-chief` | Orquestra as lentes e sintetiza o perfil |
| 1 | `disc-mapper` | Estilo de trabalho DISC (D/I/S/C) |
| 1 | `bigfive-assessor` | Traços OCEAN (Big Five) |
| 2 | `enneagram-lens` | Lente Eneagrama de desenvolvimento (consentida) |
| 2 | `fit-advisor` | Fit cultura/cargo/time (advisory) |
| 3 | `ethics-gate` | Gate de ética/consentimento/anti-estereótipo — **veto** |

## Fluxo (workflow `wf-behavioral-profile`)

```text
CONSENT ─▶ DISC ─▶ BIG FIVE ─▶ ENEAGRAMA(opt) ─▶ SÍNTESE ─▶ FIT(opt) ─▶ ÉTICA(veto) ─▶ PLANO DE DEV
```

## Como usar

Selecione `profiler-dna:profiler-dna-chief` no chatbot ou na web.

Comandos do Chief:

- `*map-profile` — perfil completo (DISC + Big Five + síntese)
- `*read-disc` — só o estilo DISC
- `*assess-bigfive` — só os traços OCEAN
- `*enneagram-lens` — lente Eneagrama (consentida)
- `*fit-analysis` — fit advisory (cultura/cargo/time)
- `*dev-plan` — dicas de gestão + plano de desenvolvimento
- `*ethics-review` — roda o gate de ética
- `*help` / `*exit`

## Conexão com outros módulos

- **talent-compass:** fornece a leitura comportamental como **contexto (peso 0)** — a seleção continua por evidência.
- **onboard:** personaliza a jornada 30/60/90 pelo perfil.
- **performa:** informa PDI e dicas de gestão.

## Ética por design

Veja [`data/anti-stereotype-guardrails.md`](data/anti-stereotype-guardrails.md): consentimento obrigatório, tendências (não tipos), peso 0, sem proxy de atributos protegidos, sem claims clínicos. O `ethics-gate` veta o que violar.

## Referências

Baseado em: *DiSC (Marston)*, *Big Five / Five-Factor Model (OCEAN)* e *The Enneagram in Business* — usados estritamente como contexto.
