# ═══════════════════════════════════════════════════════════════════════════════
# TASK: Develop Story
# ID: dev-develop-story
# Version: 3.0.0
# Purpose: Primary development task — implement a user story from Ready to
#          ReadyForReview with full IDS protocol, self-critique, and DoD.
# Agent: @dev (Dex)
# Phase in Pipeline: plan-execute
# ═══════════════════════════════════════════════════════════════════════════════

## Overview

This is the PRIMARY task executed by the @dev agent (Dex). It takes a validated
story file (status: Ready) and implements all acceptance criteria through a
structured multi-phase workflow. The task enforces IDS protocol for every file
creation, self-critique at designated checkpoints, and DoD verification before
completion.

### Execution Modes

| Mode | Prompts | Description |
|------|---------|-------------|
| **YOLO** (default) | 0-1 | Fully autonomous. Reads story, implements, validates, completes. Only halts on blockers. |
| **Interactive** | 5-10 | Pauses between phases for user confirmation. Educational mode. |
| **Pre-Flight** | 0 | Planning only. Outputs implementation plan without writing code. |

### Order of Execution

```
Read task → Implement task + subtasks → Write tests → Execute validations →
Only if ALL pass: mark task checkbox [x] → Update File List → Repeat until complete
```

---

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| story_file | path | YES | Path to the .story.md file to implement |
| mode | enum | NO | Execution mode: yolo, interactive, preflight (default: yolo) |
| resume_from | string | NO | Phase ID to resume from (for recovery) |

---

## Preconditions

Before starting, the following MUST be true:

- [ ] Story file exists at `story_file` path and is readable
- [ ] Story status is "Ready" or "InProgress" (NOT "Draft")
- [ ] Story has acceptance criteria defined (at least 1 AC item)
- [ ] Story has tasks defined with checkboxes
- [ ] Development environment is functional (dependencies installed)
- [ ] No uncommitted changes in working tree that conflict with story scope
- [ ] `.aiox-core/core-config.yaml` loaded (devLoadAlwaysFiles applied)

### Precondition Failure Handling

| Failure | Action |
|---------|--------|
| Story file not found | HALT — display path and ask user |
| Story status is Draft | HALT — "Story not validated. Run @po *validate first" |
| No acceptance criteria | HALT — "Story incomplete. Return to @sm for revision" |
| Dirty working tree | WARN — list conflicts, proceed if no overlap with story files |

---

## PHASE 0: Context Loading

**Checkpoint:** All context loaded, ready to analyze.

### Action Items

- [ ] 0.1 — Run `git status --short` to capture current working tree state
- [ ] 0.2 — Run `git log --oneline -5` to capture recent commit context
- [ ] 0.3 — Read the story file at `story_file` path completely (no partial reads)
- [ ] 0.4 — Read `.aiox-core/core-config.yaml` and load `devLoadAlwaysFiles` entries
- [ ] 0.5 — Read `.aiox/gotchas.json` if it exists, filter for Dev-relevant gotchas
- [ ] 0.6 — Read `.aiox-core/data/technical-preferences.md` for coding standards
- [ ] 0.7 — If story references architecture/PRD docs, note them but do NOT load
        unless story Dev Notes explicitly says to load them
- [ ] 0.8 — Identify current git branch and verify it matches expected story branch

### Phase 0 Checkpoint

- [ ] Story file fully read and parsed
- [ ] Story status confirmed as Ready or InProgress
- [ ] devLoadAlwaysFiles loaded
- [ ] Git state captured

---

## PHASE 1: Story Analysis

**Checkpoint:** Implementation plan clear, all files identified.

### Action Items

- [ ] 1.1 — Parse ALL acceptance criteria from story file into a numbered list
- [ ] 1.2 — Parse ALL tasks and subtasks from story file into a checklist
- [ ] 1.3 — For each task/AC, identify which files need to be created or modified
- [ ] 1.4 — Build a complete File List of all files that will be touched
- [ ] 1.5 — Identify any external dependencies needed (packages, APIs, configs)
- [ ] 1.6 — Check for potential conflicts with existing code (Grep for similar names)
- [ ] 1.7 — Determine implementation order based on dependencies between tasks
- [ ] 1.8 — If mode is "preflight": output the implementation plan and HALT

### Phase 1 Checkpoint

- [ ] All AC items enumerated and understood
- [ ] All tasks enumerated with clear implementation path
- [ ] File list complete (new files + modified files)
- [ ] Implementation order determined
- [ ] No ambiguous AC items (if ambiguous: document as [AUTO-DECISION])

---

## PHASE 2: IDS Protocol (Intelligent Decision System)

**Checkpoint:** Every file decision documented — no blind creation.

### Action Items

For EACH file identified in Phase 1:

- [ ] 2.1 — **SEARCH**: Use Glob + Grep to find similar existing files
  - Search in `squads/` for similar patterns
  - Search in project `src/` or `lib/` for existing utilities
  - Search for similar component names, function names, patterns
