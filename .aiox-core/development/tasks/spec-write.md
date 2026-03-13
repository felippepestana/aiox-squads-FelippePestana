# ═══════════════════════════════════════════════════════════════════════════════
# TASK: Spec — Write Specification
# ID: spec-write
# Version: 1.0.0
# Purpose: Phase 4 of the Spec Pipeline. Write the formal feature specification
#          with full traceability to FR-*, NFR-*, CON-*, and research findings.
# Agent: @pm (Morgan)
# Phase in Pipeline: Spec Pipeline — Phase 4 (Write Spec)
# Constitution Gate: Article IV — No Invention (every statement must trace)
# ═══════════════════════════════════════════════════════════════════════════════

## Overview

Produces `spec.md` — the canonical specification that becomes the source of
truth for all implementation work. Every statement in this document MUST trace
to a requirement ID or research finding. Zero invention is tolerated.

This document will be critiqued in Phase 5. Weak traceability = certain NO-GO.

---

## Inputs

| Parameter    | Type   | Required | Description                                          |
|--------------|--------|----------|------------------------------------------------------|
| run_id       | string | YES      | Spec run ID (carries all Phase 1-3 outputs)          |
| research_path| path   | NO       | Path to research.json (required for STANDARD/COMPLEX)|

---

## Preconditions

- [ ] `requirements.json` exists at `.aiox/spec-runs/{run_id}/requirements.json`
- [ ] `complexity.json` exists at `.aiox/spec-runs/{run_id}/complexity.json`
- [ ] For STANDARD/COMPLEX: `research.json` exists at `.aiox/spec-runs/{run_id}/research.json`

---

## PHASE 0: Load All Context

**Checkpoint:** All upstream outputs loaded.

### Action Items

- [ ] 0.1 — Read `requirements.json` — build mental model of all FRs, NFRs, CONs
- [ ] 0.2 — Read `complexity.json` — note classification and risk areas
- [ ] 0.3 — If STANDARD/COMPLEX: read `research.json` — note key findings and their IDs
- [ ] 0.4 — Build a lookup table: `{FR-001: "description", NFR-001: "description", ...}`
  - This will be used to verify every statement traces to something real

### Phase 0 Checkpoint

- [ ] All required files loaded
- [ ] Traceability lookup table built in memory

---

## PHASE 1: Write Overview Section

**Checkpoint:** Feature purpose is clear from requirements, not invented.

### Action Items

- [ ] 1.1 — Write feature summary: 2-3 sentences describing what this feature does
  - Every sentence must trace to at least one FR-* item
  - CITE requirements inline: "The system provides X (FR-001) enabling Y (FR-002)"
- [ ] 1.2 — Write the problem statement: what user problem does this solve?
  - Trace to the "so that" clauses of the main FRs
- [ ] 1.3 — List out-of-scope items explicitly: what this feature does NOT include
  - This prevents scope creep during implementation

### Phase 1 Checkpoint

- [ ] Every statement has at least one inline citation (FR-*, NFR-*, CON-*, or research finding)
- [ ] Out-of-scope section present

---

## PHASE 2: Write Functional Specification

**Checkpoint:** All FRs translated into specification language with traceability.

### Action Items

- [ ] 2.1 — For each MUST FR, write a specification section:
  ```
  ### {FR-ID}: {Feature Name}
  **Requirement:** {FR description verbatim}
  **Specification:**
  {Detailed description of HOW the system fulfills this requirement}
  **Acceptance:** {What observable behavior proves this is met}
  ```
- [ ] 2.2 — For each SHOULD FR: include in a "Secondary Features" section
- [ ] 2.3 — For each COULD FR: include in an "Future Scope" section (clearly marked as out of current spec)
- [ ] 2.4 — For each FR section: ensure the specification text contains NO new requirements
  - Only elaborate HOW, never ADD new WHAT
- [ ] 2.5 — For COMPLEX features: use numbered sub-sections for multi-step flows

### Phase 2 Checkpoint

- [ ] All MUST FRs have specification sections
- [ ] All SHOULD FRs are in Secondary Features
- [ ] Zero new requirements introduced in specification text
- [ ] All acceptance descriptions are behavioral (not implementation-specific)

---

## PHASE 3: Write Non-Functional Specification

**Checkpoint:** All NFRs have measurable compliance criteria.

### Action Items

- [ ] 3.1 — For each NFR, write compliance specification:
  ```
  ### {NFR-ID}: {Category} — {Name}
  **Requirement:** {NFR description verbatim}
  **Compliance Criteria:**
  - {Specific, measurable criterion 1}
  - {Specific, measurable criterion 2}
  **Verification Method:** {How to test/validate this NFR}
  ```
