# score-candidate

## Task: Produce the Evidence-Based Scorecard (0-100)

### Metadata
- **executor:** evidence-scorer
- **elicit:** false
- **mode:** analytical
- **output:** scorecard.yaml

### Inputs Required
```
interview_responses: captured evidence
role_profile: competencies + BARS anchors
behavioral_context: (optional) DISC/Enneagram read (weight 0)
```

### Elicitation
```
(no elicitation; scores from captured evidence and anchors)
```

### Execution Steps

#### Step 1: Rate each response against BARS
- Map each response to its 1-5 anchor. Cite the specific example/quote that justifies the rating.

#### Step 2: Aggregate by competency area
- Roll ratings into technical (/40), behavioral (/35), motivation (/25). Note confidence where evidence is thin.

#### Step 3: Attach behavioral context (weight 0)
- If a DISC/Enneagram read exists, include it as a clearly labeled context section with zero score contribution.

#### Step 4: Compute total and grade
- Sum to 0-100; assign grade (A+ 90 / A 80 / B 70 / C 55 / D 40 / F 0).

#### Step 5: Write the recommendation
- Frame as a recommendation with evidence and confidence — never an automatic accept/reject. Pass to fairness-gate.

### Output Format
```yaml
scorecard:
  candidate: {name}
  technical: {score}/40
  behavioral: {score}/35
  motivation: {score}/25
  behavioral_style_context: {read, weight: 0}
  total: {0-100}
  grade: {A+..F}
  evidence: [{competency, score, quote}]
  recommendation: {text}
```

### Veto Conditions
- Cannot assign a score without cited evidence
- Cannot let behavioral_style contribute any points
- Cannot present the score as a final decision

### Completion Criteria
- Every competency scored against anchors with evidence
- Total and grade computed
- Behavioral style included only as weight-0 context
- scorecard.yaml produced and routed to fairness-gate
