# Task: Analisar Estratégia Processual

**ID:** `ap-analisar-estrategia`
**Executor:** `estrategista-processual`
**Tier:** Tier 1
**Use Cases:** UC-AP-002, UC-AP-003

**Depends On:**
- UC-AP-002: `ap-ler-peca`, `ap-pesquisar-jurisprudencia`
- UC-AP-003: `ap-avaliar-conformidade` (usa outputs do Tier 0)

## Overview

Elabora análise estratégica do processo identificando posicionamento, riscos, oportunidades, 3 cenários com probabilidades e viabilidade de acordo.

## Input

- Extrações estruturadas do `ap-ler-peca` (UC-AP-002) ou outputs do Tier 0 (UC-AP-003)
- Pesquisa jurídica do `ap-pesquisar-jurisprudencia` (UC-AP-002)

## Output

- Posicionamento processual (pontos fortes/fracos por polo)
- Riscos e oportunidades identificados com nível de criticidade
- 3 cenários (otimista, realista, pessimista) com probabilidades (%)
- Avaliação de viabilidade de acordo

## Action Items

1. Analise a fase processual e sua relevância estratégica
2. Mapeie pontos fortes e vulnerabilidades de cada polo
3. Avalie provas produzidas vs. provas necessárias
4. Identifique riscos jurídicos (prescrição, preclusão, nulidades)
5. Identifique oportunidades processuais (tutelas, reconvenção, etc.)
6. Elabore 3 cenários com probabilidades (soma = 100%)
7. Avalie viabilidade de acordo (Alta/Média/Baixa) com justificativa

## Acceptance Criteria

- [ ] Posicionamento por polo definido
- [ ] 3 cenários com percentuais que somam 100%
- [ ] Riscos identificados com nível de criticidade (Alto/Médio/Baixo)
- [ ] Viabilidade de acordo avaliada
- [ ] Nenhum cenário sem percentual de probabilidade
