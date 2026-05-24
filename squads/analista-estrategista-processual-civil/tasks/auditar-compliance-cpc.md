# Task: Auditar Compliance CPC

**ID:** `aepc-auditar-compliance-cpc`  
**Agent:** `auditor-processual`  
**Tier:** Tier 0  
**UC:** Todos (UC-AEPC-001 a 005)

## Objetivo

Auditar o processo civil nos 6 eixos de risco CPC 2015 e identificar riscos processuais com fundamento em artigos específicos.

## Input

- Ficha de Classificação do `classificador-civel`
- Descrição do processo e documentos disponíveis

## Output

Relatório de Auditoria Processual com:
- Tabela de riscos: eixo, risco identificado, artigo CPC/CC, gravidade (CRÍTICO/ALTO/MÉDIO/BAIXO), recomendação técnica de mitigação processual
- Prazos imediatos sinalizados com data limite
- Classificação de gravidade para cada risco

> **Nota:** A "recomendação" na tabela é estritamente técnica/processual (ex: "interromper prazo", "arguir incompetência", "protocolar embargos"), nunca estratégica (ex: "litigar vs. acordo").

## Acceptance Criteria

- [ ] 6 eixos auditados: pressupostos processuais, condições da ação, prescrição/decância, preclusão, nulidades, prazos imediatos
- [ ] Cada risco acompanhado do artigo CPC ou CC específico
- [ ] Riscos CRÍTICOS destacados
- [ ] Prazos fatais em menos de 7 dias sinalizados com ALERTA
- [ ] Recomendações restritas a ações técnicas/processuais — sem opinião estratégica

**Depends On:** `aepc-classificar-processo-civel`  
**Feeds Into:** Tier 1 (via chefe-estrategico)
