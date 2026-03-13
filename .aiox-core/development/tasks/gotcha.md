# Task: Add Gotcha

**Task ID:** gotcha
**Purpose:** Add a single gotcha to `.aiox/gotchas.json`
**Agent:** @dev (Dex)
**Usage:** `*gotcha {title} - {description}`

---

## Overview

Captures a specific technical gotcha (surprise, footgun, non-obvious behavior) discovered during development into persistent memory for future agents.

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | string | YES | Short gotcha title (< 60 chars) |
| `description` | string | YES | What happened and what to do instead |
| `category` | enum | NO | Frontend, Backend, API, Database, Testing, Security, DevOps, Process |
| `severity` | enum | NO | HIGH, MEDIUM, LOW (default: MEDIUM) |
| `file_context` | string | NO | Relevant file or pattern |

## Steps

- [ ] 1 — Parse title and description from `*gotcha {title} - {description}`
- [ ] 2 — Read `.aiox/gotchas.json` (create if missing)
- [ ] 3 — Infer category from content if not provided
- [ ] 4 — Create gotcha entry:
```json
{
  "id": "G{timestamp}",
  "title": "{title}",
  "description": "{description}",
  "category": "{category}",
  "severity": "{severity}",
  "agent": "dev",
  "file_context": "{if provided}",
  "discovered_at": "{iso_date}",
  "story_context": "{current story ID if active}"
}
```
- [ ] 5 — Append to gotchas array in gotchas.json
- [ ] 6 — Write updated gotchas.json
- [ ] 7 — Confirm: "✅ Gotcha added: {title}"

## Output

```
✅ Gotcha Added
ID: G20260313001
Title: {title}
Category: {category} | Severity: {severity}
Use *gotchas to list all gotchas
```

---

_Task Version: 3.0 | Last Updated: 2026-03-13_
