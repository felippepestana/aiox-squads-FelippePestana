# Task: Design 70-20-10 Learning Track (design-track)

**Executor:** track-designer
**Elicit:** Skills matrix, time constraints, social resources
**Mode:** Deterministic sequencing + 70-20-10 blend
**Output:** Learning track (YAML) with blend, sequence and application points

## Inputs Required

- `skills_matrix`: From map-skill-gap
- `time_budget`: Tempo disponível (ex: ~3h/semana, 8 semanas)
- `social_resources`: Recursos sociais disponíveis (mentor, peers, gestor)
- `constraints`: Restrições (remoto/presencial, ferramentas)

## Elicitation

Ask user:
1. "Quanto tempo por semana e por quantas semanas?"
2. "Há mentor/peers/gestor disponíveis para o componente social (20)?"
3. "Restrições de formato? (remoto, presencial, ferramentas)"

## Execution Steps

1. **Map to Blend**: Para cada objetivo, distribuir em 70 (experiencial) / 20 (social) / 10 (formal)
2. **Sequence**: Ordenar por pré-requisitos (fundamento → avançado); aplicar spaced learning
3. **Estimate Time**: Tempo realista por módulo e total (respeitando a jornada)
4. **Plan Application**: Pelo menos 1 ponto de aplicação no trabalho por competência
5. **Specify Social**: Definir mentoria/peer/shadowing concretos
6. **Output**: Trilha 70-20-10 pronta para content-forge

## Output Format

```yaml
learning_track:
  title: "Primeira Liderança — Transição de Gestor"
  skills_matrix_ref: "COMP_001, COMP_002"
  designed_by: "track-designer"
  timestamp: "2026-06-08T12:00:00Z"
  duration: { weeks: 8, formal_hours_per_week: 2.5, total_formal_hours: 20 }

  blend_summary:
    experiential_pct: 70
    social_pct: 20
    formal_pct: 10

  modules:
    - id: "MOD_001"
      competency: "COMP_001 — Feedback estruturado"
      sequence: 1
      prerequisites: []
      components:
        formal: "Microcurso SBI (2h) — content-forge"
        social: "Role-play de feedback com peer + revisão do mentor (1 sessão)"
        experiential: "Conduzir 2 1:1 reais com SBI; coletar evidência (rubrica)"
      application_point: "1:1 reais nas semanas 3–4, avaliados por rubrica"
      spaced: "Formal semana 2 → prática semanas 3-4 → reforço semana 6"
    - id: "MOD_002"
      competency: "COMP_002 — Delegação situacional"
      sequence: 2
      prerequisites: ["MOD_001"]
      components:
        formal: "Microcurso de delegação situacional (1.5h)"
        social: "Discussão de casos com o gestor (1 sessão)"
        experiential: "Delegar 1 entrega real ajustando o estilo; reflexão"
      application_point: "Delegação real na semana 6, com justificativa do estilo"

  realism_check:
    fits_work_week: true
    note: "2.5h/semana de formal cabe na jornada; 70/20 ocorrem no fluxo de trabalho."
```

## Veto Conditions

- No VETO no design, MAS:
- Trilha 100% formal (sem 70/20) → ALERT "desbalanceada", replaneje
- Estimativa de tempo irreal → ALERT, ajuste
- Competência sem ponto de aplicação → adicionar antes de avançar

## Completion Criteria

✅ 70-20-10 explícito por objetivo
✅ Sequência com pré-requisitos e spaced learning
✅ Tempo realista (cabe na jornada)
✅ Ponto de aplicação no trabalho por competência
✅ Componentes sociais concretos
✅ Trilha pronta para content-forge
