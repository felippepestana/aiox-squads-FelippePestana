# Task: QA Library Validation

**Task ID:** qa-library-validation
**Purpose:** Validate that newly added libraries are appropriate, secure, and necessary
**Agent:** @qa (Quinn)

---

## Steps

For each new library added in the current story:

- [ ] 1 — Identify new dependencies: `git diff package.json` or requirements.txt
- [ ] 2 — For each new library:
  - [ ] **Necessity:** Is there an existing library that covers this? (DRY)
  - [ ] **Security:** `npm audit` or check CVE databases — any known vulnerabilities?
  - [ ] **Maintenance:** Is it actively maintained? (last commit < 6 months)
  - [ ] **Size:** Bundle size impact acceptable?
  - [ ] **License:** Compatible with project license?
  - [ ] **Downloads:** Widely used (> 1M weekly downloads preferred)?
- [ ] 3 — Check if library is in `.aiox-core/data/technical-preferences.md` preferred/forbidden lists
- [ ] 4 — Verdict per library: APPROVED | NEEDS_JUSTIFICATION | REJECTED

## Output

```
📦 Library Validation
New Libraries: {N}

✅ {library@version} — APPROVED
  Security: CLEAN | Weekly downloads: {N}M | Last update: {date}

❌ {library@version} — REJECTED
  Reason: {security issue | better alternative exists | license incompatible}

⚠️ {library@version} — NEEDS_JUSTIFICATION
  Question: {specific concern}
```

---
_Task Version: 3.0 | Last Updated: 2026-03-13_
