# Story Definition of Done Checklist

**Purpose:** Used by @dev before declaring a story complete. Every item must be addressed (checked or justified as N/A) before requesting QA review.

**Usage:** Run via `*checklist story-dod-checklist` or manually verify before `@qa *gate {story}`.

---

## Code Quality

- [ ] Lint passes with zero errors (`npm run lint` or equivalent)
- [ ] TypeScript typecheck passes with zero errors (`tsc --noEmit`, if applicable)
- [ ] No `console.log`, `console.debug`, or `debugger` statements in production code
- [ ] No hardcoded values that should be config or environment variables
- [ ] Code follows project naming conventions (files, functions, variables, components)
- [ ] No commented-out code blocks (remove or convert to proper TODO with ticket)
- [ ] Functions are focused and reasonable in length (under 50 lines preferred)
- [ ] No `any` type abuse in TypeScript (typed properly)
- [ ] Imports follow project conventions (absolute imports per Constitution Article VI)

---

## Functionality

- [ ] All acceptance criteria implemented and working
- [ ] Each AC checkbox in story file is checked
- [ ] Edge cases handled (empty inputs, boundary values, null/undefined)
- [ ] Error states handled gracefully (user-friendly messages, no crashes)
- [ ] No regression in existing functionality (existing features still work)
- [ ] Loading states implemented (spinners, skeletons) for async operations
- [ ] Success/failure feedback provided to users for actions

---

## Testing

- [ ] Unit tests written for new business logic
- [ ] Integration tests written for new API endpoints or data flows
- [ ] All tests pass locally (`npm test`)
- [ ] Test coverage maintained or improved (no significant drops)
- [ ] No `.skip`, `.only`, `xit`, or `xdescribe` left in test files
- [ ] Tests cover happy path, error path, and at least one edge case

---

## Documentation

- [ ] Story file updated: File List reflects all created/modified files
- [ ] Story file updated: AC checkboxes checked for implemented items
- [ ] Complex logic has inline comments explaining the "why"
- [ ] API changes documented (request/response shapes, status codes)
- [ ] New environment variables documented in `.env.example`
- [ ] README updated if setup steps changed

---

## Security

- [ ] No secrets, API keys, or passwords in code (use environment variables)
- [ ] No secrets in git history (check recent commits)
- [ ] Input validated at all entry points (API handlers, form submissions)
- [ ] Authentication checks present on protected routes
- [ ] Authorization checks present (users can only access own resources)
- [ ] User-generated content sanitized before rendering (XSS prevention)
- [ ] SQL queries use parameterized statements (no string concatenation)

---

## Git

- [ ] Commits are atomic and have descriptive messages (conventional commits)
- [ ] No merge conflicts with base branch
- [ ] Branch is up to date with base branch (rebased or merged)
- [ ] No unintended files committed (build artifacts, node_modules, .env)
- [ ] Story file status updated to `ReadyForReview`

---

## Scoring

**Pass criteria:** All applicable items checked. Items not relevant to this story may be marked N/A with justification.

| Result | Condition |
|--------|-----------|
| READY FOR QA | All applicable items checked |
| NOT READY | Any applicable item unchecked without justification |
