# Story Draft Checklist — @sm (River) Pre-Submission

**Checklist ID:** story-draft-checklist
**Owner:** @sm (River)
**Used by:** `create-next-story.md` task before handing off to @po
**Purpose:** Ensure story draft meets minimum quality bar before @po validation

---

## Section 1: Format and Structure (Required)

- [ ] **1.1** Story has proper YAML frontmatter (story_id, title, epic, status: Draft)
- [ ] **1.2** User story format present: "As a {role}, I want {action} so that {benefit}"
- [ ] **1.3** Role is specific (not "user" — e.g., "registered customer", "admin", "developer")
- [ ] **1.4** Benefit (so that) is meaningful — not "I can do it"
- [ ] **1.5** Story title matches the core action in user story

## Section 2: Acceptance Criteria (Critical)

- [ ] **2.1** At least 2 acceptance criteria defined
- [ ] **2.2** Each AC starts with a specific verb (displays, creates, validates, returns, updates)
- [ ] **2.3** NO vague ACs: "works correctly", "is user friendly", "improves performance" → FAIL
- [ ] **2.4** Each AC is binary testable: PASS or FAIL, no "somewhat" states
- [ ] **2.5** ACs cover happy path AND at least one error/edge case
- [ ] **2.6** ACs derived from epic requirements (No Invention — Article IV)

## Section 3: Technical Context (Important)

- [ ] **3.1** Technical Notes section is present
- [ ] **3.2** Notes mention relevant files, APIs, or data structures @dev needs
- [ ] **3.3** No architectural decisions in technical notes (that's @architect's domain)
- [ ] **3.4** Dependencies listed (what must be done before this story)

## Section 4: Sizing and Scope

- [ ] **4.1** Story is implementable in 1-3 days (not a multi-week epic)
- [ ] **4.2** Story does ONE thing — not multiple unrelated features
- [ ] **4.3** File List section exists (can be empty — @dev will fill it)
- [ ] **4.4** Story is NOT a duplicate of an existing story

## Section 5: Context Coherence

- [ ] **5.1** Story references correct epic
- [ ] **5.2** Story number is sequential and not already used
- [ ] **5.3** Story is consistent with already-completed stories in the epic
- [ ] **5.4** If previous stories modified relevant files, notes mention this context

---

## Scoring

Count checked items:
- **20-22 checked** → ✅ READY for @po validation
- **17-19 checked** → ⚠️ REVIEW — fix missing items before submission
- **< 17 checked** → ❌ DRAFT — significant work needed

**Minimum for submission:** All Section 2 items (2.1-2.6) must pass.

---

## Auto-Fix Guidance (for @sm)

| Common Issue | Fix |
|-------------|-----|
| Vague AC like "works correctly" | Rewrite as "displays success message when {action} completes" |
| Missing error case | Add "displays error message when {input} is invalid" |
| Role too generic | Replace "user" with specific persona |
| Story too large | Split into 2-3 smaller stories |
| Missing technical context | Add: "Note: Uses {existing API/component/table}" |

---

_Checklist Version: 3.0_
_Owner: @sm (River)_
_Last Updated: 2026-03-13_
