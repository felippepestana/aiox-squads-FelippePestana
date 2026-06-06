# generate-report

## Task: Generate Candidate Report + Minutas

### Metadata
- **executor:** talent-compass-chief
- **elicit:** false
- **mode:** generative
- **output:** candidate-report.md + minutas/*

### Inputs Required
```
scorecard (fairness-gate PASSED)
role_profile
behavioral_context (weight 0)
decision_stage: convocacao|parecer|proposta|lgpd|devolutiva
```

### Elicitation
```
(no elicitation; requires a PASSED fairness audit)
```

### Execution Steps

#### Step 1: Verify fairness PASS
- Refuse to generate a recommendation report unless fairness-gate returned PASS for this candidate.

#### Step 2: Assemble the candidate report
- Use the candidate-report template: objectives, scorecard with evidence, behavioral context (weight 0), recommendation and confidence.

#### Step 3: Select and fill minutas
- Based on decision_stage, render the appropriate minuta (convocacao, parecer, proposta, termo LGPD, devolutiva) from templates/minutas.

#### Step 4: Frame as recommendation
- State plainly that the accountable human makes the decision; the report is evidence-based support.

### Output Format
```yaml
# Candidate Report — {candidate} / {role}
Performance objectives | Scorecard (evidence) | Behavioral context (weight 0) | Recommendation (human decides)
+ rendered minuta(s)
```

### Veto Conditions
- Cannot generate a recommendation without a PASSED fairness audit
- Cannot present the report as an autonomous decision
- Cannot include behavioral style in the recommendation rationale

### Completion Criteria
- Fairness PASS verified
- Candidate report assembled with evidence
- Relevant minuta(s) rendered
- Output framed as human-decided recommendation
