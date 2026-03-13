# ═══════════════════════════════════════════════════════════════════════════════
# TASK: Spec — Assess Complexity
# ID: spec-assess-complexity
# Version: 1.0.0
# Purpose: Phase 2 of the Spec Pipeline. Score feature complexity across 5
#          dimensions to determine pipeline depth (SIMPLE/STANDARD/COMPLEX).
# Agent: @architect (Aria)
# Phase in Pipeline: Spec Pipeline — Phase 2 (Assess)
# ═══════════════════════════════════════════════════════════════════════════════

## Overview

Uses `requirements.json` from Phase 1 to score the feature across 5 dimensions
(1-5 each, max 25). The total score determines how many pipeline phases are
executed:
- SIMPLE (≤8): gather → spec → critique (3 phases, skip research and plan)
- STANDARD (9-15): all 6 phases
- COMPLEX (≥16): all 6 phases + mandatory revision cycle

---

## Inputs

| Parameter    | Type   | Required | Description                                          |
|--------------|--------|----------|------------------------------------------------------|
| run_id       | string | YES      | Spec run ID from Phase 1                             |
| requirements | path   | NO       | Override path to requirements.json                   |

---

## Preconditions

- [ ] `requirements.json` exists at `.aiox/spec-runs/{run_id}/requirements.json`
- [ ] File is valid JSON with at least 1 FR, 1 NFR, 1 CON

---

## PHASE 0: Load Requirements

**Checkpoint:** Requirements loaded and ready for analysis.

### Action Items

- [ ] 0.1 — Read `requirements.json` at `.aiox/spec-runs/{run_id}/requirements.json`
- [ ] 0.2 — Read existing project architecture doc if available (check `.aiox-core/` for architecture files)
- [ ] 0.3 — Count FRs, NFRs, CONs as baseline for scoring context

---

## PHASE 1: Score 5 Complexity Dimensions

**Checkpoint:** All 5 dimensions scored, rationale documented for each.

For each dimension, assign 1-5. Rationale is MANDATORY — never score without explanation.

### Dimension 1: Scope (Files Affected)

How many files/modules will need to be created or substantially modified?

| Score | Criteria |
|-------|----------|
| 1 | 1-3 files, single module |
| 2 | 4-8 files, 1-2 modules |
| 3 | 9-15 files, 2-3 modules |
| 4 | 16-25 files, 3-5 modules |
| 5 | 25+ files, cross-cutting changes, or new service boundary |

- [ ] 1.1 — Estimate files from FR count and nature of changes
- [ ] 1.2 — Check if changes cross frontend/backend/database boundaries
- [ ] 1.3 — Score Scope: ___/5. Rationale: ___

### Dimension 2: Integration (External APIs/Systems)

How many external systems or APIs does this feature connect to?

| Score | Criteria |
|-------|----------|
| 1 | No external integrations |
| 2 | 1 external API (existing, documented) |
| 3 | 2-3 external APIs or 1 new undocumented API |
| 4 | 4+ external APIs or complex webhook/event system |
| 5 | New service-to-service architecture, message queue, or event sourcing |

- [ ] 2.1 — Count external integrations from CON-* and FR-* items
- [ ] 2.2 — Assess documentation quality of each integration
- [ ] 2.3 — Score Integration: ___/5. Rationale: ___

### Dimension 3: Infrastructure (Changes Required)

Does this feature require infrastructure changes beyond code?

| Score | Criteria |
|-------|----------|
| 1 | Pure code change, no infra needed |
| 2 | Minor config change (env vars, feature flags) |
| 3 | New database table(s), new API routes |
| 4 | Schema migrations on existing tables, new service/worker |
| 5 | New database, cloud service, deployment pipeline, or auth system |

- [ ] 3.1 — Identify all infra changes in CON-* and NFR-* items
- [ ] 3.2 — Assess migration risk (data at rest? breaking changes?)
- [ ] 3.3 — Score Infrastructure: ___/5. Rationale: ___

### Dimension 4: Knowledge (Team Familiarity)

How familiar is the team with the domain, patterns, and technologies required?

| Score | Criteria |
|-------|----------|
| 1 | Well-known domain, same patterns as existing code |
| 2 | Familiar domain, one new pattern or library |
| 3 | Partially familiar domain, 2-3 new patterns |
| 4 | New domain, significant learning required |
| 5 | Entirely new domain, experimental technology, or no prior art |

- [ ] 4.1 — Assess domain novelty from tech stack and requirements
- [ ] 4.2 — Check if required patterns exist in current codebase
- [ ] 4.3 — Score Knowledge: ___/5. Rationale: ___

