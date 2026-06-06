# assess-bigfive

## Task: Assess Big Five / OCEAN (context, weight 0)

### Metadata
- **executor:** bigfive-assessor
- **elicit:** true
- **mode:** analytical
- **output:** bigfive-read.yaml

### Inputs Required
```
consent: required
source: answers / free text / questionnaire
```

### Elicitation
```
Consent to assess traits? (required)
> [user]

Evidence to read from?
> [user]
```

### Execution Steps

#### Step 1: Confirm consent
- No consent, no profile.

#### Step 2: Read each OCEAN trait
- Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism — as tendencies with cited evidence.

#### Step 3: State confidence
- Per-trait confidence; flag thin evidence.

#### Step 4: Frame neutrally
- Describe Neuroticism neutrally; never pathologize.

### Output Format
```yaml
bigfive_read:
  openness: {tendency, evidence}
  conscientiousness: {...}
  extraversion: {...}
  agreeableness: {...}
  neuroticism: {...}
  confidence: low|medium|high
  weight: 0
```

### Veto Conditions
- Cannot proceed without consent
- Cannot output a selection score
- Cannot pathologize a trait

### Completion Criteria
- Consent confirmed
- Five traits read with evidence
- Confidence stated
- Labeled weight 0
