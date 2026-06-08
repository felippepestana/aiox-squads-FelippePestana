# checklist

## Task: Generate Dynamic Checklist + Documents + Contract

### Metadata
- **executor:** checklist-runner
- **elicit:** true
- **mode:** generative
- **output:** onboarding-checklist.yaml

### Inputs Required
```text
role / location / modality
start_date
```

### Elicitation
```text
Role, location and modality (presencial/remoto/híbrido), and start date?
> [user]
```

### Execution Steps

#### Step 1: Tailor the checklist
- Generate items by role/location/modality — pre-start, day 1, week 1.

#### Step 2: Documents & contract
- Coordinate document collection and consent/contract signature (minimal, private).

#### Step 3: Provisioning
- Track access/equipment/accounts items with owners and due dates.

#### Step 4: Hand off admission
- Route admission filings/payroll/eSocial to peopleops.

### Output Format
```yaml
checklist:
  role: {role}
  modality: presencial|remoto|hibrido
  pre_start: [{item, owner, due}]
  day_1: [{item, owner, due}]
  week_1: [{item, owner, due}]
  documents: [{doc, status, consent: true|false}]
  blockers: [{item, owner, due}]
  admission_handoff: peopleops
```

### Veto Conditions
- Cannot process payroll/eSocial/admission here (peopleops)
- Cannot expose sensitive documents
- Cannot collect beyond what's needed
- Cannot proceed without required consent

### Completion Criteria
- Checklist tailored to role/location/modality
- Documents + contract coordinated (consent recorded)
- Provisioning items tracked with owners/dates
- Admission handed to peopleops
