# ═══════════════════════════════════════════════════════════════════════════════
# TASK: Correct Course
# ID: correct-course
# Version: 3.0.0
# Purpose: Recovery task when implementation is stuck, wrong direction, or
#          repeatedly failing. Analyzes root cause and creates correction plan.
# Agent: @dev (Dex)
# Phase in Pipeline: recovery-rollback
# ═══════════════════════════════════════════════════════════════════════════════

## Overview

This task is invoked when the normal development flow hits a wall — repeated
failures, wrong approach, blocked dependencies, or misunderstood acceptance
criteria. It performs a structured root cause analysis, determines the best
recovery strategy, and either rolls back to a safe state or applies a targeted
fix before resuming development.

### When to Use

- 3+ consecutive failures on the same task
- Implementation doesn't align with acceptance criteria after review
- Blocking dependency discovered mid-implementation
- Architecture approach proves unworkable
- Tests keep failing with no clear fix path

---

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| story_file | path | YES | Path to the story being corrected |
| trigger | string | NO | What triggered correction (e.g., "3_failures", "wrong_approach", "blocked") |
| last_good_commit | string | NO | Git commit hash of last known good state |

---

## Preconditions

- [ ] Story file exists and status is "InProgress"
- [ ] There is actual implementation work to evaluate (not starting from zero)
- [ ] Git history is available for the current branch

---

## PHASE 0: State Assessment

**Checkpoint:** Current state fully understood.

### Action Items

- [ ] 0.1 — Run `git status --short` to see all current changes
- [ ] 0.2 — Run `git diff --stat` to see scope of changes
- [ ] 0.3 — Run `git log --oneline -10` to see recent commit history
- [ ] 0.4 — Read the story file to understand expected vs actual state
- [ ] 0.5 — Identify which tasks are complete [x] vs incomplete [ ]
- [ ] 0.6 — Run lint check and capture errors (if any)
- [ ] 0.7 — Run tests and capture failures (if any)
- [ ] 0.8 — Check for `.aiox/recovery/attempts.json` for attempt history

### Phase 0 Checkpoint

- [ ] Git state captured (changes, commits, branch)
- [ ] Story state captured (completed vs remaining tasks)
- [ ] Error state captured (lint errors, test failures)

---

## PHASE 1: Root Cause Analysis

**Checkpoint:** Root cause identified with evidence.

### Action Items

- [ ] 1.1 — Categorize the issue:
  ```yaml
  categories:
    wrong_approach:
      signal: "Code works partially but doesn't satisfy AC"
      evidence: "AC comparison shows fundamental mismatch"
    missing_dependency:
      signal: "Import errors, API not available"
      evidence: "Specific missing package or service"
    misunderstood_ac:
      signal: "Implementation is correct but for wrong requirement"
      evidence: "Re-read AC shows different interpretation"
    technical_blocker:
      signal: "Library limitation, API constraint, environment issue"
      evidence: "Specific technical constraint documented"
    accumulated_errors:
      signal: "Each fix introduces new problems"
      evidence: "Git log shows fix-on-fix pattern"
    scope_creep:
      signal: "Implementation exceeds story scope"
      evidence: "Files modified outside story File List"
  ```
- [ ] 1.2 — Gather evidence for the identified category
- [ ] 1.3 — Document the root cause clearly:
  ```
  [ROOT CAUSE] Category: {category}
  Evidence: {specific evidence}
  Impact: {what this blocks}
  ```
- [ ] 1.4 — Check gotchas.json for similar past issues

### Phase 1 Checkpoint

- [ ] Root cause category identified
- [ ] Evidence documented
- [ ] Impact scope understood

---

## PHASE 2: Correction Strategy

**Checkpoint:** Strategy chosen and documented.

### Action Items

- [ ] 2.1 — Evaluate correction options:

  **Option A: Targeted Fix**
  - When: Issue is localized, most implementation is correct
  - Action: Fix the specific problem area
  - Risk: Low
  - Time: Minutes

  **Option B: Partial Rollback**
  - When: Recent changes broke things, older changes are good
  - Action: `git stash` or revert specific commits
  - Risk: Medium (might lose some good work)
  - Time: Minutes

  **Option C: Full Rollback**
  - When: Approach is fundamentally wrong, start task over
  - Action: `git checkout` to last good commit for affected files
  - Risk: Medium (lose current approach)
  - Time: Requires re-implementation

  **Option D: Scope Reduction**
  - When: Story is too complex for single pass
  - Action: Split remaining work, complete partial story
  - Risk: Low (but requires PO approval)
  - Time: Fast decision, slower execution

  **Option E: Escalation**
  - When: Technical blocker beyond dev capability
  - Action: Document and escalate to @architect or user
  - Risk: Blocks story
  - Time: Depends on resolution

