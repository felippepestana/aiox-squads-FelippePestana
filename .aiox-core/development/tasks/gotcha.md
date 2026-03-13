# ═══════════════════════════════════════════════════════════════════════════════
# TASK: Add Gotcha
# ID: gotcha
# Version: 3.0.0
# Purpose: Add a single gotcha entry to .aiox/gotchas.json — minimal,
#          fast task for capturing a gotcha in the moment.
# Agent: @dev (Dex)
# Phase in Pipeline: memory-capture
# ═══════════════════════════════════════════════════════════════════════════════

## Overview

Quick-capture task for adding a single gotcha to the knowledge base. This is
the fast path — use `*gotcha {title} - {description}` to capture a gotcha
immediately without the full session-insights workflow.

### Usage

```
*gotcha Missing index on users table - Queries on email field were slow because no index existed. Added CREATE INDEX idx_users_email.
```

---

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| title | string | YES | Brief title of the gotcha |
| description | string | YES | What happened and how it was resolved |
| category | string | NO | Category (auto-detected if not provided) |
| severity | string | NO | HIGH, MEDIUM, LOW (default: MEDIUM) |

---

## Preconditions

- [ ] Title and description provided (can be in single string with " - " separator)

---

## PHASE 0: Parse Input

**Checkpoint:** Gotcha data parsed.

### Action Items

- [ ] 0.1 — Parse input string:
  - If format is `{title} - {description}`: split on first " - "
  - If only title provided: use title as both title and description
- [ ] 0.2 — Auto-detect category from keywords:
  ```yaml
  auto_detect:
    Frontend: [react, component, css, tailwind, UI, render, DOM, hook, state]
    Backend: [api, server, endpoint, route, middleware, request, response]
    Database: [query, index, table, migration, SQL, RLS, schema, postgres]
    DevOps: [deploy, CI, CD, docker, build, pipeline, git]
    Testing: [test, mock, jest, assertion, coverage, fixture]
    Configuration: [env, config, yaml, json, setting, variable]
    Architecture: [pattern, module, import, dependency, structure]
    API: [fetch, axios, REST, GraphQL, webhook, oauth, token]
  ```
  Default to "Backend" if no match.
- [ ] 0.3 — Set severity to provided value or MEDIUM

### Phase 0 Checkpoint

- [ ] Title extracted
- [ ] Description extracted
- [ ] Category determined
- [ ] Severity set

---

## PHASE 1: Write Gotcha

**Checkpoint:** Gotcha persisted.

### Action Items

- [ ] 1.1 — Read `.aiox/gotchas.json` (create if not exists with `[]`)
- [ ] 1.2 — Check for duplicates (same title, case-insensitive)
- [ ] 1.3 — If duplicate found: warn and HALT (don't add duplicate)
- [ ] 1.4 — Create gotcha entry:
  ```json
  {
    "id": "gotcha-{timestamp}",
    "title": "{title}",
    "description": "{description}",
    "category": "{category}",
    "severity": "{severity}",
    "agent_type": "Dev",
    "discovered_date": "{YYYY-MM-DD}",
    "resolution": "{extracted from description if present}",
    "tags": ["{auto-extracted keywords}"]
  }
  ```
- [ ] 1.5 — Append to gotchas array
- [ ] 1.6 — Write updated `.aiox/gotchas.json`
- [ ] 1.7 — Display confirmation:
  ```
  Gotcha added: "{title}"
  Category: {category} | Severity: {severity}
  Total gotchas: {N}
  ```

### Phase 1 Checkpoint

- [ ] Gotcha written to file
- [ ] No duplicates
- [ ] Confirmation displayed

---

## Acceptance Criteria

1. Gotcha entry added to `.aiox/gotchas.json`
2. Entry has valid id, title, description, category, severity
3. No duplicate entries created
4. File remains valid JSON after write

---

## Output Specification

| Field | Value |
|-------|-------|
| Primary Output | Updated .aiox/gotchas.json |

---

## Dependencies

| Resource | Type | Path |
|----------|------|------|
| Gotchas | data | `.aiox/gotchas.json` |

---

## Error Handling

| Error | Action |
|-------|--------|
| gotchas.json doesn't exist | Create directory and file with `[]` |
| Invalid JSON in existing file | Attempt to fix, or backup and create new |
| Duplicate title found | Warn user, do not add |
| No input provided | HALT — "Usage: *gotcha {title} - {description}" |

---

_Task Version: 3.0.0_
_Last Updated: 2026-03-13_
