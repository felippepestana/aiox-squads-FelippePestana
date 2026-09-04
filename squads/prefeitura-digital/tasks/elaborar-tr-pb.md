# Task: Elaborar Termo de Referência / Projeto Básico

**ID:** `pd-elaborar-tr-pb`
**Executor:** `elaborador-tr-pb`
**Tier:** Tier 1
**Use Cases:** UC-PD-003

## Overview
Converte o ETP em Termo de Referência (bens/serviços) ou Projeto Básico (obras/engenharia), conforme os modelos da AGU.

## Input
- ETP de referência (elaborador-etp)
- Dossiê de pesquisa de preços
- Parecer de dotação (controlador-orcamentario)

## Output
- TR ou Projeto Básico no template correspondente, salvo em output/contratacoes/

## Action Items
1. Selecione o instrumento correto (TR vs Projeto Básico)
2. Defina objeto, requisitos e modelo de execução/gestão
3. Estabeleça critérios de medição/pagamento e de seleção do fornecedor
4. Inclua estimativa de valor e a adequação orçamentária
5. Garanta especificações isonômicas (sem direcionamento)
6. Marque lacunas com [PREENCHER:]

## Acceptance Criteria
- [ ] Instrumento adequado ao objeto
- [ ] Todos os elementos do art. 6º (XXIII ou XXV) presentes
- [ ] Adequação orçamentária registrada
- [ ] Arquivo salvo via Write
