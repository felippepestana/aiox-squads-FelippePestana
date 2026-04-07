# audit-schema

## Task: Structured Data (Schema.org) Audit

### Metadata
- **executor:** schema-architect
- **elicit:** false (called by seo-chief via workflow)
- **mode:** sequential
- **model:** sonnet
- **output:** schema-audit-results.json

### Description
Evaluates structured data implementation: JSON-LD presence, correctness, rich result eligibility, and entity linking. Returns a score (0-15).

### Inputs
```
pages: List of pages with their HTML content
site_type: Detected site type (blog, ecommerce, local_business, saas, etc.)
```

### Execution Steps

#### Step 1: Schema Detection
- Scan all pages for existing JSON-LD, Microdata, and RDFa
- Identify page types (Article, Product, LocalBusiness, FAQPage, etc.)
- Extract and parse all structured data blocks

#### Step 2: Schema Checks (10 checks)

| # | Check | Max |
|---|-------|-----|
| 1 | JSON-LD structured data present on all key pages | 2 |
| 2 | Page type correctly identified and schema matches | 2 |
| 3 | Required properties present per schema type | 2 |
| 4 | No JSON syntax errors in structured data | 1 |
| 5 | Organization/WebSite schema on homepage | 2 |
| 6 | BreadcrumbList schema present | 1 |
| 7 | Rich result eligibility (FAQ, HowTo, Recipe, etc.) | 2 |
| 8 | Entity @id linking between schemas | 1 |
| 9 | No deprecated schema types used | 1 |
| 10 | All schemas pass Google Rich Results Test validation | 1 |

**Scoring:** Raw sum normalized to 0-15 scale.

#### Step 3: Generation Opportunities
- Identify pages missing schema that should have it
- Recommend schema types per page
- Flag rich result opportunities not yet captured

### Output Format
```json
{
  "category": "schema_structured_data",
  "score": 8,
  "max_score": 15,
  "existing_schemas": [],
  "missing_schemas": [],
  "checks": [],
  "generation_opportunities": []
}
```

### Completion Criteria
- [ ] All existing structured data parsed and validated
- [ ] Missing schema types identified per page
- [ ] Rich result opportunities listed
- [ ] Score normalized to 0-15