- [ ] 2.2 — Select the best option based on:
  - Amount of salvageable work
  - Time already invested
  - Risk of each option
  - Story deadline (if any)
- [ ] 2.3 — Document the decision:
  ```
  [CORRECTION] Strategy: {option}
  Reason: {why this option}
  Salvageable: {what can be kept}
  Lost: {what must be redone}
  ```

### Phase 2 Checkpoint

- [ ] Correction strategy selected
- [ ] Decision documented with justification
- [ ] Risk acknowledged

---

## PHASE 3: Execute Correction

**Checkpoint:** Correction applied, state is clean.

### Action Items

- [ ] 3.1 — Execute chosen strategy:

  **If Targeted Fix:**
  - Apply specific fix
  - Run lint + typecheck + tests
  - Verify fix resolves root cause

  **If Partial Rollback:**
  - Identify commits to revert
  - `git revert {commit}` or `git checkout {commit} -- {files}`
  - Verify good state restored
  - Re-apply any salvageable changes

  **If Full Rollback:**
  - `git stash` current changes (preserve for reference)
  - `git checkout {last_good_commit} -- {affected_files}`
  - Verify clean state
  - Discard stash only after confirming recovery

  **If Scope Reduction:**
  - Document what is complete vs deferred
  - Update story tasks (mark deferred items)
  - Note: requires [AUTO-DECISION] documentation

  **If Escalation:**
  - Document the blocker completely
  - Create escalation artifact
  - HALT and notify user

- [ ] 3.2 — Run full validation:
  - Lint check: must pass
  - Typecheck: must pass
  - Test suite: must pass (at least at pre-correction level)
- [ ] 3.3 — Verify the root cause is resolved

### Phase 3 Checkpoint

- [ ] Correction applied successfully
- [ ] Validation passes (lint, typecheck, tests)
- [ ] Root cause resolved or escalated

---

## PHASE 4: Document and Resume

**Checkpoint:** Correction documented, development can resume.

### Action Items

- [ ] 4.1 — Update story Dev Agent Record:
  - Add correction entry to Debug Log
  - Document root cause, strategy, and outcome
- [ ] 4.2 — Add gotcha if the issue is reusable knowledge:
  ```json
  {
    "title": "{brief description}",
    "description": "{what happened and why}",
    "category": "{Frontend|Backend|Architecture|etc}",
    "severity": "{HIGH|MEDIUM|LOW}",
    "resolution": "{how it was fixed}",
    "prevention": "{how to avoid in future}"
  }
  ```
- [ ] 4.3 — Update implementation plan if approach changed
- [ ] 4.4 — Resume development from the correction point:
  - If tasks remain: continue with `dev-develop-story.md` from next incomplete task
  - If escalated: HALT with clear escalation message
- [ ] 4.5 — Reset failure counter for the affected task

### Phase 4 Checkpoint

- [ ] Correction documented in story Debug Log
- [ ] Gotcha added if applicable
- [ ] Development ready to resume (or escalation sent)

---

## Acceptance Criteria

1. Root cause identified and documented with evidence
2. Correction strategy selected with clear justification
3. Correction applied without introducing new issues
4. Validation passes after correction (lint, typecheck, tests)
5. Story Dev Agent Record updated with correction details
6. Gotcha added for reusable learnings (when applicable)
7. Development can resume from corrected state

---

## Output Specification

| Field | Value |
|-------|-------|
| Primary Output | Corrected codebase in clean state |
| Secondary Output | Updated story with correction documentation |
| Artifacts | Gotcha entry (if applicable) |

---

## Dependencies

| Resource | Type | Path |
|----------|------|------|
| Story file | input | `{story_file}` |
| Gotchas | data | `.aiox/gotchas.json` |
| Recovery tracker | script | `scripts/recovery-tracker.js` (optional) |

---

## Error Handling

| Error | Action |
|-------|--------|
| Rollback fails | Try manual file-by-file checkout |
| Correction introduces new issues | Revert correction, try next strategy option |
| All strategies fail | Escalate to user with complete diagnosis |
| Git history insufficient | Use file timestamps and story checkboxes as reference |

---

_Task Version: 3.0.0_
_Last Updated: 2026-03-13_
