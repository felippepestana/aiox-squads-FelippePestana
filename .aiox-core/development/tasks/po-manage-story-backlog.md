# ═══════════════════════════════════════════════════════════════════════════════
# TASK: Manage Story Backlog
# ID: po-manage-story-backlog
# Version: 1.0.0
# Purpose: Full backlog lifecycle management — list, add, reprioritize, tag,
#          archive, and report on story health across all epics.
# Agent: @po (Pax)
# ═══════════════════════════════════════════════════════════════════════════════

## Overview

The single command center for backlog management. Scans `.aiox/stories/` and
produces a live view of backlog health, supports adding entries, reprioritizing,
tagging tech debt, and archiving completed stories.

Can operate in multiple modes depending on the caller's intent:
- `list` (default) — full status view
- `add` — create a placeholder story entry
- `reprioritize` — reorder priorities
- `tag` — add/remove tags (tech-debt, spike, blocked, etc.)
- `archive` — move Done stories to archive
- `health` — metrics and alerts only

---

## Inputs

| Parameter | Type   | Required | Description                                                   |
|-----------|--------|----------|---------------------------------------------------------------|
| mode      | enum   | NO       | One of: list, add, reprioritize, tag, archive, health. Default: list |
| epic_id   | string | NO       | Filter to specific epic. Default: all epics.                  |
| story_id  | string | NO       | Target story for tag/reprioritize/archive modes               |
| tag       | string | NO       | Tag to add/remove (for tag mode)                              |

---

## Preconditions

- [ ] `.aiox/stories/` directory exists (or is created in this task)

---

## PHASE 0: Scan Stories

**Checkpoint:** All story files read, indexed by status.

### Action Items

- [ ] 0.1 — Scan `.aiox/stories/` for all `*.story.md` files
- [ ] 0.2 — For each story, extract: `story_id`, `title`, `status`, `epic`, `dependencies`
- [ ] 0.3 — Group stories by status: Draft | Ready | InProgress | InReview | Done | Blocked
- [ ] 0.4 — Apply epic_id filter if provided
- [ ] 0.5 — Count stories per status

### Phase 0 Checkpoint

- [ ] All story files scanned
- [ ] Stories indexed by status
- [ ] Epic filter applied if requested

---

## PHASE 1: Execute Mode

### MODE: list (default)

- [ ] 1.1 — Output backlog table sorted by epic, then story number:
  ```
  | Story ID | Title | Status | Epic | Dependencies | Tags |
  |----------|-------|--------|------|--------------|------|
  ```
- [ ] 1.2 — Group by status with section headers
- [ ] 1.3 — Highlight: Blocked stories (why?), stories InProgress > 5 days, Ready stories waiting > 3 days

### MODE: add

- [ ] 1.1 — Prompt for (or accept from caller): epic_id, story title, brief description
- [ ] 1.2 — Determine next story number for the epic
- [ ] 1.3 — Create a placeholder story file with status "Draft" and minimal content
- [ ] 1.4 — Note: this creates an entry only — full story must be created via `create-next-story.md`
- [ ] 1.5 — Output new story path

### MODE: reprioritize

- [ ] 1.1 — Show current "Ready" stories in priority order
- [ ] 1.2 — Accept new order from caller (or decide autonomously based on dependencies/value)
- [ ] 1.3 — Add `priority: {N}` field to each affected story file
- [ ] 1.4 — Output updated priority list

### MODE: tag

- [ ] 1.1 — Read target story at `story_id`
- [ ] 1.2 — Add or remove `tag` from the story's tags section
- [ ] 1.3 — Valid tags: `tech-debt`, `spike`, `blocked`, `urgent`, `fast-track`, `deferred`
- [ ] 1.4 — Update story file with new tag
- [ ] 1.5 — Output confirmation

### MODE: archive

- [ ] 1.1 — Identify all stories with status "Done"
- [ ] 1.2 — If `story_id` provided, archive only that story; otherwise, archive all Done stories
- [ ] 1.3 — Create `.aiox/stories/archive/` directory if not exists
- [ ] 1.4 — Move archived stories to `.aiox/stories/archive/`
- [ ] 1.5 — Output list of archived stories

### MODE: health

- [ ] 1.1 — Calculate and output metrics:
  - Total stories by status (count + percentage)
  - Average age of InProgress stories
  - Stories blocked (count + blockers)
  - Ready queue depth (how many stories waiting to start)
  - Done rate: stories completed this sprint/period
- [ ] 1.2 — Alert on:
  - More than 3 stories InProgress simultaneously
  - Any story blocked for more than 3 days
  - Empty Ready queue (sprint will stall)
  - More than 5 stories in Draft (backlog grooming needed)

---

## PHASE 2: Output Report

**Checkpoint:** Report is actionable and complete.

### Action Items

- [ ] 2.1 — Format output as clean markdown
- [ ] 2.2 — For `list` and `health` modes: include a "Next Actions" section with 1-3 recommendations
- [ ] 2.3 — For `add`, `tag`, `archive`, `reprioritize` modes: confirm the change made

---

## Acceptance Criteria

1. All `.aiox/stories/*.story.md` files are scanned
2. Stories are correctly grouped by status
3. Output table has: story_id, title, status, epic columns
4. Health mode outputs numeric metrics
5. Archive mode moves files (does not copy)
6. Tag mode updates the story file
7. Report includes at least 1 actionable recommendation (list/health modes)

---

## Output Specification

| Field    | Value                          |
|----------|-------------------------------|
| Format   | Markdown to console            |
| Side effects | Story file updates for tag/reprioritize/archive modes |

---

## Error Handling

| Error                        | Action                                            |
|------------------------------|---------------------------------------------------|
| `.aiox/stories/` empty       | Output "Backlog is empty. Run @sm create-story to start." |
| story_id not found (tag mode)| BLOCK — list available story IDs                  |
| Invalid tag                  | List valid tags and ask for correction             |
| Archive dir creation fails   | BLOCK — output error with path                    |
