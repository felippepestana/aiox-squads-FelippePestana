# Payroll Close Gate Checklist

> Run by **payroll-auditor** before any payroll closes. The verdict is **PASS** or **VETO**.
> Nothing closes before this gate clears and an accountable human signs off.

## 1. Anomaly sweep

- [ ] **Deltas:** no unexplained material month-over-month change per employee.
- [ ] **Duplicates:** no duplicate payments / verbas.
- [ ] **Completeness:** no missing or zero records for active employees.
- [ ] **Sanity:** no negative líquido; FGTS shown as employer deposit (not a desconto).

## 2. Traceability

- [ ] Every total maps to component verbas and bases.
- [ ] Tables/competência are named and confirmed as current.

## 3. Privacy (LGPD)

- [ ] No secrets/credentials in the artifact.
- [ ] No full documents exposed.
- [ ] Sensitive data minimized (refs, not copies).

## 4. Accountability

- [ ] An accountable human sign-off is identified.
- [ ] Any official filing (eSocial/FGTS/GFIP) is left for a licensed professional to transmit.

---

**Verdict:**

- **PASS** — all items clear → cleared for a human to close.
- **VETO** — any item fails → return findings + remediation; re-audit before close.
