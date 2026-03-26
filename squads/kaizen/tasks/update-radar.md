---
task: updateRadar()
responsavel: "TechRadar"
responsavel_type: Agente
atomic_layer: Molecule
Entrada:
  - nome: current_radar
    tipo: yaml
    obrigatorio: true
  - nome: tool_usage_data
    tipo: object
    obrigatorio: true
Saida:
  - nome: updated_radar
    tipo: yaml
    obrigatorio: true
Checklist:
  - Carregar radar atual (initial-radar.yaml)
  - Avaliar ferramentas com Fitness Functions
  - Classificar em rings (Adopt/Trial/Assess/Hold)
  - Identificar ferramentas novas para avaliacao
  - Gerar radar atualizado com justificativas
---

# Task: Update Technology Radar

# ID: KZ-TP-003

# Executor: tech-radar

# Trigger: *radar command or quarterly cadence

task:
  name: "Update Technology Radar"
  status: ready
  responsible_executor: tech-radar
  execution_type: agent
  elicit: false

  description: |
    Update the technology radar with current tool evaluations,
    movements between rings, and fitness function results.

  input:
    - "squads/*/config/config.yaml — tools referenced by squads"
    - "squads/*/agents/*.md — tools/APIs used by agents"
    - "squads/kaizen/data/radar/ — previous radar state"
    - "Capability gaps from capability-mapper"

  steps:
    - id: "1"
      name: "Inventory current tools"
      action: |
        1. Scan all squad configs and agent files for tool references
        2. Categorize into 4 quadrants: APIs, MCPs, Libraries, Models
        3. Count usage frequency per tool

    - id: "2"
      name: "Evaluate ring placement"
      action: |
        Per tool:
        - Adopt: >3 successful uses, proven reliability
        - Trial: 1-3 uses, positive results
        - Assess: 0 uses but addresses known gap
        - Hold: known issues or better alternative exists
        Apply KZ_TR_001 (adopt without evidence)
        Apply KZ_TR_002 (hold too long)

    - id: "3"
      name: "Validate Adopt/Trial via external research (BLOCKING)"
      action: |
        GATE OBRIGATÓRIO para tools classificadas como Adopt ou Trial no Step 2.
        Validação interna (uso + fitness) é necessária mas NÃO suficiente para
        recomendar adoção — o ecossistema externo pode revelar problemas invisíveis.

        3a. Para cada tool em Adopt ou Trial, pesquisar:
        - Usar Exa (mcp__exa__web_search_exa):
          Query: "[tool name] [category] production issues reliability"
          Query: "[tool name] vs [alternatives] comparison benchmark"
        - Nota: Exa retorna resultados recentes por default. NÃO hardcodar anos.
        - Min 1 query por tool em Adopt, 1 por tool em Trial

        3b. Teste de 3 perguntas:
        | Pergunta | Se NÃO |
        |----------|--------|
        | A comunidade confirma estabilidade/confiabilidade? | Rebaixar ring (Adopt→Trial, Trial→Assess) |
        | Existem alternativas superiores não detectadas internamente? | Documentar na seção "alternativas" |
        | Há CVEs, deprecations ou breaking changes planejados? | Adicionar alerta no radar |

        3c. Classificar decisão de ring:
        - Confirmada: evidência interna + externa alinhadas
        - Cautelosa: evidência interna positiva mas externa levanta dúvidas → rebaixar 1 ring
        - Bloqueada: evidência externa contradiz interna → manter em Hold até investigação

        Tools NÃO em Adopt/Trial (Assess, Hold) não precisam desta validação.

    - id: "4"
      name: "Detect movements"
      action: |
        Compare current placement vs previous radar
        Document movements with evidence for each change
        Apply KZ_TR_005 (new tool opportunity)

    - id: "5"
      name: "Run fitness functions"
      action: |
        Per squad:
        - Latency: avg response time for tasks
        - Token efficiency: output quality per token
        - Accuracy: acceptance criteria pass rate
        - Cost/task: total cost divided by completed tasks
        Apply KZ_TR_003 (missing fitness function)

    - id: "6"
      name: "Check for consolidation"
      action: |
        Apply KZ_TR_004 (tool sprawl)
        Identify duplicate tools serving same purpose
        Recommend consolidation where applicable

  output:
    format: "Technology Radar"
    template: "templates/tech-radar-tmpl.md"

  acceptance_criteria:
    - "All tools categorized into quadrants"
    - "All tools placed in appropriate ring with evidence"
    - "Adopt/Trial tools validated via external research (Step 3)"
    - "Movements documented with rationale"
    - "Fitness functions run for all active squads"
    - "Consolidation opportunities identified"

  veto_conditions:
    - "Movimento entre rings sem evidência de fitness function → BLOQUEAR (RULE-RD-001)"
    - "Tool em Adopt sem 3+ usos comprovados → REBAIXAR para Trial"
    - "Tool em Adopt/Trial sem validação externa (Step 3) → BLOQUEAR"
    - "Nova tool em Assess sem gap correspondente no capability-mapper → REMOVER"
    - "Consolidação recomendada sem grep de referências no codebase → BLOQUEAR (GATE-RD-VERIFY)"

  action_items:
    - "Run tech-radar *radar"
    - "Save updated radar to data/radar/"
    - "Hand off tool gap recommendations to kaizen-chief"
