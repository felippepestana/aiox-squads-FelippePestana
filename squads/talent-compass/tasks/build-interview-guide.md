# build-interview-guide

## Task: Build Structured Interview Guide (BARS+STAR)

### Metadata
- **executor:** guide-builder
- **elicit:** false
- **mode:** generative
- **output:** interview-guide.yaml

### Inputs Required
```
role_profile: output of define-role (competencies + anchors)
time_budget: (optional) total interview minutes
```

### Elicitation
```
(uses role-profile; no elicitation unless competencies are missing)
```

### Execution Steps

#### Step 1: Map competencies to questions
- For each competency, write 1-2 behavioral (STAR) and/or situational questions designed to surface concrete evidence.

#### Step 2: Attach BARS anchors
- For every question, define 1/3/5 rating anchors describing what each level of answer looks like.

#### Step 3: Add probing follow-ups
- Add probes that dig for the candidate's specific Action and the measurable Result.

#### Step 4: Bias pre-check
- Remove any question touching protected attributes; flag coded phrasing. Hand off to fairness-gate for a pre-check if unsure.

#### Step 5: Sequence and time-box
- Order questions (warm-up -> core competencies -> candidate questions) and set time budgets.

### Output Format
```yaml
interview_guide:
  role_title: {title}
  sections:
    - competency: {name}
      questions:
        - text: {question}
          type: behavioral|situational
          probes: [{...}]
          bars: {1: {...}, 3: {...}, 5: {...}}
```

### Veto Conditions
- Cannot omit BARS anchors on any scored question
- Cannot include questions on protected attributes
- Cannot produce more than one guide per role (fairness)

### Completion Criteria
- Every competency has at least one anchored question
- All questions have 1/3/5 BARS anchors
- Bias pre-check passed
- interview-guide.yaml produced
