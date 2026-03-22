# ===============================================================================
# TASK: NFR Assessment
# ID: nfr-assess
# Version: 1.0.0
# Purpose: Evaluate non-functional requirements for a story or feature.
#          Covers performance, security, accessibility, scalability, maintainability.
# Agent: qa (Quinn)
# ===============================================================================

## Overview

Assesses non-functional requirements (NFRs) for a story or feature implementation.
Evaluates five NFR dimensions and produces a structured report with findings,
risks, and recommendations.

---

## Inputs

| Parameter    | Type   | Required | Description                                  |
|-------------|--------|----------|----------------------------------------------|
| story_file  | path   | YES      | Absolute path to the story .md file          |

---

## Preconditions

- [ ] Story file exists and is readable
- [ ] Implementation code is available for review

---

## PHASE 0: Context Loading

- [ ] 0.1 -- Read the story file and extract technical notes, constraints, NFR references
- [ ] 0.2 -- Run `git diff main...HEAD` to identify changed files
- [ ] 0.3 -- Read all changed files to understand the implementation

---

## PHASE 1: Performance Assessment

- [ ] 1.1 -- Identify critical paths (API endpoints, data flows, user interactions)
- [ ] 1.2 -- Check for N+1 query patterns
- [ ] 1.3 -- Verify pagination on list endpoints
- [ ] 1.4 -- Check for unbounded loops or recursive operations
- [ ] 1.5 -- Verify caching strategies where appropriate
- [ ] 1.6 -- Check bundle size impact (frontend changes)
- [ ] 1.7 -- Identify blocking operations on critical paths
- [ ] 1.8 -- Rate: LOW RISK / MEDIUM RISK / HIGH RISK

---

## PHASE 2: Security Assessment

- [ ] 2.1 -- Input validation at all entry points
- [ ] 2.2 -- Authentication checks on protected resources
- [ ] 2.3 -- Authorization checks (role-based access)
- [ ] 2.4 -- No hardcoded secrets or credentials
- [ ] 2.5 -- Sensitive data encrypted at rest and in transit
- [ ] 2.6 -- CSRF protection on state-changing operations
- [ ] 2.7 -- Content Security Policy headers (if serving HTML)
- [ ] 2.8 -- Rate: LOW RISK / MEDIUM RISK / HIGH RISK

---

## PHASE 3: Accessibility Assessment

- [ ] 3.1 -- Semantic HTML elements used correctly
- [ ] 3.2 -- ARIA labels on interactive elements
- [ ] 3.3 -- Keyboard navigation supported
- [ ] 3.4 -- Color contrast meets WCAG AA minimums
- [ ] 3.5 -- Screen reader compatibility considered
- [ ] 3.6 -- Focus management on dynamic content
- [ ] 3.7 -- Rate: LOW RISK / MEDIUM RISK / HIGH RISK
- [ ] 3.8 -- If no UI changes: mark as N/A

---

## PHASE 4: Scalability Assessment

- [ ] 4.1 -- Database queries efficient under load (indexed, paginated)
- [ ] 4.2 -- Stateless design where possible (for horizontal scaling)
- [ ] 4.3 -- External API calls have timeouts and circuit breakers
- [ ] 4.4 -- File/blob storage separated from application server
- [ ] 4.5 -- Background job processing for long-running tasks
- [ ] 4.6 -- Rate: LOW RISK / MEDIUM RISK / HIGH RISK

---

## PHASE 5: Maintainability Assessment

- [ ] 5.1 -- Logging at appropriate levels (error, warn, info, debug)
- [ ] 5.2 -- Error messages actionable for debugging
- [ ] 5.3 -- Configuration externalized (env vars, config files)
- [ ] 5.4 -- Feature flags for gradual rollout (if applicable)
- [ ] 5.5 -- Code modularity (can components be replaced independently?)
- [ ] 5.6 -- Test coverage adequate for future refactoring confidence
- [ ] 5.7 -- Rate: LOW RISK / MEDIUM RISK / HIGH RISK

---

## PHASE 6: Report

- [ ] 6.1 -- Compile findings across all dimensions
- [ ] 6.2 -- Calculate overall NFR risk level
- [ ] 6.3 -- Provide recommendations prioritized by risk

### Output Format

```markdown
## NFR Assessment: {story_id}

**Date:** {YYYY-MM-DD}
**Reviewer:** Quinn (QA Agent)

### Assessment Summary

| Dimension       | Risk Level  | Key Finding                  |
|----------------|-------------|------------------------------|
| Performance     | LOW/MED/HIGH | {summary}                   |
| Security        | LOW/MED/HIGH | {summary}                   |
| Accessibility   | LOW/MED/HIGH/N/A | {summary}              |
| Scalability     | LOW/MED/HIGH | {summary}                   |
| Maintainability | LOW/MED/HIGH | {summary}                   |

**Overall NFR Risk:** {LOW / MEDIUM / HIGH}

### Findings
{detailed findings per dimension}

### Recommendations
1. {prioritized recommendation}
2. {prioritized recommendation}
```

---

## Acceptance Criteria

1. All 5 NFR dimensions assessed with risk rating
2. Each dimension has specific findings documented
3. Overall risk level determined
4. Recommendations provided and prioritized
5. N/A dimensions justified (e.g., no UI = no accessibility)

---

## Estimated Time

| Scenario           | Time      |
|--------------------|-----------|
| Small change       | 5-8 min   |
| Medium feature     | 10-15 min |
| Large feature      | 15-25 min |
