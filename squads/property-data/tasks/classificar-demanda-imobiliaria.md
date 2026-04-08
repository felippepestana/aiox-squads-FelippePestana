# Task: Classificar Demanda Imobiliária

**ID:** `pd-classificar-demanda`
**Executor:** `property-data-chief`
**Tier:** Orchestrator
**Use Cases:** Todos (UC-PD-001~007, UC-PD-ALL)

## Overview

Classifica a demanda do usuário em um ou mais use cases (UC-PD-001~007) e extrai o endereço completo do imóvel para iniciar o pipeline de pesquisa.

## Input

- Descrição da demanda do usuário (texto livre)
- Opcionalmente: documentos anexados (PDF, imagens)

## Output

- Use case(s) classificado(s) com justificativa
- Endereço completo estruturado (rua, número, bairro, cidade, UF, CEP)
- Plano de ativação dos agentes (quais serão acionados e em que ordem)

## Action Items

1. Leia a demanda do usuário e identifique os termos-chave (triggers)
2. Classifique em um ou mais UC-PD conforme a tabela de triggers
3. Extraia o endereço completo do imóvel
4. Se o usuário enviou documentos/imagens, planeje acionar o leitor-documental primeiro
5. Se a demanda for ambígua, pergunte ao usuário para esclarecer
6. Apresente o plano de ativação dos agentes

## Acceptance Criteria

- [ ] Use case classificado com justificativa
- [ ] Endereço completo extraído (mínimo: rua + número + cidade + UF)
- [ ] Plano de ativação dos agentes definido
- [ ] Se ambíguo, pergunta de esclarecimento formulada
