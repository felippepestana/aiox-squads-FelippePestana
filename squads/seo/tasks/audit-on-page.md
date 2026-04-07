# audit-on-page

## Task: On-Page SEO Audit

### Metadata
- **executor:** on-page-optimizer
- **elicit:** false (called by seo-chief via workflow)
- **mode:** sequential
- **model:** sonnet
- **output:** on-page-audit-results.json

### Description
Evaluates all on-page SEO factors for a given page or set of pages. Returns a score (0-25) with per-check breakdown.

### Inputs
```
page_url: URL or local path of the page to audit
focus_keyphrase: (optional) target keyphrase for the page
language: content language (default: auto-detect)
```

### Execution Steps

#### Step 1: Content Extraction
- Extract page title, meta description, headings, body text, images, links
- Detect the focus keyphrase (if not provided, infer from content + title)
- Calculate word count and readability metrics

#### Step 2: On-Page Checks (12 checks)

| # | Check | Scoring | Max |
|---|-------|---------|-----|
| 1 | Title tag present, 50-60 chars, contains keyphrase | 0-3 | 3 |
| 2 | Meta description present, 120-160 chars, contains keyphrase | 0-2 | 2 |
| 3 | Single H1, contains keyphrase | 0-2 | 2 |
| 4 | Heading hierarchy logical (H1 > H2 > H3, no skips) | 0-2 | 2 |
| 5 | Keyphrase density 1-2.5% | 0-2 | 2 |
| 6 | Keyphrase in first 100 words | 0-2 | 2 |
| 7 | Keyphrase in URL slug | 0-2 | 2 |
| 8 | Image alt text contains keyphrase (at least 1 image) | 0-2 | 2 |
| 9 | Content length vs. top-10 benchmark (within 80%) | 0-2 | 2 |
| 10 | Readability: Flesch score > 60 | 0-2 | 2 |
| 11 | Internal links present (min 2) | 0-2 | 2 |
| 12 | External links to authoritative sources (min 1) | 0-2 | 2 |

**Scoring:** Raw sum normalized to 0-25 scale.

#### Step 3: Issue Classification
For each failed check, classify:
- **Severity:** HIGH (>2 pts recoverable), MEDIUM (1-2 pts), LOW (<1 pt)
- **Fixable:** AUTO (can be fixed by optimizer), MANUAL (needs human input), GUIDANCE (recommendation only)

### Output Format
```json
{
  "category": "on_page_seo",
  "score": 18,
  "max_score": 25,
  "checks": [
    {"id": 1, "name": "title_tag", "status": "PASS", "score": 3, "max": 3, "detail": "..."},
    {"id": 2, "name": "meta_description", "status": "FAIL", "score": 0, "max": 2, "detail": "Missing meta description", "severity": "HIGH", "fixable": "AUTO"}
  ],
  "issues": [],
  "quick_wins": []
}
```

### Completion Criteria
- [ ] All 12 checks evaluated with score and status
- [ ] Total score calculated and normalized to 0-25
- [ ] Issues classified by severity and fixability
- [ ] Quick wins identified for Phase 2 optimization
