# ═══════════════════════════════════════════════════════════════════════════════
# TASK: Execute Checklist
# ID: execute-checklist
# Version: 3.0.0
# Purpose: Generic checklist execution engine. Takes any checklist file and
#          runs each item, producing a PASS/PARTIAL/FAIL verdict.
# Agent: Any agent (composable utility task)
# Phase in Pipeline: general
# ═══════════════════════════════════════════════════════════════════════════════

## Overview

This is a generic, reusable task that executes any AIOX checklist file. It
reads the checklist, processes each item by gathering evidence from the
codebase, story files, or test results, and produces a structured verdict.

Used by other tasks (e.g., dev-develop-story uses this to run story-dod-checklist
and self-critique-checklist), or invoked directly via `*execute-checklist`.

### Available Checklists

| Checklist | Used By | Purpose |
|-----------|---------|---------|
| `story-dod-checklist.md` | @dev | Definition of Done for stories |
| `self-critique-checklist.md` | @dev | Self-review at implementation checkpoints |
| `pre-push-checklist.md` | @devops | Quality gate before git push |
| `release-checklist.md` | @devops | Release readiness verification |
| `po-master-checklist.md` | @po | PO validation checklist |
| `change-checklist.md` | @po | Change impact assessment |

---

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| checklist_name | string | YES | Name or path of checklist to execute |
| mode | enum | NO | Execution mode: yolo (default), interactive |
| context_files | array | NO | Additional files to load as context for evaluation |
| story_file | path | NO | Story file to evaluate against (for story-related checklists) |

---

## Preconditions

- [ ] Checklist file can be resolved (by name or path)
- [ ] Context for evaluation exists (code, story, tests — depends on checklist)

---

## PHASE 0: Resolve Checklist

**Checkpoint:** Checklist file found and loaded.

### Action Items

- [ ] 0.1 — Resolve checklist path:
  1. Try: `.aiox-core/development/checklists/{checklist_name}.md`
  2. Try: `.aiox-core/development/checklists/{checklist_name}`
  3. Try: `.aiox-core/product/checklists/{checklist_name}.md`
  4. Try: `.aiox-core/product/checklists/{checklist_name}`
  5. Try: exact path as provided
  6. Fuzzy match: "dod" -> "story-dod-checklist.md", "critique" -> "self-critique-checklist.md"
- [ ] 0.2 — Read the resolved checklist file completely
- [ ] 0.3 — Parse checklist into sections and items:
  ```yaml
  checklist:
    name: "{checklist name}"
    sections:
      - name: "Section Name"
        items:
          - id: "1.1"
            text: "Checklist item text"
            critical: true|false  # items marked CRITICAL or BLOCKING
  ```
- [ ] 0.4 — Count total items and critical items
- [ ] 0.5 — Load context files if provided

### Phase 0 Checkpoint

- [ ] Checklist file found and parsed
- [ ] Sections and items enumerated
- [ ] Context loaded

---

## PHASE 1: Gather Evidence

**Checkpoint:** Evidence collected for evaluation.

### Action Items

- [ ] 1.1 — Based on checklist type, gather relevant evidence:

  **For story-related checklists:**
  - Read story file
  - Read files in story's File List
  - Check git diff for story changes
  - Check test results

  **For code-quality checklists:**
  - Run lint and capture output
  - Run typecheck and capture output
  - Run tests and capture output
  - Read source files

  **For process checklists:**
  - Read relevant documentation
  - Check git log for process compliance
  - Review story/PR metadata

- [ ] 1.2 — Create evidence map: `{item_id} -> [relevant evidence]`

### Phase 1 Checkpoint

- [ ] Evidence gathered for all checklist items
- [ ] Evidence map created

---

## PHASE 2: Evaluate Items

**Checkpoint:** Every item evaluated with verdict.

### Action Items

- [ ] 2.1 — For EACH checklist item:
  - Review the requirement
  - Match against gathered evidence
  - Consider both explicit and implicit coverage
  - Assign verdict:

    | Verdict | Symbol | Meaning |
    |---------|--------|---------|
    | PASS | [PASS] | Requirement clearly met with evidence |
    | FAIL | [FAIL] | Requirement not met or insufficient evidence |
    | PARTIAL | [PARTIAL] | Some aspects covered, gaps remain |
    | N/A | [N/A] | Not applicable (with justification) |

  - Provide brief justification for each verdict

- [ ] 2.2 — If mode is "interactive": pause after each section for user review
- [ ] 2.3 — Track critical items separately (FAIL on critical = overall FAIL)

### Phase 2 Checkpoint

- [ ] Every item has a verdict
- [ ] Justifications provided
- [ ] Critical items tracked

---

## PHASE 3: Generate Report

**Checkpoint:** Checklist report complete.

### Action Items

- [ ] 3.1 — Calculate section scores:
  ```
  section_pass_rate = PASS_count / (total - N/A_count) * 100
  ```

- [ ] 3.2 — Calculate overall score:
  ```
  overall_pass_rate = total_PASS / (total - total_N/A) * 100
  ```

- [ ] 3.3 — Determine overall verdict:
  ```yaml
  verdicts:
    APPROVED:
      condition: "pass_rate >= 90% AND 0 FAIL on critical items"
    NEEDS_WORK:
      condition: "pass_rate 70-89% OR any FAIL on non-critical"
    FAIL:
      condition: "pass_rate < 70% OR any FAIL on critical items"
  ```

- [ ] 3.4 — Generate report:
  ```markdown
  ## Checklist Report: {checklist_name}

  **Date:** {YYYY-MM-DD}
  **Agent:** {current agent}
  **Mode:** {yolo|interactive}

  ### Summary

  | Section | Items | Pass | Fail | Partial | N/A | Rate |
  |---------|-------|------|------|---------|-----|------|
  | {name}  |   N   |  N   |  N   |    N    |  N  | NN%  |

  **Overall:** {pass_rate}% ({total_pass}/{total_applicable})

  ### Failed Items

  1. **{item}** — {reason} -> {recommendation}

  ### Partial Items

  1. **{item}** — {what's covered} / {what's missing}

  ### Decision

  **{APPROVED | NEEDS_WORK | FAIL}**
  ```

- [ ] 3.5 — Display report

### Phase 3 Checkpoint

- [ ] Report generated
- [ ] Verdict determined
- [ ] Report displayed

---

## Acceptance Criteria

1. Checklist file resolved and loaded
2. Every item evaluated with verdict and justification
3. Section pass rates calculated
4. Overall verdict determined (APPROVED/NEEDS_WORK/FAIL)
5. Report generated in standard format
6. Critical item failures correctly block APPROVED verdict

---

## Output Specification

| Field | Value |
|-------|-------|
| Primary Output | Checklist execution report (markdown) |
| Secondary Output | Overall verdict (APPROVED/NEEDS_WORK/FAIL) |

---

## Dependencies

| Resource | Type | Path |
|----------|------|------|
| Target checklist | checklist | `.aiox-core/development/checklists/` or `.aiox-core/product/checklists/` |
| Story file | input | Provided via `story_file` parameter |
| Source files | input | From story File List or context_files |

---

## Error Handling

| Error | Action |
|-------|--------|
| Checklist not found | List available checklists, ask user to select |
| Multiple fuzzy matches | Present numbered list, ask user to choose |
| No evidence for item | Mark as FAIL with "insufficient evidence" |
| Checklist has no items | HALT — "Checklist appears empty" |

---

_Task Version: 3.0.0_
_Last Updated: 2026-03-13_
