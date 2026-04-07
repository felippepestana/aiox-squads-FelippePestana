# audit-ai-visibility

## Task: AI Visibility & GEO Audit

### Metadata
- **executor:** ai-visibility-optimizer
- **elicit:** false (called by seo-chief via workflow)
- **mode:** sequential
- **model:** sonnet
- **output:** ai-visibility-results.json

### Description
Evaluates Generative Engine Optimization (GEO) signals: machine readability, llms.txt, citation worthiness, and content structure for AI consumption. Returns a score (0-10).

### Inputs
```
pages: List of pages with content
site_url: Base URL for llms.txt detection
```

### Execution Steps

#### Step 1: AI Readability Analysis
- Check for llms.txt at site root
- Analyze content structure for machine parsability
- Detect direct-answer formatting patterns
- Check robots.txt AI crawler policies

#### Step 2: GEO Checks (9 checks)

| # | Check | Max |
|---|-------|-----|
| 1 | llms.txt present at root with site summary | 1 |
| 2 | Content has quantitative statistics and data points | 1 |
| 3 | Citations from credible, verifiable sources | 1 |
| 4 | Self-contained content blocks (no "as mentioned above" dependencies) | 1 |
| 5 | Semantic HTML structure (article, section, nav, aside) | 1 |
| 6 | Direct answers to questions (featured snippet format) | 2 |
| 7 | Structured data enhances AI parsability | 1 |
| 8 | robots.txt defines AI crawler policy (GPTBot, ClaudeBot, etc.) | 1 |
| 9 | Content is unique/original (not commodity aggregation) | 1 |

**Scoring:** Raw sum = 0-10.

#### Step 3: GEO Recommendations
- Generate llms.txt if missing
- Identify content that could be restructured for AI citation
- Recommend direct-answer formatting for key questions

### Output Format
```json
{
  "category": "ai_visibility",
  "score": 4,
  "max_score": 10,
  "llms_txt_exists": false,
  "ai_crawler_policy": "not_defined",
  "checks": [],
  "recommendations": []
}
```

### Completion Criteria
- [ ] All 9 GEO checks evaluated
- [ ] llms.txt status determined
- [ ] AI crawler policy assessed
- [ ] Score calculated (0-10)
