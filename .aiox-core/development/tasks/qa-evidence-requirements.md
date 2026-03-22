# Task: QA Evidence Requirements

**Task ID:** qa-evidence-requirements
**Purpose:** Check that all QA verdicts have sufficient evidence to support them
**Agent:** @qa (Quinn)

---

## Overview

Ensures that QA decisions are backed by actual evidence (code inspection, test results, tool output) rather than assumptions. Prevents false approvals.

## Steps

For the current QA review session:

- [ ] 1 — List all PASS verdicts issued
- [ ] 2 — For each PASS: verify evidence exists
  - Code reviewed (file and line referenced)?
  - Tests run and output attached?
  - Command executed with actual output?
  - Not "assumed to work" without verification?
- [ ] 3 — List all FAIL verdicts issued
- [ ] 4 — For each FAIL: verify evidence is specific
  - Exact file and line where issue found?
  - Specific description of what's wrong (not vague)?
  - Reproducible steps if applicable?
- [ ] 5 — Identify any "unsupported verdicts":
  - PASS without reading the code
  - FAIL without specific evidence
  - Assumptions presented as facts

## Output

```
🔍 Evidence Audit
Total verdicts: {N}
Supported: {N} ✅
Unsupported: {N} ❌

Unsupported verdicts (must fix):
  - {verdict}: {issue with evidence}
```

---
_Task Version: 3.0 | Last Updated: 2026-03-13_
