# inclusion-review

## Task: Inclusion, Consent & Accessibility Gate (PASS/VETO)

### Metadata
- **executor:** inclusion-gate
- **elicit:** false
- **mode:** audit
- **output:** inclusion-audit.yaml

### Inputs Required
```text
journey-30-60-90.yaml
consent record + stated accessibility needs
```

### Elicitation
```text
(no elicitation; audits the journey)
```

### Execution Steps

#### Step 1: Consent check
- Verify informed consent + weight-0 framing for any behavioral context; else VETO.

#### Step 2: Accessibility check
- Confirm stated accessibility needs are accommodated (assistive tech, formats, scheduling).

#### Step 3: Inclusion check
- Flag exclusionary content or protected-attribute proxies.

#### Step 4: Manager-augmentation check
- Confirm the buddy/IA supports — not replaces — the manager relationship.

#### Step 5: Verdict
- PASS or VETO with findings and remediation owners; re-run after fixes.

### Output Format
```yaml
inclusion_audit:
  verdict: PASS|VETO
  findings:
    - issue: {description}
      type: consent|accessibility|inclusion|manager-augmentation
      remediation: {action}
      owner: {who}
```

### Veto Conditions
- Cannot PASS without consent/accessibility resolved
- Cannot let personality gate the person
- Cannot allow the buddy to replace the manager

### Completion Criteria
- Consent + weight-0 framing verified
- Accessibility accommodations confirmed
- Inclusion/proxy issues checked
- Verdict issued; remediation routed if VETO
