# ═══════════════════════════════════════════════════════════════════════════════
# TASK: Create Next Story
# ID: create-next-story
# Version: 1.0.0
# Purpose: Create the next logical story from an epic, ready for @po validation.
# Agent: @sm (River)
# Phase in Pipeline: Story Development Cycle — Phase 1 (Create)
# ═══════════════════════════════════════════════════════════════════════════════

## Overview

Receives an epic file (or PRD shard) and determines the next story that delivers
the smallest incremental value. Produces a complete story file at
`.aiox/stories/{epic_id}.{story_num}.story.md` following `story-tmpl.yaml`.

This task is the ENTRY POINT for all development work. No implementation should
start without a story file created by this task.

---

## Inputs

| Parameter   | Type   | Required | Description                                         |
|-------------|--------|----------|-----------------------------------------------------|
| epic_file   | path   | YES      | Absolute path to the epic .md or PRD shard file     |
| epic_id     | string | YES      | Epic identifier (e.g., "E001", "1")                 |
| story_num   | string | NO       | Override story number. Auto-detected if not given.  |

---

## Preconditions

Before starting this task, the following MUST be true:

- [ ] `epic_file` exists and is readable
- [ ] Epic file contains at least a title and goal/objective
- [ ] Story template exists: `.aiox-core/product/templates/story-tmpl.yaml`
- [ ] Stories directory exists or can be created: `.aiox/stories/`

---

## PHASE 0: Load Epic Context

**Checkpoint:** Epic fully understood, story sequence established.

### Action Items

- [ ] 0.1 — Read the epic file at `epic_file` path in full (MUST read, never assume)
- [ ] 0.2 — Read story template: `.aiox-core/product/templates/story-tmpl.yaml`
- [ ] 0.3 — Scan `.aiox/stories/` for existing stories from this epic (pattern: `{epic_id}.*.story.md`)
- [ ] 0.4 — Read each found story file to understand: title, status, scope already covered
- [ ] 0.5 — Read `.aiox/accumulated-context.md` if it exists (cross-story coherence)
- [ ] 0.6 — Determine next story number: count existing stories + 1 (or use `story_num` if provided)

### Phase 0 Checkpoint

- [ ] Epic objective is understood
- [ ] All existing stories from this epic have been reviewed
- [ ] Next story number is determined
- [ ] Scope gaps identified (what remains to implement from the epic)

---

## PHASE 1: Determine Next Story

**Checkpoint:** The next story increment is identified and justified.

### Action Items

- [ ] 1.1 — List ALL requirements/features from the epic that are NOT yet covered by existing stories
- [ ] 1.2 — Apply MVP-First principle: which uncovered item delivers the smallest independent value?
  - Prefer: core data models and CRUD before UI
  - Prefer: authentication before protected routes
  - Prefer: API endpoints before consuming them in UI
  - Prefer: foundational setup before feature work
- [ ] 1.3 — Select the next story scope: one cohesive unit of work that can be completed in 1-3 days
- [ ] 1.4 — Verify the selected scope is INDEPENDENT (not blocked by anything not yet done)
- [ ] 1.5 — Document selection rationale: why this story, why now

### Phase 1 Checkpoint

- [ ] Next story scope is selected
- [ ] Scope is independently deliverable (not blocked)
- [ ] Selection rationale documented
- [ ] Story delivers visible value (not just internal refactor, unless epic says so)

---

## PHASE 2: Draft Story

**Checkpoint:** User story sentence is clear, role-specific, and outcome-focused.

### Action Items

- [ ] 2.1 — Identify the PRIMARY user role for this story (who benefits?)
- [ ] 2.2 — Write the user story in the canonical format:
  `As a {role}, I want {specific action} so that {measurable benefit}.`
- [ ] 2.3 — Validate the sentence:
  - Role is specific (not "user" alone — use "authenticated user", "admin", "visitor", etc.)
  - Action is concrete (not "manage" or "handle" — use "create", "view", "delete", etc.)
  - Benefit maps to a real outcome (not "it works" — describe why the user cares)
