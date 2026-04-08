# Task: Pesquisar Documentação Condominial

**ID:** `pd-pesquisar-documentacao-condominial`
**Executor:** `analista-condominial`
**Tier:** Tier 2
**Use Cases:** UC-PD-005, UC-PD-ALL

## Overview

Pesquisa e compila documentação de condomínios e conjuntos residenciais, incluindo convenção, regulamento interno, atas de assembleia, aforamento e documentos de formação.

## Input

- Nome do condomínio/conjunto residencial
- Endereço completo
- Dados registrais (quando disponíveis)

## Output

Relatório condominial com:
- Dados da convenção condominial (regras, fração ideal, áreas comuns)
- Regulamento interno (restrições de uso, normas de convivência)
- Atas relevantes (decisões importantes, alterações)
- Dados de aforamento (quando aplicável)
- Documentos de formação do conjunto (loteamento, memorial descritivo)

## Action Items

1. Pesquise informações sobre o condomínio/conjunto residencial via WebSearch
2. Identifique convenção condominial (regras, fração ideal, áreas comuns)
3. Pesquise regulamento interno e restrições de uso
4. Pesquise atas de assembleia com decisões relevantes
5. Se aforamento: pesquise SPU, laudêmio, terreno de marinha
6. Pesquise documentos de formação (loteamento original, memorial descritivo)
7. Distinga condomínio edilício (Lei 4.591/64 / CC 2002) de associação de moradores
8. Compile documentos encontrados com referência e data

## Acceptance Criteria

- [ ] Tipo de organização identificado (condomínio edilício vs associação)
- [ ] Documentos encontrados listados com referência e data
- [ ] Principais disposições da convenção/regulamento extraídas
- [ ] Aforamento verificado (quando aplicável)
