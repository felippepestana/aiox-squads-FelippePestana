# Task: Review Proposal

**Task ID:** review-proposal
**Purpose:** QA review of a design proposal or technical proposal before implementation
**Agent:** @qa (Quinn)

---

## Overview

Evaluates a technical proposal (architecture proposal, API design, database schema, etc.) for quality, completeness, and risk before it moves to implementation.

## Steps

- [ ] 1 — Read the proposal document
- [ ] 2 — Check completeness:
  - [ ] Problem statement clear?
  - [ ] Solution described with sufficient detail?
  - [ ] Alternatives considered?
  - [ ] Trade-offs documented?
  - [ ] Risks identified?
- [ ] 3 — Check quality:
  - [ ] No missing edge cases in design?
  - [ ] Security implications considered?
  - [ ] Performance implications considered?
  - [ ] Backwards compatibility handled?
- [ ] 4 — Check consistency:
  - [ ] Consistent with existing architecture?
  - [ ] Consistent with Constitution and AIOX principles?
  - [ ] No contradiction with existing approved designs?
- [ ] 5 — Score (1-10) and verdict: APPROVED | NEEDS_REVISION | REJECTED

## Output

```
📋 Proposal Review: {proposal_name}
Score: {N}/10
Verdict: APPROVED | NEEDS_REVISION | REJECTED

Strengths:
  - {list}

Issues:
  CRITICAL: {list if any}
  MAJOR: {list if any}
  MINOR: {list if any}
```

---
_Task Version: 3.0 | Last Updated: 2026-03-13_
