# Architecture — analista-processual

## Visão Geral

O squad `analista-processual` implementa um pipeline 3-tier para análise de processos organizacionais e jurídicos brasileiros, com elaboração de peças processuais e documentos jurídicos.

```
                         analista-chefe (Orchestrator)
                                    |
                    [QG-AP-001: classificação]
                                    |
     ┌──────────────┬───────────────┼───────────────┬──────────────┐
     |              |               |               |              |
 UC-AP-001     UC-AP-003       UC-AP-002       UC-AP-004    UC-AP-005
     |              |               |               |              |
 TIER 0         TIER 0          TIER 1          TIER 1       TIER 1
 mapeador       mapeador        leitor-de-pecas pesquisador  leitor-de-pecas (opc.)
     |          avaliador       pesquisador         |        pesquisador (opc.)
 avaliador          |          estrategista          |              |
     |          estrategista   advogado-orientador   |        redator-juridico
     |          orientador           |               |              |
     └──────────────┴───────────────┬─┴───────────────┴──────────────┘
                                    |
              analista-chefe sintetiza (UC-AP-001/002/003)
                                    |
              ┌─────────────────────┴─────────────────────┐
              |                                           |
     documentador-processual                    redator-juridico
       [QG-AP-004: Write]                      [QG-AP-005: Write]
              |                                           |
     relatorio salvo em                          peça salva em
     relatorio-[slug]-[AAAA-MM-DD].md            output/pecas/
```

## Use Cases

> **Fonte canônica:** `config.yaml > pipeline.use_cases`. A tabela abaixo é um
> resumo; gatilhos completos, agentes acionados e modo de documentação vivem no
> `config.yaml` e devem prevalecer em caso de divergência.

| UC | Trigger (amostra) | Tier 0 | Tier 1 | Modo |
|----|-------------------|--------|--------|------|
| UC-AP-001 | mapear processo, etapas, fluxo, BPMN, mapeamento | Sim | — | MODO_PROCESSUAL |
| UC-AP-002 | processo judicial, peças, petição, sentença, recurso, analisar processo | Não | leitor + pesquisador + estrategista + orientador | MODO_JURIDICO |
| UC-AP-003 | riscos, cenários, probabilidade, sucumbência, estratégia, acordo | Sim | estrategista + orientador | MODO_JURIDICO |
| UC-AP-004 | jurisprudência, STJ, STF, súmula, legislação, precedente | Não | pesquisador | RESPOSTA_DIRETA |
| UC-AP-005 | elaborar, redigir, minutar, contestação, petição inicial, contrato, notificação | Não | leitor* + pesquisador* + redator | ELABORACAO_PECA |

\* *leitor-de-pecas* e *pesquisador-juridico* são opcionais em UC-AP-005 — ativados quando há peças existentes ou fundamentos a pesquisar.

## Tier 0 — Intake e Mapeamento

**Execução:** Sequencial (mapeador → avaliador)

**Use cases:** UC-AP-001 (sempre), UC-AP-003 (antes do Tier 1 estratégico)

```
mapeador-processual
  - Input: descrição do processo / documentos workspace
  - Output: tabela de etapas (etapa | ator | entradas | saídas | critério)
  - Passa para: avaliador-processual
  - Tools: Read, Glob

avaliador-processual
  - Input: tabela de etapas do mapeador
  - Output: score maturidade 0-5 + gargalos + Top-5 riscos
  - Passa para: analista-chefe
  - Tools: Read
```

## Tier 1 — Execução Jurídica

**Execução:** Paralelo (leitor + pesquisador simultâneos quando ambos ativos), depois sequencial (estrategista → orientador) ou terminal (redator-juridico)

```
leitor-de-pecas (paralelo com pesquisador quando ambos ativos)
  - Input: arquivos de peças processuais
  - Output: extração estruturada 7 categorias por documento
  - Tools: Read, Glob, Grep

pesquisador-juridico (paralelo com leitor quando ambos ativos)
  - Input: questões jurídicas do leitor ou demanda direta
  - Output: legislação + STF/STJ + súmulas + posição majoritária
  - Tools: Read, Glob, Grep, WebSearch

estrategista-processual (após leitor+pesquisador, UC-AP-002/003)
  - Input: extração + pesquisa jurídica
  - Output: posicionamento + riscos + 3 cenários (%) + viabilidade acordo
  - Tools: Read, Grep

advogado-orientador (após estrategista, UC-AP-002/003)
  - Input: análise estratégica
  - Output: ações urgentes + plano 4-8 sem + monitoramento + orientação cliente
  - Tools: Read

redator-juridico (UC-AP-005, após leitor/pesquisador opcionais)
  - Input: tipo de peça, partes, fatos, pedidos, fundamentos pesquisados
  - Output: peça processual ou documento jurídico completo
  - Salva: Write → output/pecas/[tipo]-[slug]-[AAAA-MM-DD].md
  - Tools: Read, Write, Grep, Glob
```

