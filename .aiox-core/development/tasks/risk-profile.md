# ===============================================================================
# TASK: Risk Profile
# ID: risk-profile
# Version: 1.0.0
# Purpose: Create a risk profile for a feature or story. Identify technical,
#          security, and regression risks with mitigation and rollback plans.
# Agent: qa (Quinn)
# ===============================================================================

## Overview

Produces a structured risk assessment for a story or feature. Evaluates technical
risks, security risks, regression risks, and operational risks. Each risk is
scored by probability and impact, producing a prioritized risk matrix with
mitigation strategies and a rollback plan.

---

## Inputs

| Parameter    | Type   | Required | Description                                  |
|-------------|--------|----------|----------------------------------------------|
| story_file  | path   | YES      | Absolute path to the story .md file          |

---

## Preconditions

- [ ] Story file exists with acceptance criteria and technical notes
- [ ] Architecture context is available (tech stack, dependencies)

---

## PHASE 0: Context Loading

- [ ] 0.1 -- Read the story file completely
- [ ] 0.2 -- Identify the scope of changes (files, modules, layers affected)
- [ ] 0.3 -- Read technical preferences and architecture docs if available
- [ ] 0.4 -- Check for dependencies on external services or APIs

---

## PHASE 1: Technical Risks

- [ ] 1.1 -- **Complexity risk**: Is the implementation complex? Many moving parts?
- [ ] 1.2 -- **Integration risk**: Does this connect to external APIs, databases, or services?
- [ ] 1.3 -- **Dependency risk**: Are new libraries being introduced? Are they stable?
- [ ] 1.4 -- **Data migration risk**: Are schema changes involved? Is data at risk?
- [ ] 1.5 -- **Performance risk**: Could this degrade response times or increase resource usage?
- [ ] 1.6 -- For each risk: assign Probability (1-5) and Impact (1-5)

---

## PHASE 2: Security Risks

- [ ] 2.1 -- **Authentication risk**: Does this change auth flows?
- [ ] 2.2 -- **Data exposure risk**: Could this leak sensitive data?
- [ ] 2.3 -- **Injection risk**: Does this accept user input that reaches DB or commands?
- [ ] 2.4 -- **Privilege escalation risk**: Could this allow unauthorized access?
- [ ] 2.5 -- For each risk: assign Probability (1-5) and Impact (1-5)

---

## PHASE 3: Regression Risks

- [ ] 3.1 -- **Shared module risk**: Are shared components being modified?
- [ ] 3.2 -- **Database schema risk**: Do schema changes affect other features?
- [ ] 3.3 -- **API contract risk**: Do API changes break existing consumers?
- [ ] 3.4 -- **Configuration risk**: Do config changes affect other environments?
- [ ] 3.5 -- For each risk: assign Probability (1-5) and Impact (1-5)

---

## PHASE 4: Operational Risks

- [ ] 4.1 -- **Deployment risk**: Does this require special deployment steps?
- [ ] 4.2 -- **Monitoring risk**: Will existing monitoring catch issues?
- [ ] 4.3 -- **Rollback risk**: Can this be rolled back cleanly?
- [ ] 4.4 -- **Data consistency risk**: Could partial deployment leave data inconsistent?
- [ ] 4.5 -- For each risk: assign Probability (1-5) and Impact (1-5)

---

## PHASE 5: Risk Matrix and Mitigation

- [ ] 5.1 -- Build risk matrix: Risk Score = Probability x Impact
- [ ] 5.2 -- Classify risks: LOW (1-6), MEDIUM (7-14), HIGH (15-25)
- [ ] 5.3 -- For each MEDIUM and HIGH risk: define mitigation strategy
- [ ] 5.4 -- Define rollback plan: steps to undo this change if needed

### Output Format

```markdown
## Risk Profile: {story_id}

**Date:** {YYYY-MM-DD}
**Analyst:** Quinn (QA Agent)

### Risk Matrix

| # | Risk | Category | Probability | Impact | Score | Level |
|---|------|----------|-------------|--------|-------|-------|
| R1 | {description} | Technical | 3 | 4 | 12 | MEDIUM |

### Risk Summary

| Level | Count |
|-------|-------|
| HIGH  | {n}   |
| MEDIUM | {n}  |
| LOW   | {n}   |

**Overall Risk Level:** {LOW | MEDIUM | HIGH}

### Mitigation Strategies

| Risk | Mitigation |
|------|-----------|
| R1   | {strategy} |

### Rollback Plan

1. {step to undo changes}
2. {step to verify rollback}
3. {step to communicate rollback}

### Recommendations
- {testing focus areas based on risks}
- {monitoring recommendations}
```

---

## Acceptance Criteria

1. All four risk categories evaluated (technical, security, regression, operational)
2. Each risk scored by probability and impact
3. Risk matrix generated with levels
4. Mitigation strategies for MEDIUM and HIGH risks
5. Rollback plan documented
6. Overall risk level determined

---

## Estimated Time

| Scenario           | Time      |
|--------------------|-----------|
| Simple story       | 5-8 min   |
| Medium story       | 10-15 min |
| Complex story      | 15-20 min |
