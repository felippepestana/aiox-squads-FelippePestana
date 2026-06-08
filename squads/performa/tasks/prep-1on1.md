# prep-1on1

## Task: Prepare a 1:1 Agenda from Recent Signals

### Metadata
- **executor:** performa-chief
- **elicit:** true
- **mode:** generative
- **output:** oneonone-agenda.md

### Inputs Required
```text
recent_signals: wins, blockers, feedback since last 1:1
pdi.md / okrs.yaml (optional)
```

### Elicitation
```text
What's happened since the last 1:1 — wins, blockers, feedback?
> [user]
```

### Execution Steps

#### Step 1: Gather recent signals
- Pull wins, blockers and feedback since the last 1:1.

#### Step 2: Frame feedback with SBI
- Phrase any feedback as Situation-Behavior-Impact, not labels.

#### Step 3: Connect to PDI/OKRs
- Tie items to the development plan and goals for continuity.

#### Step 4: Leave space for them
- Reserve the first part of the agenda for the person's topics, not the manager's.

### Output Format
```yaml
# 1:1 — {pessoa} ({data})
1. Pauta da pessoa (espaco reservado)
2. Wins recentes
3. Bloqueios / ajuda necessaria
4. Feedback (SBI: situacao-comportamento-impacto)
5. PDI/OKRs — progresso e proximos passos
```

### Veto Conditions
- Cannot give feedback as a label instead of SBI
- Cannot fill the whole agenda with the manager's topics

### Completion Criteria
- Recent signals gathered
- Feedback framed as SBI
- Tied to PDI/OKRs
- Space reserved for the person
