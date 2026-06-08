# run-review

## Task: Conduct a 90/180/360 Evidence-Based Review

### Metadata
- **executor:** review-runner
- **elicit:** true
- **mode:** interactive
- **output:** review.yaml

### Inputs Required
```text
person: who is being reviewed
review_type: 90 | 180 | 360
competencies: from role/job architecture
period: review window
```

### Elicitation
```text
Who are we reviewing, what type (90/180/360), and over what period?
> [user]

For each competency, share a recent concrete example.
> [user]
```

### Execution Steps

#### Step 1: Set competencies & period
- Confirm the competencies (from the role) and the full review window.

#### Step 2: Collect evidence per competency
- For each competency, gather a recent, concrete behavioral example. No example -> insufficient evidence.

#### Step 3: Rate against anchors (1-5)
- Map evidence to the rating scale; tie every rating to its example.

#### Step 4: Aggregate raters (360)
- If 360, reconcile multi-rater input; surface disagreements with evidence.

#### Step 5: Flag bias for calibration
- Note recency/halo/leniency risks and route to calibration-gate before sharing.

### Output Format
```yaml
review:
  person: {name}
  type: 90|180|360
  period: {window}
  competencies:
    - name: {competency}
      rating: 1-5
      evidence: {recent concrete example}
  strengths: [{...}]
  growth_areas: [{...}]
  bias_flags: [{recency|halo|leniency}]
  calibration_status: PENDING
```

### Veto Conditions
- Cannot rate a competency without a recent example
- Cannot share before calibration
- Cannot include personality in the rating

### Completion Criteria
- Competencies rated against anchors with evidence
- Multi-rater input reconciled (if 360)
- Bias flags noted
- Routed to calibration-gate
