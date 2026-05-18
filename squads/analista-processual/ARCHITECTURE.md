# Architecture — analista-processual

## Visão Geral

O squad `analista-processual` implementa um pipeline 3-tier para análise de processos organizacionais e jurídicos brasileiros.

```
                         analista-chefe (Orchestrator)
                                    |
                    [QG-AP-001: classificação]
                                    |
              ┌──────────────────────┤
              |                      |
         UC-AP-001             UC-AP-002
         UC-AP-003             UC-AP-004
              |                      |
     TIER 0 (Sequencial)    TIER 1 (Paralelo)
      mapeador-processual    leitor-de-pecas
            |                pesquisador-juridico
      avaliador-processual   estrategista-processual
      [QG-AP-002, 003]       advogado-orientador
              |                      |
              └──────────────────────┘
                                    |
                          analista-chefe sintetiza
                                    |
                       documentador-processual
                         [QG-AP-004: Write]
                                    |
                         relatorio salvo em
                         .md no workspace
```

## Use Cases

| UC | Trigger | Tier 0 | Tier 1 | Modo |
|----|---------|--------|--------|------|
| UC-AP-001 | mapear, etapas, fluxo, BPMN | Sim | Não | PROCESSUAL |
| UC-AP-002 | processo judicial, peças, petição | Opcional | Todos 4 | JURIDICO |
| UC-AP-003 | riscos, estratégia, cenários | Sim | estrategista + orientador | JURIDICO |
| UC-AP-004 | jurisprudência, STJ, súmula | Não | pesquisador | Direto |

## Tier 0 — Intake e Mapeamento

**Execução:** Sequencial (mapeador → avaliador)

```
mapeador-processual
  - Input: descrição do processo / documentos workspace
  - Output: tabela de etapas (etapa | ator | entradas | saídas | critério)
  - Passa para: avaliador-processual
  - Tools: Read, Glob

avaliador-processual
  - Input: tabela de etapas do mapeador
  - Output: score maturidade 0-5 + gargalos + Top-5 riscos
  - Passes para: analista-chefe
  - Tools: Read
```

## Tier 1 — Execução Jurídica

**Execução:** Paralelo (leitor + pesquisador simultâneos), depois sequencial (estrategista → orientador)

```
leitor-de-pecas (paralelo com pesquisador)
  - Input: arquivos de peças processuais
  - Output: extração estruturada 7 categorias por documento
  - Tools: Read, Glob, Grep

pesquisador-juridico (paralelo com leitor)
  - Input: questões jurídicas do leitor
  - Output: legislação + STF/STJ + súmulas + posição majoritária
  - Tools: Read, Glob, Grep, WebSearch

estrategista-processual (após leitor+pesquisador)
  - Input: extração + pesquisa jurídica
  - Output: posicionamento + riscos + 3 cenários (%) + viabilidade acordo
  - Tools: Read, Grep

advogado-orientador (após estrategista)
  - Input: análise estratégica
  - Output: ações urgentes + plano 4-8 sem + monitoramento + orientação cliente
  - Tools: Read
```

## Tier Síntese

```
documentador-processual
  - Input: pacote consolidado do analista-chefe
  - Detecta modo: MODO_PROCESSUAL ou MODO_JURIDICO
  - MODO_PROCESSUAL: sumário + mapa + maturidade + riscos + roadmap 3 horizontes
  - MODO_JURIDICO: identificação + histórico + questões + fundamentação + mérito + estratégia + orientações + conclusões + bloco citacoes
  - Salva: Write → relatorio-[slug]-[AAAA-MM-DD].md
  - Tools: Read, Write, Grep, Glob
```

## Formato do Bloco `citacoes` (MODO_JURIDICO)

O bloco de citações rastreadas é adicionado ao final de todo relatório MODO_JURIDICO:

```
```citacoes
documento: [nome da peça ou fonte]
trecho: [trecho extraído ou resumo relevante]
tipo: [peca-processual | jurisprudencia | legislacao | doutrina]
---
```
```

## Algoritmo de Classificação do `analista-chefe`

```
IF mensagem contém {"processo judicial", "peças", "petição", "sentença", "recurso"}
  → UC-AP-002 (Análise Jurídica Completa)

ELSE IF mensagem contém {"mapear", "etapas", "fluxo", "BPMN", "workflow"}
  → UC-AP-001 (Mapeamento de Processo)

ELSE IF mensagem contém {"riscos", "estratégia", "cenários", "sucumbência", "acordo"}
  → UC-AP-003 (Análise Estratégica)

ELSE IF mensagem contém {"jurisprudência", "STJ", "STF", "súmula", "precedente"}
  → UC-AP-004 (Pesquisa Jurisprudencial)

ELSE
  → Perguntar ao usuário
```

## Quality Gates

| Gate | Agente | Critério | On Fail |
|------|--------|---------|--------|
| QG-AP-001 | analista-chefe | UC classificado + plano definido | Pedir esclarecimento |
| QG-AP-002 | mapeador-processual | Todas etapas com atores | Reprocessar |
| QG-AP-003 | avaliador-processual | Score 0-5 + Top-5 riscos | Devolver ao avaliador |
| QG-AP-004 | documentador-processual | Write executado + confirmação | Reexecutar documentador |

## Decisões de Design

**Por que fundir `documentador` + `relator-processual`?**
Ambos servem a função terminal de gerar o relatório final. O modo dual evita dois agentes concorrentes para a mesma finalidade. A detecção automática de modo (baseada em qual tier foi ativado) torna o fluxo limpo.

**Por que Tier 1 é opcional para UC-AP-001?**
O squad foi migrado de duas implementações distintas: genérica (3 agentes) e jurídica (5 agentes). O Tier 0 é suficiente para mapeamento genérico. Forçar análise jurídica em processos organizacionais adicionaria friction desnecessário.

**Por que 4 use cases?**
Espelha os 4 modos de operação efetivos das implementações de origem. Mantendo o algoritmo de classificação simples e auditável.
