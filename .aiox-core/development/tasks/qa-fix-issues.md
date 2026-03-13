# Task: QA Fix Issues (8-Phase Workflow)

**Task ID:** qa-fix-issues
**Execution Type:** Agent
**Model:** Opus
**Purpose:** Systematic 8-phase workflow for @dev to fix issues identified in QA review
**Agent:** @dev (Dex)
**Triggered by:** @qa NEEDS_WORK verdict in QA Loop

> Distinct from `apply-qa-fixes.md` (simple apply) — this is a systematic investigation and fix workflow for complex QA issues.

---

## Overview

When @qa returns NEEDS_WORK with specific issues, this 8-phase workflow ensures systematic resolution with root cause analysis, prioritized fixing, verification, and regression prevention.

```
INPUT: QA fix request file + failing story
    |
[PHASE 1: Triage] → Classify and prioritize all issues
    |
[PHASE 2: Root Cause] → WHY did each issue occur?
    |
[PHASE 3: Fix Plan] → How to fix each, in order
    |
[PHASE 4: Implement CRITICAL fixes]
    |
[PHASE 5: Implement MAJOR fixes]
    |
[PHASE 6: Implement MINOR fixes (optional)]
    |
[PHASE 7: Regression Test] → Nothing new broken
    |
[PHASE 8: Report] → Document fixes, ready for re-review
    |
OUTPUT: All issues fixed + fix report + story updated
```

---

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `fix_request_file` | path | YES | Path to QA fix request file |
| `story_file` | path | YES | Path to story being fixed |
| `qa_report` | path | NO | Path to detailed QA gate report |

---

## Preconditions

- [ ] Fix request file exists at `.aiox/qa/fix-request-{story_id}.md`
- [ ] Story status is `InReview` or `Blocked`
- [ ] @dev has read the full fix request (no skipping)
- [ ] Tests exist to run regression against

---

## PHASE 1: Triage

**Duration:** 5-10 min

- [ ] 1.1 — Read COMPLETE fix request file
- [ ] 1.2 — Count issues by severity: CRITICAL (N), MAJOR (N), MINOR (N)
- [ ] 1.3 — Classify each issue:
  - `bug` — functionality broken
  - `quality` — code quality issue
  - `missing` — required AC not implemented
  - `security` — security vulnerability
  - `test` — missing or failing tests
- [ ] 1.4 — Check for dependency between issues (fix A before B)
- [ ] 1.5 — Estimate effort per issue (quick < 15min, medium 15-60min, hard > 60min)
- [ ] 1.6 — Create prioritized fix order (CRITICAL → MAJOR → MINOR, within each: by dependency)

**Triage Output:**
```
Triage Summary:
- CRITICAL (N issues): [titles]
- MAJOR (N issues): [titles]
- MINOR (N issues): [titles]
Estimated total: {X} hours
Fix order: [ordered list]
```

---

## PHASE 2: Root Cause Analysis

**Duration:** 5-15 min

For CRITICAL and MAJOR issues only:

- [ ] 2.1 — For each issue: WHY did this happen?
  - Missing validation?
  - Wrong assumption about data?
  - Edge case not considered?
  - Test coverage gap?
  - Architecture misunderstanding?
- [ ] 2.2 — Document: `[ROOT CAUSE] {issue}: {why it happened}`
- [ ] 2.3 — Identify if root cause affects other code not in fix request
- [ ] 2.4 — If wider blast radius: note files to check in Phase 7 regression

---

## PHASE 3: Fix Plan

- [ ] 3.1 — For each issue: define the fix approach (1-3 sentences)
- [ ] 3.2 — Confirm fix is within story scope (No Invention — don't fix what's not broken)
- [ ] 3.3 — Identify which tests to update/add per fix
- [ ] 3.4 — If any fix is unclear: `[AUTO-DECISION]` or (interactive mode) ask user

Interactive mode: Present fix plan to user for approval before implementing.
YOLO mode: Log plan, proceed autonomously.

---

## PHASE 4: Fix CRITICAL Issues

Fix in priority order. For EACH critical issue:

- [ ] 4.1 — Implement fix (minimal change — don't refactor while fixing)
- [ ] 4.2 — Run specific test for that fix
- [ ] 4.3 — Run lint/typecheck
- [ ] 4.4 — Log: `[FIX CRITICAL] {issue_id}: {what was fixed}`

**Gate:** Each CRITICAL fix verified before moving to next.

---

## PHASE 5: Fix MAJOR Issues

- [ ] 5.1 — For each MAJOR issue: implement fix
- [ ] 5.2 — Run relevant tests
- [ ] 5.3 — Log: `[FIX MAJOR] {issue_id}: {what was fixed}`

**Note:** If a MAJOR fix introduces complexity, prefer a minimal safe fix over an ideal refactor.

---

## PHASE 6: Fix MINOR Issues

- [ ] 6.1 — Evaluate: is the effort worth it for this iteration?
- [ ] 6.2 — Fix minors that are quick (< 15 min each)
- [ ] 6.3 — Defer complex minors to tech debt backlog: `*backlog-debt {title}`
- [ ] 6.4 — Log: `[FIX MINOR] {issue_id}: {fixed or deferred}`

---

## PHASE 7: Regression Test

- [ ] 7.1 — Run FULL test suite: `npm test` or equivalent
- [ ] 7.2 — Verify all tests that were passing before STILL pass
- [ ] 7.3 — Verify all new tests PASS
- [ ] 7.4 — Run lint: zero errors
- [ ] 7.5 — Run typecheck: zero errors
- [ ] 7.6 — If any regressions introduced: go back to Phase 4 (CRITICAL) for that regression

**Gate:** Zero regressions ✅ | All new fixes pass ✅

---

## PHASE 8: Fix Report + Story Update

- [ ] 8.1 — Write fix report at `.aiox/qa/fix-report-{story_id}-iter{N}.md`:
```markdown
# QA Fix Report — {story_id} — Iteration {N}

## Fixes Applied
### CRITICAL (all fixed)
- [x] {issue_id}: {fix description}

### MAJOR
- [x] {issue_id}: {fix description}
- [~] {issue_id}: DEFERRED — {reason}

### MINOR
- [x] {issue_id}: {fix description}
- [~] {issue_id}: DEFERRED to tech debt

## Regression Status
- Tests: PASS ({N} tests)
- Lint: PASS
- Typecheck: PASS

## Ready for Re-Review: YES
```
- [ ] 8.2 — Update story file Dev Notes with fix iteration
- [ ] 8.3 — Signal @qa: "Fixes applied, ready for re-review"

---

## Acceptance Criteria

- [ ] All CRITICAL issues fixed and verified
- [ ] All MAJOR issues fixed or explicitly deferred with reason
- [ ] MINOR issues addressed (fixed or tech debt registered)
- [ ] Zero regressions in full test suite
- [ ] Lint: zero errors
- [ ] Typecheck: zero errors
- [ ] Fix report written
- [ ] Story updated

---

## Error Handling

| Error | Action |
|-------|--------|
| Fix breaks existing tests | Investigate regression, fix root cause |
| Issue is ambiguous | `[AUTO-DECISION]` in YOLO, ask @qa in interactive |
| Fix requires major refactor | Create separate story, apply minimal fix now |
| Can't reproduce issue | Document as "cannot reproduce" with evidence, ask @qa |
| 3+ failed fix attempts | HALT, escalate to @aiox-master |

---

_Task Version: 3.0_
_Last Updated: 2026-03-13_
