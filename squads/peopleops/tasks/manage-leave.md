# manage-leave

## Task: Process a Vacation, Leave or Termination

### Metadata
- **executor:** leave-manager
- **elicit:** true
- **mode:** procedural
- **output:** lifecycle-event.yaml

### Inputs Required
```text
need: the lifecycle event to process (matches workflow input `need`)
event_type: ferias | afastamento | rescisao
employee_context: who it relates to (refs, admission/tenure data)
specifics: for rescisão the termination type (sem justa causa, pedido, justa causa, acordo); for férias the period; for afastamento the reason/duration
```

### Elicitation
```text
Which event are we processing — férias, afastamento or rescisão?
> [user]

For a termination, which type (sem justa causa, pedido, justa causa, acordo)? For férias, which period?
> [user]
```

### Execution Steps

#### Step 1: Confirm the type/period first
- The type drives verbas, FGTS access and deadlines — confirm before building anything.

#### Step 2: Build the event package
- **Férias:** acquisitive/concessive periods, abono pecuniário (if any), 1/3 constitucional, payment deadline.
- **Afastamento:** type, duration, INSS/company responsibility boundary, return rules.
- **Rescisão:** aviso prévio (trabalhado/indenizado), saldo de salário, férias + 1/3, 13º proporcional, FGTS + multa, payment deadline, homologação if applicable.

#### Step 3: Surface deadlines & decision boundary
- State payment/homologation deadlines. For terminations, restate that the decision and sign-off stay with management.

### Output Format (`lifecycle-event.yaml`)
```yaml
lifecycle_event:
  event_type: ""            # ferias | afastamento | rescisao
  type_detail: ""           # e.g., sem justa causa
  components: []            # verbas/itens with basis
  deadlines: { payment: "", homologation: "" }
  esocial: { event: "", deadline: "" }   # e.g., S-2299 / S-2230
  decision_owner: "management + licensed sign-off"
```

### Veto Conditions
- Building verbas before the type/period is confirmed → stop.
- Presenting the termination as the AI's decision → reframe; decision stays human.

### Completion Criteria
- Package built with components + deadlines, eSocial event noted, decision boundary explicit. Hand off to payroll-analyst (values) and esocial-compliance (event map).
