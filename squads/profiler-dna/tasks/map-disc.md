# map-disc

## Task: Map DISC Work-Style (context, weight 0)

### Metadata
- **executor:** disc-mapper
- **elicit:** true
- **mode:** analytical
- **output:** disc-read.yaml

### Inputs Required
```
consent: explicit consent to profile (required)
source: answers / free text / questionnaire
```

### Elicitation
```
Do I have consent to read this person's work style? (required)
> [user]

Share the answers/text to read from.
> [user]
```

### Execution Steps

#### Step 1: Confirm consent
- Refuse to proceed without explicit consent.

#### Step 2: Infer the DISC blend
- Read D/I/S/C tendencies from the evidence; describe the blend, not a single letter.

#### Step 3: State confidence
- Report low/medium/high confidence; flag thin evidence.

#### Step 4: Give working tips
- Suggest how to communicate and give feedback to the style.

### Output Format
```yaml
disc_read:
  blend: {e.g., high-I/S}
  tendencies: [{...}]
  confidence: low|medium|high
  working_tips: [{...}]
  weight: 0
```

### Veto Conditions
- Cannot proceed without consent
- Cannot output a selection score
- Cannot use deterministic 'always' language

### Completion Criteria
- Consent confirmed
- DISC blend described with evidence
- Confidence stated
- Labeled weight 0
