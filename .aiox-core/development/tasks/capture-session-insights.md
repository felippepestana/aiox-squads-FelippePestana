# Task: Capture Session Insights

**Task ID:** capture-session-insights
**Purpose:** Capture learnings from a session into persistent memory
**Agent:** @dev, @qa, @architect, any agent
**Usage:** `*capture-insights` at end of session

---

## Overview

Structured reflection on what was learned during a session. Captures patterns, gotchas, architectural decisions, and process improvements into persistent AIOX memory.

## Steps

- [ ] 1 — Review session: read git log of last 10 commits and any `[AUTO-DECISION]` logs
- [ ] 2 — Identify insights by category:

  **Technical Insights:**
  - New patterns discovered
  - Libraries or APIs that worked well / poorly
  - Performance considerations
  - Security findings

  **Gotchas:**
  - Surprises, non-obvious behaviors
  - Footguns encountered
  - Configuration issues

  **Process Insights:**
  - Workflow improvements
  - Agent collaboration patterns
  - Testing approaches that worked

- [ ] 3 — For each gotcha found: add to `.aiox/gotchas.json` via `gotcha.md` protocol

- [ ] 4 — Update `.aiox/learned-patterns.json`:
```json
{
  "pattern_id": "P{timestamp}",
  "category": "{Frontend|Backend|Database|Testing|Architecture|Process}",
  "pattern": "{what was learned}",
  "context": "{when to apply this}",
  "example": "{code snippet or description}",
  "discovered_at": "{iso_date}",
  "agent": "{agent_id}",
  "story_context": "{story_id}"
}
```

- [ ] 5 — Update agent MEMORY file at `.claude/agent-memory/{agent_id}/MEMORY.md`:
  - Add new insights to memory
  - Update "Last Session Summary"
  - Note any recurring patterns

- [ ] 6 — Summary report:
```
📚 Session Insights Captured
  Gotchas added: {N}
  Patterns captured: {N}
  Memory updated: {agent_id}
```

---

_Task Version: 3.0 | Last Updated: 2026-03-13_
