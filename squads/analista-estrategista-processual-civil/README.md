# Analista Estrategista Processual Civil

Squad especializado na análise estratégica de processos civis brasileiros sob o **Código de Processo Civil (CPC 2015)**.

## Descrição

Pipeline 3-tier que cobre desde a triagem processual e auditoria de riscos CPC até a elaboração de relatório estratégico com fundamentos legais, cenários com probabilidades, análise recursal e plano de ação.

## Casos de Uso

| UC | Nome | Agentes Ativados | Modo |
|----|------|-----------------|------|
| UC-AEPC-001 | Análise CPC Completa | Todos (9 agentes) | COMPLETO |
| UC-AEPC-002 | Diagnóstico Processual | chefe + classificador + auditor + redator | DIAGNÓSTICO |
| UC-AEPC-003 | Estratégia Recursal | Todos exceto estrategista-civel | COMPLETO |
| UC-AEPC-004 | Análise de Defesa | Todos exceto analista-recursos | COMPLETO |
| UC-AEPC-005 | Fase de Execução | Todos exceto analista-recursos | COMPLETO |

## Agentes (9)

| Agente | Tier | Função |
|--------|------|--------|
| `chefe-estrategico` | Orquestrador | Classifica UC, roteia pipeline, verifica quality gates |
| `classificador-civel` | Tier 0 | Tipo de ação, fase processual, polo, competência |
| `auditor-processual` | Tier 0 | 6 eixos CPC: prescrição, preclusão, nulidades, prazos |
| `leitor-pecas-civel` | Tier 1 | Extração de peças civis em 8 categorias |
| `pesquisador-cpc` | Tier 1 | CPC 2015, STJ, teses repetitivas, súmulas via WebSearch |
| `estrategista-civel` | Tier 1 | 3 cenários (%), acordo, recomendação estratégica |
| `analista-recursos` | Tier 1 | Admissibilidade + mérito recursal (apelação, REsp, RE) |
| `orientador-civel` | Tier 1 | Plano de ação com prazos CPC e comunicação ao cliente |
| `redator-estrategico` | Tier Síntese | Relatório estratégico + bloco citacoes + Write |

## Início Rápido

```
@analista-estrategista-processual-civil:chefe-estrategico
Preciso analisar uma ação de cobrança em fase de conhecimento. [anexe os documentos]
```

## Critérios de Qualidade

| Gate | Agente | Critério |
|------|--------|----------|
| QG-AEPC-001 | chefe-estrategico | UC classificado antes de acionar agentes |
| QG-AEPC-002 | classificador-civel | Tipo + fase + polo identificados com base no CPC |
| QG-AEPC-003 | auditor-processual | Riscos CPC com artigos específicos |
| QG-AEPC-004 | redator-estrategico | Relatório salvo via Write + bloco citacoes |

## Estrutura de Arquivos

```
analista-estrategista-processual-civil/
├── config.yaml
├── agents/          # 9 agentes
├── workflows/       # wf-analise-cpc-completa + wf-diagnostico-rapido
├── tasks/           # 8 tarefas
├── templates/       # relatorio-estrategico-cpc-tmpl
├── checklists/      # diagnostico + relatorio-estrategico
├── data/            # normas-cpc.yaml
├── README.md
├── CHANGELOG.md
└── ARCHITECTURE.md
```
