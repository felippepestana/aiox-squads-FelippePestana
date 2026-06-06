# ethics-review

## Task: Ethics & Anti-Stereotype Gate (PASS/VETO)

### Metadata
- **executor:** ethics-gate
- **elicit:** false
- **mode:** audit
- **output:** ethics-audit.yaml

### Inputs Required
```
behavioral_profile and/or fit_report
consent record
```

### Elicitation
```
(no elicitation; audits the artifacts)
```

### Execution Steps

#### Step 1: Consent check
- Verify informed consent is present; else VETO.

#### Step 2: Anti-stereotype check
- Flag deterministic 'type always' language; require tendency/range wording.

#### Step 3: Weight-zero check
- Confirm the profile is framed as weight 0 / development-only; else VETO.

#### Step 4: No clinical overreach
- Strip any diagnostic/mental-health claim.

#### Step 5: Verdict
- Issue PASS or VETO with findings and remediation owners.

### Output Format
```yaml
ethics_audit:
  verdict: PASS|VETO
  findings:
    - issue: {description}
      type: consent|stereotype|weight|clinical
      remediation: {action}
```

### Veto Conditions
- Cannot PASS without consent
- Cannot PASS with deterministic stereotyping
- Cannot PASS if used as a decision factor

### Completion Criteria
- Consent, stereotype, weight-0 and clinical checks run
- Verdict issued
- Findings/remediation routed if VETO
