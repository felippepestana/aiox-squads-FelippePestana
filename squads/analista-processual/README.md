# Analista Processual

> Análise e elaboração de processos organizacionais, peças processuais e documentos jurídicos brasileiros — do mapeamento ao relatório estratégico e à minuta final.

**Version:** 1.1.0 | **Created:** 2026-03-28 | **Updated:** 2026-05-15 | **Agents:** 9 | **Tasks:** 10 | **Workflows:** 2

---

## Arquitetura do Squad

```
                    analista-chefe (Orchestrator)
                           |
              ┌───────────────┬─────────────┐
              |              |              |
         TIER 0         TIER 1        TIER SÍNTESE
         (Intake)       (Jurídico)    (Relatório)
              |              |
    mapeador-processual  leitor-de-pecas
    avaliador-processual pesquisador-juridico
                         estrategista-processual
                         advogado-orientador
                         redator-juridico ← NOVO (UC-AP-005)
                                           |
                              documentador-processual
```

---

## Agentes

| Tier | Agente | Foco | Tools |
|------|--------|------|-------|
| Orchestrator | `analista-chefe` | Classificação UC, roteamento, quality gates | — |
| Tier 0 | `mapeador-processual` | Mapeamento pseudo-BPMN (etapas, atores, decisões) | Read, Glob |
| Tier 0 | `avaliador-processual` | Maturidade 0-5, gargalos, Top-5 riscos | Read |
| Tier 1 | `leitor-de-pecas` | Extração estruturada em 7 categorias | Read, Glob, Grep |
| Tier 1 | `pesquisador-juridico` | Jurisprudência STF/STJ/TJs, súmulas, legislação | WebSearch, Read |
| Tier 1 | `estrategista-processual` | 3 cenários (%), riscos, viabilidade de acordo | Read, Grep |
| Tier 1 | `advogado-orientador` | Ações urgentes, plano 4-8 sem, orientação cliente | Read |
| Tier 1 | `redator-juridico` ✨ | Elaboração de peças processuais e documentos jurídicos | Read, Write, Glob |
| Tier Síntese | `documentador-processual` | Relatório dual-mode + `citacoes` + Write | Read, Write, Glob |

---

## Use Cases

| ID | Demanda | Agents | Modo | Tempo |
|----|---------|--------|------|-------|
| UC-AP-001 | Mapear processo genérico | mapeador + avaliador | PROCESSUAL | 5-15 min |
| UC-AP-002 | Análise jurídica completa | todos tier 1 | JURIDICO | 15-40 min |
| UC-AP-003 | Análise estratégica | estrategista + orientador | JURIDICO | 10-20 min |
| UC-AP-004 | Pesquisa jurisprudencial | pesquisador | Direto | 5-10 min |
| UC-AP-005 ✨ | Elaborar peça processual ou documento jurídico | pesquisador + leitor + redator | ELABORAÇÃO | 10-30 min |

---

## Quick Start

### Ativar o Orchestrator

```
@analista-processual:analista-chefe
```

### Ativar Agente Diretamente

```
@analista-processual:leitor-de-pecas
@analista-processual:pesquisador-juridico
@analista-processual:estrategista-processual
```

### Exemplos de Uso

```
# Mapeamento genérico
"Mapear o processo de aprovação de contratos da nossa empresa"

# Análise jurídica completa
"Analisar este processo judicial [anexar documentos] e identificar riscos"

# Pesquisa jurisprudencial
"Quais súmulas do STJ se aplicam a contratos bancários com juros abusivos?"

# Análise estratégica
"Quais os cenários e probabilidades de sucesso no processo de despejo?"

# Elaboração de peça processual (UC-AP-005 — NOVO)
"Elaborar contestação no processo de cobrança n.º 1234/2026 — prazo em 15 dias"
"Redigir petição inicial de ação de cobrança contra empresa devedora"
"Minutar embargos de declaração para sanar omissão na sentença"
"Escrever notificação extrajudicial para locatário em mora"
"Elaborar contrato de prestação de serviços de consultoria"
```

---

## Quality Gates

| ID | Gate | Agente | Critério |
|----|------|--------|----------|
| QG-AP-001 | Classificação | analista-chefe | UC definido antes de qualquer ativation |
| QG-AP-002 | Mapeamento Completo | mapeador-processual | Todas etapas com atores e saídas |
| QG-AP-003 | Avaliação Fundamentada | avaliador-processual | Score 0-5 + Top-5 riscos com mitigação |
| QG-AP-004 | Relatório Salvo | documentador-processual | Write executado + citações rastreadas |
| QG-AP-005 ✨ | Peça Salva | redator-juridico | Peça completa em output/pecas/ + dados faltantes marcados |

---

## Estrutura de Diretórios

```
squads/analista-processual/
├── config.yaml
├── README.md
├── ARCHITECTURE.md
├── HEADLINE.md
├── CHANGELOG.md
├── agents/
│   ├── analista-chefe.md           (Orchestrator)
│   ├── mapeador-processual.md      (Tier 0)
│   ├── avaliador-processual.md     (Tier 0)
│   ├── leitor-de-pecas.md          (Tier 1)
│   ├── pesquisador-juridico.md     (Tier 1)
│   ├── estrategista-processual.md  (Tier 1)
│   ├── advogado-orientador.md      (Tier 1)
│   ├── redator-juridico.md         (Tier 1) ✨ NOVO
│   └── documentador-processual.md  (Tier Síntese)
├── tasks/                          (10 task files)
│   └── elaborar-peca-processual.md ✨ NOVO
├── workflows/                      (2 workflow files)
├── checklists/                     (2 checklist files)
├── templates/                      (2 templates)
│   └── peca-processual-tmpl.md     ✨ NOVO
├── data/                           (1 data file)
└── output/
    └── pecas/                      ✨ NOVO — peças elaboradas salvas aqui
```

---

## Estatísticas

| Métrica | Valor |
|---------|-------|
| Total de agentes | 9 |
| Agentes Tier 0 | 2 |
| Agentes Tier 1 | 5 |
| Agentes Tier Síntese | 1 |
| Orchestrator | 1 |
| Tasks | 10 |
| Workflows | 2 |
| Checklists | 2 |
| Templates | 2 |
| Data files | 1 |
| Quality Gates | 5 |
| Fontes jurídicas autorizadas | 7 |
| Tipos de peças suportadas | 14 (processuais) + 5 (extrajudiciais) |
