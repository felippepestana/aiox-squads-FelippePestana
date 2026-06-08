# Apex-Talent — Plataforma de Gestão de Pessoas AI-Native

Apex-Talent é a plataforma guarda-chuva de RH/People do ecossistema AIOX Squads. Em vez de um único produto monolítico, ela é uma **suíte de módulos especializados** — cada área de RH é um squad AIOX independente, auto-contido e conversável. O squad `apex-talent` é o **orquestrador**: entende a necessidade do usuário, roteia para o módulo certo e costura visões que atravessam o ciclo de vida do colaborador.

A proposta de valor é cobrir o máximo de funcionalidades de uma suíte de RH moderna (no espírito de plataformas como Sólides, Gupy, Feedz, BambooHR) e se diferenciar pelo **uso intensivo de IA — agentes e squads multi-agente** em cada funcionalidade.

## Mapa de módulos

| Módulo | Área | Status |
|--------|------|--------|
| [`talent-compass`](../talent-compass/) | Recrutamento & Seleção + Entrevistas | 🟢 Ativo (flagship) |
| [`profiler-dna`](../profiler-dna/) | Inteligência Comportamental | 🟢 Ativo |
| [`performa`](../performa/) | Gestão de Desempenho | 🟢 Ativo |
| [`pulse`](../pulse/) | Clima & Engajamento | 🟡 Em desenvolvimento |
| [`peopleops`](../peopleops/) | Departamento Pessoal & Folha | 🟢 Ativo |
| [`chronos`](../chronos/) | Controle de Ponto | 🟡 Em desenvolvimento |
| [`onboard`](../onboard/) | Onboarding & Integração | 🟢 Ativo |
| [`academy`](../academy/) | Treinamento & Desenvolvimento | 🟡 Em desenvolvimento |
| [`insights`](../insights/) | People Analytics | 🟡 Em desenvolvimento |
| [`org-architect`](../org-architect/) | Cargos, Salários & Org Design | 🟢 Ativo |
| [`benefits-hub`](../benefits-hub/) | Benefícios | 🟡 Em desenvolvimento |

> 🟢 **Ativo** = fluxos completos construídos. 🟡 **Em desenvolvimento** = esqueleto disponível (apenas o agente Chief), pronto para desenhar e evoluir o módulo.

> 🛠️ **Promover um módulo 🟡 → 🟢:** veja [`templates/module-activation-checklist.md`](./templates/module-activation-checklist.md). Passo-a-passo do design (Tier 0→3) ao wiring no orquestrador, baseado nos patterns de `talent-compass`, `profiler-dna` e `performa`.

## O ciclo de vida do colaborador

Os módulos não são silos — eles formam uma cadeia:

```text
ATRAIR ──▶ CONTRATAR ──▶ INTEGRAR ──▶ DESENVOLVER ──▶ ENGAJAR ──▶ OPERAR ──▶ ANALISAR
            talent-       onboard      performa /      pulse        peopleops    insights
            compass                    academy                      chronos
            profiler-dna (lente comportamental transversal)         benefits-hub
            org-architect (estrutura de cargos transversal)
```

## Como usar

O orquestrador é o agente `apex-talent-chief`. No chatbot ou na web, selecione `apex-talent:apex-talent-chief` e descreva sua necessidade.

Comandos do Chief:

- `*catalog` — lista todos os módulos e seus status
- `*route` — diagnostica a necessidade e encaminha ao módulo certo
- `*roadmap` — mostra o que está construído vs. planejado
- `*lifecycle` — mapeia um pedido ao longo do ciclo de vida do colaborador

## Documentação de referência

- [`data/platform-blueprint.md`](data/platform-blueprint.md) — blueprint completo por área (funcionalidades-núcleo).
- [`data/ai-opportunity-map.md`](data/ai-opportunity-map.md) — mapa de oportunidades de IA por funcionalidade (agente simples vs. squad).
- [`data/market-benchmark.md`](data/market-benchmark.md) — referências de mercado cruzadas.

## Princípios

- **Human-in-the-loop:** a IA é suporte à decisão; decisões de pessoas ficam com humanos responsáveis.
- **Compliance by design:** módulos que tocam contratação e remuneração carregam quality gates de viés e conformidade.
- **Auto-contido:** cada módulo segue a anatomia de 6 camadas dos squads AIOX e funciona de forma independente.
