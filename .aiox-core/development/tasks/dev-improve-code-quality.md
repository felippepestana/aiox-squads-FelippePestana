# ═══════════════════════════════════════════════════════════════════════════════
# TASK: Improve Code Quality
# ID: dev-improve-code-quality
# Version: 3.0.0
# Purpose: Analyze and improve code quality in existing codebase — lint fixes,
#          type safety, dead code removal, naming conventions, consistency.
# Agent: @dev (Dex)
# Phase in Pipeline: general
# ═══════════════════════════════════════════════════════════════════════════════

## Overview

This task performs a structured code quality improvement pass on the codebase
or a specific set of files. It addresses lint errors, type safety gaps, dead
code, naming inconsistencies, and code organization issues. Unlike a story
implementation, this task is scope-flexible and can target the entire project
or specific directories.

### Scope Options

- **Full project**: Analyze all source files
- **Directory**: Analyze specific directory (e.g., `src/components/`)
- **File list**: Analyze specific files
- **Story files**: Analyze files from a story's File List

---

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| target | string | YES | Path to analyze: directory, file, or "all" |
| focus | enum | NO | Focus area: lint, types, dead-code, naming, all (default: all) |
| auto_fix | boolean | NO | Auto-apply safe fixes (default: true) |

---

## Preconditions

- [ ] Target path exists and contains source files
- [ ] Project dependencies installed (lint/typecheck tools available)
- [ ] No unrelated uncommitted changes in working tree

---

## PHASE 0: Quality Assessment

**Checkpoint:** Baseline quality metrics captured.

### Action Items

- [ ] 0.1 — Run `npm run lint` and capture all errors and warnings
- [ ] 0.2 — Run `npm run typecheck` and capture all type errors
- [ ] 0.3 — Count total issues by category:
  ```yaml
  baseline:
    lint_errors: N
    lint_warnings: N
    type_errors: N
    dead_code_candidates: N  # estimated from grep for unused exports
    naming_issues: N  # estimated from pattern analysis
  ```
- [ ] 0.4 — Identify top files by issue count (focus effort)
- [ ] 0.5 — Check `.aiox-core/data/technical-preferences.md` for project conventions

### Phase 0 Checkpoint

- [ ] Baseline metrics captured
- [ ] Problem files identified
- [ ] Project conventions loaded

---

## PHASE 1: Lint Fixes

**Checkpoint:** All lint errors resolved, warnings minimized.

### Action Items

- [ ] 1.1 — Run auto-fix: `npm run lint -- --fix` (safe auto-corrections)
- [ ] 1.2 — Review remaining lint errors that require manual intervention
- [ ] 1.3 — Fix each manual lint error:
  - Unused imports: remove them
  - Missing dependencies in hooks: add or restructure
  - Incorrect patterns: refactor to correct pattern
  - Style violations: align with project conventions
- [ ] 1.4 — Address lint warnings (priority order):
  - `no-explicit-any`: add proper types
  - `no-unused-vars`: remove or mark as intentional (prefix with `_`)
  - Complexity warnings: consider refactoring complex functions
- [ ] 1.5 — Re-run lint to verify 0 errors remain

### Phase 1 Checkpoint

- [ ] Lint errors: 0
- [ ] Lint warnings: reduced by at least 50%

---

## PHASE 2: Type Safety Improvements

**Checkpoint:** Type errors resolved, explicit types added to critical paths.

### Action Items

- [ ] 2.1 — Fix all TypeScript/type errors from Phase 0 assessment
- [ ] 2.2 — Replace `any` types with proper type definitions:
  - Function parameters: add explicit types
  - Return types: add explicit return types to exported functions
  - API responses: define proper interfaces
  - Event handlers: use correct event types
- [ ] 2.3 — Add missing type exports for shared interfaces
- [ ] 2.4 — Verify generic types are properly constrained
- [ ] 2.5 — Re-run typecheck to verify 0 errors remain

### Phase 2 Checkpoint

- [ ] Type errors: 0
- [ ] `any` types reduced (count before vs after)
- [ ] Key interfaces properly typed

---

## PHASE 3: Dead Code Removal

**Checkpoint:** Unused code identified and removed safely.

### Action Items

- [ ] 3.1 — Search for unused exports:
  - Grep for `export` declarations
  - For each export, search for imports across the codebase
  - If no imports found: candidate for removal
- [ ] 3.2 — Search for unused local variables and functions
- [ ] 3.3 — Identify commented-out code blocks (>5 lines)
- [ ] 3.4 — For each candidate:
  - Verify it is truly unused (not dynamically imported)
  - Remove if confirmed unused
  - If uncertain: add `// TODO: verify usage` comment
- [ ] 3.5 — Remove empty files (0 exports, 0 meaningful code)
- [ ] 3.6 — Run tests after removals to ensure nothing broke

### Phase 3 Checkpoint

- [ ] Dead code candidates reviewed
- [ ] Confirmed dead code removed
- [ ] Tests still pass after removal

---

## PHASE 4: Naming and Consistency

**Checkpoint:** Naming conventions consistent across codebase.

### Action Items

- [ ] 4.1 — Verify naming conventions match project standards:
  - Components: PascalCase
  - Functions/hooks: camelCase
  - Constants: UPPER_SNAKE_CASE
  - Files: kebab-case (or match framework convention)
  - Types/Interfaces: PascalCase with prefix convention
- [ ] 4.2 — Fix inconsistent names (rename with refactoring tools)
- [ ] 4.3 — Verify import organization:
  - External imports first
  - Internal imports second
  - Relative imports last
  - Alphabetical within groups
- [ ] 4.4 — Standardize file structure patterns across similar files

### Phase 4 Checkpoint

- [ ] Naming conventions consistent
- [ ] Import organization standardized

---

## PHASE 5: Final Validation

**Checkpoint:** All improvements validated, no regressions.

### Action Items

- [ ] 5.1 — Run full lint check: 0 errors expected
- [ ] 5.2 — Run full typecheck: 0 errors expected
- [ ] 5.3 — Run full test suite: all tests must pass
- [ ] 5.4 — Compare final metrics against baseline:
  ```yaml
  improvement:
    lint_errors: {before} -> {after}
    lint_warnings: {before} -> {after}
    type_errors: {before} -> {after}
    dead_code_removed: N files/functions
    naming_fixes: N items
  ```
- [ ] 5.5 — Display improvement summary

### Phase 5 Checkpoint

- [ ] Lint: 0 errors
- [ ] Typecheck: 0 errors
- [ ] All tests pass
- [ ] Improvement metrics documented

---

## Acceptance Criteria

1. Lint errors reduced to 0
2. Type errors reduced to 0
3. Dead code identified and removed safely
4. No regressions introduced (all tests pass)
5. Improvement metrics documented (before vs after)

---

## Output Specification

| Field | Value |
|-------|-------|
| Primary Output | Improved source code |
| Secondary Output | Quality improvement report with metrics |

---

## Dependencies

| Resource | Type | Path |
|----------|------|------|
| Technical Preferences | data | `.aiox-core/data/technical-preferences.md` |
| Core Config | config | `.aiox-core/core-config.yaml` |

---

## Error Handling

| Error | Action |
|-------|--------|
| Lint auto-fix breaks code | Revert auto-fix, apply manually |
| Type fix causes cascade | Fix root type, propagate changes |
| Dead code removal breaks import | Restore and verify usage path |
| Tests fail after changes | Revert batch, apply one at a time |

---

_Task Version: 3.0.0_
_Last Updated: 2026-03-13_
