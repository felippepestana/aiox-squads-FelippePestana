# ===============================================================================
# TASK: Spec Critique
# ID: spec-critique
# Version: 1.0.0
# Purpose: QA critique of a specification/PRD document. Phase 5 of Spec Pipeline.
#          Evaluates completeness, feasibility, constitutional compliance, and
#          ambiguity across multiple dimensions.
# Agent: qa (Quinn)
# Phase in Pipeline: Spec Pipeline Phase 5 (Critique)
# ===============================================================================

## Overview

The Spec Critique is a structured evaluation of a specification document before
implementation begins. It checks for completeness of functional and non-functional
requirements, detects ambiguity, validates constitutional compliance (especially
Article IV: No Invention), and assesses technical feasibility.

Each dimension is scored 1-5, producing a verdict that determines whether the spec
can proceed to implementation planning or needs revision.

---

## Inputs

| Parameter  | Type   | Required | Description                                  |
|-----------|--------|----------|----------------------------------------------|
| spec_file | path   | YES      | Absolute path to the spec/PRD .md file       |

---

## Preconditions

- [ ] Spec file exists and is readable
- [ ] Spec was produced by @pm (Phase 4 of Spec Pipeline)
- [ ] Requirements gathering (Phase 1) has been completed

---

## PHASE 0: Load Context

- [ ] 0.1 -- Read the spec file completely
- [ ] 0.2 -- Extract all functional requirements (FR-*)
- [ ] 0.3 -- Extract all non-functional requirements (NFR-*)
- [ ] 0.4 -- Extract all constraints (CON-*)
- [ ] 0.5 -- Read the Constitution (`.aiox-core/constitution.md`) for compliance reference
- [ ] 0.6 -- If research phase output exists, read `research.json` for evidence baseline

---

## PHASE 1: Functional Requirements Completeness

**Score 1-5: Are all necessary FRs present and well-defined?**

- [ ] 1.1 -- Every user story or use case has corresponding FR(s)
- [ ] 1.2 -- Each FR is specific and testable (no vague requirements)
- [ ] 1.3 -- Each FR has acceptance criteria that can be verified
- [ ] 1.4 -- No implicit requirements left unstated
- [ ] 1.5 -- CRUD operations complete where applicable (not just "create" without "delete")
- [ ] 1.6 -- Error scenarios defined for each FR
- [ ] 1.7 -- Assign score: 1=Missing most FRs, 2=Major gaps, 3=Adequate, 4=Thorough, 5=Exemplary

---

## PHASE 2: NFR Coverage

**Score 1-5: Are non-functional requirements addressed?**

- [ ] 2.1 -- Performance: response times, throughput targets defined
- [ ] 2.2 -- Security: authentication, authorization, data protection specified
- [ ] 2.3 -- Accessibility: WCAG compliance level stated (if UI involved)
- [ ] 2.4 -- Scalability: expected load, growth projections documented
- [ ] 2.5 -- Maintainability: logging, monitoring, deployment considerations
- [ ] 2.6 -- Reliability: uptime targets, failure recovery, data backup
- [ ] 2.7 -- Assign score: 1=No NFRs, 2=Major gaps, 3=Key NFRs covered, 4=Thorough, 5=Exemplary

---

## PHASE 3: Constitutional Compliance

**Score 1-5: Does the spec comply with AIOX Constitution?**

- [ ] 3.1 -- **Article IV (No Invention):** Every feature in the spec traces to a stated requirement (FR-*, NFR-*, CON-*) or research finding. NO invented features.
- [ ] 3.2 -- Check each feature: can you point to the originating requirement? If not, flag it.
- [ ] 3.3 -- **Article I (CLI First):** If applicable, CLI interface is prioritized over UI
- [ ] 3.4 -- **Article III (Story-Driven):** Spec is structured to decompose into stories
- [ ] 3.5 -- **Article V (Quality First):** Quality requirements are explicit, not assumed
- [ ] 3.6 -- Assign score: 1=Multiple violations, 2=Significant gaps, 3=Compliant, 4=Strong, 5=Exemplary

---

## PHASE 4: Technical Feasibility

**Score 1-5: Can this be built with the stated technology and constraints?**

- [ ] 4.1 -- Technology choices are appropriate for the requirements
- [ ] 4.2 -- No contradictory requirements (e.g., "real-time + batch-only")
- [ ] 4.3 -- Integration points are feasible (APIs exist, data formats compatible)
- [ ] 4.4 -- Performance targets are achievable with stated architecture
- [ ] 4.5 -- Constraints do not make implementation impossible
- [ ] 4.6 -- Dependencies are available and maintained
- [ ] 4.7 -- Assign score: 1=Infeasible, 2=Major concerns, 3=Feasible, 4=Well-scoped, 5=Exemplary

---

## PHASE 5: Ambiguity Detection

**Score 1-5: How clear and unambiguous is the spec?**

- [ ] 5.1 -- Search for ambiguous terms: "appropriate", "reasonable", "good", "fast", "user-friendly", "intuitive", "simple", "etc.", "and/or"
- [ ] 5.2 -- Check for missing definitions: are domain terms defined in a glossary?
- [ ] 5.3 -- Check for conflicting statements within the spec
- [ ] 5.4 -- Verify diagrams/examples match text descriptions
- [ ] 5.5 -- Check that "should" vs "must" vs "may" are used consistently (RFC 2119)
- [ ] 5.6 -- Assign score: 1=Highly ambiguous, 2=Multiple unclear areas, 3=Mostly clear, 4=Clear, 5=Precise

---

## PHASE 6: Verdict

- [ ] 6.1 -- Calculate average score across all 5 dimensions
- [ ] 6.2 -- Determine verdict:
  - **APPROVED** (avg >= 4.0): Spec is ready for implementation planning (Phase 6)
  - **NEEDS_REVISION** (avg 3.0-3.9): Spec has gaps that must be addressed. Return to @pm for revision.
  - **BLOCKED** (avg < 3.0): Spec has fundamental issues. Escalate to @architect.
- [ ] 6.3 -- For each dimension scoring < 3: provide specific items that need improvement
- [ ] 6.4 -- Document the critique results

### Output Format

```markdown
## Spec Critique Results

**Spec:** {spec_file}
**Date:** {YYYY-MM-DD}
**Reviewer:** Quinn (QA Agent)

### Dimension Scores

| Dimension                  | Score | Notes                    |
|---------------------------|-------|--------------------------|
| FR Completeness            | X/5   | {summary}               |
| NFR Coverage               | X/5   | {summary}               |
| Constitutional Compliance  | X/5   | {summary}               |
| Technical Feasibility      | X/5   | {summary}               |
| Ambiguity                  | X/5   | {summary}               |
| **Average**                | **X.X/5** |                     |

### Verdict: {APPROVED | NEEDS_REVISION | BLOCKED}

### Required Changes (if not APPROVED)
1. {specific change needed}
2. {specific change needed}

### Observations
- {notable findings}
```

---

## Acceptance Criteria

1. All 5 dimensions scored with justification
2. Average score calculated correctly
3. Verdict matches score thresholds
4. For scores < 3: specific improvement items listed
5. Constitutional compliance checked (especially Article IV)
6. Ambiguous terms identified and flagged

---

## Estimated Time

| Scenario        | Time       |
|-----------------|------------|
| Simple spec     | 8-12 min   |
| Standard spec   | 15-20 min  |
| Complex spec    | 25-35 min  |
