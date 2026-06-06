# define-role

## Task: Define Role as Performance Objectives + Scorecard

### Metadata
- **executor:** role-architect
- **elicit:** true
- **mode:** interactive
- **output:** role-profile.yaml

### Inputs Required
```
role_title: the role to hire for
job_description: (optional) existing JD to refine
seniority: (optional) level/seniority
context: (optional) team, business goals
```

### Elicitation
```
What role are we hiring for? (title + a sentence on why)
> [user]

What must this person measurably deliver in the first 6-12 months?
> [user, or I propose objectives to confirm]
```

### Execution Steps

#### Step 1: Capture the role and business context
- Get the title, team, and why the role exists now. If a JD exists, treat it as raw material, not the source of truth.

#### Step 2: Define 4-6 performance objectives
- Write measurable outcomes (what success looks like in 6-12 months). Each objective is an outcome, not a task. Confirm with the user.

#### Step 3: Derive competencies
- For each objective, identify the 1-3 competencies that predict it. Drop nice-to-haves that don't move outcomes. Group as technical vs. behavioral.

#### Step 4: Set BARS anchor expectations
- For each competency, sketch what a weak (1), solid (3) and strong (5) demonstration looks like, to feed guide-builder.

#### Step 5: Assemble the scorecard
- Weights: technical 40 / behavioral 35 / motivation 25 / behavioral_style 0. Adjust technical/behavioral split to the role; keep style at 0.

### Output Format
```yaml
role_profile:
  role_title: {title}
  performance_objectives: [{...}]
  competencies:
    technical: [{name, anchors}]
    behavioral: [{name, anchors}]
    motivation: [{signals}]
  scorecard_weights: {technical: 40, behavioral: 35, motivation: 25, behavioral_style: 0}
```

### Veto Conditions
- Cannot proceed without at least 4 performance objectives
- Cannot assign any weight to behavioral_style (must be 0)
- Cannot list a competency that does not map to an objective

### Completion Criteria
- 4-6 performance objectives confirmed
- Competencies derived and mapped to objectives
- Scorecard assembled with style at weight 0
- role-profile.yaml produced
