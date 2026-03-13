# ═══════════════════════════════════════════════════════════════════════════════
# TASK: Validate Next Story
# ID: validate-next-story
# Version: 1.0.0
# Purpose: Validate a story draft using the 10-point PO checklist.
#          Promote to Ready (GO) or return to @sm with specific fixes (NO-GO).
# Agent: @po (Pax)
# Phase in Pipeline: Story Development Cycle — Phase 2 (Validate)
# ═══════════════════════════════════════════════════════════════════════════════

## Overview

Receives a story draft from `.aiox/stories/` and runs the 10-point PO validation
checklist. Issues a GO (score ≥ 7/10) or NO-GO verdict with specific fix
instructions for @sm.

This is the QUALITY GATE between story creation and implementation. No story
moves to InProgress without passing this gate.

---

## Inputs

| Parameter  | Type   | Required | Description                                          |
|------------|--------|----------|------------------------------------------------------|
| story_id   | string | YES      | Story ID to validate (e.g., "E001.1", "1.2")         |
| story_path | path   | NO       | Override path. Default: `.aiox/stories/{story_id}.story.md` |

---

## Preconditions

Before starting this task, the following MUST be true:

- [ ] Story file exists at `.aiox/stories/{story_id}.story.md` (or at `story_path`)
- [ ] Story status is "Draft" (not already validated)
- [ ] Epic file for this story is accessible

---

## PHASE 0: Load Story Context

**Checkpoint:** Story and epic context fully loaded.

### Action Items

- [ ] 0.1 — Resolve story path: `.aiox/stories/{story_id}.story.md` (or use `story_path`)
- [ ] 0.2 — Read the story file in full
- [ ] 0.3 — Extract `epic` field from story, locate and read the corresponding epic file
- [ ] 0.4 — Read `.aiox/accumulated-context.md` if it exists
- [ ] 0.5 — Scan `.aiox/stories/` for sibling stories (same epic) to check for overlap

### Phase 0 Checkpoint

- [ ] Story file loaded
- [ ] Epic file loaded
- [ ] Context checked for coherence

---

## PHASE 1: Run 10-Point Validation Checklist

**Checkpoint:** All 10 points scored.

For each point, assign:
- **PASS (1 point)** — criterion clearly met
- **PARTIAL (0.5 points)** — partially met, minor fix needed
- **FAIL (0 points)** — not met or unacceptable

### Checklist Points

**Structure & Completeness**

- [ ] **P1 — User Story Format**: Story sentence follows "As a {role}, I want {action} so that {benefit}" format. Role is specific. Action is concrete. Benefit is measurable.
  - FAIL triggers: missing any of the three parts, generic "user" without qualifier, vague verb like "manage"

- [ ] **P2 — Acceptance Criteria Quantity**: Story has between 3 and 8 ACs.
  - FAIL triggers: fewer than 3 ACs (story too thin), more than 8 ACs (story too large, must split)

- [ ] **P3 — ACs are Testable**: Every AC is binary (PASS/FAIL), observable, and free from subjective language.
  - FAIL triggers: any AC with "smooth", "fast", "intuitive", "good", "proper", "appropriate", "nice"
  - PARTIAL triggers: 1-2 ACs with minor subjective terms

**Scope & Value**

- [ ] **P4 — Single Cohesive Scope**: Story has one clear focus. It is not two stories merged into one.
  - FAIL triggers: multiple unrelated features, "and also" constructs in user story sentence
  - PARTIAL triggers: slightly broad scope but technically still one unit

- [ ] **P5 — Business Value Clear**: The "so that" clause delivers real, observable business/user value.
  - FAIL triggers: "so that it works", "so that the system does X" (not user benefit)
  - PARTIAL triggers: benefit is real but weakly stated

- [ ] **P6 — Epic Traceability**: Story scope traces back to the epic. ACs from the epic are preserved verbatim.
  - FAIL triggers: story introduces features not present in the epic
  - PARTIAL triggers: epic ACs present but slightly paraphrased

**Implementation Readiness**

- [ ] **P7 — Technical Notes Actionable**: Technical notes give @dev enough context to start without asking questions.
  - FAIL triggers: technical notes section is empty or says "TBD"
  - PARTIAL triggers: present but missing API contract or data model

- [ ] **P8 — File List Present**: At least 1 file listed in the File List table.
  - FAIL triggers: table is empty or missing

