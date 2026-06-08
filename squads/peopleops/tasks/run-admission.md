# run-admission

## Task: Run a Compliant Digital Admission

### Metadata
- **executor:** admission-officer
- **elicit:** true
- **mode:** procedural
- **output:** admission-dossier.yaml

### Inputs Required
```text
need: the admission to process (matches workflow input `need`)
employee_context: candidate/hire data available so far (name ref, role, start date)
contract: role, salary, journey, contract type (CLT, etc.) — from org-architect/talent-compass if available
dependents: dependents and their pay effect (IRRF, salário-família), if any
```

### Elicitation
```text
Who are we admitting, into which role, and when do they start?
> [user]

Which documents and dependents do we already have, and what's the contract type/salary?
> [user or skip]
```

### Execution Steps

#### Step 1: Build the document checklist
- Required: CPF, CTPS digital, RG/identity, comprovante de residência, dados bancários.
- Conditional: dependentes (IRRF/salário-família), exame admissional (ASO), reservista, etc.
- Collect only what admission/eSocial requires (LGPD minimization); never store full images.

#### Step 2: Capture contract data
- Role, salary, journey (hours), contract type, start date, probation (if any).
- Pull salary/level from the role/band definition rather than inventing it.

#### Step 3: Prepare the S-2200 (admission) event
- Mark the deadline: ready to register BEFORE the employee starts activities.
- List prerequisites; flag any missing document that blocks the deadline.

### Output Format (`admission-dossier.yaml`)
```yaml
admission_dossier:
  employee_ref: ""          # reference, not full sensitive data
  role: ""
  contract: { type: "", salary: "", journey: "", start_date: "" }
  documents: { collected: [], pending: [] }
  dependents: []            # each with pay effect noted
  esocial: { event: "S-2200", deadline: "before activities start", prereqs: [], status: "ready-to-register" }
```

### Veto Conditions
- Employee scheduled to start before the S-2200 is ready → HALT and escalate.
- Full document images or raw sensitive numbers being stored/logged → stop.

### Completion Criteria
- Checklist complete (or pending items explicitly listed), contract data captured, S-2200 prepared with deadline. Hand off to esocial-compliance (validate event) and payroll-analyst (first run).
