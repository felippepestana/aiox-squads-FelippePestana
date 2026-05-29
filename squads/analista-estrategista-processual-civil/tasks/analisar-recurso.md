# Task: Analisar Recurso

**ID:** `aepc-analisar-recurso`  
**Agent:** `analista-recursos`  
**Tier:** Tier 1  
**UC:** UC-AEPC-001, 003

## Objetivo

Analisar a admissibilidade e o mérito de recurso cível com recomendação objetiva.

## Input

- Acórdão ou decisão impugnada (do `leitor-pecas-civel`)
- Fundamentos CPC e STJ (do `pesquisador-cpc`)
- Análise estratégica (do `estrategista-civel`, se disponível)

## Output

Análise Recursal em 4 partes:
1. Admissibilidade: checklist com APTO/FALHO/A VERIFICAR para cada requisito
2. Mérito recursal: tese jurídica, fundamento e possibilidade de provimento
3. Efeitos e riscos (efeito suspensivo, risco de inadmissão, multa protelatoria)
4. Recomendação: INTERPOR/NÃO INTERPOR/COM CAUTELAS com justificativa

## Acceptance Criteria

- [ ] Todos os requisitos de admissibilidade verificados com artigo CPC
- [ ] Pré-questionário verificado para REsp/RE
- [ ] Tempestividade calculada com prazo CPC
- [ ] Recomendação objetiva (INTERPOR/NÃO INTERPOR/COM CAUTELAS)
- [ ] Risco de multa protelatoria alertado quando aplicável (CPC art. 1026, §2º)

**Depends On:**
- UC-AEPC-001: `aepc-analisar-estrategia-civel`
- UC-AEPC-003: `aepc-ler-pecas-civeis` + `aepc-pesquisar-cpc-stj`  
**Feeds Into:** `aepc-orientar-plano-civel`
