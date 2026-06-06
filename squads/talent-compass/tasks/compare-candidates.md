# compare-candidates

## Task: Compare and Rank Finalists on Evidence

### Metadata
- **executor:** evidence-scorer
- **elicit:** false
- **mode:** analytical
- **output:** comparison-report.md

### Inputs Required
```
scorecards: two or more scorecards for the same role
role_profile: shared competencies and rubric
```

### Elicitation
```
(no elicitation; compares existing scorecards)
```

### Execution Steps

#### Step 1: Verify comparability
- Confirm the same guide, anchors and rubric were applied to every candidate. If not, flag to fairness-gate before comparing.

#### Step 2: Lay out the evidence side by side
- Build a competency-by-competency comparison with each candidate's score and key evidence.

#### Step 3: Highlight differentiators and gaps
- Identify where candidates meaningfully differ on evidence, and shared risks/gaps.

#### Step 4: Rank with confidence
- Rank on total + evidence strength, noting confidence and what a follow-up could resolve. Keep style at weight 0.

#### Step 5: Route to fairness-gate
- Send the comparison for a consistency/bias audit before any recommendation.

### Output Format
```yaml
# Candidate Comparison — {role}
| Competency | Cand A | Cand B | ... |
|---|---|---|---|
| Technical | x/40 | y/40 | |
...
Ranking + rationale (evidence-based, style weight 0).
```

### Veto Conditions
- Cannot compare candidates assessed with different guides/anchors
- Cannot rank using behavioral style
- Cannot recommend before fairness-gate audit

### Completion Criteria
- Comparability verified
- Side-by-side evidence laid out
- Ranking with confidence produced
- Routed to fairness-gate
