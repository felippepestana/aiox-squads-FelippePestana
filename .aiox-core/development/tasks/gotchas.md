# ═══════════════════════════════════════════════════════════════════════════════
# TASK: List/Search Gotchas
# ID: gotchas
# Version: 3.0.0
# Purpose: List, search, and display gotchas from .aiox/gotchas.json with
#          filtering by category, severity, agent type, and search terms.
# Agent: @dev (Dex) — also usable by any agent
# Phase in Pipeline: memory-capture
# ═══════════════════════════════════════════════════════════════════════════════

## Overview

Read-only task for browsing the gotchas knowledge base. Supports filtering
by category, severity, agent type, tags, and free-text search. Useful for
loading relevant gotchas at the start of a task or debugging session.

### Usage

```
*gotchas                           # List all gotchas
*gotchas --category Frontend       # Filter by category
*gotchas --severity HIGH           # Filter by severity
*gotchas --search "index"          # Free text search
*gotchas --agent Dev               # Filter by agent type
*gotchas --recent 5                # Show 5 most recent
```

---

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| category | string | NO | Filter: Frontend, Backend, Database, API, DevOps, etc. |
| severity | string | NO | Filter: HIGH, MEDIUM, LOW |
| agent_type | string | NO | Filter: Dev, QA, Architect, All |
| search | string | NO | Free-text search in title and description |
| recent | integer | NO | Show N most recent entries |
| format | enum | NO | Output format: table, full, compact (default: table) |

---

## Preconditions

- [ ] `.aiox/gotchas.json` exists (or report "no gotchas yet")

---

## PHASE 0: Load and Filter

**Checkpoint:** Gotchas loaded and filtered.

### Action Items

- [ ] 0.1 — Read `.aiox/gotchas.json`
- [ ] 0.2 — If file doesn't exist or is empty: display "No gotchas recorded yet. Use *gotcha to add one."
- [ ] 0.3 — Parse all entries into array
- [ ] 0.4 — Apply filters (in order, cumulative):

  **Category filter:**
  - If `category` provided: keep only entries where `category` matches (case-insensitive)

  **Severity filter:**
  - If `severity` provided: keep only entries where `severity` matches

  **Agent type filter:**
  - If `agent_type` provided: keep entries where `agent_type` matches or is "All"

  **Search filter:**
  - If `search` provided: keep entries where title OR description contains search term (case-insensitive)

  **Recent filter:**
  - If `recent` provided: sort by discovered_date descending, take first N

- [ ] 0.5 — Count total and filtered results

### Phase 0 Checkpoint

- [ ] Gotchas loaded
- [ ] Filters applied
- [ ] Result count known

---

## PHASE 1: Display Results

**Checkpoint:** Results displayed in requested format.

### Action Items

- [ ] 1.1 — Display results based on format:

  **Table format (default):**
  ```
  Gotchas ({filtered}/{total})
  Filters: {active filters or "none"}

  | # | Severity | Category | Title | Date |
  |---|----------|----------|-------|------|
  | 1 | HIGH | Database | Missing index on users | 2026-03-10 |
  | 2 | MEDIUM | Frontend | React state batching | 2026-03-08 |
  ```

  **Full format:**
  ```
  Gotchas ({filtered}/{total})

  --- Gotcha 1 ---
  Title: Missing index on users table
  Category: Database | Severity: HIGH
  Date: 2026-03-10

  Description: Queries on email field were slow because no index existed.

  Resolution: Added CREATE INDEX idx_users_email ON users(email).

  Prevention: Always check query plans before deploying new queries.

  Tags: database, postgresql, performance
  ---
  ```

  **Compact format:**
  ```
  Gotchas ({filtered}/{total}):
  - [HIGH] Missing index on users table (Database)
  - [MEDIUM] React state batching quirk (Frontend)
  ```

- [ ] 1.2 — If no results after filtering: "No gotchas match your filters."
- [ ] 1.3 — Show filter tips if no filters were applied:
  ```
  Tip: Use --category, --severity, --search to filter.
  ```

### Phase 1 Checkpoint

- [ ] Results displayed in correct format
- [ ] Count shown

---

## Acceptance Criteria

1. Gotchas loaded from `.aiox/gotchas.json`
2. All specified filters applied correctly
3. Results displayed in requested format
4. Count of filtered/total shown
5. Graceful handling of empty file or no results

---

## Output Specification

| Field | Value |
|-------|-------|
| Primary Output | Formatted gotchas display |
| Format | Table, Full, or Compact (user's choice) |

---

## Dependencies

| Resource | Type | Path |
|----------|------|------|
| Gotchas | data | `.aiox/gotchas.json` |

---

## Error Handling

| Error | Action |
|-------|--------|
| File doesn't exist | Display "No gotchas yet" message |
| Invalid JSON | Warn user, attempt to parse what is valid |
| No results for filter | Display "No matches" with suggestion to broaden |

---

_Task Version: 3.0.0_
_Last Updated: 2026-03-13_