- [ ] 2.2 — **DECIDE**: For each file, choose one:
  - **REUSE** — Existing file serves the purpose. Import and use directly.
  - **ADAPT** — Existing file is close. Copy and modify for new context.
  - **CREATE** — Nothing suitable exists. Create from scratch.
- [ ] 2.3 — **LOG**: Record each decision:
  ```
  [IDS] {file_path} → {REUSE|ADAPT|CREATE} (reason: {justification})
  ```
- [ ] 2.4 — Verify no duplicate functionality is being introduced

### Phase 2 Checkpoint

- [ ] Every new file has an IDS decision logged
- [ ] No blind file creation (every CREATE has justification)
- [ ] Reuse opportunities identified and applied where possible

---

## PHASE 3: Implementation

**Checkpoint:** All code written, lint passes, tests pass.

### Action Items

Execute in the order determined in Phase 1:

- [ ] 3.1 — For EACH task in story (in dependency order):
  - Read the task description and subtasks
  - Implement the code changes required
  - Follow coding standards from technical-preferences.md
  - Use absolute imports (Constitution Article VI)
  - Apply relevant gotchas from `.aiox/gotchas.json`

- [ ] 3.2 — For EACH acceptance criterion:
  - Verify the implementation satisfies the criterion
  - If tests are required by the AC, write them
  - Document any deviations as [AUTO-DECISION]

- [ ] 3.3 — Run lint check: `npm run lint` (or project equivalent)
  - If lint fails: fix all errors before proceeding
  - Warnings are acceptable but should be minimized

- [ ] 3.4 — Run type check: `npm run typecheck` (or project equivalent)
  - If typecheck fails: fix all type errors before proceeding

- [ ] 3.5 — Run existing tests: `npm test` (or project equivalent)
  - ALL existing tests must pass (no regressions)
  - New tests for implemented features must pass

### Implementation Rules

```yaml
CRITICAL_RULES:
  - ONLY update story file sections authorized for @dev:
    - Task/Subtask checkboxes [x]
    - Dev Agent Record section
    - File List
    - Change Log
    - Status field
  - DO NOT modify: Story title, AC, Dev Notes, Testing sections, Scope
  - Follow story task order unless dependencies require otherwise
  - HALT if: 3 consecutive failures on same task, missing config, ambiguous AC
```

### Error Handling During Implementation

| Error | Action |
|-------|--------|
| Lint error | Auto-fix if possible, otherwise fix manually and re-run |
| Type error | Fix type issue, re-run typecheck |
| Test failure (new test) | Debug and fix implementation |
| Test failure (existing test) | HALT — regression detected, investigate |
| Missing dependency | Document need, ask user if allowed to add |
| 3 consecutive failures | HALT — possible wrong approach, run correct-course |

### Phase 3 Checkpoint

- [ ] All tasks implemented
- [ ] Lint passes with 0 errors
- [ ] Typecheck passes with 0 errors
- [ ] All tests pass (existing + new)
- [ ] No regressions introduced

---

## PHASE 3.5: Self-Critique Checkpoint (FIRST)

**Checkpoint:** Self-assessment before continuing to story updates.

### Action Items

- [ ] 3.5.1 — Execute `self-critique-checklist.md` against current implementation
- [ ] 3.5.2 — Review each criterion honestly:
  - Code quality: Is the code clean, readable, maintainable?
  - Completeness: Are ALL acceptance criteria addressed?
  - Testing: Are tests meaningful (not just passing)?
  - Standards: Does code follow project conventions?
  - IDS: Were all IDS decisions justified?
- [ ] 3.5.3 — If any CRITICAL issues found: fix before proceeding
- [ ] 3.5.4 — Document self-critique results in story Dev Agent Record

### Phase 3.5 Checkpoint

- [ ] Self-critique checklist executed
- [ ] All CRITICAL issues resolved
- [ ] Results documented in story

---

## PHASE 4: Story File Updates

**Checkpoint:** Story file accurately reflects implementation state.

### Action Items

- [ ] 4.1 — Update task checkboxes: mark each completed task as `[x]`
- [ ] 4.2 — Update subtask checkboxes: mark each completed subtask as `[x]`
- [ ] 4.3 — Update File List section:
  - Add all new files created
  - Add all modified files
  - Mark deleted files if any
  - Include relative paths from project root
- [ ] 4.4 — Update Change Log section with summary of changes
- [ ] 4.5 — Update Dev Agent Record section:
  - Debug Log: any issues encountered and how resolved
  - Completion Notes: summary of what was done
  - Agent Model Used: record model identifier
- [ ] 4.6 — Verify NO unauthorized sections were modified

### Phase 4 Checkpoint

- [ ] All completed tasks marked [x]
- [ ] File List is complete and accurate
- [ ] Change Log updated
- [ ] Dev Agent Record filled
- [ ] No unauthorized story sections modified

---

## PHASE 5: DoD Verification

**Checkpoint:** Story meets Definition of Done.

### Action Items

