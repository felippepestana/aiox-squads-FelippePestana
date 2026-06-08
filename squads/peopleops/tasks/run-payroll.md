# run-payroll

## Task: Prepare a Defensible Payroll Run

### Metadata
- **executor:** payroll-analyst
- **elicit:** true
- **mode:** generative
- **output:** payroll-run.yaml

### Inputs Required
```text
need: the payroll to prepare (matches workflow input `need`)
competencia: reference month/period of the run
population: employees in scope (refs, roles, base salaries)
variables: overtime, absences, bonuses, sales/commissions, leave events
tables: INSS/IRRF/salário-mínimo tables + competência (confirm current values)
```

### Elicitation
```text
Which competência are we running, and for whom (population in scope)?
> [user]

What variable inputs apply this period (overtime, absences, bonuses, leave events)?
> [user or skip]
```

### Execution Steps

#### Step 1: Assemble proventos
- Salário-base, DSR, overtime, bonuses, commissions — each as a named verba with its base.

#### Step 2: Compute descontos
- INSS (progressive over base), IRRF (base after INSS + dependent deductions), other legal descontos.
- FGTS as an employer deposit (does not reduce líquido) — show it explicitly.

#### Step 3: State assumptions for validation
- Name every table/competência used; flag that current official values must be confirmed before close.
- Produce a plain-language payslip explanation per line.

### Output Format (`payroll-run.yaml`)
```yaml
payroll_run:
  competencia: ""
  population_count: 0
  lines:                    # per employee
    - employee_ref: ""
      proventos: []         # { verba, base, value }
      descontos: []         # { verba, base, value }
      fgts: ""              # employer deposit, not a desconto
      liquido: ""
  assumptions: { tables: "", competencia: "", confirm_before_close: true }
  status: "prepared"        # never "closed" — that requires the gate + sign-off
```

### Veto Conditions
- A total presented without its component verbas/bases → fix before output.
- A tax table asserted as current without a confirmation flag → fix.
- Marking the run "closed" here → not allowed; close goes through payroll-auditor.

### Completion Criteria
- Run assembled, every number traceable to a verba/base, assumptions flagged, payslip explainable. Hand off to payroll-auditor for the close gate.
