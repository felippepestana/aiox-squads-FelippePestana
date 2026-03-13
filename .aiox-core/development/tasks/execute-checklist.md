# Task: Execute Checklist

**Task ID:** execute-checklist
**Purpose:** Generic task to execute any checklist file with PASS/PARTIAL/FAIL verdict
**Agent:** @dev, @qa, or any agent
**Usage:** `*execute-checklist {checklist_name}`

---

## Overview

Generic checklist execution engine. Reads any checklist file and executes each item, returning a structured verdict. Used as the underlying engine for DoD gates, QA gates, and self-critique.

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `checklist_name` | string | YES | Checklist file name (e.g., "story-dod-checklist") |
| `checklist_path` | path | NO | Override path (default: `.aiox-core/development/checklists/`) |
| `mode` | enum | NO | `yolo` (autonomous evaluation) or `interactive` (confirm each item) |
| `context` | object | NO | Additional context (story_id, file_path, etc.) |

## Steps

- [ ] 1 — Resolve checklist file path
  - Try `.aiox-core/development/checklists/{name}.md`
  - Try `.aiox-core/product/checklists/{name}.md`
  - Try exact path if `checklist_path` provided
  - BLOCK if not found

- [ ] 2 — Parse checklist sections and items
  - Extract all `- [ ]` checkboxes
  - Group by section headers (##, ###)
  - Count total items per section

- [ ] 3 — Execute each item

  **YOLO mode:** Agent evaluates autonomously
  - For each item: read → assess → mark ✅ or ❌ or ⚠️
  - Log evidence for each decision

  **Interactive mode:** User confirms each section
  - Display section items
  - Ask: "Section passes? (y/n/partial)"
  - Record responses

- [ ] 4 — Calculate scores
  - Per section: `(passed / total) * 100`
  - Overall: `(passed / total) * 100`
  - Weight sections if checklist specifies weights

- [ ] 5 — Generate verdict

  | Score | Verdict | Emoji |
  |-------|---------|-------|
  | 100% | PASS | ✅ |
  | 80-99% | PARTIAL | ⚠️ |
  | < 80% | FAIL | ❌ |
  | Any blocking items fail | FAIL regardless of score | ⛔ |

- [ ] 6 — Output report

## Output Format

```
📋 Checklist: {name}
Mode: {yolo|interactive}

Section: {Section Name} ({N}/{total}) ✅
  ✅ Item 1: PASS — {evidence}
  ✅ Item 2: PASS — {evidence}
  ❌ Item 3: FAIL — {reason}

OVERALL SCORE: {N}/{total} ({%})
VERDICT: PASS | PARTIAL | FAIL

Failing items:
  - {section}: {item}: {reason}
```

## Integration with Other Tasks

This task is the execution engine for:
- `story-dod-checklist.md` → used in `dev-develop-story.md`
- `qa-gate-checklist.md` → used in `qa-gate.md`
- `self-critique-checklist.md` → used in `plan-execute-subtask.md`
- `story-validation-checklist.md` → used in `validate-next-story.md`
- Any squad-specific checklist

---

_Task Version: 3.0 | Last Updated: 2026-03-13_
