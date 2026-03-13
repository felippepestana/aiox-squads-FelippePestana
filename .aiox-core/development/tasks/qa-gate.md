# Task: QA Gate

**Task ID:** qa-gate
**Execution Type:** Agent
**Model:** Opus
**Purpose:** Primary quality gate — comprehensive review of story implementation before Done
**Agent:** @qa (Quinn)
**Template:** `.aiox-core/product/templates/qa-gate-tmpl.yaml`

> The QA Gate is the last line of defense before a story is marked Done. Thorough and uncompromising.

---

## Overview

Performs a comprehensive multi-dimensional review of a story implementation. Evaluates functional correctness, code quality, test coverage, security, and story hygiene. Issues verdict: PASS, NEEDS_WORK, or FAIL.

```
INPUT: Story file (status=ReadyForReview) + git diff
    |
[PHASE 0: Context Load] → Read story, diff, understand scope
    |
[PHASE 1: Functional Verification] → Does it work? AC by AC
    |
[PHASE 2: Code Quality] → Is it well written?
    |
[PHASE 3: Test Coverage] → Are there adequate tests?
    |
[PHASE 4: Security] → Is it safe?
    |
[PHASE 5: Performance] → No obvious performance issues?
    |
[PHASE 6: Story Hygiene] → Is the story file updated?
    |
[PHASE 7: Decision] → PASS | NEEDS_WORK | FAIL
    |
OUTPUT: Verdict + QA report in story file + optional fix request
```

---

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `story_file` | path | YES | Path to story file (status=ReadyForReview) |
| `story_id` | string | NO | Derived from story file if not provided |

---

## Preconditions

- [ ] Story status is `ReadyForReview` (not Draft, Ready, or InProgress)
- [ ] Git changes exist (something was implemented)
- [ ] @qa is in review mode (NOT modifying source code)

---

## PHASE 0: Context Load

**Duration:** 3-5 min

- [ ] 0.1 — Read COMPLETE story file
- [ ] 0.2 — Extract: story_id, acceptance_criteria (each item), File List, Technical Notes
- [ ] 0.3 — Run `git diff {base}...HEAD` to see ALL changes
- [ ] 0.4 — Read each file in File List (understand what was changed)
- [ ] 0.5 — Run `git log --oneline -10` — understand commit history
- [ ] 0.6 — Note: which AC items have checkboxes checked?

**Phase 0 Gate:**
- [ ] Story file read completely
- [ ] Git diff available
- [ ] All changed files identified

---

## PHASE 1: Functional Verification (40% of score)

**For EACH acceptance criterion item:**

- [ ] 1.1 — Identify the AC: what exactly should happen?
- [ ] 1.2 — Find the implementation: which code/files handle this AC?
- [ ] 1.3 — Verify the implementation matches the AC:
  - Does the code do what the AC says?
  - Are edge cases handled?
  - Are error states handled?
- [ ] 1.4 — Record evidence: `[AC-N] {criterion}: PASS (line {N} in {file}) | FAIL (reason)`
- [ ] 1.5 — Check for unchecked AC boxes in story — any missed?

**Critical Failures (auto-FAIL verdict):**
- Any AC item not implemented at all
- Core functionality completely broken
- Security vulnerability that makes the feature unsafe to use

---

## PHASE 2: Code Quality (20% of score)

- [ ] 2.1 — Lint status: check for lint errors in changed files
  - Run or assess: `npm run lint` or equivalent
  - Zero errors required for PASS; warnings acceptable
- [ ] 2.2 — TypeScript: check for type errors in changed files
  - Run or assess: `npm run typecheck` or `tsc --noEmit`
  - Zero type errors required
- [ ] 2.3 — No debug code: check for console.log, debugger, TODO comments in production code
- [ ] 2.4 — No hardcoded values: config, URLs, credentials must use env vars or config
- [ ] 2.5 — Code readability: complex logic has comments? Naming is clear?
- [ ] 2.6 — DRY principle: no obvious copy-paste that should be abstracted?
- [ ] 2.7 — Function sizes: excessively long functions (> 80 lines) flagged

---

## PHASE 3: Test Coverage (20% of score)

- [ ] 3.1 — New tests written for new logic?
- [ ] 3.2 — Existing tests still pass? (no regressions)
- [ ] 3.3 — Tests are meaningful (not just testing implementation details)?
- [ ] 3.4 — Error paths are tested (not just happy path)?
- [ ] 3.5 — Edge cases from AC are tested?
- [ ] 3.6 — Run test suite if available: `npm test` — all pass?
- [ ] 3.7 — No test files with `skip` or `only` left accidentally

---

