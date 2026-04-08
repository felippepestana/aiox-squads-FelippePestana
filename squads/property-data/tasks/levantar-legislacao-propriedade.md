# Task: Levantar Legislação da Propriedade

**ID:** `pd-levantar-legislacao`
**Executor:** `analista-legislativo`
**Tier:** Tier 1
**Use Cases:** UC-PD-002, UC-PD-ALL

## Overview

Identifica e compila toda legislação federal, estadual e municipal aplicável ao imóvel, incluindo restrições, limitações e normas de regularização.

## Input

- Endereço completo do imóvel (cidade e UF são essenciais)
- Tipo do imóvel (residencial, comercial, rural, etc.)
- Dados registrais quando disponíveis (matrícula, aforamento, etc.)

## Output

Tabela legislativa estruturada por esfera (federal/estadual/municipal) com:
- Dispositivo legal, artigo/parágrafo, conteúdo relevante
- Restrições identificadas com impacto qualificado
- Normas de regularização aplicáveis

## Action Items

1. Identifique legislação federal aplicável (CC, Lei 6.015/73, CF/88, Lei 6.766/79)
2. Pesquise legislação estadual relevante via WebSearch
3. Pesquise legislação municipal: plano diretor, código de obras, código de posturas
4. Identifique restrições: limitações administrativas, servidões, tombamento, desapropriação
5. Verifique normas de regularização: REURB (Lei 13.465/17), usucapião, aforamento
6. Se imóvel tombado: pesquise IPHAN e órgão estadual de patrimônio
7. Se aforamento: pesquise Lei 9.636/98 e terrenos de marinha
8. Compile tudo em tabela estruturada por esfera

## Acceptance Criteria

- [ ] Mínimo 5 dispositivos legais identificados com artigos e ementas
- [ ] Legislação das 3 esferas coberta (federal, estadual, municipal)
- [ ] Restrições identificadas com impacto qualificado (alto/médio/baixo)
- [ ] Todas as fontes com referência completa (lei, artigo, data)
