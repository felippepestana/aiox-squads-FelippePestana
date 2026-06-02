# Arquitetura — Analista Estrategista Processual Civil

## Visão Geral

Sistema de análise estratégica de processos civis com pipeline 3-tier especializado no **CPC 2015**. Complementa o `analista-processual` com foco exclusivo em Direito Processual Civil e recursos aos tribunais superiores.

## Pipeline 3-Tier

```
Demanda Civil
      │
      ▼
┌─────────────────────────────────┐
│ ORQUESTRADOR                         │
│ chefe-estrategico                     │
│ Classifica UC-AEPC-001 a 005         │
└─────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────┐
│ TIER 0 — Triagem e Diagnóstico       │
│ [1] classificador-civel (tipo/fase)  │
│     → [2] auditor-processual (CPC)   │
└─────────────────────────────────┘
      │ (se UC ≠ 002)
      ▼
┌─────────────────────────────────┐
│ TIER 1 — Análise Especializada        │
│ [paralelo]                            │
│   leitor-pecas-civel  pesquisador-cpc │
│ [sequencial]                          │
│   estrategista-civel                  │
│   analista-recursos (003/001)         │
│   orientador-civel                    │
└─────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────┐
│ TIER SÍNTESE                           │
│ redator-estrategico                   │
│ Relatório COMPLETO ou DIAGNOSTICO     │
│ Write (salva arquivo)                 │
└─────────────────────────────────┘
```

## Roteamento por Use Case

| UC | Tier 0 | Tier 1 (Paralelo) | Tier 1 (Seq.) | Síntese |
|----|--------|-------------------|---------------|--------|
| UC-AEPC-001 | classif. → auditor | leitor + pesquisador | estrategista → recursos → orientador | redator |
| UC-AEPC-002 | classif. → auditor | — | — | redator |
| UC-AEPC-003 | classif. → auditor | leitor + pesquisador | recursos → orientador | redator |
| UC-AEPC-004 | classif. → auditor | leitor + pesquisador | estrategista → orientador | redator |
| UC-AEPC-005 | classif. → auditor | leitor + pesquisador | estrategista → orientador | redator |

## Relação com analista-processual

| Aspecto | analista-processual | analista-estrategista-processual-civil |
|---------|--------------------|-----------------------------------------|
| Escopo | Genérico + Jurídico | Exclusivamente Civil (CPC 2015) |
| Tier 0 | Mapeamento BPMN + Avaliação | Classificação CPC + Auditoria CPC |
| Recursal | Não especializado | analista-recursos dedicado |
| Execução | Não coberto | UC-AEPC-005 (fase de execução) |
| Teses STJ | Sim (pesquisador) | Teses repetitivas + IRDR especializados |

## Algoritmo de Classificação (chefe-estrategico)

```
1. "recurso", "apelação", "agravo", "REsp", "RE"  → UC-AEPC-003
2. "execução", "cumprimento", "penhora"             → UC-AEPC-005
3. "defesa", "contestação", "preliminares"          → UC-AEPC-004
4. "diagnosticar", "status", "prazos"               → UC-AEPC-002
5. "processo cível", "ação civil", "analisar"       → UC-AEPC-001
6. ambíguo                                           → perguntar
```
