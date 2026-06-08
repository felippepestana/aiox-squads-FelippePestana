# Task: Map Skill Gap to Competency Matrix (map-skill-gap)

**Executor:** skill-mapper
**Elicit:** Gap source, target audience, current/target proficiency
**Mode:** Deterministic mapping + objective writing
**Output:** Skills matrix (YAML) with measurable learning objectives

## Inputs Required

- `gap_source`: Origem do gap (performa ciclo/9-box | org-architect matriz | insights coorte)
- `audience`: Público-alvo (cargo, coorte, n pessoas)
- `current_level`: Nível de proficiência atual (escala 1–5)
- `target_level`: Nível de proficiência alvo (escala 1–5)
- `business_goal`: Objetivo de negócio que o fechamento do gap serve

## Elicitation

Ask user:
1. "Qual o gap e de onde vem? (avaliação performa, matriz de cargo, coorte de insights)"
2. "Para quem? (cargo/coorte e quantas pessoas)"
3. "Nível atual e nível alvo de proficiência? (1–5)"
4. "Que objetivo de negócio isso serve?"

## Execution Steps

1. **Decompose Gap**: Quebrar o gap em competências específicas e observáveis
2. **Trace Source**: Registrar a fonte de cada competência (módulo + evidência)
3. **Set Levels**: Definir nível atual e alvo por competência (escala explícita)
4. **Write Objectives**: Objetivo mensurável por competência (verbo + condição + critério)
5. **Validate Observability**: Garantir que cada competência é observável no trabalho
6. **Output**: Matriz de competências pronta para track-designer

## Output Format

```yaml
skills_matrix:
  gap_source: "performa — ciclo 2026.1, 9-box"
  audience: { role: "gestor recém-promovido", cohort_size: 12 }
  business_goal: "Reduzir atrito de transição na primeira liderança"
  mapped_by: "skill-mapper"
  timestamp: "2026-06-08T12:00:00Z"
  proficiency_scale: "1=ciente · 2=iniciante · 3=competente · 4=proficiente · 5=expert"

  competencies:
    - id: "COMP_001"
      name: "Feedback estruturado"
      observable: "Conduz 1:1 com feedback no modelo SBI (Situação-Comportamento-Impacto)"
      current_level: 2
      target_level: 4
      source: "performa — gap recorrente em 8/12 gestores"
      objective: "Dar feedback SBI em 1:1 com >= 90% de aderência ao modelo (rubrica)"
      bloom_level: "aplicar"
    - id: "COMP_002"
      name: "Delegação situacional"
      observable: "Ajusta nível de delegação ao nível de maturidade do liderado"
      current_level: 2
      target_level: 3
      source: "performa + org-architect (matriz de cargo gestor)"
      objective: "Selecionar o estilo de delegação adequado em 3 cenários reais, justificando"
      bloom_level: "analisar"

  summary:
    competencies_count: 2
    all_observable: true
    all_sourced: true
    all_measurable: true
```

## Veto Conditions

- No VETO no mapeamento, MAS:
- Competência sem nível atual/alvo → devolver para esclarecer
- Competência sem fonte → ALERT "gap não validado"
- Objetivo sem critério mensurável → reescrever antes de avançar

## Completion Criteria

✅ Gap decomposto em competências observáveis
✅ Fonte de cada competência rastreada
✅ Níveis atual e alvo definidos (escala explícita)
✅ Objetivos mensuráveis (verbo + condição + critério)
✅ Matriz pronta para track-designer