### Dimension 5: Risk (Criticality Level)

What is the blast radius if this feature fails in production?

| Score | Criteria |
|-------|----------|
| 1 | Isolated feature, no existing data at risk, easy rollback |
| 2 | Minor user impact, quick rollback possible |
| 3 | Significant user impact, rollback takes hours |
| 4 | Critical path feature, data integrity risk, complex rollback |
| 5 | Core system (auth, payments, data pipeline), catastrophic failure risk |

- [ ] 5.1 — Identify affected systems and user paths from NFR-* items
- [ ] 5.2 — Assess rollback complexity
- [ ] 5.3 — Score Risk: ___/5. Rationale: ___

---

## PHASE 2: Calculate Total and Classify

**Checkpoint:** Classification determined, pipeline depth decided.

### Action Items

- [ ] 2.1 — Sum all dimension scores: Scope + Integration + Infrastructure + Knowledge + Risk
- [ ] 2.2 — Apply classification:
  - **SIMPLE**: total ≤ 8 → skip research (Phase 3), go directly to spec-write
  - **STANDARD**: total 9-15 → run all 6 phases
  - **COMPLEX**: total ≥ 16 → run all 6 phases + mandatory revision cycle after critique
- [ ] 2.3 — Document the critical dimensions (scored 4+) as "Risk Areas" requiring extra attention
- [ ] 2.4 — For COMPLEX class: identify which dimensions are highest risk and what mitigation is needed

### Phase 2 Checkpoint

- [ ] Total score calculated
- [ ] Classification assigned (SIMPLE/STANDARD/COMPLEX)
- [ ] Pipeline phases to execute listed
- [ ] Risk Areas documented for dimensions scoring 4+

---

## PHASE 3: Write complexity.json

**Checkpoint:** Output file written and valid.

### Action Items

- [ ] 3.1 — Write the following JSON structure:
  ```json
  {
    "run_id": "{run_id}",
    "created_at": "{ISO-8601 datetime}",
    "scores": {
      "scope": {"score": 0, "rationale": "..."},
      "integration": {"score": 0, "rationale": "..."},
      "infrastructure": {"score": 0, "rationale": "..."},
      "knowledge": {"score": 0, "rationale": "..."},
      "risk": {"score": 0, "rationale": "..."}
    },
    "total": 0,
    "classification": "SIMPLE|STANDARD|COMPLEX",
    "pipeline_phases": ["gather", "assess", "spec", "critique"],
    "risk_areas": [],
    "revision_cycle_required": false,
    "recommendation": "..."
  }
  ```
- [ ] 3.2 — Set `pipeline_phases` based on classification:
  - SIMPLE: `["gather", "assess", "spec", "critique"]`
  - STANDARD: `["gather", "assess", "research", "spec", "critique", "plan"]`
  - COMPLEX: `["gather", "assess", "research", "spec", "critique", "revision", "plan"]`
- [ ] 3.3 — Set `revision_cycle_required: true` for COMPLEX
- [ ] 3.4 — Write `recommendation` field: plain English summary of what this complexity means
- [ ] 3.5 — Write output to: `.aiox/spec-runs/{run_id}/complexity.json`
- [ ] 3.6 — Output summary to console: total score, classification, phases to execute, top risk areas

### Phase 3 Checkpoint

- [ ] File exists at `.aiox/spec-runs/{run_id}/complexity.json`
- [ ] File is valid JSON
- [ ] All 5 scores have rationale
- [ ] Classification matches score range

---

## Acceptance Criteria

1. Output file exists at `.aiox/spec-runs/{run_id}/complexity.json`
2. File is parseable JSON
3. All 5 dimensions are scored 1-5 with rationale
4. Total is the sum of 5 dimension scores (range: 5-25)
5. Classification is SIMPLE (≤8), STANDARD (9-15), or COMPLEX (≥16)
6. Pipeline phases list is correct for the classification
7. Risk areas documented for any dimension scoring 4+

---

## Classification Reference

| Score | Class    | Pipeline | Revision? |
|-------|----------|----------|-----------|
| 5-8   | SIMPLE   | 4 phases | No        |
| 9-15  | STANDARD | 6 phases | No        |
| 16-25 | COMPLEX  | 7 phases | Yes       |

---

## Next Step

After this task completes:
1. **SIMPLE** → skip to `spec-write.md` (Phase 4)
2. **STANDARD/COMPLEX** → proceed to `spec-research.md` (Phase 3 — @analyst)
3. Then: `spec-write.md` → `spec-critique.md` → `spec-create-implementation-plan.md`
