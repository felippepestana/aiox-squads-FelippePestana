# Task: QA Review Story (Code Review)

**Task ID:** qa-review-story
**Purpose:** Comprehensive code review of story implementation — deeper than QA Gate
**Agent:** @qa (Quinn)
**Aliases:** code-review

---

## Overview

While `qa-gate.md` is a quality gate with a verdict, this task is a thorough code review that provides detailed feedback for improvement, even on passing code. Used for complex stories or when the team wants deeper review.

---

## PHASE 0: Setup

- [ ] 0.1 — Read complete story file
- [ ] 0.2 — Get full git diff: `git diff {base_branch}...HEAD`
- [ ] 0.3 — Read ALL modified files completely
- [ ] 0.4 — Read related files (files that interact with modified files)
- [ ] 0.5 — Read relevant tests

---

## PHASE 1: Architecture Review

- [ ] 1.1 — Does the implementation follow the project's architectural patterns?
- [ ] 1.2 — Are the right layers being used (presentation vs business logic vs data)?
- [ ] 1.3 — Is the coupling between components appropriate (low coupling, high cohesion)?
- [ ] 1.4 — Are abstractions at the right level? (not over- or under-engineered)
- [ ] 1.5 — Does it align with decisions in any architecture docs?

**Findings:** List architectural observations, both good and concerning.

---

## PHASE 2: Code Readability & Maintainability

- [ ] 2.1 — Variable and function names: clear and descriptive?
- [ ] 2.2 — Functions: single responsibility? Not doing too many things?
- [ ] 2.3 — Complex logic: adequately commented?
- [ ] 2.4 — Magic numbers/strings: extracted to named constants?
- [ ] 2.5 — Error messages: helpful and actionable?
- [ ] 2.6 — Would a new team member understand this code in 6 months?

---

## PHASE 3: Error Handling Completeness

- [ ] 3.1 — All external calls have error handling (API, DB, file I/O)
- [ ] 3.2 — Errors are propagated appropriately (not silently swallowed)
- [ ] 3.3 — User-facing errors are friendly and actionable
- [ ] 3.4 — Error logging is appropriate (not too verbose, not missing)
- [ ] 3.5 — Retry logic where appropriate (network calls, external services)

---

## PHASE 4: Edge Cases Coverage

- [ ] 4.1 — Empty/null inputs handled
- [ ] 4.2 — Boundary values handled (0, negative, very large numbers)
- [ ] 4.3 — Concurrent access considered (race conditions)?
- [ ] 4.4 — Pagination/limits on list operations
- [ ] 4.5 — Internationalization concerns (dates, currencies, text encoding)?

---

## PHASE 5: API Contract Validation

(Skip if no API changes)
- [ ] 5.1 — Request/response types match documented API contract
- [ ] 5.2 — HTTP status codes are semantically correct
- [ ] 5.3 — Breaking changes are explicitly flagged
- [ ] 5.4 — Versioning considered for breaking changes

---

## PHASE 6: Database Query Review

(Skip if no database changes)
- [ ] 6.1 — Queries are efficient (no N+1, appropriate indexes used)
- [ ] 6.2 — Transactions used where needed (multiple operations that must be atomic)
- [ ] 6.3 — RLS policies enforced (if Supabase/PostgreSQL)
- [ ] 6.4 — Migrations are reversible
- [ ] 6.5 — Sensitive data handled appropriately (encryption, masking)

---

## PHASE 7: Security Deep-Dive

Same as qa-gate.md PHASE 4, but with deeper analysis:
- [ ] 7.1 — Authentication: verified at all protected endpoints
- [ ] 7.2 — Authorization: verified user can only access own data
- [ ] 7.3 — Input validation: all user input sanitized
- [ ] 7.4 — Output encoding: XSS prevention
- [ ] 7.5 — SQL injection: parameterized queries everywhere
- [ ] 7.6 — Sensitive data: not logged, not in URLs, encrypted at rest
- [ ] 7.7 — Dependencies: no known vulnerabilities in new deps

---

## Output: Review Report

```markdown
# Code Review: {story_id}
**Reviewer:** @qa (Quinn)
**Date:** {date}
**Type:** Comprehensive Code Review

## Summary
{2-3 sentence overall assessment}

## Strengths 💚
- {what was done well}

## Issues

### CRITICAL (must fix)
- **{file}:{line}** — {issue}: {recommendation}

### MAJOR (should fix)
- **{file}:{line}** — {issue}: {recommendation}

### MINOR (optional / tech debt)
- **{file}:{line}** — {suggestion}

## Architecture Notes
{architectural observations}

## Verdict
APPROVED | NEEDS_REVISION | REJECTED
```

---

_Task Version: 3.0 | Last Updated: 2026-03-13_
