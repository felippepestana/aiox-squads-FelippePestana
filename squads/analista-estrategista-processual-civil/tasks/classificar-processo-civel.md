# Task: Classificar Processo Civil

**ID:** `aepc-classificar-processo-civel`  
**Agent:** `classificador-civel`  
**Tier:** Tier 0  
**UC:** Todos (UC-AEPC-001 a 005)

## Objetivo

Identificar e classificar o processo civil em 4 dimensões: tipo de ação, fase processual, partes e competência.

## Input

- Descrição do processo fornecida pelo usuário
- Documentos processuais (quando disponíveis): petição inicial, contestação, sentença, acórdão

## Output

Ficha de Classificação Processual Civil em tabela Markdown com:
- Tipo de ação (conhecimento/execução/cautelar/procedimento especial)
- Fase processual (postulatória/saneamento/instrutória/decisória/recursal/execução)
- Polo ativo e polo passivo identificados
- Competência (estadual/federal, vara especializada)
- Próxima fase processual esperada

## Acceptance Criteria

- [ ] Tipo de ação identificado com base no CPC 2015
- [ ] Fase processual atual mapeada
- [ ] Polo ativo e passivo identificados (ou marcados como [NÃO IDENTIFICADO])
- [ ] Competência indicada
- [ ] Sem opinião sobre mérito ou estratégia

**Depends On:** Nenhuma (primeiro agente do Tier 0)  
**Feeds Into:** `aepc-auditar-compliance-cpc`
