# ===============================================================================
# TASK: Security Scan
# ID: security-scan
# Version: 1.0.0
# Purpose: Run automated security scanning tools against the codebase and report
#          findings with severity classification.
# Agent: qa (Quinn)
# ===============================================================================

## Overview

Executes available automated security scanning tools against the project codebase.
Aggregates findings from dependency audits, secret detection, and static analysis
into a unified report. Each finding is classified by severity and mapped to
OWASP categories where applicable.

---

## Inputs

| Parameter    | Type   | Required | Description                                  |
|-------------|--------|----------|----------------------------------------------|
| scope       | enum   | NO       | `full` (default) or `changed` (only diff)    |

---

## Preconditions

- [ ] Project has a package manager with lock file (package-lock.json, yarn.lock, pnpm-lock.yaml)
- [ ] Git repository is initialized

---

## PHASE 0: Tool Discovery

- [ ] 0.1 -- Detect available security tools:
  - `npm audit` / `yarn audit` / `pnpm audit` (dependency vulnerabilities)
  - `npx secretlint` (hardcoded secrets detection)
  - `npx eslint --rule 'security/*'` (if eslint-plugin-security installed)
  - CodeRabbit security scan (if configured)
- [ ] 0.2 -- Note which tools are available and which are missing
- [ ] 0.3 -- If scope is `changed`: get file list from `git diff main...HEAD --name-only`

---

## PHASE 1: Dependency Audit

- [ ] 1.1 -- Run `npm audit --json` (or equivalent for the package manager in use)
- [ ] 1.2 -- Parse results: extract vulnerability count by severity (critical, high, moderate, low)
- [ ] 1.3 -- For each CRITICAL and HIGH vulnerability:
  - Record: package name, version, vulnerability description, fix available?
- [ ] 1.4 -- Check if `npm audit fix` can resolve any issues automatically

---

## PHASE 2: Secret Detection

- [ ] 2.1 -- Search changed files for patterns matching secrets:
  - API keys: `/[A-Za-z0-9_]{20,}/` near keywords like `key`, `token`, `secret`, `password`
  - AWS keys: `AKIA[0-9A-Z]{16}`
  - Private keys: `-----BEGIN (RSA|DSA|EC|OPENSSH) PRIVATE KEY-----`
  - Connection strings with credentials
  - Bearer tokens
- [ ] 2.2 -- Check `.env` files are in `.gitignore`
- [ ] 2.3 -- Check that `.env.example` exists but contains no real values
- [ ] 2.4 -- Verify no secrets in git history (check recent commits)

---

## PHASE 3: Static Analysis

- [ ] 3.1 -- Search for dangerous function calls:
  - `eval()`, `Function()`, `innerHTML =`, `document.write()`
  - `exec()`, `spawn()` with user-controlled input
  - `dangerouslySetInnerHTML` without sanitization
- [ ] 3.2 -- Search for SQL injection vectors:
  - String concatenation in SQL queries
  - Template literals in query strings with user input
- [ ] 3.3 -- Search for XSS vectors:
  - Unsanitized user input rendered in JSX/HTML
  - Missing Content Security Policy

---

## PHASE 4: Report Generation

- [ ] 4.1 -- Aggregate all findings from Phases 1-3
- [ ] 4.2 -- Deduplicate (same issue found by multiple tools)
- [ ] 4.3 -- Classify each finding:
  - **CRITICAL**: Exploitable vulnerability, exposed secrets, RCE vector
  - **HIGH**: Known vulnerable dependency with fix available, injection risk
  - **MEDIUM**: Moderate vulnerability, missing security headers
  - **LOW**: Informational, best practice suggestion

### Output Format

```markdown
## Security Scan Report

**Date:** {YYYY-MM-DD}
**Scope:** {full | changed}
**Tools Used:** {list of tools executed}

### Summary

| Severity | Count |
|----------|-------|
| CRITICAL | {n}   |
| HIGH     | {n}   |
| MEDIUM   | {n}   |
| LOW      | {n}   |

### Dependency Audit
| Package | Version | Vulnerability | Severity | Fix Available |
|---------|---------|---------------|----------|---------------|

### Secret Detection
| Finding | File | Line | Description |
|---------|------|------|-------------|

### Static Analysis
| Finding | File | Line | Category | Description |
|---------|------|------|----------|-------------|

### Recommendations
1. {prioritized recommendation}

### Verdict: {PASS | NEEDS_WORK | FAIL}
- PASS: Zero CRITICAL, zero HIGH findings
- NEEDS_WORK: Zero CRITICAL, some HIGH findings with fixes available
- FAIL: Any CRITICAL finding, or HIGH findings without available fix
```

---

## Acceptance Criteria

1. At least one scanning tool executed successfully
2. Dependency audit completed (or noted as unavailable)
3. Secret detection completed on changed files
4. All findings classified by severity
5. Verdict issued based on findings

---

## Error Handling

| Error                        | Action                                    |
|------------------------------|-------------------------------------------|
| npm audit fails              | WARN -- note in report, continue          |
| No lock file found           | WARN -- skip dependency audit             |
| No security tools installed  | Use manual grep-based scanning only       |

---

## Estimated Time

| Scenario           | Time      |
|--------------------|-----------|
| Small project      | 3-5 min   |
| Medium project     | 5-10 min  |
| Large project      | 10-15 min |
