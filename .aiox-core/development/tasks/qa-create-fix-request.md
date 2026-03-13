# ===============================================================================
# TASK: Create Fix Request
# ID: qa-create-fix-request
# Version: 1.0.0
# Purpose: Generate a structured fix request for @dev after QA identifies issues.
#          Provides clear, actionable guidance organized by severity.
# Agent: qa (Quinn)
# Phase in Pipeline: Post-QA Gate (when verdict is NEEDS_WORK or FAIL)
# ===============================================================================

## Overview

When the QA Gate or Story Review identifies issues, this task creates a structured
fix request document that @dev can follow to resolve all findings. Issues are
classified by severity with specific file locations, expected behavior, and
recommended fixes.

---

## Inputs

| Parameter    | Type   | Required | Description                                      |
|-------------|--------|----------|--------------------------------------------------|
| story_file  | path   | YES      | Absolute path to the story .md file              |
| qa_findings | object | YES      | Findings from qa-gate or qa-review-story         |

---

## Preconditions

- [ ] QA Gate or Story Review has been executed
- [ ] Findings exist with severity classifications
- [ ] Story file has QA Results section populated

---

## PHASE 0: Load Context

- [ ] 0.1 -- Read the story file to extract story ID and title
- [ ] 0.2 -- Read the QA Results section from the story file
- [ ] 0.3 -- Collect all findings from the most recent QA review

---

## PHASE 1: Classify and Prioritize

- [ ] 1.1 -- Group findings by severity:
  - **CRITICAL**: Must fix before story can pass. Security vulnerabilities, data loss risks, broken core functionality.
  - **MAJOR**: Should fix before merge. Failing tests, missing AC implementations, lint errors, incomplete error handling.
  - **MINOR**: Optional improvements. Style inconsistencies, missing comments, potential optimizations.
- [ ] 1.2 -- Within each severity, order by impact (highest impact first)
- [ ] 1.3 -- For each finding, ensure it includes:
  - Clear description of the problem
  - File path and line number (or range)
  - What the current behavior is
  - What the expected behavior should be
  - Recommended fix approach

---

## PHASE 2: Generate Fix Request Document

- [ ] 2.1 -- Create the fix request using the format below
- [ ] 2.2 -- Include reproduction steps for CRITICAL and MAJOR issues
- [ ] 2.3 -- Add "How to Verify" instructions for each fix
- [ ] 2.4 -- Include "How to Run QA Again" section at the end

### Fix Request Format

```markdown
# Fix Request: {story_id}

**Story:** {story_title}
**QA Verdict:** {NEEDS_WORK | FAIL}
**Date:** {YYYY-MM-DD}
**Reviewer:** Quinn (QA Agent)
**Total Issues:** {count} (CRITICAL: {n}, MAJOR: {n}, MINOR: {n})

---

## CRITICAL Issues (MUST fix before PASS)

### C-1: {title}
- **File:** `{path}:{line}`
- **Problem:** {description}
- **Current:** {what happens now}
- **Expected:** {what should happen}
- **Fix:** {recommended approach}
- **Verify:** {how to verify the fix works}

---

## MAJOR Issues (SHOULD fix before merge)

### M-1: {title}
- **File:** `{path}:{line}`
- **Problem:** {description}
- **Fix:** {recommended approach}
- **Verify:** {how to verify}

---

## MINOR Issues (OPTIONAL improvements)

### m-1: {title}
- **File:** `{path}:{line}`
- **Suggestion:** {description}

---

## How to Run QA Again

1. Fix all CRITICAL issues (required)
2. Fix MAJOR issues (recommended)
3. Run `npm run lint` -- verify zero errors
4. Run `npm test` -- verify all tests pass
5. Commit changes
6. Request QA re-review: `@qa *gate {story_id}`
```

---

## PHASE 3: Deliver

- [ ] 3.1 -- Present the fix request document to the user
- [ ] 3.2 -- Summarize: "X CRITICAL, Y MAJOR, Z MINOR issues found. Fix CRITICAL issues first."
- [ ] 3.3 -- If CRITICAL count > 0: emphasize that story is BLOCKED until these are resolved

---

## Acceptance Criteria

1. Fix request contains all findings from QA review
2. Each finding has file path, description, and recommended fix
3. Findings are grouped by severity (CRITICAL > MAJOR > MINOR)
4. "How to Run QA Again" section included
5. CRITICAL issues clearly marked as blocking

---

## Output Specification

| Field     | Value                              |
|-----------|------------------------------------|
| Format    | Markdown                           |
| Delivery  | Presented inline to user           |

---

## Estimated Time

| Scenario             | Time    |
|----------------------|---------|
| 1-3 issues           | 2 min   |
| 4-10 issues          | 5 min   |
| 11+ issues           | 8 min   |
