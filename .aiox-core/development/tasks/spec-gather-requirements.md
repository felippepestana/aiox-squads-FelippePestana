# ═══════════════════════════════════════════════════════════════════════════════
# TASK: Spec — Gather Requirements
# ID: spec-gather-requirements
# Version: 1.0.0
# Purpose: Phase 1 of the Spec Pipeline. Elicit and document all requirements
#          (functional, non-functional, constraints) from user input or PRD.
# Agent: @pm (Morgan)
# Phase in Pipeline: Spec Pipeline — Phase 1 (Gather)
# ═══════════════════════════════════════════════════════════════════════════════

## Overview

The first and mandatory phase of every Spec Pipeline run. Transforms informal
requirements (user conversation, rough notes, feature request) into structured
`requirements.json` with traceability IDs. Everything downstream traces back
to this output — no requirement can enter the spec without appearing here first.

---

## Inputs

| Parameter    | Type   | Required | Description                                          |
|--------------|--------|----------|------------------------------------------------------|
| input_source | path   | NO       | Path to existing PRD/notes file. If absent, gather interactively. |
| feature_name | string | YES      | Short name for the feature being specified            |
| run_id       | string | NO       | Spec run ID. Auto-generated if not provided.         |

---

## Preconditions

- [ ] `feature_name` is provided
- [ ] Output directory `.aiox/spec-runs/` can be created

---

## PHASE 0: Setup

**Checkpoint:** Run environment initialized.

### Action Items

- [ ] 0.1 — Generate `run_id` if not provided: format `spec-{YYYYMMDD}-{feature_name_slug}`
- [ ] 0.2 — Create run directory: `.aiox/spec-runs/{run_id}/`
- [ ] 0.3 — If `input_source` provided: read the file in full. Note all explicit requirements.
- [ ] 0.4 — If no `input_source`: proceed to interactive elicitation in Phase 1.
- [ ] 0.5 — Read `.aiox-core/data/technical-preferences.md` for stack constraints

### Phase 0 Checkpoint

- [ ] run_id set
- [ ] Run directory created
- [ ] Input source loaded (if provided)

---

## PHASE 1: Elicit Functional Requirements

**Checkpoint:** All FR-* items documented with IDs.

### Action Items

- [ ] 1.1 — For each feature/capability, write a FR statement:
  - Format: `"id": "FR-{N}", "description": "{what the system must do}", "source": "{user|prd|inferred}"`
  - Use active voice: "The system SHALL..." or "Users can..."
  - Each FR covers exactly ONE behavior
- [ ] 1.2 — Extract FRs from all explicit "must have", "should have", "user can" statements in input
- [ ] 1.3 — Identify implicit FRs that are obviously required but unstated:
  - Common implicit: CRUD operations implied by "manage X"
  - Common implicit: error states ("what happens when X fails")
  - Common implicit: authentication if user roles are mentioned
- [ ] 1.4 — Mark implicit FRs with `"source": "inferred"` and add rationale
- [ ] 1.5 — Assign sequential IDs: FR-001, FR-002, ...

### Phase 1 Checkpoint

- [ ] At least 1 functional requirement documented
- [ ] All FRs have IDs (FR-001 format)
- [ ] Source tagged: user | prd | inferred
- [ ] No compound FRs (one behavior per FR)

---

## PHASE 2: Elicit Non-Functional Requirements

**Checkpoint:** All NFR-* items documented.

### Action Items

- [ ] 2.1 — Identify performance requirements (response times, throughput, limits)
- [ ] 2.2 — Identify security requirements (auth, authorization, data protection, OWASP)
- [ ] 2.3 — Identify reliability requirements (uptime SLA, error rate tolerance, recovery)
- [ ] 2.4 — Identify usability requirements (accessibility, browser support, mobile)
- [ ] 2.5 — Identify scalability requirements (concurrent users, data volume growth)
- [ ] 2.6 — If none explicitly stated: document default NFRs based on tech-preferences:
  - Default: "System must handle standard web traffic loads"
  - Default: "All forms must include input validation"
  - Default: "All authenticated routes must check session validity"
- [ ] 2.7 — Assign sequential IDs: NFR-001, NFR-002, ...

### Phase 2 Checkpoint

