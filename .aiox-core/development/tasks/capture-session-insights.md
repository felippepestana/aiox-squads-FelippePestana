# ═══════════════════════════════════════════════════════════════════════════════
# TASK: Capture Session Insights
# ID: capture-session-insights
# Version: 3.0.0
# Purpose: Capture learnings, patterns, and gotchas from a development session
#          into persistent storage for future reference.
# Agent: @dev (Dex)
# Phase in Pipeline: memory-capture
# ═══════════════════════════════════════════════════════════════════════════════

## Overview

At the end of a development session or after a significant discovery, this task
performs structured reflection on what was learned and persists it to:

1. `.aiox/gotchas.json` — Specific technical gotchas (bugs, quirks, workarounds)
2. `.claude/agent-memory/{agent-id}/MEMORY.md` — Agent-specific learnings
3. `.aiox-core/data/learned-patterns.yaml` — Reusable patterns discovered

This ensures knowledge is not lost between sessions and builds a growing
knowledge base that agents can reference at activation time.

---

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| session_scope | string | NO | What the session was about (e.g., "story 3.2 implementation") |
| focus | enum | NO | What to capture: gotchas, patterns, all (default: all) |

---

## Preconditions

- [ ] Some development work has been done in this session
- [ ] Git history available (to review what changed)

---

## PHASE 0: Session Review

**Checkpoint:** Session activity reconstructed.

### Action Items

- [ ] 0.1 — Run `git log --oneline -20` to see recent session activity
- [ ] 0.2 — Run `git diff --stat HEAD~5..HEAD` to see files changed (adjust range as needed)
- [ ] 0.3 — Review any story files worked on during session
- [ ] 0.4 — Check for any error patterns encountered (from Debug Logs in stories)
- [ ] 0.5 — Identify key decisions made during session

### Phase 0 Checkpoint

- [ ] Session timeline reconstructed
- [ ] Files changed identified
- [ ] Key events noted

---

## PHASE 1: Extract Gotchas

**Checkpoint:** Technical gotchas identified and formatted.

### Action Items

- [ ] 1.1 — Identify technical surprises or non-obvious behaviors encountered:
  - Library quirks that caused debugging time
  - Configuration issues that were not obvious
  - API behaviors different from documentation
  - Environment-specific issues
  - Performance surprises
  - Type system edge cases

- [ ] 1.2 — For EACH gotcha, format as:
  ```json
  {
    "id": "gotcha-{timestamp}",
    "title": "Brief description of the gotcha",
    "description": "Detailed explanation of what happens and why",
    "category": "Frontend|Backend|Database|API|DevOps|Architecture|Testing|Configuration",
    "severity": "HIGH|MEDIUM|LOW",
    "agent_type": "Dev|QA|Architect|All",
    "trigger": "What situation triggers this gotcha",
    "resolution": "How to fix or work around it",
    "prevention": "How to avoid it in the future",
    "related_files": ["file1.ts", "file2.ts"],
    "tags": ["react", "typescript", "specific-library"],
    "discovered_date": "YYYY-MM-DD",
    "discovered_in": "story-X.Y or session context"
  }
  ```

- [ ] 1.3 — Read existing `.aiox/gotchas.json` (create if not exists)
- [ ] 1.4 — Append new gotchas (avoid duplicates — check titles)
- [ ] 1.5 — Write updated gotchas.json

### Phase 1 Checkpoint

- [ ] Gotchas identified (or documented as "none found")
- [ ] Gotchas formatted correctly
- [ ] gotchas.json updated

---

## PHASE 2: Extract Patterns

**Checkpoint:** Reusable patterns identified.

### Action Items

- [ ] 2.1 — Identify reusable patterns discovered during session:
  - Code patterns that worked well
  - Architectural decisions that proved effective
  - Testing strategies that caught issues
  - Workflow improvements
  - Tool usage patterns

- [ ] 2.2 — For EACH pattern:
  ```yaml
  pattern:
    name: "Pattern Name"
    description: "What this pattern does"
    context: "When to use this pattern"
    example: "Brief code or workflow example"
    anti_pattern: "What NOT to do (the wrong approach)"
    discovered_date: "YYYY-MM-DD"
    category: "code|architecture|testing|workflow|tooling"
  ```

- [ ] 2.3 — Read `.aiox-core/data/learned-patterns.yaml`
- [ ] 2.4 — Append new patterns (avoid duplicates)
- [ ] 2.5 — Write updated learned-patterns.yaml

### Phase 2 Checkpoint

- [ ] Patterns identified (or documented as "none found")
- [ ] Patterns formatted correctly
- [ ] learned-patterns.yaml updated

---

## PHASE 3: Update Agent Memory

**Checkpoint:** Agent memory updated with session insights.

### Action Items

- [ ] 3.1 — Read agent memory file: `.claude/agent-memory/dev/MEMORY.md`
  (create directory and file if not exists)
- [ ] 3.2 — Add session entry:
  ```markdown
  ## Session: {date} — {session_scope}

  ### Key Learnings
  - {learning 1}
  - {learning 2}

  ### Decisions Made
  - {decision 1}: {rationale}

  ### Gotchas Added
  - {gotcha title} (severity: {level})

  ### Patterns Discovered
  - {pattern name}

  ### Notes for Next Session
  - {what to remember}
  ```
- [ ] 3.3 — Keep memory file manageable (max 50 entries, oldest removed)
- [ ] 3.4 — Write updated MEMORY.md

### Phase 3 Checkpoint

- [ ] Agent memory updated
- [ ] Session entry complete

---

## PHASE 4: Summary

**Checkpoint:** Session insights captured and persisted.

### Action Items

- [ ] 4.1 — Display capture summary:
  ```
  Session Insights Captured:
  - Gotchas: N new entries added to .aiox/gotchas.json
  - Patterns: N new entries added to learned-patterns.yaml
  - Memory: Session entry added to agent memory

  Total gotchas in knowledge base: N
  Total patterns in knowledge base: N
  ```

### Phase 4 Checkpoint

- [ ] Summary displayed

---

## Acceptance Criteria

1. Session activity reviewed (git log, files changed)
2. Gotchas identified and written to `.aiox/gotchas.json` (or "none" documented)
3. Patterns identified and written to `learned-patterns.yaml` (or "none" documented)
4. Agent memory updated with session entry
5. No duplicate entries created

---

## Output Specification

| Field | Value |
|-------|-------|
| Primary Output | Updated .aiox/gotchas.json |
| Secondary Output | Updated learned-patterns.yaml, agent memory |

---

## Dependencies

| Resource | Type | Path |
|----------|------|------|
| Gotchas | data | `.aiox/gotchas.json` |
| Learned Patterns | data | `.aiox-core/data/learned-patterns.yaml` |
| Agent Memory | data | `.claude/agent-memory/dev/MEMORY.md` |

---

## Error Handling

| Error | Action |
|-------|--------|
| gotchas.json doesn't exist | Create with empty array `[]` |
| learned-patterns.yaml doesn't exist | Create with empty patterns list |
| Agent memory dir doesn't exist | Create directory and file |
| No insights to capture | Document "clean session" and complete |

---

_Task Version: 3.0.0_
_Last Updated: 2026-03-13_