- [ ] 3.2 — Performance NFRs MUST include numeric targets (not "fast" — use actual ms/rps)
- [ ] 3.3 — Security NFRs MUST reference specific controls (not "secure" — cite OWASP controls, specific checks)
- [ ] 3.4 — No new performance targets or security controls beyond what NFR-* items specify

### Phase 3 Checkpoint

- [ ] All NFRs have compliance criteria
- [ ] All performance targets are numeric
- [ ] All security requirements cite specific controls

---

## PHASE 4: Write Constraints and Assumptions

**Checkpoint:** All constraints documented, assumptions flagged for reader.

### Action Items

- [ ] 4.1 — Write Constraints section:
  ```
  ### Constraints
  | ID | Type | Constraint | Impact |
  |----|------|------------|--------|
  | CON-001 | technology | {description} | {what it limits} |
  ```
- [ ] 4.2 — Write Assumptions section with risk indicators:
  ```
  ### Assumptions
  | Assumption | Basis | Risk | Owner |
  |------------|-------|------|-------|
  | {assumption} | {why assumed} | HIGH/MEDIUM/LOW | {who validates} |
  ```
- [ ] 4.3 — HIGH RISK assumptions MUST include a note on what changes if assumption is wrong

### Phase 4 Checkpoint

- [ ] All CON-* items in constraints table
- [ ] All assumptions listed with risk levels

---

## PHASE 5: No-Invention Audit (CRITICAL)

**Constitution Article IV Gate — MANDATORY before writing output.**

### Action Items

- [ ] 5.1 — Re-read every sentence in the spec written in Phases 1-4
- [ ] 5.2 — For each sentence, verify it traces to: FR-*, NFR-*, CON-*, or a named research finding
- [ ] 5.3 — If any sentence introduces a requirement NOT in any upstream document:
  - **EITHER**: Remove it from the spec
  - **OR**: Add it to `requirements.json` as a new FR/NFR with `"source": "inferred"` first, then cite it
- [ ] 5.4 — After audit: count sentences, count cited sentences. All must be cited.
- [ ] 5.5 — Document audit result: "X sentences reviewed, 0 uncited."

### Phase 5 Checkpoint

- [ ] Every substantive statement has a citation
- [ ] Zero invented requirements
- [ ] Audit result documented

---

## PHASE 6: Write spec.md

**Checkpoint:** Output file written, formatted, and complete.

### Action Items

- [ ] 6.1 — Compose final `spec.md` with this structure:
  ```markdown
  # Feature Specification: {feature_name}

  **Run ID:** {run_id}
  **Complexity:** {SIMPLE|STANDARD|COMPLEX}
  **Date:** {YYYY-MM-DD}
  **Status:** DRAFT

  ## 1. Overview
  {Phase 1 output}

  ## 2. Functional Specification
  {Phase 2 output — all FR sections}

  ## 3. Non-Functional Requirements
  {Phase 3 output — all NFR sections}

  ## 4. Constraints
  {Phase 4 constraints table}

  ## 5. Assumptions
  {Phase 4 assumptions table}

  ## 6. Traceability Matrix
  | Spec Section | Requirement IDs |
  |--------------|-----------------|
  | Overview     | FR-001, FR-002  |
  | ...          | ...             |

  ## 7. No-Invention Audit
  Reviewed: {N} statements. Uncited: 0. Gate: PASSED.
  ```
- [ ] 6.2 — Write Traceability Matrix: map each spec section to the requirement IDs it covers
- [ ] 6.3 — Write output to: `.aiox/spec-runs/{run_id}/spec.md`
- [ ] 6.4 — Output summary: FR coverage count, NFR coverage count, total spec length

### Phase 6 Checkpoint

- [ ] File exists at `.aiox/spec-runs/{run_id}/spec.md`
- [ ] Traceability matrix covers all FRs
- [ ] No-Invention Audit section present and shows "Uncited: 0"
- [ ] Status is "DRAFT"

---

## Acceptance Criteria

1. Output file exists at `.aiox/spec-runs/{run_id}/spec.md`
2. Every MUST FR has a specification section
3. Every NFR has compliance criteria with measurable targets
4. All constraints from CON-* appear in constraints table
5. Traceability matrix present covering all FRs
6. No-Invention Audit section shows 0 uncited statements
7. Status is "DRAFT"

---

## Next Step

After this task completes:
1. **@qa** runs `spec-critique.md` — validates spec quality
2. Critique verdict: APPROVED (≥4.0 avg) → proceed to plan; NEEDS_REVISION → revise; BLOCKED (<3.0) → escalate to @architect
