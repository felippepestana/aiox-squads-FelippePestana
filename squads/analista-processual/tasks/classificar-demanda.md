# Task: Classificar Demanda

**ID:** `ap-classificar-demanda`
**Executor:** `analista-chefe`
**Tier:** Orchestrator
**Use Cases:** All

## Overview

Classifica a demanda recebida em um dos 5 use cases do squad e define o plano de ativação dos agentes. Esta é sempre a primeira tarefa executada (QG-AP-001).

## Input

- Mensagem ou descrição fornecida pelo usuário
- Documentos anexados (opcional)

## Output

- Use case classificado (UC-AP-001, 002, 003, 004 ou 005)
- Lista de agentes a serem ativados
- Modo de documentação final (MODO_PROCESSUAL, MODO_JURIDICO, RESPOSTA_DIRETA ou ELABORACAO_PECA)

## Action Items

1. Leia a mensagem do usuário identificando palavras-chave
2. Aplique o algoritmo de classificação usando os gatilhos da **fonte canônica** `config.yaml > pipeline.use_cases` (não duplique a lista de gatilhos aqui)
3. Se ambíguo, pergunte ao usuário para esclarecer
4. Defina os agentes a acionar e a sequência de ativação
5. Comunique o plano ao usuário brevemente antes de executar

## Acceptance Criteria

- [ ] Use case atribuído (UC-AP-001 a 005)
- [ ] Lista de agentes definida
- [ ] Modo de documentação definido
- [ ] Nenhum agente acionado antes da classificação
