# Task: QA Review Build

**Task ID:** qa-review-build
**Purpose:** Review the build output and deployment artifacts for quality and correctness
**Agent:** @qa (Quinn)

---

## Steps

- [ ] 1 — Trigger build process: `npm run build` or equivalent
- [ ] 2 — Verify build succeeds (zero errors)
- [ ] 3 — Check build output:
  - Verify expected output files exist
  - Check bundle sizes against budgets (if defined in `.aiox-core/core-config.yaml`)
  - No source maps in production (if applicable)
  - No development-only code in production bundle
- [ ] 4 — Static analysis on build output:
  - No console.log in bundled code
  - No hardcoded environment values
  - No debug flags enabled
- [ ] 5 — Run smoke tests against build (if available)
- [ ] 6 — Verdict: PASS | FAIL with specific findings

## Output

```
🏗️ Build Review: {story_id}
Build: {PASS|FAIL} ({build_duration}s)
Bundle Size: {size} ({vs_budget})
Findings: {list or "None"}
Verdict: PASS | FAIL
```

---
_Task Version: 3.0 | Last Updated: 2026-03-13_
