# detect-signals

## Task: Surface Early Disengagement Signals

### Metadata
- **executor:** signal-scout
- **elicit:** true
- **mode:** analytical
- **output:** signals.yaml

### Inputs Required
```text
results_analysis: the current analysis (from sentiment-analyst's results-analysis.yaml, root key `results_analysis`)
history: prior cycles for trend comparison, if available
min_group_size: minimum group size for any reported segment
```

### Elicitation
```text
Which analysis am I scanning, and do we have prior cycles to compare?
> [user]

What's the minimum group size, and any segments you're already worried about?
> [user or skip]
```

### Execution Steps

#### Step 1: Compare against trend
- Look for drops/declines by segment across cycles; separate trend from single-cycle noise.

#### Step 2: Add context
- For each signal: magnitude, since when, how widespread; only for segments at/above min group size.

#### Step 3: Prioritize
- Rank by severity × spread; surface the strongest for action.

### Output Format (`signals.yaml`)
```yaml
signals:
  - segment: ""            # >= min_group_size
    metric: ""             # e.g., recognition driver
    change: ""             # magnitude + direction
    trend: ""              # cycles
    severity: ""           # high | medium | low
    context: ""
  noise_filtered: []       # wobbles intentionally not raised
```

### Veto Conditions
- A signal on a segment below the minimum group size → drop.
- Raising single-cycle noise as a trend → re-check first.
- Attributing a signal to a named individual → not allowed.

### Completion Criteria
- Prioritized, contextualized signals (no sub-minimum cuts, no noise). Hand off to action-planner.
