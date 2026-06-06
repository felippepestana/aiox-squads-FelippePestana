# enneagram-lens

## Task: Enneagram Developmental Lens (consent, weight 0)

### Metadata
- **executor:** enneagram-lens
- **elicit:** true
- **mode:** reflective
- **output:** enneagram-lens.yaml

### Inputs Required
```
consent: required
self_reported_type: the person's self-reported type (preferred)
```

### Elicitation
```
Consent to offer an Enneagram developmental lens? (required)
> [user]

What type does the person self-report (if any)?
> [user]
```

### Execution Steps

#### Step 1: Confirm consent
- Required.

#### Step 2: State the limits
- Note low predictive validity for performance; frame as self-awareness.

#### Step 3: Offer growth edges
- Describe growth edges and stress/security patterns for the type.

#### Step 4: Frame for development
- For coaching/onboarding only; weight 0.

### Output Format
```yaml
enneagram_lens:
  type: {self-reported}
  growth_edges: [{...}]
  stress_security: {...}
  use: development/onboarding only
  weight: 0
```

### Veto Conditions
- Cannot proceed without consent
- Cannot use for screening/scoring
- Cannot present as predictive of performance

### Completion Criteria
- Consent confirmed
- Limits stated
- Growth edges offered
- Labeled weight 0
