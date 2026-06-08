# pay-equity-audit

## Task: Audit Bands & Leveling for Pay Equity (PASS/VETO)

### Metadata
- **executor:** equity-gate
- **elicit:** true
- **mode:** audit
- **output:** pay-equity-audit.yaml

### Inputs Required
```text
bands: the bands/leveling under review (from comp-strategist)
population: the roles/people in the comparable set
inputs_used: how placements were decided (level, skills, prior salary, etc.)
jurisdiction: applicable pay law, if any
```

### Elicitation
```text
Which bands/leveling am I auditing, and what's the comparable population?
> [user]

How were current placements decided — what inputs went into the pay?
> [user]
```

### Execution Steps

#### Step 1: Define comparables
- Build the comparable set by level + core skills before comparing any pay.

#### Step 2: Test variance
- For each gap between comparables, test whether it is explained by role, skills or impact.

#### Step 3: Check inputs for proxies
- Flag any protected attribute or proxy (prior salary, negotiation, legacy title) in the logic.

#### Step 4: Verdict
- Issue PASS or VETO; for VETO, list findings + remediation owners. Require legal certification where pay law applies.

### Output Format
```yaml
pay_equity_audit:
  scope: {bands/level}
  comparable_set: "defined by level + core skills"
  population: {n}
  findings:
    - { gap: {%}, between: {roles}, explained_by: {role/skills/impact|UNEXPLAINED} }
  input_proxies:
    - { proxy: {prior salary|legacy title|...}, present: true/false }
  verdict: PASS | VETO
  remediation:
    - { action: {}, owner: {comp-strategist|role-designer|peopleops} }
  legal_review_required: {true/false}
```

### Veto Conditions
- Cannot pass an unexplained gap between comparable roles
- Cannot allow prior salary / negotiation / legacy title into pay logic
- Cannot compare unlike roles and call it an equity test
- Cannot waive a finding under deadline pressure

### Completion Criteria
- Comparable set defined by level + skills
- Each gap tested for explanation
- Input proxies checked and flagged
- PASS/VETO issued with remediation owners; legal review noted where applicable
