# calibrate

## Task: Calibration & Fairness Gate (PASS/VETO)

### Metadata
- **executor:** calibration-gate
- **elicit:** false
- **mode:** audit
- **output:** calibration.yaml

### Inputs Required
```text
review.yaml / ninebox.yaml for a group (multiple people/raters)
```

### Elicitation
```text
(no elicitation; audits the group's ratings/9-box)
```

### Execution Steps

#### Step 1: Rater leniency/severity
- Compare each rater's distribution to the cohort; normalize outliers with evidence.

#### Step 2: Disparate-impact check
- Audit ratings/9-box for demographic skew; flag and require justification.

#### Step 3: Evidence sufficiency
- VETO any rating without a concrete example; 'insufficient evidence' is not a 3.

#### Step 4: Personality weight-0 check
- Confirm personality contributed 0 to ratings; if it leaked in, VETO.

#### Step 5: Verdict
- PASS or VETO with findings and remediation owners. Re-run after fixes.

### Output Format
```yaml
calibration:
  verdict: PASS|VETO
  findings:
    - issue: {description}
      type: leniency|severity|skew|evidence|personality
      remediation: {action}
      owner: {who}
```

### Veto Conditions
- Cannot PASS with unresolved bias or evidence gaps
- Cannot waive calibration under time pressure
- Cannot let personality affect ratings

### Completion Criteria
- Rater leniency/severity checked
- Disparate-impact audited
- Evidence sufficiency verified
- Verdict issued; remediation routed if VETO
