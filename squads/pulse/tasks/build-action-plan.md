# build-action-plan

## Task: Build a Prioritized, Owned Action Plan

### Metadata
- **executor:** action-planner
- **elicit:** true
- **mode:** generative
- **output:** action-plan.yaml

### Inputs Required
```text
results_analysis: the analysis (from sentiment-analyst's results-analysis.yaml, root key `results_analysis`)
signals: prioritized signals (from signal-scout's signals.yaml, root key `signals`), if available
owners: the leaders who can own actions
```

### Elicitation
```text
Which results/signals are we acting on, and who can own the actions?
> [user]

Any constraints (time, budget) I should respect?
> [user or skip]
```

### Execution Steps

#### Step 1: Pick the few that matter
- Convert the top themes/signals into 2-3 actions max — focus beats a long list.

#### Step 2: Assign owner + date + driver
- Each action gets a named human owner, a target date, and the driver it should move.

#### Step 3: Close the loop
- Recommend what to communicate back to respondents (and when).

### Output Format (`action-plan.yaml`)
```yaml
action_plan:
  actions:
    - { action: "", driver: "", owner: "", due: "" }   # 2-3 max
  close_the_loop:
    message: ""
    owner: ""
    by: ""
  measure_next_cycle: []   # which drivers to re-check
```

### Veto Conditions
- A long, unownable wishlist → cut to 2-3 owned actions.
- An action without a human owner or date → fix.
- No close-the-loop step → add it.

### Completion Criteria
- 2-3 prioritized, owned, dated actions tied to drivers, plus a close-the-loop plan. Leaders own delivery; pulse-chief tracks. Anonymity-gate clears any cut before publishing.
