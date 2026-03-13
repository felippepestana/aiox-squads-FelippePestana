# ===============================================================================
# TASK: False Positive Detection
# ID: qa-false-positive-detection
# Version: 1.0.0
# Purpose: Identify false positives in QA results -- things that look like
#          failures but are not real issues. Critical thinking verification.
# Agent: qa (Quinn)
# ===============================================================================

## Overview

Reviews QA findings from previous reviews to identify false positives -- issues
that were flagged as problems but are actually correct behavior, acceptable
patterns, or environmental artifacts. This task prevents unnecessary fix cycles
and maintains QA credibility.

---

## Inputs

| Parameter     | Type   | Required | Description                                  |
|--------------|--------|----------|----------------------------------------------|
| story_file   | path   | YES      | Absolute path to the story .md file          |
| qa_report    | object | NO       | Previous QA findings to re-evaluate          |

---

## Preconditions

- [ ] A QA review has been performed (qa-gate or qa-review-story)
- [ ] Issues were identified that need verification
- [ ] @dev has challenged specific findings (optional trigger)

---

## PHASE 0: Load Previous Findings

- [ ] 0.1 -- Read the story file and extract QA Results section
- [ ] 0.2 -- List all issues found in the previous review
- [ ] 0.3 -- Understand the context of each finding

---

## PHASE 1: False Positive Checks

For EACH finding from the previous review:

- [ ] 1.1 -- **Intentional Pattern Check**: Is this a deliberate design decision?
  - Read surrounding code comments
  - Check if the pattern is used elsewhere in the codebase
  - Look for documentation explaining the approach
- [ ] 1.2 -- **Framework Convention Check**: Is this how the framework works?
  - Is the "issue" actually the recommended pattern for the tech stack?
  - Does the framework documentation endorse this approach?
- [ ] 1.3 -- **Environment Artifact Check**: Is this caused by dev environment only?
  - Would this occur in production?
  - Is it a testing tool artifact?
- [ ] 1.4 -- **Context Misunderstanding Check**: Did QA miss context?
  - Re-read the AC -- does it actually require what was flagged?
  - Is the scope of the finding within this story?
- [ ] 1.5 -- **Severity Reassessment**: Even if valid, is the severity correct?
  - Could a CRITICAL be downgraded to MINOR?
  - Is the impact as bad as initially assessed?

---

## PHASE 2: Verdict Per Finding

For each finding, assign a new status:

| Status | Meaning |
|--------|---------|
| CONFIRMED | Finding is valid, severity is correct |
| DOWNGRADED | Finding is valid but severity was too high |
| FALSE_POSITIVE | Finding is not a real issue |
| DEFERRED | Finding is valid but out of scope for this story |

---

## PHASE 3: Report

### Output Format

```markdown
## False Positive Analysis: {story_id}

**Date:** {YYYY-MM-DD}
**Analyst:** Quinn (QA Agent)

### Re-evaluation Summary

| Original # | Original Severity | Finding | New Status | Reason |
|------------|-------------------|---------|------------|--------|
| 1 | CRITICAL | {desc} | CONFIRMED/FALSE_POSITIVE | {reason} |

### Summary

| Status | Count |
|--------|-------|
| CONFIRMED | {n} |
| DOWNGRADED | {n} |
| FALSE_POSITIVE | {n} |
| DEFERRED | {n} |

### Revised Verdict
Based on re-evaluation, the effective findings are:
- CRITICAL: {n} (was {n})
- MAJOR: {n} (was {n})
- MINOR: {n} (was {n})

**Revised Verdict:** {PASS | NEEDS_WORK | FAIL}
```

---

## Acceptance Criteria

1. Every previous finding re-evaluated
2. Each finding assigned a new status with justification
3. False positives clearly explained
4. Revised verdict calculated based on confirmed findings only
5. No valid findings dismissed without strong justification

---

## Estimated Time

| Scenario           | Time      |
|--------------------|-----------|
| 1-5 findings       | 5-8 min   |
| 6-15 findings      | 10-15 min |
| 16+ findings       | 15-25 min |
