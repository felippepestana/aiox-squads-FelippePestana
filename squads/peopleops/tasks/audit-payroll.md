# audit-payroll

## Task: Payroll Close Gate — Anomaly + Privacy Audit (PASS/VETO)

### Metadata
- **executor:** payroll-auditor
- **elicit:** true
- **mode:** audit
- **output:** payroll-audit.yaml

### Inputs Required
```text
payroll_run: the run under review (from payroll-analyst's payroll-run.yaml, root key `payroll_run`)
prior_run: prior competência for delta comparison, if available
sign_off: who the accountable human signer is
```

### Elicitation
```text
Which payroll run am I auditing, and is a prior competência available to compare against?
> [user]

Who is the accountable human signing off the close?
> [user]
```

### Execution Steps

#### Step 1: Anomaly sweep
- Large month-over-month deltas per employee, duplicate payments, missing/zero records, negative líquido.

#### Step 2: Privacy check (LGPD)
- No secrets/credentials, no full documents, sensitive data minimized in the run artifact.

#### Step 3: Verdict
- Return **PASS** or **VETO** with specific findings and remediation; confirm a human sign-off is in the loop.

### Output Format (`payroll-audit.yaml`)
```yaml
payroll_audit:
  competencia: ""
  anomalies: []             # { employee_ref, finding, severity }
  privacy: { violations: [], minimized: true }
  verdict: "PASS | VETO"
  remediation: []           # required only if VETO
  sign_off: ""              # accountable human
```

### Veto Conditions
- Unexplained material delta between competências → VETO + investigate.
- Duplicate payment / negative líquido / missing record → VETO + correct.
- Secrets or full documents exposed → VETO + remove (privacy).
- No accountable human sign-off identified → HALT.

### Completion Criteria
- Verdict issued. On PASS, the run is cleared for a human to close. On VETO, it returns to payroll-analyst/leave-manager for remediation and re-audit — nothing closes before the gate clears.
