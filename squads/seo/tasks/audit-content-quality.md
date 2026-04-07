# audit-content-quality

## Task: Content Quality & E-E-A-T Audit

### Metadata
- **executor:** content-quality-assessor
- **elicit:** false (called by seo-chief via workflow)
- **mode:** sequential
- **model:** sonnet
- **output:** content-quality-results.json

### Description
Evaluates E-E-A-T signals (Experience, Expertise, Authoritativeness, Trustworthiness), content depth, trust markers, and YMYL compliance. Returns a score (0-15).

### Inputs
```
pages: List of pages with content
site_url: Base URL for trust page detection
```

### Execution Steps

#### Step 1: Trust Page Detection
- Check for About page with credentials
- Check for Contact page with real information
- Check for Privacy Policy and Terms of Service
- Check for author bios/bylines on content pages

#### Step 2: E-E-A-T Checks (12 checks)

| # | Check | Max |
|---|-------|-----|
| 1 | Author bio/byline present on content pages | 2 |
| 2 | Author page/schema exists | 1 |
| 3 | About page exists with credentials | 1 |
| 4 | Contact information accessible | 1 |
| 5 | Privacy policy present | 1 |
| 6 | Terms of service present | 1 |
| 7 | Content depth (word count and topical coverage vs. competitors) | 2 |
| 8 | Original information, research, or data present | 1 |
| 9 | Citations to authoritative sources | 1 |
| 10 | Last updated date present on content pages | 1 |
| 11 | Editorial standards visible | 1 |
| 12 | YMYL classification check (higher bar for health, finance, legal) | 2 |

**Scoring:** Raw sum normalized to 0-15 scale.

#### Step 3: Content Recommendations
- Identify thin content pages (< 300 words with no justification)
- Flag YMYL pages without adequate E-E-A-T signals
- Recommend specific trust improvements

### Output Format
```json
{
  "category": "content_quality",
  "score": 10,
  "max_score": 15,
  "trust_pages": {"about": true, "contact": true, "privacy": false, "terms": false},
  "checks": [],
  "recommendations": []
}
```

### Completion Criteria
- [ ] All E-E-A-T signals evaluated
- [ ] YMYL pages identified and flagged if under-supported
- [ ] Score normalized to 0-15
- [ ] Actionable recommendations provided
