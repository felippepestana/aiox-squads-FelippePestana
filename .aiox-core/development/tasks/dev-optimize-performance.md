# ═══════════════════════════════════════════════════════════════════════════════
# TASK: Optimize Performance
# ID: dev-optimize-performance
# Version: 3.0.0
# Purpose: Analyze and optimize performance in the codebase — identify
#          bottlenecks, apply optimizations, measure improvements.
# Agent: @dev (Dex)
# Phase in Pipeline: general
# ═══════════════════════════════════════════════════════════════════════════════

## Overview

This task performs a systematic performance analysis and optimization pass.
It profiles the application, identifies bottlenecks, applies targeted
optimizations, and measures the improvement. Every optimization must be
measurable — no speculative performance improvements.

### Principle

**Measure first, optimize second, measure again.**

No optimization is applied without a before/after measurement. Premature
optimization is actively avoided.

---

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| target | string | YES | What to optimize: "bundle", "runtime", "api", "database", "all" |
| scope | string | NO | Specific files/routes to focus on |
| budget | string | NO | Performance budget target (e.g., "LCP < 2.5s", "API < 200ms") |

---

## Preconditions

- [ ] Application is buildable and runnable
- [ ] Performance measurement tools are available (or can be installed)
- [ ] Baseline measurements can be taken (app is in a working state)

---

## PHASE 0: Baseline Measurement

**Checkpoint:** Performance baseline captured with specific numbers.

### Action Items

- [ ] 0.1 — Identify performance measurement approach for the target:
  ```yaml
  measurement_tools:
    bundle:
      - "npm run build" (output size)
      - "npx webpack-bundle-analyzer" or equivalent
      - Bundle size in KB per chunk
    runtime:
      - Browser DevTools Performance tab
      - React DevTools Profiler
      - Core Web Vitals (LCP, FID, CLS)
    api:
      - Response time measurement (Date.now() or performance.now())
      - Request count per page load
      - Payload sizes
    database:
      - Query execution time
      - Number of queries per operation
      - Index usage analysis (EXPLAIN)
  ```
- [ ] 0.2 — Run baseline measurements and record:
  ```yaml
  baseline:
    timestamp: "{ISO timestamp}"
    target: "{target}"
    metrics:
      - name: "{metric name}"
        value: "{number with unit}"
        context: "{how measured}"
  ```
- [ ] 0.3 — Identify the top 3-5 bottlenecks from baseline data
- [ ] 0.4 — Rank bottlenecks by impact (biggest improvement potential first)

### Phase 0 Checkpoint

- [ ] Baseline metrics captured with numbers
- [ ] Top bottlenecks identified and ranked
- [ ] Measurement methodology documented (reproducible)

---

## PHASE 1: Analysis and Plan

**Checkpoint:** Optimization plan created with expected impact per item.

### Action Items

- [ ] 1.1 — For EACH bottleneck, identify the root cause:
  ```yaml
  bottleneck:
    id: "PERF-001"
    location: "file:line or route or query"
    root_cause: "Why this is slow"
    current_metric: "200ms / 500KB / etc"
    target_metric: "50ms / 100KB / etc"
    optimization_approach: "What to do"
    risk: "LOW|MEDIUM|HIGH"
    effort: "minutes|hours|days"
  ```
- [ ] 1.2 — Categorize optimizations:
  ```yaml
  categories:
    quick_wins:  # Low effort, high impact
      - description: "..."
    significant: # Medium effort, high impact
      - description: "..."
    deferred:    # High effort or low impact
      - description: "..."
  ```
- [ ] 1.3 — Create optimization order: quick wins first, then significant
- [ ] 1.4 — Estimate total expected improvement

### Phase 1 Checkpoint

- [ ] Every bottleneck has root cause analysis
- [ ] Optimizations categorized and prioritized
- [ ] Expected improvements estimated

---

## PHASE 2: Apply Optimizations

**Checkpoint:** All planned optimizations applied.

### Action Items

Apply optimizations one at a time, measuring after each:

- [ ] 2.1 — **Bundle optimizations** (if target includes bundle):
  - Dynamic imports / code splitting for large modules
  - Tree shaking verification (no side-effect imports)
  - Image optimization (proper formats, sizing, lazy loading)
  - Remove unused dependencies from package.json
  - Minification verification

- [ ] 2.2 — **Runtime optimizations** (if target includes runtime):
  - React.memo / useMemo / useCallback for expensive renders
  - Virtualization for long lists
  - Debounce/throttle for frequent event handlers
  - Reduce re-renders (check component boundaries)
  - Lazy loading for below-fold content

- [ ] 2.3 — **API optimizations** (if target includes api):
  - Reduce redundant API calls (caching, deduplication)
  - Batch requests where possible
  - Optimize payload size (select only needed fields)
  - Add proper cache headers
  - Connection pooling for database-backed APIs

- [ ] 2.4 — **Database optimizations** (if target includes database):
  - Add missing indexes (based on EXPLAIN analysis)
  - Optimize N+1 queries (use joins or batch loading)
  - Reduce query complexity
  - Add query result caching where appropriate
  - Optimize schema for read patterns

- [ ] 2.5 — After EACH optimization:
  - Run tests to verify no regression
  - Measure the specific metric being optimized
  - Log: `[PERF] PERF-{id}: {metric} {before} -> {after} ({improvement%})`

### Phase 2 Checkpoint

- [ ] All planned optimizations applied
- [ ] Each optimization measured individually
- [ ] No regressions from optimizations
- [ ] Tests still passing

---

## PHASE 3: Final Measurement

**Checkpoint:** Final metrics captured, improvement quantified.

### Action Items

- [ ] 3.1 — Run the same measurement methodology from Phase 0
- [ ] 3.2 — Compare final vs baseline:
  ```yaml
  results:
    target: "{target}"
    improvements:
      - metric: "{name}"
        baseline: "{value}"
        final: "{value}"
        improvement: "{percentage or absolute}"
    total_improvement: "{summary}"
    budget_met: true|false
  ```
- [ ] 3.3 — Verify performance budget is met (if specified)
- [ ] 3.4 — Run full test suite one final time
- [ ] 3.5 — Display performance improvement report

### Phase 3 Checkpoint

- [ ] Final metrics captured
- [ ] Improvement quantified with numbers
- [ ] Performance budget status reported
- [ ] All tests pass

---

## Acceptance Criteria

1. Baseline metrics captured before any changes
2. At least 1 measurable performance improvement achieved
3. Every optimization has before/after measurement
4. No regressions introduced (all tests pass)
5. Final metrics documented and compared to baseline
6. Performance budget met (if specified) or gap documented

---

## Output Specification

| Field | Value |
|-------|-------|
| Primary Output | Optimized source code |
| Secondary Output | Performance improvement report with before/after metrics |

---

## Dependencies

| Resource | Type | Path |
|----------|------|------|
| Technical Preferences | data | `.aiox-core/data/technical-preferences.md` |

---

## Error Handling

| Error | Action |
|-------|--------|
| Cannot measure baseline | Identify alternative measurement approach |
| Optimization causes regression | Revert immediately, log and skip |
| No measurable improvement | Document finding, move to next bottleneck |
| Build breaks after optimization | Revert, investigate build system interaction |

---

_Task Version: 3.0.0_
_Last Updated: 2026-03-13_
