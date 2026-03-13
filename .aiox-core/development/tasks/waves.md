# ═══════════════════════════════════════════════════════════════════════════════
# TASK: Wave Analysis and Execution
# ID: waves
# Version: 3.0.0
# Purpose: Analyze a workflow or task list for parallel execution opportunities,
#          structure into DAG-based waves, and optionally execute via subagents.
# Agent: @dev (Dex)
# Phase in Pipeline: plan-execute
# ═══════════════════════════════════════════════════════════════════════════════

## Overview

This task analyzes a set of tasks (from a story, execution plan, or manifest)
and identifies which tasks can run in parallel by building a dependency DAG
and structuring execution into waves. Each wave contains tasks that have no
dependencies on each other and can execute simultaneously.

### Modes

| Mode | Description |
|------|-------------|
| **analyze** (default) | Build waves and display plan. No execution. |
| **execute** | Build waves and execute them via subagents. |
| **visual** | Build waves and display ASCII DAG visualization. |

### Wave Concept

```
Wave 1: [T001, T002, T003]  <- No dependencies, all run in parallel
Wave 2: [T004, T005]        <- Depend on Wave 1 outputs
Wave 3: [T006]              <- Depends on Wave 2 outputs (critical path)
```

Tasks within the same wave have NO dependencies on each other.
Tasks in Wave N+1 depend on at least one task from Wave N or earlier.

---

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| source | string | YES | Path to story file, execution-plan.yaml, or task manifest |
| mode | enum | NO | analyze, execute, visual (default: analyze) |
| max_parallel | integer | NO | Max tasks per wave (default: unlimited) |

---

## Preconditions

- [ ] Source file exists and contains tasks with identifiable dependencies
- [ ] If mode=execute: dispatch squad available or subagent capability active

---

## PHASE 0: Extract Tasks

**Checkpoint:** All tasks extracted with dependencies.

### Action Items

- [ ] 0.1 — Read source file
- [ ] 0.2 — Detect source type:
  - Story file (.story.md): extract tasks from checkboxes
  - Execution plan (.yaml): extract tasks section
  - Task manifest (.yaml/.json): parse directly
- [ ] 0.3 — For each task, extract:
  ```yaml
  task:
    id: "T001"
    description: "What this task does"
    depends_on: []  # IDs of tasks that must complete first
    estimated_time: "Xm"  # if available
    executor: "agent-name"  # if specified
  ```
- [ ] 0.4 — If dependencies are not explicit, infer them:
  - Tasks that produce output used by other tasks
  - Sequential tasks in a story (may have implicit ordering)
  - Tasks sharing the same file (must be sequential)
- [ ] 0.5 — Validate: no circular dependencies (topological sort check)

### Phase 0 Checkpoint

- [ ] All tasks extracted
- [ ] Dependencies mapped (explicit or inferred)
- [ ] No circular dependencies

---

## PHASE 1: Build Wave Structure

**Checkpoint:** Tasks organized into parallel waves.

### Action Items

- [ ] 1.1 — Apply topological sort to build wave assignment:
  ```
  Algorithm:
  1. Find all tasks with no dependencies -> Wave 1
  2. Remove Wave 1 tasks from dependency graph
  3. Find all tasks whose dependencies are all in completed waves -> Wave 2
  4. Repeat until all tasks assigned
  ```
- [ ] 1.2 — If max_parallel specified: split large waves into sub-waves
- [ ] 1.3 — Calculate wave statistics:
  ```yaml
  wave_plan:
    total_tasks: N
    total_waves: N
    critical_path_length: N  # longest chain of sequential dependencies
    max_parallelism: N  # largest wave size
    estimated_speedup: "X.Nx"  # vs sequential execution
  ```
- [ ] 1.4 — Identify critical path (longest sequential chain)

### Phase 1 Checkpoint

- [ ] All tasks assigned to waves
- [ ] Wave statistics calculated
- [ ] Critical path identified

---

## PHASE 2: Output Wave Plan

**Checkpoint:** Wave plan displayed or executed.

### Action Items — Analyze Mode (default)

- [ ] 2.1 — Display wave plan:
  ```
  Wave Analysis: {source_name}
  Total: {N} tasks in {W} waves
  Max parallelism: {P} tasks
  Critical path: {C} tasks ({T} estimated time)
  Speedup: {X}x vs sequential

  Wave 1 (parallel: {N} tasks):
    [T001] {description} (no deps)
    [T002] {description} (no deps)
    [T003] {description} (no deps)

  Wave 2 (parallel: {N} tasks):
    [T004] {description} (depends: T001)
    [T005] {description} (depends: T001, T002)

  Wave 3 (sequential: 1 task):
    [T006] {description} (depends: T004, T005) [CRITICAL PATH]
  ```

### Action Items — Visual Mode

- [ ] 2.2 — Display ASCII DAG:
  ```
  Wave 1:  [T001] --+-- [T004] --+
           [T002] --+             +-- [T006]
           [T003] --+-- [T005] --+

  Critical path: T001 -> T004 -> T006
  ```

### Action Items — Execute Mode

- [ ] 2.3 — For each wave (sequentially):
  - Launch all tasks in the wave as parallel subagents
  - Wait for all tasks in wave to complete
  - Collect outputs
  - Verify all completed successfully
  - If any failed: HALT and report which tasks failed
  - Proceed to next wave
- [ ] 2.4 — After all waves complete:
  - Collect all outputs
  - Display execution summary:
    ```
    Wave Execution Complete:
    - Waves executed: W
    - Tasks completed: N/N
    - Total time: Xm
    - Estimated sequential time: Ym
    - Actual speedup: X.Nx
    ```

### Phase 2 Checkpoint

- [ ] Wave plan displayed (analyze/visual) OR all waves executed (execute)
- [ ] Statistics reported

---

## Acceptance Criteria

1. All tasks extracted from source file
2. Dependencies correctly mapped
3. No circular dependencies in wave structure
4. Tasks assigned to minimum number of waves (optimal parallelism)
5. Critical path correctly identified
6. Wave plan displayed in requested format
7. If execute mode: all tasks completed successfully

---

## Output Specification

| Field | Value |
|-------|-------|
| Primary Output | Wave plan (analyze/visual) or execution results (execute) |
| Format | Formatted text display |

---

## Dependencies

| Resource | Type | Path |
|----------|------|------|
| Source file | input | Story, execution plan, or manifest |
| Dispatch squad | optional | `squads/dispatch/` (for execute mode) |

---

## Error Handling

| Error | Action |
|-------|--------|
| Circular dependency detected | Report cycle, suggest restructuring |
| Source file has no tasks | HALT — "No tasks found in source" |
| Execute mode task failure | HALT wave execution, report failed task |
| Cannot infer dependencies | Treat all tasks as Wave 1 (fully parallel), warn user |

---

_Task Version: 3.0.0_
_Last Updated: 2026-03-13_
