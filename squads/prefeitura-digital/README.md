# Prefeitura Digital

> Automação e modernização da gestão pública municipal (poder executivo) — das contratações ao orçamento, processo administrativo, RH, Diário Oficial e transparência. Caso de referência: **Porto Velho/RO**.

**Version:** 1.0.0 | **Created:** 2026-06-08 | **Agents:** 13 | **Tasks:** 11 | **Templates:** 9

---

## Visão

Uma solução pensada para o dia a dia do executivo municipal, organizada em torno de um **eixo orçamentário transversal**: todo ato administrativo nasce vinculado ao orçamento, conforma-se à lei e publica-se com transparência. Os agentes **geram artefatos prontos e orientam**; a integração "viva" com APIs e portais é prevista para a Fase 2 (app web companheiro).

## Arquitetura do Squad

```
                         chefe-de-gabinete (Orchestrator)
                                    |
  ┌──────────────┬─────────────────┬──────────────────┬──────────────┐
  |              |                 |                  |              |
 EIXO          NÚCLEOS          ESPECIALISTA       SUPORTE        (output/)
 ORÇAMENTO     FUNCIONAIS                          + GATES
  |              |                 |                  |
 controlador-   gestor-processo-   consultor-        revisor-conformidade
 orcamentario   adm                secretarias       documentador
 planejador-    pesquisador-contratacoes
 orcamentario   elaborador-etp
                elaborador-tr-pb
                gestor-rh
                editor-diario-oficial
                arquiteto-transparencia
```

## Agentes

| Tier | Agente | Foco | Tools |
|------|--------|------|-------|
| Orchestrator | `chefe-de-gabinete` | Classificação por secretaria/UC, roteamento, gates | Read, Glob |
| Orçamento | `controlador-orcamentario` | Dotação, execução, mínimos (15%/25%), LRF; SICONFI/SIOPS/SIOPE | WebSearch, Read, Grep |
| Orçamento | `planejador-orcamentario` | PPA, LDO, LOA | Read, Write |
| Tier 1 | `gestor-processo-adm` | Trâmite no padrão SEI; despachos | Read, Glob |
| Tier 1 | `pesquisador-contratacoes` | Pesquisa de mercado/preços/soluções (PNCP) | WebSearch |
| Tier 1 | `elaborador-etp` | ETP (13 elementos, art. 18) | Read, Write |
| Tier 1 | `elaborador-tr-pb` | Termo de Referência / Projeto Básico (modelos AGU) | Read, Write |
| Tier 1 | `gestor-rh` | Atos de pessoal, prazos, PAD, RPPS; eSocial/SIPREV | Read, Write |
| Tier 1 | `editor-diario-oficial` | Atos por tipo/caderno + biblioteca (inspiração AROM) | Read, Write |
| Tier 1 | `arquiteto-transparencia` | Conformidade LAI/PNTP/EBT/WCAG; reconstrução do painel | WebSearch, Write |
| Tier 2 | `consultor-secretarias` | Competências/fluxos por secretaria | Read, Grep |
| Suporte | `revisor-conformidade` | Gate legal/fiscal (Lei 14.133 + LRF + LGPD + TCE-RO) | WebSearch, Read, Grep |
| Suporte | `documentador` | Consolida e salva o artefato final | Read, Write, Glob |

## Use Cases

| ID | Demanda | Agentes |
|----|---------|---------|
| UC-PD-001 | Instruir/tramitar processo administrativo (SEI) | gestor-processo-adm |
| UC-PD-002 | Elaborar ETP | pesquisador-contratacoes + elaborador-etp |
| UC-PD-003 | Elaborar Termo de Referência / Projeto Básico | elaborador-tr-pb |
| UC-PD-004 | Pesquisa de mercado/preços | pesquisador-contratacoes |
| UC-PD-005 | Verificação orçamentária | controlador-orcamentario |
| UC-PD-006 | Elaborar/atualizar PPA·LDO·LOA | planejador-orcamentario |
| UC-PD-007 | Elaborar ato para o Diário Oficial | editor-diario-oficial |
| UC-PD-008 | Atos e rotinas de RH | gestor-rh |
| UC-PD-009 | Diagnóstico/reconstrução da Transparência | arquiteto-transparencia |
| UC-PD-010 | Revisão de conformidade | revisor-conformidade |
| UC-PD-011 | Orientação por secretaria | consultor-secretarias |

## Quick Start

```
# Ativar o orquestrador
@prefeitura-digital:chefe-de-gabinete

# Exemplos
"Elaborar ETP para aquisição de ambulâncias para a Semusa"
"Gerar Termo de Referência da limpeza hospitalar a partir do ETP"
"Redigir portaria de nomeação de aprovado em concurso (Semad)"
"Publicar extrato do contrato nº 045/2026 no Diário Oficial"
"Diagnosticar a conformidade do nosso Portal da Transparência"
"Verificar a dotação para uma despesa de R$ 1,2 mi na saúde"
```

## Quality Gates

| ID | Gate | Agente | Critério |
|----|------|--------|----------|
| QG-PD-001 | Classificação | chefe-de-gabinete | UC e secretaria definidos antes da execução |
| QG-PD-002 | Vínculo orçamentário | controlador-orcamentario | Dotação/fonte + mínimos + LRF em atos financeiros |
| QG-PD-003 | Completude do ETP | elaborador-etp | 13 elementos (art. 18) ou dispensa justificada |
| QG-PD-004 | Conformidade legal | revisor-conformidade | Aderência Lei 14.133 + LRF + LGPD; pendências marcadas |
| QG-PD-005 | Publicação conforme | editor-diario-oficial | Tipo/caderno + obrigação de publicação + ICP-Brasil |
| QG-PD-006 | Artefato salvo | documentador | Write executado, fontes/normas citadas |

## Escopo e limites

Este squad entrega **inteligência, elaboração de documentos e orientação de conformidade**. As integrações "vivas" (SEI, PNCP, SICONFI, eSocial), o **Diário Oficial eletrônico** (publicação assinada + biblioteca) e a **reconstrução do Portal da Transparência** são previstas para a **Fase 2 — app web companheiro** (ver `docs/DOSSIE-PLANEJAMENTO.md`).

> ⚠️ Os artefatos gerados são **minutas de apoio**; não substituem a análise jurídica (PGM) nem a decisão da autoridade competente. Dados normativos têm caráter de referência — confirmar a norma vigente.

## Estrutura de Diretórios

```
squads/prefeitura-digital/
├── config.yaml
├── README.md
├── ARCHITECTURE.md
├── agents/         (13 agentes)
├── tasks/          (11 tasks)
├── templates/      (9 templates)
├── data/           (6 arquivos de referência)
├── checklists/     (4 checklists)
├── docs/
│   └── DOSSIE-PLANEJAMENTO.md
└── output/         (artefatos gerados)
```
