# ===============================================================================
# TASK: Test Design
# ID: test-design
# Version: 1.0.0
# Purpose: Design a comprehensive test plan for a story or feature.
#          Creates unit tests, integration tests, e2e scenarios, and edge cases.
# Agent: qa (Quinn)
# ===============================================================================

## Overview

Designs a test strategy for a story before or during implementation. Produces
test scenarios organized by type (unit, integration, e2e) with Given-When-Then
format for each scenario. This plan guides @dev in writing actual test code.

---

## Inputs

| Parameter    | Type   | Required | Description                                  |
|-------------|--------|----------|----------------------------------------------|
| story_file  | path   | YES      | Absolute path to the story .md file          |

---

## Preconditions

- [ ] Story file exists and has acceptance criteria
- [ ] Technical approach is understood (from story technical notes or architecture docs)

---

## PHASE 0: Context Loading

- [ ] 0.1 -- Read the story file. Extract AC items, technical notes, constraints.
- [ ] 0.2 -- Identify the tech stack and testing frameworks in use
- [ ] 0.3 -- Read existing test files to understand current patterns and conventions
- [ ] 0.4 -- Identify what code will be created/modified (from File List or technical notes)

---

## PHASE 1: Requirements Mapping

- [ ] 1.1 -- For each AC item, create a requirements trace:
  - AC-{n} maps to test scenario(s) TS-{n}.{m}
- [ ] 1.2 -- Identify requirements not covered by AC that still need testing
- [ ] 1.3 -- Identify shared setup/fixtures needed across scenarios

---

## PHASE 2: Unit Test Scenarios

- [ ] 2.1 -- For each function/module being created or modified:
  - Happy path: expected inputs produce expected outputs
  - Error path: invalid inputs produce proper errors
  - Boundary: edge values handled correctly
- [ ] 2.2 -- Format each scenario as Given-When-Then:
  ```
  TS-1.1: {description}
  Given: {precondition}
  When: {action}
  Then: {expected result}
  ```
- [ ] 2.3 -- Identify mocks/stubs needed for external dependencies
- [ ] 2.4 -- Estimate test count per module

---

## PHASE 3: Integration Test Scenarios

- [ ] 3.1 -- Identify integration points (API to DB, frontend to API, service to service)
- [ ] 3.2 -- For each integration point:
  - Data flows correctly end-to-end
  - Error propagation works across boundaries
  - Authentication/authorization enforced at integration level
- [ ] 3.3 -- Format as Given-When-Then with integration context
- [ ] 3.4 -- Identify test data requirements (seeds, fixtures)

---

## PHASE 4: E2E Test Scenarios

- [ ] 4.1 -- Identify critical user journeys affected by this story
- [ ] 4.2 -- For each journey:
  - Complete happy path flow
  - Key error scenarios
  - Browser-specific concerns (if UI)
- [ ] 4.3 -- Format as step-by-step user actions with expected outcomes
- [ ] 4.4 -- Note which scenarios need browser automation vs manual testing

---

## PHASE 5: Edge Cases and Negative Tests

- [ ] 5.1 -- Empty/null inputs
- [ ] 5.2 -- Maximum length strings, large numbers
- [ ] 5.3 -- Special characters, Unicode, emoji
- [ ] 5.4 -- Concurrent operations (race conditions)
- [ ] 5.5 -- Network failures, timeouts
- [ ] 5.6 -- Permission boundaries (accessing resources without authorization)
- [ ] 5.7 -- Data corruption scenarios (partial saves, interrupted operations)

---

## PHASE 6: Test Plan Document

- [ ] 6.1 -- Compile all scenarios into organized document
- [ ] 6.2 -- Prioritize scenarios (P1: must have, P2: should have, P3: nice to have)
- [ ] 6.3 -- Estimate total test count and implementation time

### Output Format

```markdown
## Test Plan: {story_id}

**Date:** {YYYY-MM-DD}
**Designer:** Quinn (QA Agent)
**Total Scenarios:** {count} (Unit: {n}, Integration: {n}, E2E: {n}, Edge: {n})

### Requirements Traceability
| AC # | Test Scenarios | Priority |
|------|---------------|----------|
| AC-1 | TS-1.1, TS-1.2 | P1 |

### Unit Tests
#### Module: {module_name}
**TS-1.1: {title}**
- Given: {precondition}
- When: {action}
- Then: {expected result}
- Priority: P1/P2/P3

### Integration Tests
{scenarios}

### E2E Tests
{scenarios}

### Edge Cases
{scenarios}

### Test Data Requirements
- {fixtures, seeds, mocks needed}

### Estimated Effort
- Unit tests: {n} scenarios, ~{time}
- Integration tests: {n} scenarios, ~{time}
- E2E tests: {n} scenarios, ~{time}
```

---

## Acceptance Criteria

1. Every AC item traced to at least one test scenario
2. Unit, integration, and e2e categories covered
3. Edge cases identified and documented
4. Given-When-Then format used for all scenarios
5. Priorities assigned (P1/P2/P3)
6. Test data requirements documented

---

## Estimated Time

| Scenario              | Time       |
|-----------------------|------------|
| Simple story (1-3 AC) | 8-12 min   |
| Medium story (4-8 AC) | 15-20 min  |
| Complex story (9+ AC) | 25-35 min  |
