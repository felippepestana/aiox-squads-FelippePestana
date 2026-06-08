# Task: Build Assessment & Certification (assess-learning)

**Executor:** assessment-master
**Elicit:** Skills matrix, learning track, content
**Mode:** Bloom-aligned, application-focused assessment design
**Output:** Assessment (YAML) with rubric, Kirkpatrick mapping and certification criteria

## Inputs Required

- `skills_matrix`: From map-skill-gap (objetivos + nível de Bloom)
- `learning_track`: From design-track (pontos de aplicação)
- `content_meta`: From build-content
- `cert_required`: Há certificação? (sim/não)

## Elicitation

Ask user:
1. "Quais objetivos avaliar?"
2. "Haverá certificação? Qual o uso (interno, requisito de cargo)?"
3. "É possível avaliar aplicação no trabalho (Kirkpatrick 3)?"

## Execution Steps

1. **Align to Bloom**: Cada item no nível de Bloom do objetivo (não abaixo)
2. **Prioritize Application**: Avaliar aplicação no trabalho (Kirkpatrick 3) sempre que possível
3. **Build Rubric**: Rubrica com níveis descritos para a avaliação de aplicação
4. **Set Certification**: Critério observável + limiar explícito de aprovação
5. **Map Kirkpatrick**: Classificar cada medição (1=reação, 2=aprendizado, 3=aplicação, 4=resultado)
6. **Output**: Avaliação + critérios de certificação

## Output Format

```yaml
assessment:
  track_ref: "Primeira Liderança"
  built_by: "assessment-master"
  timestamp: "2026-06-08T12:00:00Z"

  items:
    - id: "ASS_001"
      competency: "COMP_001 — Feedback estruturado"
      bloom_level: "aplicar"
      kirkpatrick_level: 3
      type: "aplicação no trabalho"
      prompt: "Conduza 2 1:1 reais usando SBI; submeta as notas para avaliação por rubrica."
      rubric:
        - level: "proficiente (4)"
          descriptor: "SBI completo nos 2 1:1, impacto descrito objetivamente"
        - level: "competente (3)"
          descriptor: "SBI presente, impacto às vezes vago"
        - level: "iniciante (2)"
          descriptor: "Estrutura SBI ausente ou incompleta"
    - id: "ASS_002"
      competency: "COMP_002 — Delegação situacional"
      bloom_level: "analisar"
      kirkpatrick_level: 3
      type: "cenário aplicado"
      prompt: "Delegue uma entrega real; justifique o estilo escolhido vs. a maturidade do liderado."

  kirkpatrick_distribution:
    level_1_reaction: 0
    level_2_learning: 1     # quiz de conhecimento (do content-forge)
    level_3_application: 2  # avaliações de aplicação
    level_4_results: 0      # acompanhado por insights pós-trilha

  certification:
    enabled: true
    criteria: ">= nível 'proficiente (4)' em COMP_001 e >= 'competente (3)' em COMP_002, por rubrica"
    threshold: "média ponderada >= 80%"
    validity: "12 meses; reavaliar na próxima janela de ciclo"
    note: "Certificação por aplicação observada, não por conclusão de conteúdo."
```

## Veto Conditions

- No VETO na construção, MAS (o learning-gate VETA se):
- Avaliação mede só conclusão/satisfação (Kirkpatrick 1-2) num objetivo de aplicação
- Item abaixo do nível de Bloom do objetivo
- Certificação sem critério observável + limiar

## Completion Criteria

✅ Itens alinhados ao nível de Bloom do objetivo
✅ Aplicação no trabalho priorizada (Kirkpatrick 3+)
✅ Rubrica com níveis descritos
✅ Certificação com critério observável + limiar
✅ Distribuição Kirkpatrick mapeada
✅ Avaliação pronta para learning-gate
