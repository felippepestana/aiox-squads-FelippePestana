# ═══════════════════════════════════════════════════════════════════════════════
# TASK: Suggest Refactoring
# ID: dev-suggest-refactoring
# Version: 3.0.0
# Purpose: Analyze codebase and suggest refactoring opportunities with risk
#          assessment, priority ranking, and effort estimation. DOES NOT
#          implement — only recommends.
# Agent: @dev (Dex)
# Phase in Pipeline: general
# ═══════════════════════════════════════════════════════════════════════════════

## Overview

This is an ANALYSIS-ONLY task. It examines the codebase for refactoring
opportunities, categorizes them by type and risk, estimates effort, and
produces a prioritized refactoring backlog. No code changes are made.

The output serves as input for the @po agent to create refactoring stories,
or for the @dev agent to schedule targeted improvements.

### Key Principle

**Suggest, don't implement.** This task produces a report, not code changes.
Each suggestion includes enough context for someone to create a story from it.

---

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| target | string | YES | Path to analyze: directory, file, or "all" |
| depth | enum | NO | Analysis depth: quick, standard, deep (default: standard) |
| focus | string | NO | Focus area: "duplication", "complexity", "patterns", "all" |

---

## Preconditions

- [ ] Target path exists and contains source files
- [ ] Sufficient codebase to analyze (not empty project)

---

## PHASE 0: Codebase Survey

**Checkpoint:** Codebase structure understood.

### Action Items

- [ ] 0.1 — Map directory structure and file count per directory
- [ ] 0.2 — Identify primary patterns in use (architectural, design, naming)
- [ ] 0.3 — Load technical-preferences.md for project conventions
- [ ] 0.4 — Note the technology stack (framework, libraries, tools)
- [ ] 0.5 — Count total files, total lines of code (estimated)

### Phase 0 Checkpoint

- [ ] Directory map created
- [ ] Tech stack identified
- [ ] Scale of codebase understood

---

## PHASE 1: Pattern Analysis

**Checkpoint:** Refactoring candidates identified.

### Action Items

- [ ] 1.1 — **Code Duplication Detection**:
  - Search for similar function bodies (>10 lines repeated)
  - Search for similar component structures
  - Search for copy-pasted utility functions
  - Flag: files with >30% similarity

- [ ] 1.2 — **Complexity Analysis**:
  - Identify functions with deep nesting (>4 levels)
  - Identify functions with many parameters (>5)
  - Identify files that are too long (>500 lines)
  - Identify components with too many responsibilities

- [ ] 1.3 — **Pattern Inconsistency**:
  - Mixed patterns for same problem (e.g., some fetch + some axios)
  - Inconsistent error handling strategies
  - Mixed state management approaches
  - Inconsistent file organization

- [ ] 1.4 — **Dependency Analysis**:
  - Circular dependency detection
  - Over-coupled modules (too many cross-imports)
  - Under-utilized dependencies (imported but barely used)
  - Outdated patterns from old library versions

