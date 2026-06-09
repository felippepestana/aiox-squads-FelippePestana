# Orquestração do Ciclo de Vida do Colaborador

Referência canônica para o `apex-talent-chief` rotear necessidades e encadear módulos. Define as **etapas do ciclo de vida**, o **módulo dono** de cada uma e o **dado de handoff** que flui entre eles. É a base das tasks de orquestração (`route-need`, `map-lifecycle`, `consolidate-cross-module`) e dos workflows cross-módulo.

> Princípio: os módulos não são silos — formam uma cadeia. O orquestrador nomeia a etapa, roteia ao dono e explicita o dado que passa adiante. A IA é suporte à decisão; a decisão fica com o humano responsável.

---

## Etapas do ciclo de vida → módulo dono

| # | Etapa | Módulo dono | Lente transversal |
|---|-------|-------------|-------------------|
| 1 | **ATRAIR** | `talent-compass` (sourcing, página de carreira, banco de talentos) | — |
| 2 | **CONTRATAR** | `talent-compass` (vaga por objetivos → entrevista → scorecard → gate de viés) | `profiler-dna` (estilo comportamental, advisory) |
| 3 | **INTEGRAR** | `onboard` (jornada 30/60/90, checklists, documentos) | `academy` (trilhas de integração) |
| 4 | **DESENVOLVER** | `performa` (avaliação, 9-box, PDI) + `academy` (trilhas por gap) | `org-architect` (matriz de cargo) |
| 5 | **ENGAJAR** | `pulse` (clima, eNPS, planos de ação) | `profiler-dna` (fit/estilo) |
| 6 | **OPERAR** | `peopleops` (folha, eSocial, férias) + `chronos` (ponto, jornada, banco) | `benefits-hub` (benefícios) |
| 7 | **ANALISAR** | `insights` (headcount, turnover/burnout preditivo, narrativa) | cruza todos |

`org-architect` (cargos/faixas) e `profiler-dna` (comportamental) são **transversais** — alimentam várias etapas como contexto, não como dono de etapa.

---

## Handoffs canônicos (dado que flui entre módulos)

| De → Para | Gatilho | Dado de handoff |
|-----------|---------|-----------------|
| `talent-compass` → `onboard` | Candidato aprovado | Perfil do contratado + scorecard + objetivos de performance da vaga |
| `talent-compass` → `academy` | Gaps no scorecard | Competências abaixo do alvo → trilha de desenvolvimento |
| `onboard` → `performa` | Fim do 30/60/90 | Marcos de integração → primeiro ciclo de desempenho |
| `performa` → `academy` | PDI / gap de ciclo | Gap de competência (com nível atual/alvo) → trilha 70-20-10 |
| `performa` → `org-architect` | Progressão / sucessão | Posição 9-box → carreira/faixa salarial |
| `chronos` → `insights` | Anomalia HIGH (fadiga/super-jornada) | Sinal agregado de fadiga → risco de burnout |
| `pulse` → `insights` | Queda de eNPS | Sinal de engajamento → risco de turnover |
| `chronos` → `peopleops` | Fechamento de período (gate PASS) | Banco de horas + espelho → folha + eSocial |
| `insights` → `academy` / `org-architect` | Driver de risco identificado | Driver acionável (estagnação) → trilha / revisão de carreira |
| `benefits-hub` → `peopleops` | Adesão efetivada | Benefício elegível → desconto em folha |

---

## Regras de roteamento (para `route-need`)

1. **Uma necessidade → uma etapa → um módulo dono.** Nomeie a etapa antes de rotear.
2. **Multi-etapa → encadeie.** Se o pedido atravessa etapas (ex: "contratar e já integrar"), sequencie os módulos e explicite o handoff (use `map-lifecycle`).
3. **Honestidade de capacidade.** Roteie ao dono e descreva o que o módulo realmente entrega (tasks/workflow) — sem prometer além.
4. **Fora do catálogo → diga.** Se a necessidade não cabe nas 11 áreas, diga explicitamente e sugira o módulo mais próximo ou um item de roadmap.
5. **Quality gate é do módulo.** Decisões sensíveis (contratação, folha, predição) passam pelo gate de veto do módulo dono — o orquestrador não decide por ele.

## Visões cross-módulo (para `consolidate-cross-module`)

O orquestrador consolida quando o valor está no cruzamento, p.ex.:
- **Visão 360 do colaborador:** desempenho (`performa`) + engajamento (`pulse`) + jornada (`chronos`) + desenvolvimento (`academy`).
- **Risco de retenção:** sinais de `chronos` + `pulse` + `performa` → `insights` (agregado, com gate de ética/privacidade).
- **Prontidão de sucessão:** 9-box (`performa`) + matriz de cargo (`org-architect`) + trilhas concluídas (`academy`).

Toda consolidação respeita os gates de privacidade/ética dos módulos-fonte (ex: `insights` n≥5, sem veredito individual).
