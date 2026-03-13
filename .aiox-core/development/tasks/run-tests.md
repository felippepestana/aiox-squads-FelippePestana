# ===============================================================================
# TASK: Run Tests
# ID: run-tests
# Version: 1.0.0
# Purpose: Execute test suite and report results with clear pass/fail reporting.
# Agent: qa (Quinn)
# ===============================================================================

## Overview

Discovers and executes the project test suite. Reports results in a structured
format with clear identification of failures, their causes, and recommendations
for resolution.

---

## Inputs

| Parameter    | Type   | Required | Description                                     |
|-------------|--------|----------|--------------------------------------------------|
| scope       | enum   | NO       | `all` (default), `changed`, or `specific`        |
| test_path   | path   | NO       | Specific test file or directory (if scope=specific) |

---

## Preconditions

- [ ] Project has a test framework configured
- [ ] Dependencies are installed (node_modules or equivalent exists)

---

## PHASE 0: Discovery

- [ ] 0.1 -- Detect test framework:
  - Check `package.json` for `jest`, `vitest`, `mocha`, `playwright`, `cypress`
  - Check for test config files: `jest.config.*`, `vitest.config.*`, `.mocharc.*`
- [ ] 0.2 -- Detect test command: check `package.json` scripts for `test`, `test:unit`, `test:e2e`
- [ ] 0.3 -- If scope is `changed`: get changed files from `git diff main...HEAD --name-only`, map to related test files
- [ ] 0.4 -- Count total test files to execute

---

## PHASE 1: Execution

- [ ] 1.1 -- Run the test command with appropriate flags:
  - For Jest/Vitest: `npx jest --verbose` or `npx vitest run --reporter=verbose`
  - For scope=changed: `npx jest --changedSince=main`
  - For scope=specific: `npx jest {test_path}`
- [ ] 1.2 -- Capture stdout, stderr, and exit code
- [ ] 1.3 -- Set timeout: 5 minutes for unit tests, 10 minutes for integration/e2e
- [ ] 1.4 -- If tests fail, capture the full failure output

---

## PHASE 2: Parse Results

- [ ] 2.1 -- Extract from test output:
  - Total tests run
  - Tests passed
  - Tests failed
  - Tests skipped
  - Test suites passed/failed
  - Duration
- [ ] 2.2 -- For each failing test:
  - Test name and suite
  - Failure message
  - Expected vs actual (if assertion failure)
  - Stack trace location (file:line)
- [ ] 2.3 -- Check for skipped tests: `.skip`, `.only`, `xit`, `xdescribe`
- [ ] 2.4 -- Extract coverage data if available

---

## PHASE 3: Report

- [ ] 3.1 -- Generate structured test report
- [ ] 3.2 -- Classify failures:
  - **Regression**: Previously passing test now fails
  - **New failure**: Test for new code fails
  - **Flaky**: Test fails intermittently (if detected)
  - **Environment**: Failure due to missing config/deps

### Output Format

```markdown
## Test Execution Report

**Date:** {YYYY-MM-DD}
**Runner:** Quinn (QA Agent)
**Framework:** {jest | vitest | mocha | etc.}
**Scope:** {all | changed | specific}

### Summary

| Metric       | Value    |
|-------------|----------|
| Total Tests  | {n}      |
| Passed       | {n}      |
| Failed       | {n}      |
| Skipped      | {n}      |
| Duration     | {time}   |
| Pass Rate    | {%}      |

### Failed Tests

| # | Suite | Test Name | Type | File:Line | Message |
|---|-------|-----------|------|-----------|---------|
| 1 | {suite} | {test} | Regression/New/Flaky | {path}:{line} | {message} |

### Skipped Tests (Warning)
- {test name} -- reason unknown, investigate

### Coverage (if available)
| Metric     | Value |
|-----------|-------|
| Statements | {%}   |
| Branches   | {%}   |
| Functions  | {%}   |
| Lines      | {%}   |

### Verdict: {PASS | FAIL}
- PASS: All tests pass, no unexpected skips
- FAIL: Any test failure
```

---

## Acceptance Criteria

1. Test framework detected and command executed
2. Results captured with pass/fail counts
3. Each failure documented with file location and message
4. Skipped tests flagged as warnings
5. Verdict: PASS (all pass) or FAIL (any failure)

---

## Error Handling

| Error                          | Action                                    |
|-------------------------------|-------------------------------------------|
| No test framework found       | WARN -- report "No tests configured"      |
| Tests timeout                 | FAIL -- report timeout, suggest async fix  |
| Missing dependencies          | BLOCK -- run `npm install` first           |
| Test command not in scripts   | Try common patterns: `npx jest`, `npx vitest` |

---

## Estimated Time

| Scenario           | Time       |
|--------------------|------------|
| Small suite (<50)  | 1-3 min    |
| Medium suite       | 3-8 min    |
| Large suite        | 8-15 min   |
