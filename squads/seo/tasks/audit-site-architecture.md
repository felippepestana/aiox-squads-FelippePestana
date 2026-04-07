# audit-site-architecture

## Task: Site Architecture Audit

### Metadata
- **executor:** site-architect
- **elicit:** false (called by seo-chief via workflow)
- **mode:** sequential
- **model:** sonnet
- **output:** architecture-audit-results.json

### Description
Evaluates URL structure, internal linking, navigation hierarchy, and content siloing. Returns a score (0-5).

### Inputs
```
pages: List of pages with URLs and navigation data
site_map: Internal link graph
```

### Execution Steps

#### Step 1: URL Structure Analysis
- Check URL patterns (hyphens, lowercase, no parameters)
- Identify inconsistent URL conventions
- Detect unnecessarily deep URLs

#### Step 2: Architecture Checks (6 checks)

| # | Check | Max |
|---|-------|-----|
| 1 | URL structure clean and descriptive (hyphens, lowercase) | 1 |
| 2 | No unnecessary URL parameters or session IDs | 1 |
| 3 | Logical content hierarchy / silo structure | 1 |
| 4 | Navigation reflects content structure | 0.5 |
| 5 | Internal linking connects related content (min 2 contextual links per page) | 1 |
| 6 | No pages deeper than 3 clicks from homepage | 0.5 |

**Scoring:** Raw sum = 0-5.

#### Step 3: Architecture Recommendations
- Identify orphan pages and linking opportunities
- Suggest content silo groupings
- Flag deep pages that need promotion in navigation

### Output Format
```json
{
  "category": "site_architecture",
  "score": 3,
  "max_score": 5,
  "max_depth": 4,
  "orphan_pages": [],
  "checks": [],
  "silo_recommendations": []
}
```

### Completion Criteria
- [ ] URL structure analyzed
- [ ] Internal link graph mapped
- [ ] Depth analysis complete
- [ ] Score calculated (0-5)
