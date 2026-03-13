# Task: Wave Analysis (WIS-4)

**Task ID:** waves
**Purpose:** Analyze story/workflow for parallel execution opportunities
**Agent:** @dev (Dex) — delegates execution to Dispatch squad
**Usage:** `*waves [--visual]`

---

## Overview

Analyzes the current story's tasks and subtasks to identify which can run in parallel (wave-based execution), then either displays the analysis or hands off to `@dispatch-chief` for execution.

## Steps

- [ ] 1 — Read active story file, extract AC items and File List
- [ ] 2 — Build task dependency graph:
  - Items that can start immediately → Wave 1 (root tasks, no dependencies)
  - Items dependent on Wave 1 completion → Wave 2
  - Items dependent on Wave 2 → Wave 3
  - Continue until all items placed

- [ ] 3 — Identify parallelism:
  - Within each wave: which tasks are independent?
  - Estimate: how many agents needed per wave?

- [ ] 4 — Calculate potential savings:
  - Sequential time: sum of all task durations
  - Parallel time: sum of critical path task durations
  - Savings = (sequential - parallel) / sequential * 100%

- [ ] 5 — If `--visual` flag: render ASCII art DAG
  ```
  Wave 1: [Task A] [Task B] [Task C]  ← parallel
              |        |
  Wave 2:   [Task D] [Task E]         ← parallel
                   |
  Wave 3:        [Task F]             ← final
  ```

- [ ] 6 — Recommendation:
  - If parallelism > 40%: suggest `@dispatch-chief` for execution
  - If tasks > 10: strongly suggest Dispatch Squad
  - If tasks ≤ 5 and simple: sequential is fine

## Output

```
⚡ Wave Analysis: Story {story_id}

Tasks: {N} total, {M} independent in Wave 1
Waves: {K} sequential phases
Critical Path: {list of dependent tasks}

Parallelism opportunity: {%}
Estimated savings: {time or cost delta}

Recommended: [Sequential | Dispatch Squad]

If using Dispatch: @dispatch-chief *dispatch {story_file}
```

---

_Task Version: 3.0 | WIS-4 | Last Updated: 2026-03-13_
