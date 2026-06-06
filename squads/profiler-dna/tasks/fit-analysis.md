# fit-analysis

## Task: Advisory Culture/Role/Team Fit

### Metadata
- **executor:** fit-advisor
- **elicit:** true
- **mode:** advisory
- **output:** fit-report.yaml

### Inputs Required
```
behavioral_profile
team_context: existing team styles / role context
```

### Elicitation
```
What is the team/role context to advise fit against?
> [user]
```

### Execution Steps

#### Step 1: Read complementarity
- How does the profile complement/balance the team? Favor complementarity over sameness.

#### Step 2: Consider culture add
- What does the person bring that the team lacks?

#### Step 3: Guard against bias
- Check that 'fit' means values/ways-of-working, not similarity or a protected-attribute proxy; flag if it slips.

#### Step 4: Keep advisory
- Frame all fit as advisory, weight 0.

### Output Format
```yaml
fit_report:
  complementarity: {...}
  culture_add: {...}
  bias_flags: [{...}]
  verdict: advisory only (weight 0)
```

### Veto Conditions
- Cannot gate hiring on fit
- Cannot equate fit with similarity
- Cannot let fit proxy protected attributes

### Completion Criteria
- Complementarity read
- Culture-add considered
- Bias flags checked
- Labeled advisory/weight 0
