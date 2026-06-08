# Task: Elaborar Ato para o Diário Oficial

**ID:** `pd-elaborar-ato-do`
**Executor:** `editor-diario-oficial`
**Tier:** Tier 1
**Use Cases:** UC-PD-007

## Overview
Elabora um ato oficial por tipo/caderno a partir de informações mínimas, preparando-o para publicação e para a biblioteca eletrônica.

## Input
- Tipo de ato e informações mínimas (objeto, partes, valores, datas, fundamento)

## Output
- Ato completo no template ato-diario-oficial-tmpl.md, salvo em output/diario-oficial/, com metadados de publicação

## Action Items
1. Identifique o tipo de ato e o caderno (ver data/tipos-atos-do.md)
2. Verifique a obrigação de publicação (DOM e, se for licitação/contrato, PNCP)
3. Monte o corpo do ato completando a estrutura padrão
4. Gere os metadados (tipo, caderno, data, edição, palavras-chave, verificação)
5. Cheque LGPD (sem dado pessoal sensível desnecessário)
6. Marque informações faltantes com [PREENCHER:]

## Acceptance Criteria
- [ ] Ato classificado por tipo e caderno
- [ ] Obrigação de publicação verificada
- [ ] Metadados para a biblioteca presentes
- [ ] Arquivo salvo via Write