- [ ] At least 2 NFRs documented (security + one other)
- [ ] All NFRs have IDs (NFR-001 format)
- [ ] Performance metrics are numeric where possible (not "fast" — use "< 200ms")

---

## PHASE 3: Identify Constraints

**Checkpoint:** All CON-* items documented.

### Action Items

- [ ] 3.1 — Technology constraints: must use specific frameworks, languages, platforms
- [ ] 3.2 — Integration constraints: must connect to specific existing systems/APIs
- [ ] 3.3 — Data constraints: existing schema must not change, data migration required, etc.
- [ ] 3.4 — Timeline/scope constraints: MVP only, hard deadline, budget
- [ ] 3.5 — Regulatory/compliance constraints: GDPR, HIPAA, regional laws
- [ ] 3.6 — Read tech stack from `.aiox-core/core-config.yaml` (`techPreset.active`) and add as constraint
- [ ] 3.7 — Assign sequential IDs: CON-001, CON-002, ...

### Phase 3 Checkpoint

- [ ] At least 1 constraint documented (tech stack is always a constraint)
- [ ] All CONs have IDs (CON-001 format)

---

## PHASE 4: Document Assumptions

**Checkpoint:** All assumptions explicit and flagged for validation.

### Action Items

- [ ] 4.1 — List ALL assumptions made during this elicitation
  - What was assumed because it was unstated but seemed obvious?
  - What ambiguities were resolved by assumption?
- [ ] 4.2 — For each assumption, note: the assumption, why it was made, risk if wrong
- [ ] 4.3 — Flag HIGH RISK assumptions (ones that, if wrong, would invalidate requirements)

### Phase 4 Checkpoint

- [ ] At least 1 assumption documented
- [ ] Risk level tagged for each assumption

---

## PHASE 5: Write requirements.json

**Checkpoint:** Output file written and valid.

### Action Items

- [ ] 5.1 — Compile all collected data into the following JSON structure:
  ```json
  {
    "run_id": "{run_id}",
    "feature_name": "{feature_name}",
    "created_at": "{ISO-8601 datetime}",
    "functional_requirements": [
      {"id": "FR-001", "description": "...", "priority": "MUST|SHOULD|COULD", "source": "user|prd|inferred"}
    ],
    "non_functional_requirements": [
      {"id": "NFR-001", "category": "performance|security|reliability|usability|scalability", "description": "...", "metric": "..."}
    ],
    "constraints": [
      {"id": "CON-001", "type": "technology|integration|data|timeline|compliance", "description": "..."}
    ],
    "assumptions": [
      {"assumption": "...", "rationale": "...", "risk": "HIGH|MEDIUM|LOW"}
    ],
    "totals": {
      "fr_count": 0,
      "nfr_count": 0,
      "con_count": 0,
      "assumption_count": 0
    }
  }
  ```
- [ ] 5.2 — Set priority for each FR: MUST (core functionality), SHOULD (important), COULD (nice to have)
- [ ] 5.3 — Populate `totals` section
- [ ] 5.4 — Write output to: `.aiox/spec-runs/{run_id}/requirements.json`
- [ ] 5.5 — Output summary: FR count, NFR count, CON count, any HIGH RISK assumptions

### Phase 5 Checkpoint

- [ ] File exists at `.aiox/spec-runs/{run_id}/requirements.json`
- [ ] File is valid JSON
- [ ] All IDs are unique and sequential
- [ ] Totals match actual counts

---

## Acceptance Criteria

1. Output file exists at `.aiox/spec-runs/{run_id}/requirements.json`
2. File is parseable JSON
3. At least 1 FR-* item with valid ID
4. At least 2 NFR-* items (security + one other)
5. At least 1 CON-* item (tech stack minimum)
6. At least 1 assumption documented
7. All items have sequential IDs in correct format
8. No compound FRs (one behavior per entry)
9. All priorities set (MUST/SHOULD/COULD)

---

## Next Step

After this task completes, the spec pipeline flows to:
1. **@architect** runs `spec-assess-complexity.md` — determines pipeline depth
2. If SIMPLE: skip to `spec-write.md` (Phase 4)
3. If STANDARD/COMPLEX: run `spec-research.md` (Phase 3) first
