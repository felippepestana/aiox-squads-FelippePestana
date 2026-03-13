# ═══════════════════════════════════════════════════════════════════════════════
# TASK: Apply QA Fixes
# ID: apply-qa-fixes
# Version: 3.0.0
# Purpose: Apply fixes from QA review feedback to the current story
#          implementation. Processes fixes by severity priority.
# Agent: @dev (Dex)
# Phase in Pipeline: qa-fix
# ═══════════════════════════════════════════════════════════════════════════════

## Overview

After @qa (Quinn) reviews a story and issues a REJECT verdict, this task
processes the QA feedback and applies fixes systematically. Fixes are
prioritized by severity (CRITICAL first, then MAJOR, then MINOR) and each
fix is validated before moving to the next.

This task is typically invoked via `*apply-qa-fixes` after receiving
QA feedback, or automatically as part of the QA Loop workflow.

---

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| story_file | path | YES | Path to the story being fixed |
| qa_feedback | path | NO | Path to QA feedback file. If not provided, searches in `docs/qa/` |
| max_fixes | integer | NO | Maximum fixes to apply in one pass (default: all) |

---

## Preconditions

- [ ] Story file exists and status is "InReview" or "InProgress"
- [ ] QA feedback exists (file or inline in story)
- [ ] Previous implementation exists (not starting from scratch)
- [ ] Git working tree is clean or changes are only from this story

---

## PHASE 0: Load QA Feedback

**Checkpoint:** All QA issues parsed and categorized.

### Action Items

- [ ] 0.1 — Read the story file to get current implementation state
- [ ] 0.2 — Locate QA feedback:
  - Check for `QA_FIX_REQUEST.md` in story directory
  - Check for inline QA comments in story file
  - Check `docs/qa/` for feedback files matching story ID
- [ ] 0.3 — Parse each QA issue into structured format:
  ```yaml
  issue:
    id: "QA-001"
    severity: "CRITICAL|MAJOR|MINOR"
    file: "path/to/file.ts"
    line: 42  # optional
    description: "What is wrong"
    expected_fix: "What QA expects to see"
    category: "bug|style|performance|security|logic"
  ```
- [ ] 0.4 — Sort issues by severity: CRITICAL > MAJOR > MINOR
- [ ] 0.5 — Count total issues per severity level

### Phase 0 Checkpoint

- [ ] QA feedback file found and parsed
- [ ] All issues categorized by severity
- [ ] Issue count logged: CRITICAL={n}, MAJOR={n}, MINOR={n}

---

## PHASE 1: Apply CRITICAL Fixes

**Checkpoint:** All CRITICAL issues resolved.

### Action Items

- [ ] 1.1 — For EACH CRITICAL issue (in order):
  - Read the affected file
  - Understand the issue context
  - Apply the fix
  - Run lint check on the modified file
  - Run typecheck
  - Run related tests
  - Verify the fix addresses the QA concern
- [ ] 1.2 — If a CRITICAL fix introduces a regression:
  - Revert the fix
  - Try alternative approach
  - If 2 attempts fail: HALT and escalate to user
- [ ] 1.3 — After ALL critical fixes: run full test suite
- [ ] 1.4 — Log each fix applied:
  ```
  [QA-FIX] QA-001 (CRITICAL) → Fixed: {description of fix}
  ```

### Phase 1 Checkpoint

- [ ] All CRITICAL issues fixed
- [ ] No regressions from CRITICAL fixes
- [ ] Full test suite passes after CRITICAL fixes

---

## PHASE 2: Apply MAJOR Fixes

**Checkpoint:** All MAJOR issues resolved.

### Action Items

- [ ] 2.1 — For EACH MAJOR issue (in order):
  - Read the affected file
  - Apply the fix
  - Run lint + typecheck
  - Verify fix addresses QA concern
- [ ] 2.2 — After ALL major fixes: run test suite
- [ ] 2.3 — Log each fix applied

### Phase 2 Checkpoint

- [ ] All MAJOR issues fixed
- [ ] Tests still passing after MAJOR fixes

---

## PHASE 3: Apply MINOR Fixes

**Checkpoint:** All MINOR issues resolved (or documented as deferred).

### Action Items

- [ ] 3.1 — For EACH MINOR issue:
  - Apply the fix if straightforward
  - If fix is complex or risky: document as deferred with justification
- [ ] 3.2 — Run final lint + typecheck
- [ ] 3.3 — Log fixes applied and any deferred items

### Phase 3 Checkpoint

- [ ] All MINOR issues either fixed or documented as deferred
- [ ] Final lint + typecheck clean

---

## PHASE 4: Story Update and Re-Review Signal

**Checkpoint:** Story updated, ready for re-review.

### Action Items

- [ ] 4.1 — Update story Dev Agent Record:
  - Add QA Fix Log with all fixes applied
  - Note any deferred items
  - Update Change Log
- [ ] 4.2 — Update File List if new files were created/modified
- [ ] 4.3 — Update story status to "ReadyForReview"
- [ ] 4.4 — Create handoff artifact for @qa re-review:
  ```yaml
  handoff:
    from_agent: "dev"
    to_agent: "qa"
    story_status: "ReadyForReview"
    fixes_applied:
      critical: N
      major: N
      minor: N
      deferred: N
    next_action: "Re-review story with applied fixes"
  ```
- [ ] 4.5 — Display summary:
  ```
  QA Fixes Applied:
  - CRITICAL: N fixed
  - MAJOR: N fixed
  - MINOR: N fixed / M deferred
  Story status: ReadyForReview
  Ready for @qa re-review.
  ```

### Phase 4 Checkpoint

- [ ] Story Dev Agent Record updated with fix log
- [ ] File List updated
- [ ] Story status is "ReadyForReview"
- [ ] Handoff artifact created

---

## Acceptance Criteria

1. All CRITICAL QA issues resolved (0 remaining)
2. All MAJOR QA issues resolved (0 remaining)
3. MINOR issues either resolved or documented as deferred with justification
4. No regressions introduced by fixes
5. Lint and typecheck pass after all fixes
6. Full test suite passes after all fixes
7. Story Dev Agent Record updated with fix log
8. Story status updated to "ReadyForReview"

---

## Output Specification

| Field | Value |
|-------|-------|
| Primary Output | Fixed code with all QA issues addressed |
| Secondary Output | Updated story file with fix log |
| Artifacts | Handoff artifact for @qa re-review |

---

## Dependencies

| Resource | Type | Path |
|----------|------|------|
| Story file | input | `{story_file}` |
| QA feedback | input | `docs/qa/` or inline |
| Core Config | config | `.aiox-core/core-config.yaml` |

---

## Error Handling

| Error | Action |
|-------|--------|
| QA feedback not found | HALT — ask user for feedback location |
| CRITICAL fix fails twice | HALT — escalate to user with details |
| Regression detected | Revert fix, try alternative, then HALT if still failing |
| Conflicting fixes | Apply in severity order, document conflicts |

---

_Task Version: 3.0.0_
_Last Updated: 2026-03-13_
