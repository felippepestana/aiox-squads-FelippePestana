# plot-9box

## Task: Position on the 9-Box (Performance x Potential)

### Metadata
- **executor:** ninebox-plotter
- **elicit:** false
- **mode:** analytical
- **output:** ninebox.yaml

### Inputs Required
```text
review.yaml (performance evidence)
potential_signals: learning agility, scope growth, aspiration
```

### Elicitation
```text
(uses review evidence + potential signals)
```

### Execution Steps

#### Step 1: Justify the performance axis
- Use the review evidence to place performance (low/med/high).

#### Step 2: Justify the potential axis separately
- Use distinct signals (agility, scope growth, aspiration) — never personality — to place potential.

#### Step 3: Assign the cell
- Combine into one of the 9 cells; state confidence.

#### Step 4: Explain & imply development
- Explain the cell and what development/stretch it implies. Route to calibration.

### Output Format
```yaml
ninebox:
  person: {name}
  performance: low|medium|high
  performance_evidence: {from the review — delivery/quality/collaboration/ownership}
  potential: low|medium|high
  potential_evidence: {learning agility / scope growth / aspiration — NOT personality}
  cell: {e.g., High Performance / Medium Potential}
  implication: {development/stretch move this cell implies}
  confidence: low|medium|high
  note: "Input to a human talent conversation — not a promotion/pay decision."
  calibration_status: PENDING
```

### Veto Conditions
- Cannot derive potential from performance (separate evidence)
- Cannot use personality as the potential axis
- Cannot treat the cell as a promotion decision

### Completion Criteria
- Both axes justified on separate evidence
- Cell assigned with confidence
- Implication explained
- Routed to calibration-gate
