# audit-performance

## Task: Performance & Core Web Vitals Audit

### Metadata
- **executor:** performance-engineer
- **elicit:** false (called by seo-chief via workflow)
- **mode:** sequential
- **model:** sonnet
- **output:** performance-audit-results.json

### Description
Evaluates Core Web Vitals (LCP, INP, CLS), image optimization, render-blocking resources, and font loading. Returns a score (0-10).

### Inputs
```
pages: List of pages with HTML content
assets: Detected images, scripts, stylesheets
```

### Execution Steps

#### Step 1: Static Analysis
- Identify LCP candidate elements
- Detect images without dimensions, lazy loading, or optimization
- Find render-blocking scripts and stylesheets
- Check font loading strategy

#### Step 2: Performance Checks (10 checks)

| # | Check | Max |
|---|-------|-----|
| 1 | LCP element optimized (preload, fetchpriority=high) | 1 |
| 2 | No layout shift triggers (images without width/height) | 1 |
| 3 | Images optimized (WebP/AVIF format suggested) | 1 |
| 4 | Below-fold images use lazy loading | 1 |
| 5 | Critical CSS inlined or preloaded | 1 |
| 6 | No render-blocking resources in head | 1 |
| 7 | Font loading optimized (font-display: swap/optional) | 1 |
| 8 | Total page weight < 3MB | 1 |
| 9 | JavaScript deferred or async where possible | 1 |
| 10 | Third-party scripts minimized and async | 1 |

**Scoring:** Raw sum = 0-10 (direct mapping).

#### Step 3: Optimization Opportunities
- Estimate CWV improvement from each fix
- Prioritize by impact on LCP, INP, CLS
- Identify quick wins (attribute additions, format changes)

### Output Format
```json
{
  "category": "performance",
  "score": 6,
  "max_score": 10,
  "cwv_estimates": {"lcp": "~2.8s", "cls": "~0.15"},
  "checks": [],
  "optimization_opportunities": []
}
```

### Completion Criteria
- [ ] All 10 performance checks evaluated
- [ ] CWV risk areas identified
- [ ] Image audit complete with recommendations
- [ ] Score calculated (0-10)