## Tier Síntese

> Estrutura completa das seções por modo de relatório: ver fonte canônica `templates/relatorio-processual-tmpl.md`.

```
documentador-processual (UC-AP-001, 002, 003)
  - Input: pacote consolidado do analista-chefe
  - Detecta modo: MODO_PROCESSUAL ou MODO_JURIDICO
  - MODO_PROCESSUAL: sumário + mapa + maturidade + riscos + roadmap 3 horizontes
  - MODO_JURIDICO: identificação + histórico + questões + fundamentação + mérito + estratégia + orientações + conclusões + bloco citacoes
  - Salva: Write → relatorio-[slug]-[AAAA-MM-DD].md
  - Tools: Read, Write, Grep, Glob
```

**Modos sem documentador:**

| Modo | UC | Destino |
|------|-----|---------|
| RESPOSTA_DIRETA | UC-AP-004 | Resposta do pesquisador-juridico retornada pelo analista-chefe (sem Write) |
| ELABORACAO_PECA | UC-AP-005 | Peça salva pelo redator-juridico em `output/pecas/` (QG-AP-005) |

## Formato do Bloco `citacoes` (MODO_JURIDICO)

O bloco de citações rastreadas é adicionado ao final de todo relatório MODO_JURIDICO:

````
```citacoes
documento: [nome da peça ou fonte]
trecho: [trecho extraído ou resumo relevante]
tipo: [peca-processual | jurisprudencia | legislacao | doutrina]
---
```
````

## Algoritmo de Classificação do `analista-chefe`

> Gatilhos espelham `config.yaml > pipeline.use_cases` (fonte canônica).
> UC-AP-005 é verificado **antes** de UC-AP-002 para distinguir elaboração de análise.

```
IF mensagem contém {"elaborar", "redigir", "minutar", "escrever", "draft",
                    "petição inicial", "contestação", "apelação", "embargos",
                    "recurso especial", "notificação extrajudicial", "contrato",
                    "procuração", "memorial", "manifestação"}
  → UC-AP-005 (Elaboração de Peça Processual ou Documento Jurídico)

ELSE IF mensagem contém {"processo judicial", "peças", "petição", "sentença", "recurso", "analisar processo"}
  → UC-AP-002 (Análise Jurídica Completa)

ELSE IF mensagem contém {"mapear processo", "etapas", "fluxo", "BPMN", "workflow", "mapeamento"}
  → UC-AP-001 (Mapeamento de Processo)

ELSE IF mensagem contém {"riscos", "cenários", "probabilidade", "sucumbência", "estratégia", "acordo"}
  → UC-AP-003 (Análise Estratégica)

ELSE IF mensagem contém {"jurisprudência", "STJ", "STF", "súmula", "legislação", "precedente"}
  → UC-AP-004 (Pesquisa Jurisprudencial)

ELSE IF ambíguo entre UC-AP-002 e UC-AP-005
  → Perguntar: "Você quer ANALISAR a peça ou ELABORAR uma nova?"

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
| QG-AP-005 | redator-juridico | Peça salva via Write em `output/pecas/`, dados faltantes com `[PREENCHER:]` | Reexecutar redator |

## Decisões de Design

**Por que fundir `documentador` + `relator-processual`?**
Ambos servem a função terminal de gerar o relatório final. O modo dual evita dois agentes concorrentes para a mesma finalidade. A detecção automática de modo (baseada em qual tier foi ativado) torna o fluxo limpo.

**Por que Tier 1 é opcional para UC-AP-001?**
O squad foi migrado de duas implementações distintas: genérica (3 agentes) e jurídica (5 agentes). O Tier 0 é suficiente para mapeamento genérico. Forçar análise jurídica em processos organizacionais adicionaria friction desnecessário.

**Por que UC-AP-002 não aciona Tier 0?**
Demandas de análise jurídica completa partem diretamente das peças processuais (`tier_0_active: false` em `config.yaml`). O mapeamento genérico de etapas não agrega valor quando o input são autos judiciais.

**Por que 5 use cases?**
Espelha os 5 modos de operação efetivos: mapeamento genérico, análise jurídica completa, análise estratégica, pesquisa pontual e elaboração de peças. Mantém o algoritmo de classificação simples e auditável.

**Por que `redator-juridico` é separado do `documentador-processual`?**
Relatórios de análise e peças processuais têm formatos, quality gates e destinos distintos (`relatorio-*.md` vs `output/pecas/`). UC-AP-005 usa modo `ELABORACAO_PECA` e QG-AP-005, sem passar pelo documentador.
