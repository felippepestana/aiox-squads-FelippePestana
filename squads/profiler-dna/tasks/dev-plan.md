# dev-plan

## Task: Management Tips + Development Plan

### Metadata
- **executor:** profiler-dna-chief
- **elicit:** false
- **mode:** generative
- **output:** development-plan.md

### Inputs Required
```
behavioral_profile (ethics-gate PASSED)
```

### Elicitation
```
(no elicitation; requires a PASSED ethics audit)
```

### Execution Steps

#### Step 1: Verify ethics PASS
- Refuse to generate without a PASSED ethics audit.

#### Step 2: Management tips
- How to communicate, delegate and give feedback to this profile.

#### Step 3: Development plan
- Strengths to leverage, growth edges, concrete next steps.

#### Step 4: Frame for growth
- Development context, weight 0; the person is a partner in the plan.

### Output Format
```yaml
# Development Plan — {person}
Management tips | Strengths | Growth edges | Next steps (weight 0, development context)
```

### Veto Conditions
- Cannot generate without a PASSED ethics audit
- Cannot frame as a decision/ranking

### Completion Criteria
- Ethics PASS verified
- Management tips + development plan produced
- Framed as development context, weight 0
