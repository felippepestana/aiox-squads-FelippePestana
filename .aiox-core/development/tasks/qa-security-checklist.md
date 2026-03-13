# ===============================================================================
# TASK: Security Checklist
# ID: qa-security-checklist
# Version: 1.0.0
# Purpose: Security-focused review task. OWASP Top 10 checks, auth/authz
#          validation, data exposure, CORS, rate limiting.
# Agent: qa (Quinn)
# ===============================================================================

## Overview

Performs a focused security review of story implementation against OWASP Top 10
categories and common web application security concerns. Produces a structured
report with findings classified by severity.

---

## Inputs

| Parameter    | Type   | Required | Description                                  |
|-------------|--------|----------|----------------------------------------------|
| story_file  | path   | YES      | Absolute path to the story .md file          |

---

## Preconditions

- [ ] Story file exists with File List populated
- [ ] Code changes are committed and available for review

---

## PHASE 0: Context Loading

- [ ] 0.1 -- Read story file, extract File List
- [ ] 0.2 -- Run `git diff main...HEAD` to see all changes
- [ ] 0.3 -- Read all changed files

---

## PHASE 1: OWASP Top 10 Checks

### A01 - Broken Access Control
- [ ] 1.1 -- Every API endpoint has authentication check
- [ ] 1.2 -- Authorization enforced (user can only access own resources)
- [ ] 1.3 -- No IDOR vulnerabilities (direct object references without ownership check)
- [ ] 1.4 -- Admin functions protected by role check
- [ ] 1.5 -- CORS configured restrictively (not wildcard `*`)

### A02 - Cryptographic Failures
- [ ] 1.6 -- No sensitive data in plain text (passwords, tokens, PII)
- [ ] 1.7 -- HTTPS enforced for data in transit
- [ ] 1.8 -- Proper hashing for passwords (bcrypt, argon2)
- [ ] 1.9 -- No deprecated crypto algorithms (MD5, SHA1 for security)

### A03 - Injection
- [ ] 1.10 -- SQL queries use parameterized statements (no string concatenation)
- [ ] 1.11 -- NoSQL queries sanitized
- [ ] 1.12 -- OS command injection prevented (no `exec()` with user input)
- [ ] 1.13 -- LDAP/XPath injection prevented (if applicable)

### A04 - Insecure Design
- [ ] 1.14 -- Rate limiting on authentication endpoints
- [ ] 1.15 -- Account lockout after failed attempts
- [ ] 1.16 -- No business logic flaws (e.g., negative quantities, price manipulation)

### A05 - Security Misconfiguration
- [ ] 1.17 -- No default credentials
- [ ] 1.18 -- Error messages do not leak stack traces or system info
- [ ] 1.19 -- Security headers set (X-Content-Type-Options, X-Frame-Options, CSP)
- [ ] 1.20 -- Debug mode disabled in production config

### A06 - Vulnerable Components
- [ ] 1.21 -- No known vulnerable dependencies (check package.json/lock file)
- [ ] 1.22 -- Dependencies are from trusted sources
- [ ] 1.23 -- No unnecessary dependencies added

### A07 - Authentication Failures
- [ ] 1.24 -- Session management secure (httpOnly, secure, sameSite cookies)
- [ ] 1.25 -- JWT tokens have expiration
- [ ] 1.26 -- Password requirements enforced (if registration involved)
- [ ] 1.27 -- Multi-factor authentication considered for sensitive operations

### A08 - Data Integrity Failures
- [ ] 1.28 -- Deserialization of untrusted data handled safely
- [ ] 1.29 -- CI/CD pipeline integrity (no unsigned code execution)
- [ ] 1.30 -- Software supply chain verified

### A09 - Logging and Monitoring
- [ ] 1.31 -- Authentication events logged (login, logout, failed attempts)
- [ ] 1.32 -- Authorization failures logged
- [ ] 1.33 -- No sensitive data in logs (passwords, tokens, full credit cards)
- [ ] 1.34 -- Log injection prevented (user input sanitized before logging)

### A10 - Server-Side Request Forgery (SSRF)
- [ ] 1.35 -- URL inputs validated and restricted to allowed domains
- [ ] 1.36 -- Internal network access blocked from user-supplied URLs
- [ ] 1.37 -- Redirect URLs validated against allowlist

---

## PHASE 2: Additional Security Checks

- [ ] 2.1 -- No hardcoded API keys, secrets, or passwords in code
- [ ] 2.2 -- `.env` files not committed to git
- [ ] 2.3 -- Sensitive config uses environment variables
- [ ] 2.4 -- File upload validation (type, size, content) if applicable
- [ ] 2.5 -- XSS prevention: user input sanitized before rendering in HTML
- [ ] 2.6 -- CSRF tokens on state-changing forms/endpoints

---

## PHASE 3: Report

- [ ] 3.1 -- Compile all findings with severity
- [ ] 3.2 -- Mark each check as PASS / FAIL / N/A
- [ ] 3.3 -- Generate security report

### Output Format

```markdown
## Security Review: {story_id}

**Date:** {YYYY-MM-DD}
**Reviewer:** Quinn (QA Agent)

### OWASP Top 10 Summary

| Category | Status | Findings |
|----------|--------|----------|
| A01 - Broken Access Control | PASS/FAIL/N/A | {summary} |
| A02 - Cryptographic Failures | PASS/FAIL/N/A | {summary} |
| ... | | |

### Critical Findings
| # | Category | Description | File:Line | Severity |
|---|----------|-------------|-----------|----------|

### Verdict: {PASS | NEEDS_WORK | FAIL}
{summary}
```

---

## Acceptance Criteria

1. All OWASP Top 10 categories evaluated
2. Each check marked PASS/FAIL/N/A with justification
3. Critical findings have file paths and line numbers
4. Verdict provided based on findings severity
5. No CRITICAL security findings for PASS verdict

---

## Estimated Time

| Scenario           | Time       |
|--------------------|------------|
| Small change       | 8-12 min   |
| Medium feature     | 15-20 min  |
| Large feature      | 25-35 min  |
