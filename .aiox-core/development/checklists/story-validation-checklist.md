# Story Validation Checklist (10-Point)

**Purpose:** Used by @po (Pax) during story validation (Phase 2 of Story Development Cycle). A 10-point checklist that determines GO or NO-GO for implementation.

**Usage:** Run via `*checklist story-validation-checklist` or follow during `*validate-story-draft {story}`.

---

## Checklist Items (1 point each)

### 1. User Story Format
- [ ] Story has a clear user story format: "As a {role}, I want {action}, so that {benefit}"
- Verifies the story communicates WHO, WHAT, and WHY

### 2. Acceptance Criteria Quality
- [ ] Acceptance criteria are specific and testable (not vague like "works well" or "looks good")
- Each AC item should be verifiable as PASS or FAIL with no ambiguity

### 3. Story Sizing
- [ ] Story is properly sized: can be completed in 1-3 days by a single developer
- Stories larger than 3 days should be split into smaller stories

### 4. Dependencies Identified
- [ ] All dependencies are identified (other stories, external APIs, infrastructure, data)
- Blocking dependencies must be resolved or scheduled before this story

### 5. Technical Notes Sufficient
- [ ] Technical notes provide enough context for @dev to begin implementation
- Should include: approach suggestions, relevant files, constraints, patterns to follow

### 6. Correct Epic Placement
- [ ] Story belongs to the correct epic and aligns with the epic goal
- Story contributes to the epic's overall objective

### 7. Naming Convention
- [ ] Story ID follows naming convention: `{EPIC_NUM}.{STORY_NUM}` format
- File is named correctly and placed in the right directory

### 8. Scope Control
- [ ] Story has a single, focused objective (not trying to accomplish 2-3 stories in one)
- If the story has more than 8 AC items, consider splitting

### 9. Business Value
- [ ] Business value is clear: why does this story matter to the user or product?
- Not just technical housekeeping without stated value

### 10. Edge Cases Noted
- [ ] Known edge cases, limitations, or out-of-scope items are documented
- Prevents scope creep during implementation by setting clear boundaries

---

## Scoring

| Score | Decision | Action |
|-------|----------|--------|
| 10/10 | GO | Story is ready for implementation |
| 7-9/10 | GO | Story is ready, minor notes for improvement |
| 4-6/10 | NO-GO | Story needs specific fixes before implementation |
| 0-3/10 | NO-GO | Story needs significant rework |

---

## On GO Decision

- [ ] Mark story status as `Ready`
- [ ] Confirm story is assigned to next sprint/iteration
- [ ] Note any minor improvements as suggestions (do not block)

## On NO-GO Decision

- [ ] List specific items that failed with clear fix instructions
- [ ] Return to @sm for revision
- [ ] Do not allow implementation to start until score >= 7

---

## Validation Output Format

```markdown
## Story Validation: {story_id}

**Validator:** Pax (PO Agent)
**Date:** {YYYY-MM-DD}
**Score:** {N}/10

### Results
| # | Item | Status | Notes |
|---|------|--------|-------|
| 1 | User Story Format | PASS/FAIL | {notes} |
| 2 | AC Quality | PASS/FAIL | {notes} |
| ... | | | |

### Decision: {GO | NO-GO}
{summary and any required fixes}
```
