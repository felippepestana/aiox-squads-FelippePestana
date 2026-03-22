# Task: Web Scan (Security)

**Task ID:** webscan
**Purpose:** Security scan of a running web application
**Agent:** @qa (Quinn)

---

## Overview

Performs automated security checks against a running web application endpoint.

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | string | YES | Target URL (local or staging) |
| `scan_type` | enum | NO | `basic` (default), `full` |

## Steps

- [ ] 1 — Verify target URL is accessible
- [ ] 2 — HTTP Headers check:
  - Content-Security-Policy present?
  - X-Frame-Options set?
  - Strict-Transport-Security (HTTPS only)?
  - X-Content-Type-Options: nosniff?
- [ ] 3 — Authentication check:
  - Auth endpoints return proper 401/403?
  - JWT tokens expire appropriately?
  - No auth bypass via path traversal?
- [ ] 4 — Information disclosure:
  - Error pages don't reveal stack traces?
  - API responses don't expose internal IDs?
  - No sensitive data in URL parameters?
- [ ] 5 — Common vulnerabilities (quick scan):
  - XSS: test basic payload `<script>alert(1)</script>`
  - Open redirects: test redirect parameters
  - CORS: check if `Access-Control-Allow-Origin: *` inappropriately
- [ ] 6 — Report findings by severity

## Output

```
🔍 Web Security Scan: {url}
Date: {date} | Type: {basic|full}

Headers: {N}/{total} secure headers present
Issues Found: {N}

HIGH: {list}
MEDIUM: {list}
INFO: {list}

Verdict: SECURE | VULNERABILITIES_FOUND
```

---
_Task Version: 3.0 | Last Updated: 2026-03-13_
