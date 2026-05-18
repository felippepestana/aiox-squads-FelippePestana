# Task: Pesquisar Jurisprudência

**ID:** `ap-pesquisar-jurisprudencia`
**Executor:** `pesquisador-juridico`
**Tier:** Tier 1
**Use Cases:** UC-AP-002, UC-AP-003, UC-AP-004

## Overview

Pesquisa e compila jurisprudência, legislação, súmulas e doutrina relevantes para a matéria jurídica em questão nas 5 dimensões padronizadas.

## Input

- Questões jurídicas e fundamentos identificados pelo `ap-ler-peca` (ou direto do usuário)

## Output

Bibliografia estruturada com:
- Legislação aplicável com artigos
- Jurisprudência STF/STJ com número, data e ementa
- Súmulas e teses vinculantes aplicáveis
- Posição doutrinária majoritária

## Action Items

1. Identifique a matéria jurídica principal e subsidiárias
2. Pesquise a legislação aplicável (planalto.gov.br, lexml.gov.br)
3. Pesquise STF (repercussão geral, controle de constitucionalidade) via WebSearch
4. Pesquise STJ (recurso especial, teses repetitivas, súmulas) via WebSearch
5. Pesquise TJs e TRFs relevantes para a matéria e jurisdição
6. Compile súmulas e OJs aplicáveis
7. Identifique a posição doutrinária majoritária
8. Sinalize entendimentos controvertidos apresentando ambas as posições

## Acceptance Criteria

- [ ] Mínimo 5 fontes citadas com tribunal/fonte, número e data
- [ ] Decisões recentes (preferencialmente últimos 5 anos) priorizadas
- [ ] Súmulas aplicáveis identificadas
- [ ] Posição majoritária sintetizada
- [ ] Controvérsias identificadas quando existentes
