# Task: Trace Requirements

**Task ID:** trace-requirements
**Purpose:** Verify that all requirements in a PRD/spec are traceable to story ACs and implementation
**Agent:** @qa (Quinn)

---

## Overview

Requirements traceability ensures that every requirement from the PRD has been implemented (no missed requirements) and every implementation decision traces back to a requirement (no invented features — Constitution Article IV).

## Steps

- [ ] 1 — Load requirements source: PRD, spec.md, or requirements.json
- [ ] 2 — Extract all requirements: FR-*, NFR-*, CON-* identifiers
- [ ] 3 — Load all stories in the epic
- [ ] 4 — For each requirement: find which story/AC covers it
  - Coverage: COVERED | PARTIAL | MISSING
- [ ] 5 — For each story AC: find which requirement it traces to
  - If no trace: flag as potential invention (Article IV violation)
- [ ] 6 — Build traceability matrix:

```
| Requirement | Story | AC | Coverage |
|-------------|-------|----|----------|
| FR-001: {text} | 1.1 | AC-2 | COVERED |
| FR-002: {text} | 1.2 | AC-1 | COVERED |
| NFR-001: {text} | 2.3 | AC-3 | PARTIAL |
| FR-003: {text} | — | — | MISSING |
```

- [ ] 7 — Report:
  - Coverage rate: {N}/{total} requirements covered
  - Missing requirements: list (these need stories)
  - Potential inventions: ACs with no requirement trace
  - Verdict: COMPLETE | INCOMPLETE | VIOLATIONS

---
_Task Version: 3.0 | Constitution: Article IV | Last Updated: 2026-03-13_
