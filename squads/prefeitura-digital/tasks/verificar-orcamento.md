# Task: Verificação Orçamentária e Fiscal

**ID:** `pd-verificar-orcamento`
**Executor:** `controlador-orcamentario`
**Tier:** Tier Orçamento
**Use Cases:** UC-PD-005 (e gate transversal em UC-PD-002/003/006/008)

## Overview
Verifica o vínculo orçamentário de um ato: dotação, disponibilidade, créditos adicionais, mínimos constitucionais e limites da LRF.

## Input
- Ato/objeto e impacto financeiro estimado
- Dados de execução (SICONFI / Portal da Transparência), quando disponíveis

## Output
- Parecer de vínculo orçamentário (favorável / com ressalvas / desfavorável)

## Action Items
1. Identifique o impacto financeiro e a dotação/fonte aplicável
2. Verifique disponibilidade de saldo
3. Se faltar dotação, indique o crédito adicional cabível e a base legal
4. Avalie impacto em mínimos (saúde 15% / educação 25%) e no limite de pessoal (LRF)
5. Confirme compatibilidade com PPA/LDO/LOA
6. Marque dados a confirmar com [PREENCHER:]

## Acceptance Criteria
- [ ] Dotação/fonte indicada
- [ ] Mínimos e limites avaliados
- [ ] Conclusão clara com fundamentos
