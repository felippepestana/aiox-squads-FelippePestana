# Task: Build Resume

**Task ID:** build-resume
**Purpose:** Resume autonomous build from last checkpoint
**Agent:** @dev (Dex)

---

## Overview

Reads the build state file and resumes from the last completed subtask checkpoint.

## Steps

- [ ] 1 — Read `.aiox/builds/build-{story_id}.json`
- [ ] 2 — Identify last successful subtask (`completed_subtasks[-1]`)
- [ ] 3 — Identify next pending subtask
- [ ] 4 — Verify worktree still exists, create if missing
- [ ] 5 — Resume `build-autonomous.md` from next subtask
- [ ] 6 — Update state file with resumed attempt

## Error Handling

- If state file missing: Create new build from scratch
- If worktree missing: Recreate from base branch
- If completed subtasks have regressions: Re-verify from first failed

---

_Task Version: 3.0 | Last Updated: 2026-03-13_
