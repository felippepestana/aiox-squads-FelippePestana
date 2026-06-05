# Apex-Talent — Mapa de Oportunidades de IA por Funcionalidade

Para cada área: a oportunidade de IA, o tipo de solução (**1 agente** simples vs. **squad multi-agente**) e o **diferencial** frente a plataformas consolidadas. Este mapa orienta a priorização de construção de cada módulo.

Legenda de tipo: 🤖 agente único · 🧠 squad multi-agente.

---

## 1. Recrutamento & Seleção — `talent-compass` 🧠

| Funcionalidade | Oportunidade de IA | Tipo |
|---|---|---|
| Definição de vaga | Gerar scorecard a partir de objetivos de performance | 🧠 |
| Triagem de CVs | Parsing + ranqueamento por aderência | 🤖 |
| Entrevista | **Entrevistador adaptativo BARS+STAR com probing dinâmico** | 🧠 |
| Scoring | Pontuar respostas por âncoras comportamentais | 🤖 |
| Comparação | Ranking justo e rastreável | 🤖 |
| Viés | **Gate de fairness/compliance automatizado (veto)** | 🤖 |
| Proposta/relatório | Redação assistida | 🤖 |

**Diferencial:** rastreabilidade de evidência por competência + auditoria de viés nativa — ausente em ATS de mercado.

## 2. Inteligência Comportamental — `profiler-dna` 🧠

Inferência de perfil a partir de texto livre/respostas; **síntese cruzada DISC × Big Five × Eneagrama como contexto, com guardrails anti-estereótipo**; plano de desenvolvimento e dicas de gestão por perfil.

**Diferencial:** lentes combinadas com avisos éticos e zero uso decisório.

## 3. Gestão de Desempenho — `performa` 🧠

Redação de avaliações sem viés de linguagem; **sugestão de posicionamento 9-Box explicada por evidências**; geração de PDI; análise de sentimento em feedbacks; coach de 1:1; detecção de OKRs mal formulados.

**Diferencial:** PDI gerado e calibração assistida por evidência.

## 4. Clima & Engajamento — `pulse` 🧠

**Análise temática/sentimento de respostas abertas e da ouvidoria**; planos de ação priorizados; alerta precoce de queda de engajamento; resumos executivos.

**Diferencial:** do dado de pesquisa ao plano de ação automático.

## 5. Departamento Pessoal & Folha — `peopleops` 🧠

Copiloto de admissão (extração de dados de documentos); **validador de conformidade eSocial/CLT em linguagem natural**; explicação de holerite; detecção de anomalias de folha.

**Diferencial:** assistente de conformidade trabalhista conversacional.

## 6. Controle de Ponto — `chronos` 🤖

**Detecção de anomalias/inconsistências de jornada e risco de passivo trabalhista**; assistente de fechamento de banco de horas; explicação de regras de jornada.

**Diferencial:** auditoria preventiva de passivo.

## 7. Onboarding — `onboard` 🧠

Jornada 30/60/90 personalizada por cargo + perfil comportamental; **buddy/IA de dúvidas do novo colaborador**; checklist dinâmico; acompanhamento proativo.

**Diferencial:** onboarding adaptado ao perfil comportamental do contratado.

## 8. Treinamento — `academy` 🧠

**Recomendação de trilha por gap de competência (cruza `performa` + `org-architect`)**; geração de conteúdo/quizzes; tutor de IA; mapeamento skills-based.

**Diferencial:** do gap de desempenho à trilha gerada.

## 9. People Analytics — `insights` 🧠

**Modelo de turnover preditivo e risco de burnout** (cruza ponto, desempenho, engajamento, feedback); copiloto de dashboards em linguagem natural; auditoria de diversidade; narrativas executivas automáticas.

**Diferencial:** RH preditivo conversacional cruzando todos os módulos.

## 10. Cargos / Org Design — `org-architect` 🧠

Geração de descrição de cargo e faixas; **job architecture skills-based (Bersin 4R)**; detecção de inequidade salarial; sugestão de planos de carreira.

**Diferencial:** decisão 4R (Redesign/Reskill/Retain/Recruit) assistida por IA.

## 11. Benefícios — `benefits-hub` 🤖

**Recomendação personalizada de benefícios por perfil/momento de vida**; assistente de dúvidas; análise de custo/adesão.

**Diferencial:** curadoria personalizada de benefícios.

---

## Princípio transversal de IA responsável

Toda funcionalidade que toca decisão sobre pessoas (contratação, promoção, remuneração, desligamento) deve:

1. Tratar a saída de IA como **suporte à decisão**, nunca como decisão autônoma.
2. Manter **rastreabilidade de evidência** (por que a recomendação foi dada).
3. Passar por um **quality gate de viés** quando aplicável.
4. Usar instrumentos de personalidade (DISC/Eneagrama) apenas como **contexto de desenvolvimento**, com peso zero em decisões seletivas.
