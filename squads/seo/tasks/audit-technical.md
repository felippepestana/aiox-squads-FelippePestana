# audit-technical

## Task: Technical SEO Audit

### Metadata
- **executor:** technical-auditor
- **elicit:** false (called by seo-chief via workflow)
- **mode:** sequential
- **model:** sonnet
- **output:** technical-audit-results.json

### Description
Evaluates all technical SEO factors: crawlability, indexability, broken links, canonicals, sitemaps, redirects, and mobile readiness. Returns a score (0-20).

### Inputs
```
site_url: Base URL or local project path
pages: List of pages discovered in crawl phase
```

### Execution Steps

#### Step 1: Crawl Analysis
- Check robots.txt validity and directives
- Check XML sitemap existence and validity
- Identify crawl blockers (noindex, nofollow, disallow)

#### Step 2: Technical Checks (12 checks)

| # | Check | Scoring | Max |
|---|-------|---------|-----|
| 1 | HTTP status codes — no 4xx/5xx on internal pages | 0-2 | 2 |
| 2 | No broken internal links | 0-2 | 2 |
| 3 | No broken external links | 0-1 | 1 |
| 4 | Redirect chains max 1 hop | 0-2 | 2 |
| 5 | Canonical tags present and self-referencing | 0-2 | 2 |
| 6 | robots.txt valid and not blocking important pages | 0-1 | 1 |
| 7 | XML sitemap exists and includes all indexable pages | 0-2 | 2 |
| 8 | HTTPS enforced, no mixed content | 0-2 | 2 |
| 9 | Mobile-responsive (viewport meta present) | 0-2 | 2 |
| 10 | No duplicate title/meta across pages | 0-1 | 1 |
| 11 | Hreflang correct (if multi-language) | 0-1 | 1 |
| 12 | No orphan pages (every page reachable from navigation) | 0-2 | 2 |

**Scoring:** Raw sum normalized to 0-20 scale.

#### Step 3: Issue Report
For each failed check:
- **Severity:** CRITICAL (blocks indexing), HIGH, MEDIUM, LOW
- **Fixable:** AUTO, MANUAL, GUIDANCE
- List affected pages/URLs

### Output Format
```json
{
  "category": "technical_seo",
  "score": 15,
  "max_score": 20,
  "checks": [],
  "issues": [],
  "quick_wins": []
}
```

### Completion Criteria
- [ ] All 12 technical checks evaluated
- [ ] Score normalized to 0-20
- [ ] Broken links listed with source and target
- [ ] Critical indexing blockers flagged
