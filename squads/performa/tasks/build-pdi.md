# build-pdi

## Task: Build an Individual Development Plan

### Metadata
- **executor:** pdi-builder
- **elicit:** false
- **mode:** generative
- **output:** pdi.md

### Inputs Required
```text
review.yaml / ninebox.yaml (gaps)
behavioral_context: optional profiler-dna read (weight 0)
goals: career path / OKRs
```

### Elicitation
```text
(uses gaps + optional behavioral context)
```

### Execution Steps

#### Step 1: Anchor to gaps
- Turn specific review/9-box gaps and goals into 2-3 focused development objectives.

#### Step 2: Design 70-20-10
- For each, blend experiential (70), social (20) and formal (10) learning.

#### Step 3: Tailor by context (weight 0)
- Use profiler-dna behavioral context to adapt communication/feedback style — not the rating.

#### Step 4: Set concrete next steps
- Every item gets an action, an owner and a timeline; tie to OKRs/career path.

### Output Format
```yaml
# Plano de Desenvolvimento — {pessoa}
Objetivos de desenvolvimento (a partir dos gaps)
Para cada: 70 (experiencial) / 20 (social) / 10 (formal)
Contexto comportamental (peso 0): {como comunicar/dar feedback}
Proximos passos: acao | responsavel | prazo
```

### Veto Conditions
- Cannot set ratings/decisions from personality
- Cannot default to courses only
- Cannot leave items without owner/timeline

### Completion Criteria
- Plan anchored to concrete gaps/goals
- 70-20-10 blend per objective
- Context applied at weight 0
- Next steps with owners and timelines
