# Task: Avaliar Conformidade e Maturidade

**ID:** `ap-avaliar-conformidade`
**Executor:** `avaliador-processual`
**Tier:** Tier 0
**Use Cases:** UC-AP-001, UC-AP-003
**Depends On:** `ap-mapear-processo`

## Overview

Avalia o processo mapeado em termos de maturidade (0-5), conformidade, gargalos, riscos operacionais e oportunidades de melhoria priorizadas.

## Input

- Mapa do processo produzido pelo `ap-mapear-processo`

## Output

- Pontuação de maturidade (0-5) com justificativa
- Tabela de gargalos identificados
- Top-5 riscos com probabilidade, impacto e mitigação
- Oportunidades de melhoria priorizadas por impacto

## Action Items

1. Analise cada etapa identificando gargalos (sem SLA, sem métrica, dependência manual)
2. Avalie riscos operacionais usando matriz probabilidade × impacto
3. Identifique etapas sem valor agregado (candidatas a eliminação)
4. Aplique os critérios de maturidade (0-5) e atribua o score
5. Elabore justificativa do score em 2-3 linhas
6. Priorize oportunidades de melhoria por impacto esperado

## Acceptance Criteria

- [ ] Pontuação de maturidade (0-5) atribuída com justificativa
- [ ] Mínimo 3 gargalos/riscos identificados (se processo > 5 etapas)
- [ ] Cada risco tem probabilidade, impacto E mitigação sugerida
- [ ] Oportunidades priorizadas por impacto
- [ ] QG-AP-003 satisfeito
