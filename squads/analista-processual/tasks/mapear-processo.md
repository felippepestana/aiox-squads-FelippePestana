# Task: Mapear Processo

**ID:** `ap-mapear-processo`
**Executor:** `mapeador-processual`
**Tier:** Tier 0
**Use Cases:** UC-AP-001, UC-AP-003

## Overview

Mapeia todas as etapas, atores, entradas/saídas, pontos de decisão e sistemas de um processo em formato estruturado (pseudo-BPMN textual).

## Input

- Descrição textual do processo (fornecida pelo usuário ou @analista-chefe)
- Documentos no workspace (opcional — usar Glob/Read se disponível)

## Output

Tabela estruturada com:
- Etapas em ordem cronológica
- Ator por etapa
- Entradas e saídas
- Critério de conclusão
- Pontos de decisão (gateways)
- Sistemas e ferramentas por etapa

## Action Items

1. Identifique todas as etapas do processo em ordem cronológica
2. Atribua um ator responsável a cada etapa
3. Defina entradas (inputs) e saídas (outputs) de cada etapa
4. Estabeleça o critério de conclusão de cada etapa
5. Mapeie todos os pontos de decisão com condições verdadeiro/falso
6. Liste sistemas e ferramentas utilizadas por etapa
7. Sinalize etapas com informações incompletas com `[INCOMPLETO — verificar]`

## Acceptance Criteria

- [ ] Todas as etapas listadas em ordem cronológica
- [ ] Cada etapa tem ator responsável identificado
- [ ] Cada etapa tem entradas e saídas definidas
- [ ] Cada etapa tem critério de conclusão
- [ ] Pontos de decisão mapeados com condições
- [ ] Tabela formatada corretamente em Markdown
