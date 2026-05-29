# Squad Jurídico — Legal Performance

> Squad unificado para análise processual, estratégia jurídica, direito processual civil, perícia judicial técnica e planejamento de produto jurídico com frontend de alta usabilidade.

**Versão:** 1.0.0 | **Agentes:** 16 | **Tasks:** 10 | **Workflows:** 3 | **Smoke tests:** 3 | **Exemplos:** 3

---

## O que este squad integra

Este squad harmoniza os conteúdos jurídicos existentes no repositório sem remover os squads de origem:

| Fonte | Função incorporada |
|---|---|
| `analista-processual` | Mapeamento de processos, análise jurídica, pesquisa, estratégia, orientação e relatórios rastreados. |
| `analista-estrategista-processual-civil` | CPC 2015, diagnóstico cível, auditoria processual, recursos, execução e estratégia civil. |
| `iphone-judicial-assessment` | Perícia judicial técnica, iPhone, cadeia de custódia, normas ABNT/NBR, CDC e laudo técnico. |
| `apex` | Referência para design system, acessibilidade, performance e futura implementação frontend. |

---

## Arquitetura resumida

```text
Tier 0  legal-performance-chief
  |
Tier 1  Intake, classificação CPC e auditoria processual
  |
Tier 2  Mapeamento, leitura de peças e pesquisa jurídica
  |
Tier 3  Estratégia, recursos e plano de ação
  |
Tier 4  Perícia técnica judicial e normas
  |
Tier 5  UX jurídico, relatório e validação de compliance
```

---

## Casos de uso

| UC | Nome | Quando usar |
|---|---|---|
| UC-LP-001 | Triagem e Diagnóstico Processual | Status, fase, prazos e riscos iniciais. |
| UC-LP-002 | Análise Jurídica Completa | Autos, peças, pedidos, fundamentos, pesquisa e estratégia. |
| UC-LP-003 | Análise Estratégica Processual Civil | CPC, defesa, execução, cumprimento de sentença e estratégia cível. |
| UC-LP-004 | Estratégia Recursal | Apelação, agravo, REsp, RE, embargos e admissibilidade. |
| UC-LP-005 | Mapeamento e Performance de Processo | Fluxos, gargalos, maturidade, melhoria processual e pseudo-BPMN. |
| UC-LP-006 | Pesquisa Jurisprudencial e Normativa | Legislação, precedentes, súmulas e teses repetitivas. |
| UC-LP-007 | Perícia Judicial Técnica | Laudo, iPhone, IMEI, quesitos, ABNT/NBR, CDC e cadeia de custódia. |
| UC-LP-008 | Design de Produto Jurídico | Frontend, dashboard, interface, usabilidade e experiência do usuário. |

---

## Agentes

| Tier | Agente | Papel |
|---|---|---|
| 0 | `legal-performance-chief` | Orquestração, roteamento, quality gates. |
| 1 | `process-intake-analyst` | Intake, escopo, lacunas, urgências. |
| 1 | `civil-procedure-classifier` | Tipo de ação, fase, competência, recursos, execução. |
| 1 | `procedural-auditor` | Auditoria CPC, prescrição, preclusão, nulidades, prazos. |
| 2 | `process-mapper` | Mapeamento pseudo-BPMN e fluxos. |
| 2 | `risk-and-maturity-evaluator` | Maturidade 0-5, gargalos, riscos e roadmap. |
| 2 | `legal-document-reader` | Extração estruturada de peças. |
| 2 | `jurisprudence-researcher` | Legislação, jurisprudência, súmulas e doutrina. |
| 3 | `litigation-strategist` | Cenários, acordo, riscos e estratégia. |
| 3 | `appeals-analyst` | Admissibilidade e mérito recursal. |
| 3 | `legal-action-advisor` | Plano de ação, prazos e comunicação. |
| 4 | `forensic-device-specialist` | Diagnóstico técnico pericial de iPhone. |
| 4 | `legal-normative-specialist` | CPC, CDC, ABNT/NBR, ANATEL e ICP-Brasil. |
| 5 | `legal-ux-architect` | Design de produto jurídico e frontend. |
| 5 | `legal-report-writer` | Relatórios, laudos e briefs rastreados. |
| 5 | `quality-compliance-validator` | Checklists, bloqueios e aprovação final. |

---

## Como usar

```text
@squad-juridico-legal-performance:legal-performance-chief
```

Exemplos:

```text
Preciso analisar uma ação de cobrança em fase de conhecimento e entender riscos, estratégia e próximos passos.
```

```text
Preciso avaliar a admissibilidade de um recurso especial contra acórdão do TJSP.
```

```text
Preciso planejar o frontend de um dashboard jurídico para upload de peças, análise e revisão humana.
```

---

## Design e frontend

As orientações para o ambiente de usabilidade estão em [`DESIGN_GUIDE.md`](DESIGN_GUIDE.md). O frontend só deve ser implementado depois de aprovado o brief de design gerado pela task `design-legal-product-ux` e validado pelo checklist `design-readiness-checklist.md`.

---

## Validação funcional

A revisão inicial deve executar os cenários de [`SMOKE_TESTS.md`](SMOKE_TESTS.md):

1. [Análise processual civil](examples/processo-civil-acao-cobranca.md).
2. [Estratégia recursal](examples/estrategia-recursal-resp.md).
3. [Planejamento de frontend jurídico](examples/frontend-juridico-dashboard.md).

Esses testes verificam classificação de UC, rota de agentes, quality gates e entregáveis esperados antes de evoluir para implementação de interface.

---

## Aviso profissional

Este squad é uma ferramenta de apoio analítico. Ele não substitui advogado, perito judicial, assistente técnico ou profissional habilitado. Relatórios, laudos, estratégias, recursos e decisões devem ser revisados por profissional responsável antes de uso externo, protocolo ou assinatura.
