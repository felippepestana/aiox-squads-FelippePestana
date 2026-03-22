# ═══════════════════════════════════════════════════════════════════════════════
# TASK: Spec — Create Implementation Plan
# ID: spec-create-implementation-plan
# Version: 1.0.0
# Purpose: Phase 6 of the Spec Pipeline. Transform an approved spec into a
#          structured implementation plan with epic and story definitions.
# Agent: @architect (Aria)
# Phase in Pipeline: Spec Pipeline — Phase 6 (Plan)
# ═══════════════════════════════════════════════════════════════════════════════

## Overview

The final phase of the Spec Pipeline. Takes an APPROVED `spec.md` and converts
it into `implementation.yaml` — a structured breakdown of epics, stories, and
dependencies ready for @sm to create individual story files.

This task ONLY runs after `spec-critique.md` returns an APPROVED verdict.

---

## Inputs

| Parameter | Type   | Required | Description                                          |
|-----------|--------|----------|------------------------------------------------------|
| run_id    | string | YES      | Spec run ID with approved spec                       |
| spec_path | path   | NO       | Override path to spec.md. Default: from run_id       |

---

## Preconditions

- [ ] `spec.md` exists at `.aiox/spec-runs/{run_id}/spec.md`
- [ ] `spec.md` status is "APPROVED" (not DRAFT or NEEDS_REVISION)
- [ ] `requirements.json` exists for traceability
- [ ] `complexity.json` exists for sizing guidance

---

## PHASE 0: Load Approved Spec

**Checkpoint:** All pipeline outputs loaded.

### Action Items

- [ ] 0.1 — Read `spec.md` from `.aiox/spec-runs/{run_id}/spec.md`
- [ ] 0.2 — Verify status field is "APPROVED". If not, BLOCK.
- [ ] 0.3 — Read `requirements.json` for the full FR list
- [ ] 0.4 — Read `complexity.json` for classification and risk areas
- [ ] 0.5 — Read existing epics in project (check `.aiox/epics/` or referenced in PRD)

### Phase 0 Checkpoint

- [ ] Spec is APPROVED
- [ ] All pipeline outputs loaded
- [ ] Existing epic structure understood

---

## PHASE 1: Define Epic Structure

**Checkpoint:** Feature is organized into 1-3 cohesive epics.

### Action Items

- [ ] 1.1 — Group related FRs into logical delivery phases:
  - Phase 1: Core foundation (data models, auth, basic CRUD)
  - Phase 2: Primary user flows (main feature functionality)
  - Phase 3: Polish and secondary features (optional, COULD FRs)
- [ ] 1.2 — For SIMPLE features: 1 epic is sufficient
- [ ] 1.3 — For STANDARD features: 1-2 epics
- [ ] 1.4 — For COMPLEX features: 2-3 epics with clear dependency ordering
- [ ] 1.5 — Each epic must be independently deployable (no cross-epic hard deps where avoidable)
- [ ] 1.6 — Define epic goal: what can users DO after this epic is complete?

### Phase 1 Checkpoint

- [ ] All MUST FRs are assigned to an epic
- [ ] Epic count appropriate for complexity
- [ ] Each epic has a clear user-facing goal

---

## PHASE 2: Decompose into Stories

**Checkpoint:** All stories defined, sized, and sequenced.

### Action Items

- [ ] 2.1 — For each epic, break into stories following these sizing rules:
  - 1 story = 1-3 days of work for 1 developer
  - Each story delivers visible, testable behavior
  - Stories within an epic are sequenced (earlier stories enable later ones)
- [ ] 2.2 — Apply MVP-First sequencing within each epic:
  - Story 1: Data model / schema setup
  - Story 2: API/backend implementation
  - Story 3: UI/frontend implementation
  - Story N: Edge cases, error handling, polish
- [ ] 2.3 — For each story, define:
  - `title`: concise action-oriented title
  - `user_story_hint`: short "As a... I want..." draft (full story created by @sm)
  - `fr_coverage`: which FR-* items this story covers
  - `estimated_days`: 1, 2, or 3
  - `dependencies`: story IDs that must complete before this one
- [ ] 2.4 — Assign story IDs: `{epic_id}.{story_num}` (e.g., E001.1, E001.2)

### Phase 2 Checkpoint

- [ ] Every MUST FR is covered by at least 1 story
- [ ] No story covers more than 3-4 FRs (if more, split it)
- [ ] Stories are sequenced with explicit dependencies
- [ ] Each story is independently testable

---

## PHASE 3: Define NFR Coverage Plan

**Checkpoint:** NFRs are explicitly assigned to stories.

### Action Items

- [ ] 3.1 — For each NFR, assign to the story that implements the relevant behavior
  - Performance: assign to the story implementing the slow path
  - Security: assign to auth/validation stories
  - Reliability: assign to error handling stories
- [ ] 3.2 — Add NFR references to the appropriate story's `nfr_coverage` field
- [ ] 3.3 — NFRs with no clear story home → add acceptance criteria to the final story in the epic

### Phase 3 Checkpoint

- [ ] All NFRs assigned to at least 1 story

---

## PHASE 4: Write implementation.yaml

**Checkpoint:** Output file written and ready for @sm to consume.

### Action Items

- [ ] 4.1 — Write the following YAML structure:
  ```yaml
  run_id: "{run_id}"
  feature_name: "{feature_name}"
  created_at: "{ISO-8601 datetime}"
  complexity: "SIMPLE|STANDARD|COMPLEX"
  status: "APPROVED"

  epics:
    - epic_id: "E001"
      title: "{epic title}"
      goal: "{what users can do after this epic}"
      fr_coverage: ["FR-001", "FR-002"]
      estimated_days: 0
      stories:
        - story_id: "E001.1"
          title: "{story title}"
          user_story_hint: "As a {role}, I want {action} so that {benefit}."
          fr_coverage: ["FR-001"]
          nfr_coverage: ["NFR-001"]
          estimated_days: 1
          dependencies: []
          notes: "{any implementation notes for @sm}"

  critical_path:
    - "E001.1"
    - "E001.2"

  totals:
    epics: 0
    stories: 0
    estimated_days: 0
    fr_coverage_percent: 100
  ```
- [ ] 4.2 — Populate `critical_path`: the sequence of stories that cannot be parallelized
- [ ] 4.3 — Calculate and populate `totals` section
- [ ] 4.4 — Verify `fr_coverage_percent`: all MUST FRs must be covered (100%)
- [ ] 4.5 — Write output to: `.aiox/spec-runs/{run_id}/implementation.yaml`
- [ ] 4.6 — Output summary: epic count, story count, total estimated days, critical path length

### Phase 4 Checkpoint

- [ ] File exists at `.aiox/spec-runs/{run_id}/implementation.yaml`
- [ ] File is valid YAML
- [ ] All MUST FRs covered (fr_coverage_percent = 100)
- [ ] Critical path defined
- [ ] All story IDs are unique

---

## Acceptance Criteria

1. Output file exists at `.aiox/spec-runs/{run_id}/implementation.yaml`
2. File is parseable YAML
3. At least 1 epic and 1 story defined
4. All MUST FRs are covered by at least 1 story
5. All stories have: title, user_story_hint, fr_coverage, estimated_days, dependencies
6. Story IDs follow `{epic_id}.{story_num}` format
7. Critical path is defined and non-empty
8. fr_coverage_percent = 100 for MUST requirements

---

## Next Step

After this task completes, implementation is ready for:
1. **@sm** reads `implementation.yaml` and runs `create-next-story.md` for each story entry
2. Stories are created in sequence following the critical path
3. @po validates each story before development starts
