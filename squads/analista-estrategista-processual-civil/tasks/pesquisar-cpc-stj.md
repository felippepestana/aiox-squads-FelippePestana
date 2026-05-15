# Task: Pesquisar CPC e STJ

**ID:** `aepc-pesquisar-cpc-stj`  
**Agent:** `pesquisador-cpc`  
**Tier:** Tier 1  
**UC:** UC-AEPC-001, 003, 004, 005

## Objetivo

Pesquisar e compilar os fundamentos legais do CPC 2015 e a jurisprudência STJ cível relevantes para o processo em análise.

## Input

- Ficha de Classificação do `classificador-civel`
- Relatório de Auditoria do `auditor-processual`
- Questões jurídicas relevantes identificadas

## Output

Pesquisa jurídica em 5 dimensões:
1. Artigos CPC 2015 aplicáveis (tabela: artigo, tema)
2. Jurisprudência STJ cível (tabela: tribunal, número, data, ementa)
3. Teses repetitivas STJ e IRDR (tabela: tema, tese vinculante)
4. Súmulas STJ e STF processuais (número + enunciado)
5. Doutrina processual civil consolidada

## Acceptance Criteria

- [ ] Mínimo 5 fontes pesquisadas
- [ ] Cada fonte com tribunal/origem, número e data
- [ ] Teses repetitivas STJ identificadas quando aplicável
- [ ] Súmulas processuais relevantes listadas
- [ ] Controvérsias jurisprudenciais mapeadas quando existentes
- [ ] Sem opinião estratégica — apenas pesquisa e organização

**Depends On:**
- UC-AEPC-001/003/004/005: `aepc-auditar-compliance-cpc`  
**Executa em paralelo com:** `aepc-ler-pecas-civeis`  
**Feeds Into:** `aepc-analisar-estrategia-civel`, `aepc-analisar-recurso`
