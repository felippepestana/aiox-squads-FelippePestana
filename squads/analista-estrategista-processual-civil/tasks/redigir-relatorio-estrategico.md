# TSK-AEPC-008 — Redigir Relatório Estratégico

```yaml
id: TSK-AEPC-008
agent: redator-estrategico
tier: tier_sintese
ucs:
  - UC-AEPC-001
  - UC-AEPC-002
  - UC-AEPC-003
  - UC-AEPC-004
  - UC-AEPC-005

objetivo: |
  Consolidar todos os outputs das análises anteriores (Tier 0 + Tier 1) em um
  relatório final estruturado, salvo em arquivo Markdown, pronto para entrega
  ao advogado ou cliente. O modo de redação (MODO_COMPLETO ou MODO_DIAGNOSTICO)
  é determinado pelo UC ativo.

input:
  required:
    - outputs de TSK-AEPC-001 (classificação processual)
    - outputs de TSK-AEPC-002 (auditoria CPC)
  optional_tier1:
    - outputs de TSK-AEPC-003 (leitura de peças) — MODO_COMPLETO
    - outputs de TSK-AEPC-004 (pesquisa CPC/STJ) — MODO_COMPLETO
    - outputs de TSK-AEPC-005 (estratégia cível) — MODO_COMPLETO
    - outputs de TSK-AEPC-006 (análise de recurso) — UC-AEPC-003 e UC-AEPC-005
    - outputs de TSK-AEPC-007 (plano de ação) — MODO_COMPLETO
  mode_selector: |
    UC-AEPC-002 → MODO_DIAGNOSTICO (relatório simplificado, ~500 palavras)
    UC-AEPC-001 / 003 / 004 / 005 → MODO_COMPLETO (8 seções, ≥ 1000 palavras)

output:
  formato: Markdown (.md)
  nomenclatura: relatorio-estrategico-civel-[slug-do-caso]-[AAAA-MM-DD].md
  operacao: SEMPRE usar Write para salvar o arquivo — nunca resposta somente em chat
  secoes_modo_completo:
    - "1. Identificação do Caso"
    - "2. Diagnóstico Processual (Tier 0)"
    - "3. Análise das Peças"
    - "4. Fundamentação Legal e Jurisprudencial"
    - "5. Estratégia Recomendada"
    - "6. Análise Recursal" # omitir se UC-AEPC-001 ou UC-AEPC-004
    - "7. Plano de Ação"
    - "8. Citações e Fontes"
  secoes_modo_diagnostico:
    - "1. Identificação do Caso"
    - "2. Diagnóstico Rápido"
    - "3. Riscos Identificados"
    - "4. Próximos Passos Imediatos"

acceptance_criteria:
  - Arquivo salvo via Write com nomenclatura correta
  - Modo correto aplicado conforme UC ativo
  - Toda citação legal inclui artigo + diploma normativo (ex: art. 337 CPC 2015)
  - Toda menção jurisprudencial inclui tribunal + número + ano
  - Nenhuma seção fica em branco — se dados ausentes, registrar "Dados insuficientes para análise"
  - MODO_COMPLETO: mínimo 8 seções, ≥ 1000 palavras
  - MODO_DIAGNOSTICO: máximo 4 seções, linguagem acessível ao cliente
  - Seção 6 (Análise Recursal) somente presente em UC-AEPC-003 e UC-AEPC-005

depends_on:
  required:
    - TSK-AEPC-001
    - TSK-AEPC-002
  conditional_completo:
    - TSK-AEPC-003
    - TSK-AEPC-004
    - TSK-AEPC-005
    - TSK-AEPC-006
    - TSK-AEPC-007

feeds_into:
  - ENTREGA FINAL — arquivo salvo localmente pelo usuário
  - Pode alimentar revisão humana antes de uso em processo

quality_gate: QG-AEPC-004
notes: |
  Este é o único agente que gera saída persistente (arquivo). O uso de Write é
  mandatório — relatórios apenas em chat violam QG-AEPC-004 e tornam o output
  irrastreável. Em UC-AEPC-002, priorizar clareza e brevidade sobre completude.
```
