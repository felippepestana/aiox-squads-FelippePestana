# Analista Processual

> Análise completa de processos organizacionais e jurídicos brasileiros — do mapeamento ao relatório estratégico.

**Version:** 1.0.0 | **Created:** 2026-03-28 | **Agents:** 8 | **Tasks:** 9 | **Workflows:** 2

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
| Tier Síntese | `documentador-processual` | Relatório dual-mode + `citacoes` + Write | Read, Write, Glob |

---

## Use Cases

| ID | Demanda | Agents | Modo | Tempo |
|----|---------|--------|------|-------|
| UC-AP-001 | Mapear processo genérico | mapeador + avaliador | PROCESSUAL | 5-15 min |
| UC-AP-002 | Análise jurídica completa | todos tier 1 | JURIDICO | 15-40 min |
| UC-AP-003 | Análise estratégica | estrategista + orientador | JURIDICO | 10-20 min |
| UC-AP-004 | Pesquisa jurisprudencial | pesquisador | Direto | 5-10 min |

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
```

---

## Quality Gates

| ID | Gate | Agente | Critério |
|----|------|--------|----------|
| QG-AP-001 | Classificação | analista-chefe | UC definido antes de qualquer ativation |
| QG-AP-002 | Mapeamento Completo | mapeador-processual | Todas etapas com atores e saídas |
| QG-AP-003 | Avaliação Fundamentada | avaliador-processual | Score 0-5 + Top-5 riscos com mitigação |
| QG-AP-004 | Relatório Salvo | documentador-processual | Write executado + citações rastreadas |

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
│   └── documentador-processual.md  (Tier Síntese)
├── tasks/                          (9 task files)
├── workflows/                      (2 workflow files)
├── checklists/                     (2 checklist files)
├── templates/                      (1 template)
└── data/                           (1 data file)
```

---

## Estatísticas

| Métrica | Valor |
|---------|-------|
| Total de agentes | 8 |
| Agentes Tier 0 | 2 |
| Agentes Tier 1 | 4 |
| Agentes Tier Síntese | 1 |
| Orchestrator | 1 |
| Tasks | 9 |
| Workflows | 2 |
| Checklists | 2 |
| Templates | 1 |
| Data files | 1 |
| Quality Gates | 4 |
| Fontes jurídicas autorizadas | 7 |
