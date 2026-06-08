# model-org

## Task: Model the Org Structure (Spans & Layers)

### Metadata
- **executor:** org-modeler
- **elicit:** true
- **mode:** analytical
- **output:** org-model.yaml

### Inputs Required
```text
scope: the org/unit to model
strategy: the goal/outcomes the structure must serve
current: existing reporting lines + headcount (if any)
constraints: budget, geography, modality
```

### Elicitation
```text
What part of the org are we modeling, and what goal must the structure serve?
> [user]

Do you have the current reporting lines and headcount, or are we designing from scratch?
> [user or skip]
```

### Execution Steps

#### Step 1: Name the strategy
- State the outcomes the structure must enable before drawing any box.

#### Step 2: Map current structure
- Capture nodes, reporting lines, spans of control and layer count.

#### Step 3: Diagnose friction
- Flag narrow/wide spans, excess layers, split ownership of key outcomes.

#### Step 4: Propose options
- Offer 1–2 structure options tied to strategy, with trade-offs; keep it role-level (no named cuts).

### Output Format
```yaml
org_model:
  scope: {unit}
  strategy: {outcomes the structure serves}
  current:
    layers: {count}
    nodes:
      - { role: {role}, reports_to: {role}, span: {n} }
  diagnosis:
    narrow_spans: [{role}]
    wide_spans: [{role}]
    excess_layers: {true/false}
    split_ownership: [{outcome}]
  options:
    - { name: {option}, change: {what moves}, trade_off: {cost}, serves: {strategy link} }
  note: "role-level model; reorg + individual impact are human decisions"
```

### Veto Conditions
- Cannot redraw structure without naming the strategy it serves
- Cannot name individuals for cuts (role/structure level only)
- Cannot present a reorg as a decision (options + trade-offs only)
- Cannot use protected attributes in structure logic

### Completion Criteria
- Strategy/outcomes stated before structure
- Spans and layers mapped and diagnosed
- Split ownership surfaced
- Options tied to strategy with trade-offs; framed as advisory
