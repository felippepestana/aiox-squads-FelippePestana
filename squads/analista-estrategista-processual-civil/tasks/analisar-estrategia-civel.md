# Task: Analisar Estratégia Cível

**ID:** `aepc-analisar-estrategia-civel`  
**Agent:** `estrategista-civel`  
**Tier:** Tier 1  
**UC:** UC-AEPC-001, 004, 005

## Objetivo

Produzir análise estratégica completa do processo civil com 3 cenários e viabilidade de acordo.

## Input

- Extração estruturada de peças do `leitor-pecas-civel`
- Pesquisa CPC/STJ do `pesquisador-cpc`
- Relatório de Auditoria do `auditor-processual`

## Output

Análise Estratégica Cível em 5 partes:
1. Posicionamento processual (pontos fortes/vulnerabilidades por polo)
2. Riscos e oportunidades cíveis (com base no CPC e jurisprudência STJ)
3. 3 cenários com probabilidades em % (soma obrigatoriamente = 100%)
4. Viabilidade de acordo (Alta/Média/Baixa) com justificativa
5. Recomendação estratégica principal

## Acceptance Criteria

- [ ] 5 partes completas na análise
- [ ] 3 cenários com percentuais (somando 100%)
- [ ] Cenário pessimista > 60% sinalizad como RISCO ALTO
- [ ] Viabilidade de acordo com justificativa
- [ ] Recomendação estratégica principal clara e objetiva
- [ ] Fundamentos baseados na pesquisa CPC/STJ

**Depends On:**
- UC-AEPC-001/004/005: `aepc-ler-pecas-civeis` + `aepc-pesquisar-cpc-stj`  
**Feeds Into:** `aepc-analisar-recurso` (UC-AEPC-001), `aepc-orientar-plano-civel`
