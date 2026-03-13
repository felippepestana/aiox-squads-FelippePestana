# ═══════════════════════════════════════════════════════════════════════════════
# TASK: Create Service
# ID: create-service
# Version: 3.0.0
# Purpose: Scaffold a new service (API endpoint, background service, database
#          service, utility service) with IDS protocol, boilerplate, and tests.
# Agent: @dev (Dex)
# Phase in Pipeline: plan-execute
# ═══════════════════════════════════════════════════════════════════════════════

## Overview

This task scaffolds a new service from scratch using project conventions and
the IDS protocol. It creates the service file, its types, its tests, and
registers it in the appropriate location. Supports multiple service types
and adapts to the project's tech preset.

### Service Types

| Type | Description | Typical Output |
|------|-------------|----------------|
| `api-integration` | External API client/wrapper | Service class + types + tests |
| `utility` | Internal utility/helper service | Module + types + tests |
| `database` | Database access layer | Repository/service + types + migrations |
| `background` | Background job/worker | Worker + queue config + tests |
| `agent-tool` | AIOX agent tool | Tool definition + handler + tests |

---

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| service_name | string | YES | Name of the service (kebab-case) |
| service_type | enum | YES | One of: api-integration, utility, database, background, agent-tool |
| description | string | YES | What the service does (1-2 sentences) |
| target_dir | string | NO | Where to create (default: inferred from type) |

---

## Preconditions

- [ ] Project structure exists (src/ or lib/ directory)
- [ ] Tech preset identified (from core-config.yaml)
- [ ] No existing service with same name at target location
- [ ] Project conventions loaded (technical-preferences.md)

---

## PHASE 0: IDS Protocol — Search Existing

**Checkpoint:** Verified no duplicate service exists.

### Action Items

- [ ] 0.1 — Search for existing services with similar name:
  - Glob: `**/*{service_name}*`
  - Grep: service name variations (camelCase, PascalCase, kebab-case)
- [ ] 0.2 — Search for existing services with similar purpose:
  - Grep for keywords from description
  - Check existing service directories
- [ ] 0.3 — IDS Decision:
  ```
  [IDS] {service_name} → {REUSE|ADAPT|CREATE}
  Reason: {justification}
  Similar found: {list of similar or "none"}
  ```
- [ ] 0.4 — If REUSE: show existing service and HALT
- [ ] 0.5 — If ADAPT: note what to copy and what to change
- [ ] 0.6 — If CREATE: proceed to Phase 1

### Phase 0 Checkpoint

- [ ] IDS search completed
- [ ] Decision logged
- [ ] No duplicates confirmed (or reuse/adapt path chosen)

---

## PHASE 1: Service Design

**Checkpoint:** Service structure planned.

### Action Items

- [ ] 1.1 — Determine target directory based on service type:
  ```yaml
  defaults:
    api-integration: "src/services/" or "src/lib/services/"
    utility: "src/utils/" or "src/lib/"
    database: "src/repositories/" or "src/db/"
    background: "src/workers/" or "src/jobs/"
    agent-tool: ".aiox-core/development/scripts/"
  ```
- [ ] 1.2 — Design the service interface:
  - Public methods/functions
  - Input types
  - Output types
  - Error types
- [ ] 1.3 — Identify dependencies:
  - External packages needed
  - Internal modules to import
  - Configuration required
- [ ] 1.4 — Plan file structure:
  ```
  {target_dir}/
  ├── {service-name}.ts          # Main service
  ├── {service-name}.types.ts    # Type definitions
  ├── {service-name}.test.ts     # Unit tests
  └── {service-name}.config.ts   # Configuration (if needed)
  ```

### Phase 1 Checkpoint

- [ ] Target directory determined
- [ ] Service interface designed
- [ ] Dependencies identified
- [ ] File structure planned

---

## PHASE 2: Scaffold Service

**Checkpoint:** All service files created.

### Action Items

- [ ] 2.1 — Create type definitions file:
  - Input types/interfaces
  - Output types/interfaces
  - Error types
  - Configuration types
  - Export all types

- [ ] 2.2 — Create main service file:
  - Import types
  - Implement service class/module
  - Add JSDoc/TSDoc comments
  - Implement error handling
  - Add logging points
  - Export service

- [ ] 2.3 — Create test file:
  - Import service and types
  - Setup test fixtures/mocks
  - Write tests for each public method:
    - Happy path test
    - Error handling test
    - Edge case test (at least 1)
  - Minimum 3 test cases

- [ ] 2.4 — Create configuration file (if needed):
  - Environment variable mapping
  - Default values
  - Validation

- [ ] 2.5 — Follow project coding standards:
  - Use absolute imports (Constitution Article VI)
  - Follow naming conventions from tech preset
  - Match existing code style

### Phase 2 Checkpoint

- [ ] Service file created with full implementation
- [ ] Types file created with all interfaces
- [ ] Test file created with minimum 3 tests
- [ ] Config file created (if needed)

---

## PHASE 3: Validation

**Checkpoint:** Service is functional and tested.

### Action Items

- [ ] 3.1 — Run lint on new files: must pass with 0 errors
- [ ] 3.2 — Run typecheck: must pass with 0 errors
- [ ] 3.3 — Run tests for the new service: all must pass
- [ ] 3.4 — Run full test suite: no regressions
- [ ] 3.5 — Verify imports resolve correctly

### Phase 3 Checkpoint

- [ ] Lint: 0 errors
- [ ] Typecheck: 0 errors
- [ ] Service tests: all pass
- [ ] Full suite: no regressions

---

## PHASE 4: Registration and Documentation

**Checkpoint:** Service registered and documented.

### Action Items

- [ ] 4.1 — Register service in appropriate index file (if project uses barrel exports)
- [ ] 4.2 — Add JSDoc module documentation at top of service file
- [ ] 4.3 — Display creation summary:
  ```
  Service Created: {service_name}
  Type: {service_type}
  Files:
    - {path/service.ts}
    - {path/service.types.ts}
    - {path/service.test.ts}
  Tests: {N} passing
  Ready for use.
  ```

### Phase 4 Checkpoint

- [ ] Service registered in project
- [ ] Documentation added
- [ ] Summary displayed

---

## Acceptance Criteria

1. Service file created with proper implementation
2. Type definitions file created with all interfaces
3. Test file created with minimum 3 passing tests
4. IDS protocol followed (search before create)
5. Lint and typecheck pass with 0 errors
6. No regressions in existing test suite
7. Service follows project coding standards
8. Absolute imports used (Constitution Article VI)

---

## Output Specification

| Field | Value |
|-------|-------|
| Primary Output | Service files (implementation + types + tests) |
| Secondary Output | Registration in project index (if applicable) |

---

## Dependencies

| Resource | Type | Path |
|----------|------|------|
| Technical Preferences | data | `.aiox-core/data/technical-preferences.md` |
| Core Config | config | `.aiox-core/core-config.yaml` |
| Tech Preset | data | `.aiox-core/data/tech-presets/{active}.md` |

---

## Error Handling

| Error | Action |
|-------|--------|
| Service name already exists | HALT — suggest REUSE or ADAPT |
| Target directory doesn't exist | Create directory |
| Missing dependency | Inform user, ask permission to install |
| Tests fail | Debug, fix, or ask user for clarification |

---

_Task Version: 3.0.0_
_Last Updated: 2026-03-13_
