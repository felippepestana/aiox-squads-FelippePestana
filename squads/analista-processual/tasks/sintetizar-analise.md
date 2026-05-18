# Task: Sintetizar Análise

**ID:** `ap-sintetizar-analise`
**Executor:** `analista-chefe`
**Tier:** Orchestrator
**Use Cases:** UC-AP-001, UC-AP-002, UC-AP-003
**Depends On:** All activated agents completed

## Overview

Consolida todos os outputs dos agentes ativados em um pacote estruturado para o @documentador-processual gerar o relatório final.

## Input

- Outputs de todos os agentes ativados no pipeline

## Output

- Pacote de síntese estruturado (modo + todos os outputs consolidados)
- Contradições ou inconsistências sinalizadas
- Instrução clara para @documentador-processual

## Action Items

1. Verifique que todos os agentes ativados produziram output
2. Identifique e sinalize contradições entre outputs dos agentes
3. Determine o modo de documentação (MODO_PROCESSUAL ou MODO_JURIDICO)
4. Estruture o pacote de síntese com os outputs numerados
5. Passe o pacote ao @documentador-processual com instrução explícita do modo
6. Aguarde confirmação do @documentador-processual que o arquivo foi salvo (QG-AP-004)

## Acceptance Criteria

- [ ] Todos os agentes ativados produziram output
- [ ] Modo de documentação definido (PROCESSUAL ou JURIDICO)
- [ ] Contradições sinalizadas (ou confirmado que nenhuma)
- [ ] @documentador-processual acionado com pacote completo
- [ ] QG-AP-004 verificado após confirmação do documentador
