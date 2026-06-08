# analyze-results

## Task: Analyze Themes, Sentiment & eNPS

### Metadata
- **executor:** sentiment-analyst
- **elicit:** true
- **mode:** analytical
- **output:** results-analysis.yaml

### Inputs Required
```text
survey_design: the instrument used (from survey-designer's survey-design.yaml, root key `survey_design`)
responses: the collected responses (aggregated; no identifying data)
min_group_size: minimum group size for any reported cut (from the survey design)
```

### Elicitation
```text
Which survey are we analyzing, and what responses do we have (aggregated)?
> [user]

What's the minimum group size for cuts, and which segments matter?
> [user or skip]
```

### Execution Steps

#### Step 1: Compute eNPS
- Promoters (9-10) − detractors (0-6) as % of respondents; report only cuts at/above min group size.

#### Step 2: Extract themes & sentiment
- Code open responses into themes with sentiment; attach representative, anonymized quotes.

#### Step 3: Interpret
- Tie the eNPS number to its driver themes (the score is the symptom, the themes are the cause).

### Output Format (`results-analysis.yaml`)
```yaml
results_analysis:
  enps: { score: 0, promoters_pct: 0, passives_pct: 0, detractors_pct: 0 }
  themes:
    - { theme: "", sentiment: "", weight: "", quote: "" }   # quotes anonymized
  segments: []             # only cuts >= min_group_size
  headline: ""             # the story, not just the average
```

### Veto Conditions
- A quote that could identify a respondent → anonymize or summarize.
- A segment cut below the minimum group size → drop or re-aggregate.
- Reporting only an average with no themes → add the story.

### Completion Criteria
- eNPS computed, themes + sentiment extracted with safe quotes, headline written. Hand off to signal-scout / action-planner, and to anonymity-gate before publishing.
