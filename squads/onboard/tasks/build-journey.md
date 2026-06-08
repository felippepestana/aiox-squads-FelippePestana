# build-journey

## Task: Design a Personalized 30/60/90 Journey

### Metadata
- **executor:** journey-architect
- **elicit:** true
- **mode:** generative
- **output:** journey-30-60-90.yaml

### Inputs Required
```text
new_hire: name/role
role_objectives: performance objectives for the role
candidate_report: optional, from talent-compass (strengths, ramp gaps)
behavioral_context: optional profiler-dna read (weight 0)
modality: presencial | remoto | hibrido
```

### Elicitation
```text
Who are we onboarding, into which role/team, and starting when?
> [user]

Do we have the candidate report (talent-compass) and a behavioral read (profiler-dna, weight 0)?
> [user or skip]
```

### Execution Steps

#### Step 1: Pull context
- Use role objectives + candidate report (strengths/ramp gaps) + behavioral context (weight 0).

#### Step 2: Design 30/60/90
- For each phase set goals, early win(s), learning, relationships and first tasks/ownership.

#### Step 3: Personalize delivery
- Adapt pace and communication to behavioral context — never to judge the person.

#### Step 4: Bake in belonging
- Assign a buddy and schedule manager 1:1s and the 30/60/90 review; route to inclusion-gate.

### Output Format
```yaml
journey:
  new_hire: {name}
  role: {role}
  modality: presencial|remoto|hibrido
  phase_30:
    goals: [{...}]
    early_win: {targeted ~day 25}
    learning: [{...}]
    relationships: [{buddy, team}]
  phase_60:
    goals: [{...}]
    first_ownership: {...}
  phase_90:
    goals: [{full ownership}]
    review: {30/60/90 review + two-way feedback}
  behavioral_context: {weight 0 — pace/communication tailoring}
  inclusion_status: PENDING
```

### Veto Conditions
- Cannot ship a one-size-fits-all journey
- Cannot use personality to judge the hire (weight 0)
- Cannot omit manager 1:1s / belonging
- Cannot run before inclusion-gate

### Completion Criteria
- 30/60/90 anchored to role objectives with early wins
- Ramp gaps from hiring addressed
- Delivery personalized at weight 0
- Buddy + manager 1:1s scheduled; routed to inclusion-gate
