# Task: Orientar Plano de Ação Cível

**ID:** `aepc-orientar-plano-civel`  
**Agent:** `orientador-civel`  
**Tier:** Tier 1  
**UC:** UC-AEPC-001, 003, 004, 005

## Objetivo

Elaborar plano de ação processual civil com prazos CPC e orientações ao cliente.

## Input

- Análise estratégica do `estrategista-civel`
- Análise recursal do `analista-recursos` (quando aplicável)
- Relatório de Auditoria do `auditor-processual` (prazos imediatos)

## Output

Plano de Ação em 4 seções:
1. Ações urgentes (até 7 dias) com data limite e artigo CPC
2. Plano de ação 4-8 semanas (tabela: semana, ação, prazo CPC, objetivo, responsável)
3. Monitoramento processual (DJe, sistema processual, eventos de alerta)
4. Comunicação com o cliente (linguagem acessível, expectativas, orientações práticas)

## Acceptance Criteria

- [ ] Seção 1 presente (mesmo que [Nenhuma ação urgente identificada])
- [ ] Cada ação com prazo CPC identificado (artigo)
- [ ] Tabela de plano de ação com no mínimo 3 linhas
- [ ] Seção de comunicação com o cliente presente
- [ ] Sem elaboração de peças processuais

**Depends On:**
- UC-AEPC-001: `aepc-analisar-recurso`
- UC-AEPC-003/004/005: `aepc-analisar-estrategia-civel`  
**Feeds Into:** `aepc-redigir-relatorio-estrategico`
