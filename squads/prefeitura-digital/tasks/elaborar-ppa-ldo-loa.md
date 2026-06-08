# Task: Elaborar/Atualizar PPA, LDO ou LOA

**ID:** `pd-elaborar-ppa-ldo-loa`
**Executor:** `planejador-orcamentario`
**Tier:** Tier Orçamento
**Use Cases:** UC-PD-006

## Overview
Elabora ou atualiza o instrumento de planejamento orçamentário (PPA, LDO ou LOA), com coerência entre os três e aderência normativa.

## Input
- Instrumento e exercício/quadriênio
- Diretrizes superiores (PPA orienta LDO; LDO orienta LOA)

## Output
- Minuta no template ppa-ldo-loa-tmpl.md, salva em output/orcamento/

## Action Items
1. Identifique o instrumento e o horizonte temporal
2. Estruture programas/metas/indicadores (PPA), prioridades e anexos fiscais (LDO) ou receita/despesa (LOA)
3. Garanta vinculações (saúde 15%, educação 25%/FUNDEB) e limites (LRF)
4. Valide a coerência entre PPA/LDO/LOA
5. Acione controlador-orcamentario para validação fiscal
6. Marque dados quantitativos com [PREENCHER:]

## Acceptance Criteria
- [ ] Estrutura conforme o instrumento e a base normativa
- [ ] Anexos fiscais incluídos (LDO)
- [ ] Coerência entre instrumentos verificada
- [ ] Arquivo salvo via Write