- [ ] 1.5 — **Architecture Smell Detection**:
  - God objects/files (does too much)
  - Feature envy (module uses another module's internals too much)
  - Shotgun surgery candidates (one change requires many file edits)
  - Leaky abstractions

### Phase 1 Checkpoint

- [ ] Duplication candidates listed
- [ ] Complexity hotspots identified
- [ ] Pattern inconsistencies noted
- [ ] Dependency issues found
- [ ] Architecture smells detected

---

## PHASE 2: Risk and Effort Assessment

**Checkpoint:** Each candidate assessed for risk and effort.

### Action Items

- [ ] 2.1 — For EACH refactoring candidate, assess:
  ```yaml
  refactoring:
    id: "REF-001"
    type: "duplication|complexity|pattern|dependency|architecture"
    location: "file(s) or module(s) affected"
    description: "What needs to change and why"
    current_state: "What exists now"
    proposed_state: "What it should look like after"
    risk:
      level: "LOW|MEDIUM|HIGH"
      reason: "Why this risk level"
      mitigations: ["How to reduce risk"]
    effort:
      estimate: "XS|S|M|L|XL"
      hours: "1-2|2-4|4-8|8-16|16+"
      files_affected: N
    impact:
      code_quality: "LOW|MEDIUM|HIGH"
      maintainability: "LOW|MEDIUM|HIGH"
      performance: "NONE|LOW|MEDIUM|HIGH"
    dependencies: ["What must be done first"]
  ```

- [ ] 2.2 — Calculate priority score for each:
  ```
  priority = (impact_score * 3 + effort_inverse * 2 + risk_inverse * 1) / 6
  ```
  Where: HIGH=3, MEDIUM=2, LOW=1, NONE=0
  And inverses: LOW_risk=3, MEDIUM_risk=2, HIGH_risk=1

- [ ] 2.3 — Sort by priority score descending

### Phase 2 Checkpoint

- [ ] All candidates assessed for risk and effort
- [ ] Priority scores calculated
- [ ] Sorted by priority

---

## PHASE 3: Generate Report

**Checkpoint:** Refactoring backlog document produced.

### Action Items

- [ ] 3.1 — Generate refactoring report:
  ```markdown
  # Refactoring Analysis Report

  **Date:** {date}
  **Target:** {target}
  **Depth:** {depth}
  **Total Candidates:** {N}

  ## Summary

  | Type | Count | Avg Risk | Avg Effort |
  |------|-------|----------|------------|
  | Duplication | N | LOW | S |
  | Complexity | N | MEDIUM | M |
  | Pattern | N | LOW | M |
  | Dependency | N | HIGH | L |
  | Architecture | N | HIGH | XL |

  ## Priority Queue (Top 10)

  ### 1. REF-001: {title}
  - **Type:** {type}
  - **Risk:** {level} — {reason}
  - **Effort:** {estimate} (~{hours} hours, {files} files)
  - **Impact:** Quality={q}, Maintainability={m}, Performance={p}
  - **Location:** {files}
  - **Current:** {what exists}
  - **Proposed:** {what it should be}
  - **Dependencies:** {what must be done first}

  [... repeat for top 10 ...]

  ## Quick Wins (Low Risk, Small Effort, High Impact)
  [filtered list]

  ## Deferred (High Risk or Large Effort)
  [filtered list with justification for deferring]

  ## Recommendations
  1. Start with quick wins to build momentum
  2. {specific recommendation}
  3. {specific recommendation}
  ```

- [ ] 3.2 — Display the report to the user
- [ ] 3.3 — Offer next steps:
  - "Create stories from these suggestions?" (delegate to @po)
  - "Implement quick wins now?" (switch to dev-improve-code-quality)
  - "Save report for later?" (write to docs/)

### Phase 3 Checkpoint

- [ ] Report generated with all candidates
- [ ] Priority queue sorted
- [ ] Quick wins highlighted
- [ ] Next steps presented

---

## Acceptance Criteria

1. At least 5 refactoring candidates identified (or documented that codebase is clean)
2. Each candidate has risk assessment (LOW/MEDIUM/HIGH)
3. Each candidate has effort estimate (XS to XL)
4. Candidates sorted by priority
5. Quick wins clearly identified
6. Report is actionable (enough detail to create stories from)
7. NO code changes made (analysis only)

---

## Output Specification

| Field | Value |
|-------|-------|
| Primary Output | Refactoring analysis report (markdown) |
| Format | Markdown document |
| Location | Displayed to user (optionally saved to docs/) |

---

## Dependencies

| Resource | Type | Path |
|----------|------|------|
| Technical Preferences | data | `.aiox-core/data/technical-preferences.md` |

---

## Error Handling

| Error | Action |
|-------|--------|
| Target path empty | Report "no files to analyze" |
| Codebase too large for deep analysis | Fall back to "standard" depth |
| No issues found | Report "codebase is clean" with positive notes |

---

_Task Version: 3.0.0_
_Last Updated: 2026-03-13_