## PHASE 4: Security Review (10% of score)

- [ ] 4.1 — No hardcoded secrets, API keys, passwords in code
- [ ] 4.2 — User input is validated at boundaries (not trusted blindly)
- [ ] 4.3 — SQL queries use parameterization (no string concatenation with user input)
- [ ] 4.4 — Auth/authz checks present on protected routes/actions
- [ ] 4.5 — No sensitive data leaked in error messages or logs
- [ ] 4.6 — CORS configured appropriately (if applicable)
- [ ] 4.7 — XSS prevention: user-generated content sanitized before rendering

---

## PHASE 5: Performance Awareness (5% of score)

- [ ] 5.1 — No obvious N+1 queries in database operations
- [ ] 5.2 — No blocking operations in event loop (sync I/O in async context)
- [ ] 5.3 — No infinite loops or missing pagination on list operations
- [ ] 5.4 — Large data sets handled with streaming or pagination
- [ ] 5.5 — No unnecessary re-renders in UI components (if applicable)

---

## PHASE 6: Story Hygiene (5% of score)

- [ ] 6.1 — Story status is `ReadyForReview` (not still InProgress)
- [ ] 6.2 — File List is complete (all created/modified files listed)
- [ ] 6.3 — All implemented AC items have `[x]` checkboxes
- [ ] 6.4 — No unauthorized sections modified (AC text, user story unchanged)
- [ ] 6.5 — Commits are atomic and have descriptive messages

---

## PHASE 7: Decision

### Score Calculation

```
functional_score = (passing_ACs / total_ACs) * 40
quality_score = (passing_checks / total_checks) * 20
test_score = (passing_checks / total_checks) * 20
security_score = (passing_checks / total_checks) * 10
performance_score = (passing_checks / total_checks) * 5
hygiene_score = (passing_checks / total_checks) * 5

total_score = sum of all scores (out of 100)
```

### Verdict

| Condition | Verdict |
|-----------|---------|
| Any critical security issue | **FAIL** — immediate |
| Any AC not implemented | **FAIL** — immediate |
| total_score >= 80, no critical issues | **PASS** |
| total_score 60-79, or MAJOR issues | **NEEDS_WORK** |
| total_score < 60 | **FAIL** |

### On PASS:
- [ ] Write QA Results section in story file:
```markdown
## QA Results
**Verdict:** ✅ PASS
**Reviewer:** @qa (Quinn)
**Date:** {date}
**Score:** {N}/100
**Notes:** {any minor notes}
```
- [ ] Update story status to `Done`
- [ ] Signal @devops: "Story {story_id} approved, ready for push"

### On NEEDS_WORK:
- [ ] Write QA Results section with specific issues
- [ ] Create fix request file at `.aiox/qa/fix-request-{story_id}.md` using `qa-create-fix-request.md`
- [ ] Signal @dev: "Review fix request, apply fixes, re-submit"
- [ ] Log iteration number

### On FAIL:
- [ ] Write QA Results section with critical issues
- [ ] Update story status to `Blocked`
- [ ] Escalate to @aiox-master with full report

---

## Fix Request Format (NEEDS_WORK)

```markdown
# QA Fix Request — {story_id} — Iteration {N}
**Reviewer:** @qa (Quinn) | **Date:** {date}

## CRITICAL Issues (must fix before PASS)
- [ ] {issue_id}: {clear description of issue and expected behavior}

## MAJOR Issues (should fix for quality)
- [ ] {issue_id}: {description}

## MINOR Issues (optional, register as tech debt if not fixing)
- [ ] {issue_id}: {description}

## Evidence
- {file}:{line}: {specific finding}

## How to Re-Request Review
1. Apply all CRITICAL and MAJOR fixes
2. Run `npm run lint && npm run typecheck && npm test`
3. Update story checkboxes
4. Signal @qa for re-review
```

---

## Constraints (Non-Negotiable for @qa)

- **NEVER modify application source code** — read-only access to implementation
- **ONLY update QA Results section** of story files
- **NEVER approve** stories with failing lint/typecheck
- **NEVER approve** stories with missing AC implementations
- **NEVER approve** stories with critical security issues
- **ALWAYS verify** actual code changes, not just documentation

---

## Acceptance Criteria (for this task)

- [ ] All 7 phases executed completely
- [ ] Score calculated accurately
- [ ] Verdict issued with evidence
- [ ] QA Results section written in story file
- [ ] Fix request created (if NEEDS_WORK)
- [ ] @dev or @devops signaled appropriately

---

_Task Version: 3.0_
_Constitution: Article V (Quality First) enforced_
_Last Updated: 2026-03-13_