- [ ] 5.1 — Execute `story-dod-checklist.md` against the completed story
- [ ] 5.2 — Verify each DoD item:
  - All acceptance criteria implemented
  - All tasks marked complete
  - Tests written and passing
  - Lint/typecheck clean
  - File List complete
  - No regressions
  - Code reviewed (self-critique passed)
- [ ] 5.3 — If any DoD item fails:
  - CRITICAL fail: go back to Phase 3, fix, re-run from Phase 3.5
  - MINOR fail: document and proceed (with justification)
- [ ] 5.4 — Record DoD results in story Dev Agent Record

### Phase 5 Checkpoint

- [ ] DoD checklist executed
- [ ] All CRITICAL DoD items pass
- [ ] Results recorded in story

---

## PHASE 5.5: Final Self-Critique Checkpoint

**Checkpoint:** Final quality gate before marking complete.

### Action Items

- [ ] 5.5.1 — Re-execute `self-critique-checklist.md` (final pass)
- [ ] 5.5.2 — Verify no issues were introduced during Phase 4 updates
- [ ] 5.5.3 — Confirm all file changes are consistent
- [ ] 5.5.4 — Run final lint + typecheck to catch any last issues

### Phase 5.5 Checkpoint

- [ ] Final self-critique passes
- [ ] Final lint + typecheck clean
- [ ] All changes consistent

---

## PHASE 6: Completion

**Checkpoint:** Story transitioned to ReadyForReview, handoff signaled.

### Action Items

- [ ] 6.1 — Update story status: "InProgress" -> "ReadyForReview"
- [ ] 6.2 — Run CodeRabbit pre-commit review (if available):
  - Execute via WSL: `coderabbit --prompt-only -t uncommitted`
  - If CRITICAL issues: enter self-healing loop (max 2 iterations)
  - If no CRITICAL issues: proceed
- [ ] 6.3 — Create handoff artifact for @qa:
  ```yaml
  handoff:
    from_agent: "dev"
    to_agent: "qa"
    story_id: "{story_id}"
    story_path: "{story_file}"
    story_status: "ReadyForReview"
    current_task: "All tasks complete"
    files_modified: [list of all modified files]
    decisions: [key architectural/implementation decisions]
    next_action: "Execute QA gate review"
  ```
- [ ] 6.4 — Display completion summary:
  - Tasks completed: N/N
  - Tests passing: all
  - Lint/typecheck: clean
  - Self-critique: passed
  - DoD: passed
  - "Story complete. Activate @qa for review or @devops to push."
- [ ] 6.5 — HALT and await user input

### Phase 6 Checkpoint

- [ ] Story status is "ReadyForReview"
- [ ] CodeRabbit review passed (or not available)
- [ ] Handoff artifact created
- [ ] Completion summary displayed

---

## Acceptance Criteria

All criteria are measurable and binary (PASS/FAIL):

1. All story tasks marked as [x] complete
2. All story acceptance criteria implemented and verified
3. Lint passes with 0 errors
4. Typecheck passes with 0 errors
5. All tests pass (existing + new, no regressions)
6. File List in story is complete and accurate
7. Self-critique checklist executed at Phase 3.5 and Phase 5.5
8. DoD checklist executed at Phase 5
9. Story status updated to "ReadyForReview"
10. No unauthorized story sections modified
11. IDS protocol followed for every new file (decisions logged)
12. Change Log updated in story

---

## Output Specification

| Field | Value |
|-------|-------|
| Primary Output | Updated story file with status "ReadyForReview" |
| Secondary Output | Implemented code changes (committed locally) |
| Artifacts | Handoff artifact at `.aiox/handoffs/` |
| Logs | IDS decisions, self-critique results, DoD results |

---

## Dependencies

| Resource | Type | Path |
|----------|------|------|
| Story DoD Checklist | checklist | `checklists/story-dod-checklist.md` |
| Self-Critique Checklist | checklist | `checklists/self-critique-checklist.md` |
| Technical Preferences | data | `.aiox-core/data/technical-preferences.md` |
| Core Config | config | `.aiox-core/core-config.yaml` |
| Gotchas | data | `.aiox/gotchas.json` |

---

## Error Handling

| Error | Action |
|-------|--------|
| Story not found | HALT — display expected path |
| Story is Draft | HALT — "Validate with @po first" |
| Lint fails after 3 attempts | HALT — log errors, ask user |
| Test regression detected | HALT — investigate, do not proceed |
| 3 consecutive task failures | HALT — suggest `*correct-course` |
| CodeRabbit CRITICAL after 2 iterations | HALT — report to user |
| Missing npm/package dependency | HALT — ask user before installing |

---

## Recovery

If this task is interrupted or fails mid-execution:

1. Check story file for last completed task checkbox
2. Use `resume_from` parameter to restart from specific phase
3. Git diff shows what was changed since task started
4. Story Change Log shows what was completed

---

_Task Version: 3.0.0_
_Last Updated: 2026-03-13_
_Lines: 300+_