- [ ] 2.4 — Write a 2-3 sentence description expanding the user story context

### Phase 2 Checkpoint

- [ ] User story sentence is written
- [ ] Role, action, and benefit are all specific and concrete
- [ ] Description provides context for @dev

---

## PHASE 3: Define Acceptance Criteria

**Checkpoint:** All ACs are specific, testable, and binary (PASS/FAIL only).

### Action Items

- [ ] 3.1 — Extract ALL acceptance criteria explicitly stated in the epic for this feature/scope
  - PRESERVE exact wording from the epic — do not paraphrase
- [ ] 3.2 — Add implicit ACs that are required but not stated (e.g., error states, edge cases)
- [ ] 3.3 — For each AC, verify:
  - It describes observable behavior (not internal implementation)
  - It can be tested without ambiguity (binary: passes or fails)
  - It does NOT use subjective language ("smooth", "fast", "intuitive")
- [ ] 3.4 — Format each AC as a checkbox: `- [ ] AC{N}: {criterion}`
- [ ] 3.5 — Ensure minimum 3 ACs, maximum 8 ACs per story (if more, split the story)
- [ ] 3.6 — Include a "happy path" AC, at least one "error/edge case" AC

### Phase 3 Checkpoint

- [ ] All epic ACs for this scope are included verbatim
- [ ] At least 3 ACs defined
- [ ] Zero subjective terms in any AC
- [ ] All ACs are independently testable

---

## PHASE 4: Technical Notes

**Checkpoint:** @dev has enough context to implement without asking questions.

### Action Items

- [ ] 4.1 — Identify relevant existing files (components, models, services) @dev will need to modify
- [ ] 4.2 — Identify API endpoints to create or call (route, method, request/response shape)
- [ ] 4.3 — Identify data models / schema changes needed (fields, relations, types)
- [ ] 4.4 — Note relevant tech stack constraints from `.aiox-core/data/technical-preferences.md`
- [ ] 4.5 — Note any patterns or conventions to follow (naming, structure, architecture)
- [ ] 4.6 — Flag any security considerations (auth checks, input validation, etc.)
- [ ] 4.7 — If unclear or out of SM scope: write "[Needs @architect input]" and move on

### Phase 4 Checkpoint

- [ ] API contracts defined (if applicable)
- [ ] Data model changes identified (if applicable)
- [ ] Relevant files/components noted
- [ ] Security considerations flagged

---

## PHASE 5: Dependencies

**Checkpoint:** All blockers are explicit and actionable.

### Action Items

- [ ] 5.1 — List stories that MUST be Done before this story can start (hard dependencies)
- [ ] 5.2 — List external dependencies (third-party APIs, environment setup, etc.)
- [ ] 5.3 — For each dependency, note its current status (Done / InProgress / Not Started)
- [ ] 5.4 — If any hard dependency is Not Started, mark story as BLOCKED and note why

### Phase 5 Checkpoint

- [ ] All dependencies listed with current status
- [ ] No hidden assumptions about "someone else handles this"
- [ ] Story status reflects dependency state (Ready vs Blocked)

---

## PHASE 6: Initial File List

**Checkpoint:** @dev has a starting map of files to create/modify.

### Action Items

- [ ] 6.1 — List files expected to be CREATED (new files @dev will write)
- [ ] 6.2 — List files expected to be MODIFIED (existing files @dev will change)
- [ ] 6.3 — List test files corresponding to implementation files
- [ ] 6.4 — Note: this is an ESTIMATE. @dev will update this list during implementation.
- [ ] 6.5 — Format as markdown table: `| File | Action | Status |`
  - Action: CREATE or MODIFY
  - Status: leave as empty (to be filled by @dev)

### Phase 6 Checkpoint

- [ ] At least 1 file listed
- [ ] Table format is correct
- [ ] Both src and test files included where applicable

