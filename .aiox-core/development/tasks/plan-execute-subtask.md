# Task: Plan and Execute Subtask (ADE — Coder Agent)

**Task ID:** plan-execute-subtask
**Execution Type:** Agent
**Model:** Opus
**Purpose:** 13-step Coder Agent workflow for executing a single subtask from implementation.yaml
**Agent:** @dev (Dex)
**Part of:** Autonomous Development Engine (ADE)

> This is the core execution unit of ADE. Each subtask from implementation.yaml is executed through this 13-step protocol.

---

## Overview

Receives a subtask from `implementation.yaml` and executes it following a rigorous 13-step protocol with recovery tracking, self-critique, and verification.

```
INPUT: subtask definition from implementation.yaml
    |
[STEP 1: Context Load] → Read subtask, story, dependencies
    |
[STEP 2: Impact Analysis] → What files does this touch?
    |
[STEP 3: IDS Protocol] → Search before create
    |
[STEP 4: Approach Design] → Plan implementation approach
    |
[STEP 5: Implementation] → Write the code
    |
[STEP 5.5: Self-Critique] → Pause, review against checklist
    |
[STEP 6: Tests] → Write/update tests
    |
[STEP 6.5: Self-Critique] → Final review
    |
[STEP 7: Lint/Typecheck] → Validate code quality
    |
[STEP 8: Verification] → Run verification command
    |
[STEP 9: Story Update] → Update story file checkboxes
    |
[STEP 10: Decision Log] → Log decisions made
    |
[STEP 11: Attempt Tracking] → Update attempt record
    |
[STEP 12: Handoff] → Ready for next subtask or QA
    |
OUTPUT: Subtask complete + story updated
```

---

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `subtask_id` | string | YES | Subtask ID from implementation.yaml (e.g., T001) |
| `implementation_file` | path | YES | Path to implementation.yaml |
| `story_file` | path | YES | Path to active story file |
| `mode` | enum | NO | `yolo` (default) or `interactive` |

---

## Preconditions

- [ ] implementation.yaml exists and has the subtask
- [ ] story file exists and status is `InProgress` or `Ready`
- [ ] subtask dependencies are all marked complete
- [ ] subtask has acceptance_criteria defined
- [ ] output_path is defined for subtask

---

## STEP 1: Context Load

**Duration:** < 1 min

- [ ] 1.1 — Read implementation.yaml, extract subtask {subtask_id}
- [ ] 1.2 — Read story file, identify relevant AC items
- [ ] 1.3 — Read `.aiox-core/data/technical-preferences.md`
- [ ] 1.4 — Check subtask `depends_on` — verify all dependencies complete
- [ ] 1.5 — Log: "Starting subtask {subtask_id}: {description}"

**Gate:** All dependencies complete ✅ | BLOCK if any incomplete

---

## STEP 2: Impact Analysis

- [ ] 2.1 — Identify ALL files this subtask will create/modify/delete
- [ ] 2.2 — Map subtask output to story File List
- [ ] 2.3 — Confirm no files outside story scope (No Invention)
- [ ] 2.4 — Note any breaking changes to existing interfaces

---

## STEP 3: IDS Protocol (Mandatory)

For EVERY file the subtask will create:

- [ ] 3.1 — **SEARCH**: `Glob` + `Grep` for similar existing code
- [ ] 3.2 — **DECIDE**: REUSE (use as-is) | ADAPT (modify) | CREATE (new)
- [ ] 3.3 — **LOG**: Record decision — `[IDS] {file}: {decision} — reason: {why}`

**Veto:** Never create if REUSE or ADAPT is valid.

---

## STEP 4: Approach Design

- [ ] 4.1 — Write approach (3-5 sentences): What pattern? What libraries? What tradeoffs?
- [ ] 4.2 — Identify risks in chosen approach
- [ ] 4.3 — Document: `[APPROACH] {decision} — alternatives: {what was considered}`

Interactive mode: Present approach to user, await confirmation.
YOLO mode: Log approach, proceed autonomously.

---

## STEP 5: Implementation

- [ ] 5.1 — Implement according to subtask definition
- [ ] 5.2 — Follow acceptance_criteria exactly
- [ ] 5.3 — No features beyond what acceptance_criteria specifies (No Invention)
- [ ] 5.4 — Use vocabulary from technical-preferences.md
- [ ] 5.5 — Ensure code is readable with inline comments where logic is non-obvious

