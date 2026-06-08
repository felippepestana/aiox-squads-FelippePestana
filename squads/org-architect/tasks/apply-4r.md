# apply-4r

## Task: Run the 4R Decision on a Capability Gap

### Metadata
- **executor:** fourr-advisor
- **elicit:** true
- **mode:** analytical
- **output:** fourr-decision.yaml

### Inputs Required
```text
gap: the capability/skill that is missing
by_when: the deadline to close it
internal: skills/people that already exist nearby
constraints: budget, time, flight-risk notes
```

### Elicitation
```text
What capability gap are we facing, and by when must it be closed?
> [user]

Who/what already exists internally that's near this capability (and any flight risk)?
> [user or skip]
```

### Execution Steps

#### Step 1: Size the gap in skills
- Express the gap as missing skills/capacity, not as a headcount number.

#### Step 2: Run 4R in order
- Evaluate Redesign, Reskill, Retain, Recruit in that order; estimate coverage per path.

#### Step 3: Cost / time / risk
- Quantify cost, time-to-capability and risk for each path.

#### Step 4: Recommend a blend
- Recommend a sequence/blend; recruiting is the residual net-new need. Route reskill→academy, retain→performa, recruit→talent-compass.

### Output Format
```yaml
fourr_decision:
  gap: {skills, not heads}
  by_when: {date}
  paths:
    redesign: { coverage: {%}, cost: {}, time: {}, risk: {} }
    reskill:  { coverage: {%}, cost: {}, time: {}, risk: {}, route: academy }
    retain:   { coverage: {%}, cost: {}, time: {}, risk: {}, route: performa }
    recruit:  { coverage: {% residual}, cost: {}, time: {}, risk: {}, route: talent-compass }
  recommendation: "sequence/blend; recruit = residual"
  note: "advisory — hire/exit/retain decisions stay with humans"
```

### Veto Conditions
- Cannot treat the gap as headcount-first
- Cannot skip to Recruit before Redesign/Reskill/Retain
- Cannot ignore flight risk on a scarce, needed capability
- Cannot make individual hire/exit calls (advisory only)

### Completion Criteria
- Gap sized in skills, not heads
- All four R's evaluated in order with coverage
- Cost/time/risk per path
- Recommendation with recruit as residual; routes assigned