---

## PHASE 7: Save and Handoff

**Checkpoint:** Story file exists, is valid, and @po is notified.

### Action Items

- [ ] 7.1 — Ensure `.aiox/stories/` directory exists (create if not)
- [ ] 7.2 — Compose full story file using `story-tmpl.yaml` structure:
  - Fill all fields from Phases 2-6
  - Set `status: "Draft"`
  - Set `story_id: "{epic_id}.{story_num}"`
  - Set `epic: "{epic_id}"`
- [ ] 7.3 — Write story to: `.aiox/stories/{epic_id}.{story_num}.story.md`
- [ ] 7.4 — Run self-validation (mini checklist before flagging complete):
  - Story sentence is present and complete
  - At least 3 ACs defined, all binary
  - Technical notes have content
  - File list has at least 1 entry
  - Status is "Draft"
- [ ] 7.5 — Output summary to user:
  - Story ID and title
  - Story path (absolute)
  - AC count
  - Dependency status
  - Next step: "@po validate-story {story_id}"

### Phase 7 Checkpoint

- [ ] Story file exists at expected path
- [ ] Self-validation passed (all 5 mini checks)
- [ ] Summary output is clear and actionable

---

## Story File Structure

The story file MUST follow this structure (from `story-tmpl.yaml`):

```markdown
# Story: {title}

story_id: "{epic_id}.{story_num}"
epic: "{epic_id}"
status: "Draft"

## User Story

As a {role}, I want {action} so that {benefit}.

## Description

{2-3 sentences of context}

## Acceptance Criteria

- [ ] AC1: {specific testable criterion}
- [ ] AC2: {specific testable criterion}
- [ ] AC3: {specific testable criterion}

## Technical Notes

{Implementation guidance for @dev}

## Dependencies

- {dependency with status}

## File List

| File | Action | Status |
|------|--------|--------|
| {path} | CREATE/MODIFY | |

## QA Results

<!-- @qa fills this section -->
Verdict: PENDING
```

---

## Acceptance Criteria

All criteria are binary (PASS/FAIL):

1. Story file exists at `.aiox/stories/{epic_id}.{story_num}.story.md`
2. Story ID follows format `{epic_id}.{story_num}`
3. User story sentence contains role, action, and benefit
4. At least 3 Acceptance Criteria defined
5. All ACs are binary (no subjective language)
6. All ACs from the epic for this scope are preserved verbatim
7. Technical Notes section has meaningful content
8. File List has at least 1 entry
9. Status is set to "Draft"
10. Dependencies section lists status of each dependency

---

## Output Specification

| Field    | Value                                               |
|----------|-----------------------------------------------------|
| Format   | Markdown                                            |
| Template | `.aiox-core/product/templates/story-tmpl.yaml`      |
| Filename | `{epic_id}.{story_num}.story.md`                    |
| Location | `.aiox/stories/`                                    |

---

## Dependencies

| Resource       | Type | Path                                            |
|----------------|------|-------------------------------------------------|
| Story Template | file | `.aiox-core/product/templates/story-tmpl.yaml`  |
| Epic File      | file | Provided by caller                              |
| Stories Dir    | dir  | `.aiox/stories/`                                |
| Context File   | file | `.aiox/accumulated-context.md` (optional)       |

---

## Error Handling

| Error                          | Action                                             |
|--------------------------------|----------------------------------------------------|
| epic_file does not exist       | BLOCK — return error with expected path            |
| Epic has no features/goals     | BLOCK — ask @pm to add content to epic             |
| All epic scope already covered | DONE — output "All stories created for this epic"  |
| Story has no testable ACs      | BLOCK — Phase 3 failed, must define ACs            |
| Hard dependency not started    | Set status to "Blocked", note blocker in output    |

---

## Next Step

After this task completes, the story flows to:
1. **@po** runs `validate-next-story.md` — validates and promotes to "Ready"
2. **@dev** runs `dev-develop-story.md` — implements the story
