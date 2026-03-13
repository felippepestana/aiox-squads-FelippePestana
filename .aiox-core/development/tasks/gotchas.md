# Task: List/Search Gotchas

**Task ID:** gotchas
**Purpose:** List and search gotchas from `.aiox/gotchas.json`
**Agent:** @dev (Dex)
**Usage:** `*gotchas [--category {X}] [--severity {Y}] [--search {term}]`

---

## Steps

- [ ] 1 — Read `.aiox/gotchas.json` (return "No gotchas yet" if missing or empty)
- [ ] 2 — Apply filters if provided:
  - `--category {X}` → filter by category
  - `--severity HIGH` → filter by severity
  - `--search {term}` → search in title and description
  - `--agent {name}` → filter by recording agent
- [ ] 3 — Sort by: severity DESC, then discovered_at DESC
- [ ] 4 — Display formatted list

## Output Format

```
📚 Gotchas Registry ({N} total, {M} filtered)

🔴 HIGH — Frontend (G20260313001)
  Title: {title}
  Issue: {description}
  Context: {file_context if present}
  Discovered: {date}

🟡 MEDIUM — Database (G20260312003)
  Title: {title}
  Issue: {description}
  ...
```

## Auto-Loading by Context

When agents start, they load relevant gotchas by category:
- `@dev` → Frontend, Backend, API, Database
- `@qa` → Testing, Security, Quality
- `@devops` → DevOps, CI/CD, Git
- `@data-engineer` → Database, Security

---

_Task Version: 3.0 | Last Updated: 2026-03-13_
