# ===============================================================================
# TASK: Manage Story Backlog
# ID: manage-story-backlog
# Version: 1.0.0
# Purpose: Manage story backlog: add new items, reprioritize, tag tech debt,
#          archive completed items.
# Agent: qa (Quinn)
# ===============================================================================

## Overview

Manages a per-story backlog of items discovered during QA review. Items include
bugs, improvements, tech debt, and follow-up tasks. The backlog lives in the
story file or a dedicated backlog file and feeds into sprint planning.

---

## Inputs

| Parameter   | Type   | Required | Description                                       |
|------------|--------|----------|---------------------------------------------------|
| story_file | path   | YES      | Absolute path to the story .md file               |
| action     | enum   | YES      | `add`, `update`, `review`, `archive`              |
| item       | object | NO       | Backlog item details (for `add` action)           |

---

## Action: ADD

Add a new item to the story backlog.

- [ ] 1.1 -- Validate item has required fields:
  - **type**: `bug`, `improvement`, `tech-debt`, `follow-up`
  - **priority**: `P1` (critical), `P2` (high), `P3` (medium), `P4` (low)
  - **title**: Brief description
  - **description**: Detailed explanation
  - **source**: Where this was found (QA gate, code review, etc.)
- [ ] 1.2 -- Assign unique item ID: `BL-{story_id}-{sequence}`
- [ ] 1.3 -- Set initial status: `open`
- [ ] 1.4 -- Append to backlog section in story file

### Backlog Entry Format

```markdown
### BL-{story_id}-{N}: {title}
- **Type:** {bug | improvement | tech-debt | follow-up}
- **Priority:** {P1 | P2 | P3 | P4}
- **Status:** {open | in-progress | resolved | deferred | archived}
- **Source:** {qa-gate | code-review | security-scan | etc.}
- **Description:** {detailed description}
- **Added:** {YYYY-MM-DD}
```

---

## Action: UPDATE

Update an existing backlog item.

- [ ] 2.1 -- Find item by ID in story file
- [ ] 2.2 -- Update status: `open` -> `in-progress` -> `resolved` / `deferred`
- [ ] 2.3 -- Add resolution note if resolving
- [ ] 2.4 -- Update priority if re-prioritizing

---

## Action: REVIEW

Generate a backlog review for sprint planning.

- [ ] 3.1 -- Read all backlog items from story file
- [ ] 3.2 -- Group by status (open, in-progress, resolved, deferred)
- [ ] 3.3 -- Group open items by priority
- [ ] 3.4 -- Calculate metrics: total items, open vs resolved, tech debt ratio

### Review Output Format

```markdown
## Backlog Review: {story_id}

**Date:** {YYYY-MM-DD}

### Metrics
| Metric | Value |
|--------|-------|
| Total Items | {n} |
| Open | {n} |
| In Progress | {n} |
| Resolved | {n} |
| Deferred | {n} |
| Tech Debt Items | {n} |

### Open Items by Priority
#### P1 (Critical)
- BL-{id}: {title}

#### P2 (High)
- BL-{id}: {title}

#### P3 (Medium)
- BL-{id}: {title}

#### P4 (Low)
- BL-{id}: {title}

### Recommendations
- {prioritized recommendations for next sprint}
```

---

## Action: ARCHIVE

Archive completed items.

- [ ] 4.1 -- Find all items with status `resolved` older than current sprint
- [ ] 4.2 -- Move to archived section of story file
- [ ] 4.3 -- Log archive count

---

## Acceptance Criteria

1. ADD: Item created with unique ID and all required fields
2. UPDATE: Item status correctly updated with timestamp
3. REVIEW: All items accounted for in metrics
4. ARCHIVE: Resolved items moved to archive section
5. Story file is the single source of truth for backlog items

---

## Estimated Time

| Action   | Time    |
|----------|---------|
| Add      | 1-2 min |
| Update   | 1 min   |
| Review   | 3-5 min |
| Archive  | 2-3 min |
