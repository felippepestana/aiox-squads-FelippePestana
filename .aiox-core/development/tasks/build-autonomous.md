# Task: Autonomous Build Loop

**Task ID:** build-autonomous
**Execution Type:** Agent + Scripts
**Model:** Opus
**Purpose:** Start autonomous build loop for a story — complete pipeline with retries
**Agent:** @dev (Dex) — Epic 8, Story 8.1

---

## Overview

Autonomous build loop that orchestrates the complete story implementation pipeline:
1. Create worktree for isolation
2. Load implementation plan
3. Execute all subtasks via plan-execute-subtask
4. Retry on failure (max 3 attempts)
5. Verify completion
6. Signal ready for QA

---

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `story_id` | string | YES | Story ID to build (e.g., "2.1") |
| `story_file` | path | YES | Path to story file |
| `max_retries` | int | NO | Max retry attempts (default 3) |
| `mode` | enum | NO | `yolo` (default) or `interactive` |

---

## PHASE 1: Setup

- [ ] 1.1 — Read story file, verify status = "Ready"
- [ ] 1.2 — Create worktree: `git worktree add .aiox/worktrees/{story_id} -b story/{story_id}`
- [ ] 1.3 — Verify implementation.yaml exists or generate from story AC
- [ ] 1.4 — Initialize state file: `.aiox/builds/build-{story_id}.json`

## PHASE 2: Execute Loop

For each subtask in topological order (respecting `depends_on`):

- [ ] 2.1 — Execute `plan-execute-subtask.md` for subtask
- [ ] 2.2 — Execute `verify-subtask.md` for subtask
- [ ] 2.3 — If PASS: continue to next subtask
- [ ] 2.4 — If FAIL: increment attempt counter, retry if < max_retries
- [ ] 2.5 — If max_retries reached: HALT, mark as blocked

## PHASE 3: DoD + Completion

- [ ] 3.1 — Run story-dod-checklist.md
- [ ] 3.2 — Run CodeRabbit (if WSL available)
- [ ] 3.3 — Update story status to "ReadyForReview"
- [ ] 3.4 — Signal @qa for review

## PHASE 4: Merge (if approved)

- [ ] 4.1 — `git merge --no-ff story/{story_id}`
- [ ] 4.2 — `git worktree remove .aiox/worktrees/{story_id}`
- [ ] 4.3 — Signal @devops for push

---

## State File: `.aiox/builds/build-{story_id}.json`

```json
{
  "story_id": "{id}",
  "status": "running|complete|failed|blocked",
  "started_at": "{iso}",
  "current_subtask": "{subtask_id}",
  "completed_subtasks": [],
  "failed_subtasks": [],
  "attempt": 1,
  "max_retries": 3
}
```

---

_Task Version: 3.0_
_Part of: ADE — Epic 8_
_Last Updated: 2026-03-13_
