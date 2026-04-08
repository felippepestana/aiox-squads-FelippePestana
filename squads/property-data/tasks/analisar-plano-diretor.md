# Task: Analisar Plano Diretor

**ID:** `pd-analisar-plano-diretor`
**Executor:** `analista-urbanistico`
**Tier:** Tier 1
**Use Cases:** UC-PD-003, UC-PD-ALL

## Overview

Analisa a conformidade do imóvel com o plano diretor municipal e normas urbanísticas, identificando zona, usos permitidos, índices urbanísticos e atividades limitadoras.

## Input

- Endereço completo do imóvel
- Município e UF
- Tipo de uso pretendido (quando informado pelo usuário)

## Output

Relatório urbanístico com:
- Classificação da zona urbanística
- Índices urbanísticos aplicáveis (TO, CA, gabarito)
- Usos permitidos e proibidos
- Atividades limitadoras por zona
- Conformidade do uso atual com o zoneamento

## Action Items

1. Pesquise o plano diretor do município via WebSearch
2. Identifique a zona urbanística do endereço (mapa de zoneamento)
3. Compile índices urbanísticos: taxa de ocupação, coeficiente de aproveitamento, gabarito
4. Liste usos permitidos e proibidos na zona
5. Verifique parcelamento do solo (Lei 6.766/79 + norma municipal)
6. Pesquise código de obras: afastamentos, área permeável, altura máxima
7. Identifique atividades limitadoras na zona do imóvel
8. Se uso pretendido informado, avalie conformidade

## Acceptance Criteria

- [ ] Zona urbanística identificada com fonte legal
- [ ] Mínimo 3 índices urbanísticos compilados (TO, CA, gabarito)
- [ ] Usos permitidos/proibidos listados com artigo da lei
- [ ] Código de obras consultado para afastamentos e restrições
