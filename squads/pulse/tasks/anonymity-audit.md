# anonymity-audit

## Task: Anonymity Gate — Min Group Size + Re-identification (PASS/VETO)

### Metadata
- **executor:** anonymity-gate
- **elicit:** true
- **mode:** audit
- **output:** anonymity-audit.yaml

### Inputs Required
```text
results_analysis: the report/cut under review (from sentiment-analyst's results-analysis.yaml, root key `results_analysis`)
action_plan: the action report to be shared, if applicable (root key `action_plan`)
min_group_size: the minimum group size threshold
```

### Elicitation
```text
Which report/cuts am I auditing before publishing, and what's the minimum group size?
> [user]

Are any quotes or cross-segment cuts included?
> [user]
```

### Execution Steps

#### Step 1: Min group size sweep
- Flag any reported segment below the minimum group size.

#### Step 2: Re-identification check
- Flag demographic combinations producing small cells; propose a coarser safe aggregation.

#### Step 3: Quote check & verdict
- Flag any quote that could identify a respondent; require summarizing. Return **PASS** or **VETO** with the safe alternative.

### Output Format (`anonymity-audit.yaml`)
```yaml
anonymity_audit:
  min_group_size: 0
  findings:
    - { item: "", issue: "", safe_alternative: "" }
  quotes_checked: true
  verdict: "PASS | VETO"
  remediation: []          # required only if VETO
```

### Veto Conditions
- Any reported segment below the minimum group size → VETO + re-aggregate.
- Re-identifying cross-cut or small cell → VETO + coarser aggregation.
- A quote that could identify a respondent → VETO + summarize.

### Completion Criteria
- Verdict issued. On PASS, the cut is cleared for a human to publish. On VETO, it returns to sentiment-analyst/action-planner to re-aggregate — nothing is published below the minimum group size.
