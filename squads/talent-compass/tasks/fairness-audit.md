# fairness-audit

## Task: Bias & Compliance Gate (PASS/VETO)

### Metadata
- **executor:** fairness-gate
- **elicit:** false
- **mode:** audit
- **output:** fairness-audit.yaml

### Inputs Required
```
scorecard(s) and/or comparison-report
interview_guide and notes
behavioral_context (to verify weight 0)
```

### Elicitation
```
(no elicitation; audits the artifacts)
```

### Execution Steps

#### Step 1: Language audit
- Scan notes/reports for coded/biased language ('culture fit', 'not polished', 'aggressive'). Require evidence-based rewording.

#### Step 2: Consistency audit
- Verify the same guide, anchors and rubric were applied to all candidates for the role. Inconsistent rigor voids comparison.

#### Step 3: Personality weight check
- Confirm DISC/Enneagram contributed 0 to the score. If they leaked in, VETO.

#### Step 4: Protected-attribute leakage
- Check questions/notes for protected attributes (age, race, religion, family/marital, health, etc.).

#### Step 5: Verdict
- Issue PASS or VETO. On VETO, list findings with required remediation and route to the responsible agent. Re-audit after remediation.

### Output Format
```yaml
fairness_audit:
  verdict: PASS|VETO
  findings:
    - issue: {description}
      type: language|consistency|personality|protected-attribute
      remediation: {action}
      owner: {agent}
```

### Veto Conditions
- Cannot PASS with unresolved bias findings
- Cannot waive the gate under time pressure
- Cannot allow personality to affect the decision

### Completion Criteria
- Language, consistency, personality and leakage checks run
- Verdict issued (PASS/VETO)
- Findings and remediation routed if VETO
- fairness-audit.yaml produced
