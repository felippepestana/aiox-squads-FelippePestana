# draft-okr

## Task: Draft & Audit OKRs (Outcome-Based)

### Metadata
- **executor:** okr-architect
- **elicit:** true
- **mode:** generative
- **output:** okrs.yaml

### Inputs Required
```text
scope: team or individual
higher_level_goals: company/team objectives for alignment
```

### Elicitation
```text
What scope are we setting OKRs for, and what higher-level goal should they ladder up to?
> [user]
```

### Execution Steps

#### Step 1: Write the Objective
- Qualitative, inspiring, time-bound; aligned to a higher-level goal.

#### Step 2: Write measurable Key Results
- Each KR is an outcome with baseline -> target, not a task.

#### Step 3: Audit for outcomes & stretch
- Reject task-lists and vanity/sandbagged targets; fix measurement gaps.

#### Step 4: Set cadence & scoring
- Define check-in cadence and how KRs will be scored.

### Output Format
```yaml
okrs:
  scope: {team|person}
  objective: {qualitative, inspiring}
  aligns_to: {higher-level goal}
  key_results:
    - kr: {outcome}
      baseline: {x}
      target: {y}
  cadence: {weekly|biweekly}

```

### Veto Conditions
- Cannot accept a task-list as a key result
- Cannot set a KR without a metric/baseline/target
- Cannot tie OKRs directly to pay

### Completion Criteria
- Objective aligned to a higher-level goal
- Each KR measurable with baseline -> target
- Vanity/sandbagging removed
- Cadence set