---

## STEP 5.5: Self-Critique Checkpoint

Run `execute-checklist.md` with checklist `self-critique-checklist.md`

Key questions:
- Am I solving the right problem? (re-read AC)
- Did I miss edge cases?
- Is this simpler than needed (over-engineering)?
- Did I respect IDS protocol?
- Any security implications?

**Gate:** Must confirm each checklist item before proceeding.

---

## STEP 6: Tests

- [ ] 6.1 — Write unit tests for new functions/components
- [ ] 6.2 — Write integration test if subtask creates API/service boundary
- [ ] 6.3 — Tests must be deterministic (no flaky tests)
- [ ] 6.4 — Run tests: `npm test {specific test file}` or equivalent

**Gate:** All tests PASS ✅ | Fix before proceeding if FAIL

---

## STEP 6.5: Final Self-Critique

Second pass of self-critique checklist. Focus on:
- Tests comprehensive?
- Code quality acceptable for QA?
- Story update ready?

---

## STEP 7: Lint & Typecheck

- [ ] 7.1 — Run lint: `npm run lint` or equivalent
- [ ] 7.2 — Run typecheck: `npm run typecheck` or `tsc --noEmit`
- [ ] 7.3 — Fix ALL lint errors (not just warnings for CRITICAL files)
- [ ] 7.4 — Fix ALL type errors

**Gate:** Zero lint errors ✅ | Zero type errors ✅

---

## STEP 8: Verification

Run the verification command from `implementation.yaml`:
- `type: command` → execute the command, match expectedOutput
- `type: api` → test the API endpoint
- `type: browser` → check browser console for errors
- `type: e2e` → run e2e test suite
- `type: manual` → document what to verify manually
- `type: none` → skip

**Gate:** Verification passes ✅ | Document failure and retry if FAIL

---

## STEP 9: Story File Update

- [ ] 9.1 — Check the subtask's story checkbox: `- [ ]` → `- [x]`
- [ ] 9.2 — Add file to Story File List (if not already there)
- [ ] 9.3 — ONLY update authorized sections (checkboxes, File List, Dev Notes)
- [ ] 9.4 — DO NOT modify AC text, user story, or any other sections

---

## STEP 10: Decision Log

Append to `.ai/decision-log-{story_id}.md`:
```markdown
## Subtask {subtask_id} — {timestamp}
- **Approach:** {chosen approach}
- **IDS Decisions:** {search results and decisions}
- **Autonomous Decisions:** {any [AUTO-DECISION] entries}
- **Files Created:** {list}
- **Files Modified:** {list}
```

---

## STEP 11: Attempt Tracking

Update `.aiox/recovery/attempts-{story_id}.json`:
```json
{
  "subtask_id": "{id}",
  "attempt": 1,
  "status": "complete",
  "timestamp": "{iso}",
  "files_modified": [...],
  "tests_pass": true
}
```

---

## STEP 12: Handoff

- [ ] 12.1 — Log: "✅ Subtask {subtask_id} complete"
- [ ] 12.2 — If more subtasks: return control to dev-develop-story.md for next subtask
- [ ] 12.3 — If last subtask: proceed to DoD checklist in dev-develop-story.md

---

## Error Handling

| Error | Action |
|-------|--------|
| Dependency not complete | BLOCK — wait for dependency or reorder |
| Implementation fails 3x | HALT — escalate to @aiox-master |
| Test fails | Fix immediately, re-run |
| Lint/type errors | Fix all before proceeding |
| Verification fails | Retry 1x, then document and escalate |
| Scope creep detected | STOP — remove extra code, stay within AC |

---

## Acceptance Criteria

- [ ] Subtask ID marked complete in implementation.yaml
- [ ] Story checkbox updated
- [ ] All tests pass
- [ ] Lint: zero errors
- [ ] Typecheck: zero errors
- [ ] Verification command passes
- [ ] Decision log updated
- [ ] Attempt tracking updated

---

_Task Version: 3.0_
_Pattern: ADE (Autonomous Development Engine)_
_Last Updated: 2026-03-13_