- [ ] **P9 — Dependencies Explicit**: All dependencies listed with current status.
  - FAIL triggers: dependencies section is empty (unless story has zero dependencies — must say "None")
  - PARTIAL triggers: dependencies listed without status

**Process & Quality**

- [ ] **P10 — No Constitution Violations**: Story does not invent features not in the epic (Article IV). Story is achievable without requiring blocked dependencies to be resolved first.
  - FAIL triggers: invented requirements, blocked hard dependencies with no path forward

---

## PHASE 2: Score and Decision

**Checkpoint:** Score calculated, decision rendered.

### Action Items

- [ ] 2.1 — Sum all scores: PASS=1, PARTIAL=0.5, FAIL=0. Maximum = 10.
- [ ] 2.2 — Apply decision rule:
  - **GO**: score ≥ 7.0 → promote story to "Ready"
  - **NO-GO**: score < 7.0 → return to @sm with fix list
- [ ] 2.3 — For every FAIL and PARTIAL point, write a specific fix instruction:
  - Not just "fix P3" — write exactly WHAT needs to change and HOW
- [ ] 2.4 — For GO decisions: also note any PARTIAL items as "Improvement suggestions" (non-blocking)

### Phase 2 Checkpoint

- [ ] Score calculated (0.0 to 10.0)
- [ ] Decision is GO or NO-GO
- [ ] All FAIL/PARTIAL points have specific fix instructions

---

## PHASE 3: Apply Verdict

**Checkpoint:** Story file updated with verdict.

### Action Items

**If GO:**

- [ ] 3.1 — Update story file: change `status: "Draft"` to `status: "Ready"`
- [ ] 3.2 — Add validation record to story file under a `## Validation` section:
  ```
  ## Validation
  Validator: @po (Pax)
  Date: {YYYY-MM-DD}
  Score: {score}/10
  Verdict: GO
  ```
- [ ] 3.3 — Output GO summary to user with story path and next step

**If NO-GO:**

- [ ] 3.1 — Keep story status as "Draft"
- [ ] 3.2 — Add NO-GO feedback to story file under `## Validation`:
  ```
  ## Validation
  Validator: @po (Pax)
  Date: {YYYY-MM-DD}
  Score: {score}/10
  Verdict: NO-GO
  Required Fixes:
  - [P{N}] {specific fix instruction}
  ```
- [ ] 3.3 — Output NO-GO summary to user: score, failing points, fix instructions, "@sm rework required"

---

## Acceptance Criteria

All criteria are binary (PASS/FAIL):

1. Story file was read in full before scoring
2. All 10 checklist points were scored (no skipped points)
3. Score is a number between 0.0 and 10.0
4. Decision is GO (≥7.0) or NO-GO (<7.0)
5. Every FAIL and PARTIAL point has a specific, actionable fix instruction
6. Story file is updated with validation record
7. Story status is "Ready" after GO verdict
8. Story status remains "Draft" after NO-GO verdict

---

## Output Specification

| Field         | Value                                               |
|---------------|-----------------------------------------------------|
| Format        | Story file update (Markdown)                        |
| Story Path    | `.aiox/stories/{story_id}.story.md`                 |
| Validation    | Appended under `## Validation` section in story     |
| Status Update | "Ready" (GO) or "Draft" kept (NO-GO)                |

---

## Scoring Reference

| Score  | Decision | Interpretation                          |
|--------|----------|-----------------------------------------|
| 9-10   | GO       | Excellent story, ready to implement     |
| 7-8.5  | GO       | Good story, minor improvements noted    |
| 5.5-6.5| NO-GO    | Needs work, specific fixes required     |
| 0-5    | NO-GO    | Major rework required, return to @sm    |

---

## Error Handling

| Error                            | Action                                             |
|----------------------------------|----------------------------------------------------|
| Story file does not exist        | BLOCK — return path and ask @sm to run create-next-story first |
| Story status is not "Draft"      | WARN — if "Ready", skip (already validated); if "InProgress"/"Done", BLOCK |
| Epic file not found              | PARTIAL validation only — flag P6 as unverifiable  |
| Accumulated context missing      | Continue — treat as no prior context               |

---

## Next Step

After this task completes, the story flows to:
1. **GO** → @dev runs `dev-develop-story.md` — implements the story
2. **NO-GO** → @sm reworks the story and re-submits for validation
