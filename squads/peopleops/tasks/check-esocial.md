# check-esocial

## Task: Map eSocial Events, Deadlines & CLT Compliance

### Metadata
- **executor:** esocial-compliance
- **elicit:** true
- **mode:** analytical
- **output:** esocial-event-map.yaml

### Inputs Required
```text
need: the situation to map (matches workflow input `need`)
situation: admission, periodic pay, leave, termination, change, etc.
employee_context: who/what the events relate to (refs)
competencia: the reference period, if periodic
```

### Elicitation
```text
What situation are we mapping (admission, pay, leave, termination, change)?
> [user]

Who does it relate to and what's already been registered?
> [user or skip]
```

### Execution Steps

#### Step 1: Identify the triggered events
- Map the situation to its eSocial event(s) (e.g., S-2200 admission, S-1200 periodic pay, S-2230 leave, S-2299 termination).

#### Step 2: State deadlines and prerequisites
- For each event: the deadline and what must already exist (e.g., S-2200 before S-1200).

#### Step 3: Validate compliance & flag risk
- Plain-language compliance check; flag tight deadlines, missing prereqs, and anything needing counsel.

### Output Format (`esocial-event-map.yaml`)
```yaml
esocial_event_map:
  situation: ""
  events:
    - { code: "", name: "", deadline: "", prereqs: [], status: "ready-to-transmit" }
  risks: []                 # tight deadlines, missing prereqs, counsel flags
  transmit_by: "licensed professional"   # AI prepares, never transmits
```

### Veto Conditions
- A deadline stated without being anchored to its event → fix.
- Implying the AI will transmit the event → not allowed.

### Completion Criteria
- Events mapped with deadlines/prereqs, risks flagged, map ready for a licensed sign-off.
