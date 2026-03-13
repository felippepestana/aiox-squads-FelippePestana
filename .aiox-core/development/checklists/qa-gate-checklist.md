# QA Gate Checklist

**Purpose:** Used by @qa during the QA Gate (qa-gate.md task). Structured quality verification with weighted scoring to determine PASS, NEEDS_WORK, or FAIL verdict.

**Usage:** Run via `*checklist qa-gate-checklist` or follow during `*gate {story}`.

---

## Functionality (40% weight)

- [ ] Each acceptance criterion item verified with evidence (file:line reference)
- [ ] Happy path works end-to-end for the primary use case
- [ ] Error paths tested: what happens when things go wrong?
- [ ] Edge cases considered: empty inputs, boundaries, unexpected data
- [ ] No regression: existing functionality still works after changes
- [ ] User-facing behavior matches AC description exactly

---

## Code Quality (20% weight)

- [ ] Lint check: zero errors in changed files
- [ ] Type check: zero TypeScript errors (if applicable)
- [ ] No debug code remaining: console.log, debugger, TODO, FIXME, HACK
- [ ] No hardcoded values that should be in config/env
- [ ] Naming conventions followed consistently
- [ ] No dead code or commented-out blocks
- [ ] Functions are focused and reasonably sized

---

## Testing (20% weight)

- [ ] New tests written for new logic (not just existing tests passing)
- [ ] All tests pass when suite is run
- [ ] No test bypasses: no `.skip`, `.only`, `xit`, `xdescribe`
- [ ] Tests are meaningful (testing real behavior, not trivial assertions)
- [ ] Error paths covered in tests (not just happy path)
- [ ] Test data is realistic (not placeholder values)

---

## Security (10% weight)

- [ ] No hardcoded secrets (API keys, passwords, tokens) in code
- [ ] Input validation present at all entry points
- [ ] SQL queries use parameterized statements
- [ ] XSS prevention: user content sanitized before rendering
- [ ] Auth checks present on protected endpoints
- [ ] No sensitive data in error messages or logs
- [ ] No known vulnerable dependencies added

---

## Story Hygiene (10% weight)

- [ ] Story file is updated with current information
- [ ] File List reflects all created and modified files
- [ ] AC checkboxes are checked for implemented items
- [ ] Status is appropriate for the current state
- [ ] Commits have descriptive messages following conventions

---

## Verdict Criteria

### PASS (score >= 80%, zero CRITICAL issues)

All critical items in Functionality and Security pass. Minor gaps in other sections are acceptable if documented.

### NEEDS_WORK (score 60-79%, or any MAJOR issue)

Specific issues must be listed with:
- File path and line number
- Description of the problem
- Recommended fix
- Severity: MAJOR

A fix request is generated for @dev.

### FAIL (score < 60%, or any CRITICAL issue)

CRITICAL issues include:
- Security vulnerability that makes the feature unsafe
- Core acceptance criterion completely unimplemented
- Data loss or corruption risk
- Tests failing with no fix path

Story is blocked until critical issues are resolved.

---

## Score Calculation

```
functionality_score = (passing_items / total_items) * 40
quality_score = (passing_items / total_items) * 20
testing_score = (passing_items / total_items) * 20
security_score = (passing_items / total_items) * 10
hygiene_score = (passing_items / total_items) * 10

total = sum of all section scores (out of 100)
```

Items marked N/A are excluded from both passing and total counts for that section.
