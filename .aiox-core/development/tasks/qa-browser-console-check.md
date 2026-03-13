# ===============================================================================
# TASK: Browser Console Check
# ID: qa-browser-console-check
# Version: 1.0.0
# Purpose: Check browser console for errors and warnings after frontend changes.
# Agent: qa (Quinn)
# Tools: browser (playwright MCP)
# ===============================================================================

## Overview

Navigates to the application in a browser and checks the developer console for
JavaScript errors, warnings, failed network requests, and other issues. Used
after frontend changes to verify no console pollution or runtime errors.

---

## Inputs

| Parameter  | Type   | Required | Description                                      |
|-----------|--------|----------|--------------------------------------------------|
| url       | string | YES      | URL to check (e.g., `http://localhost:3000`)     |
| pages     | array  | NO       | List of specific page paths to check             |

---

## Preconditions

- [ ] Application is running and accessible at the provided URL
- [ ] Browser automation tool (playwright) is available

---

## PHASE 0: Setup

- [ ] 0.1 -- Verify the application is accessible (navigate to base URL)
- [ ] 0.2 -- If pages list not provided, check: home page, main feature pages

---

## PHASE 1: Console Capture

For each page to check:

- [ ] 1.1 -- Navigate to the page
- [ ] 1.2 -- Wait for page to fully load (network idle)
- [ ] 1.3 -- Capture all console messages:
  - **error**: JavaScript errors, unhandled promise rejections
  - **warning**: Deprecation warnings, React warnings
  - **info**: Informational messages (usually benign)
- [ ] 1.4 -- Capture failed network requests (4xx, 5xx status codes)
- [ ] 1.5 -- Check for unhandled errors in the error boundary (if React)
- [ ] 1.6 -- Interact with key UI elements to trigger dynamic errors

---

## PHASE 2: Classification

- [ ] 2.1 -- Classify each finding:
  - **CRITICAL**: JavaScript errors that break functionality, unhandled exceptions
  - **MAJOR**: Failed API calls (4xx/5xx), React key warnings, missing resources (404)
  - **MINOR**: Deprecation warnings, non-critical console.warn messages
  - **IGNORE**: Third-party script warnings, browser extension noise
- [ ] 2.2 -- Filter out known false positives (browser extensions, third-party analytics)

---

## PHASE 3: Report

### Output Format

```markdown
## Browser Console Check: {url}

**Date:** {YYYY-MM-DD}
**Checker:** Quinn (QA Agent)
**Pages Checked:** {count}

### Summary

| Severity | Count |
|----------|-------|
| CRITICAL | {n}   |
| MAJOR    | {n}   |
| MINOR    | {n}   |
| Ignored  | {n}   |

### Findings

| # | Page | Severity | Type | Message | Source |
|---|------|----------|------|---------|--------|
| 1 | /path | CRITICAL | JS Error | {message} | {file:line} |

### Failed Network Requests

| # | Page | URL | Status | Method |
|---|------|-----|--------|--------|

### Verdict: {CLEAN | HAS_ISSUES | CRITICAL_ERRORS}
- CLEAN: Zero CRITICAL, zero MAJOR
- HAS_ISSUES: Some MAJOR findings, no CRITICAL
- CRITICAL_ERRORS: CRITICAL errors found, must fix
```

---

## Acceptance Criteria

1. All specified pages checked
2. Console messages captured and classified
3. Failed network requests identified
4. False positives filtered out
5. Verdict provided

---

## Error Handling

| Error                        | Action                                   |
|------------------------------|------------------------------------------|
| Application not running      | BLOCK -- start the app first             |
| Browser tool unavailable     | WARN -- cannot perform check, note skip  |
| Page timeout                 | WARN -- record as potential issue        |

---

## Estimated Time

| Scenario         | Time      |
|------------------|-----------|
| 1-3 pages        | 3-5 min   |
| 4-10 pages       | 5-10 min  |
| 10+ pages        | 10-20 min |
