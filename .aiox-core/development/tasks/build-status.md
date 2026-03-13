# Task: Build Status

**Task ID:** build-status
**Purpose:** Show current build status for one or all stories
**Agent:** @dev (Dex)

---

## Overview

Reads build state files and displays current status.

## Inputs

| Parameter | Type | Description |
|-----------|------|-------------|
| `story_id` | string | Specific story ID, or `--all` for all |

## Steps

### Single Story (`*build-status {story_id}`)
- [ ] 1 — Read `.aiox/builds/build-{story_id}.json`
- [ ] 2 — Display: status, current subtask, progress (N/total), elapsed time
- [ ] 3 — Show last 5 log entries

### All Stories (`*build-status --all`)
- [ ] 1 — Glob `.aiox/builds/*.json`
- [ ] 2 — For each: show story_id, status, progress
- [ ] 3 — Highlight blocked or failed builds

## Output Format

```
📊 Build Status: Story {story_id}
Status: RUNNING | COMPLETE | FAILED | BLOCKED
Progress: {N}/{total} subtasks complete
Current: {subtask_id} — {description}
Elapsed: {X} minutes
```

---

_Task Version: 3.0 | Last Updated: 2026-03-13_
