# Task: Axioma Assessment

**Task ID:** axioma-assessment
**Execution Type:** Agent
**Execution Rationale:** "Structural validation + gap analysis + remediation planning require judgment at every step."
**Model:** Sonnet
**Model Rationale:** "Structured audit with rubric application — complex but partially pattern-driven"
**Haiku Eligible:** Partial — scoring step could be haiku, but gap analysis and remediation require sonnet
**Purpose:** Validate a squad against the 10 meta-axiomas and produce a scored assessment with remediation plan.
**Orchestrator:** @squad-chief → delegates to @pedro-valerio
**Specialist:** @pedro-valerio (Process Absolutist)

---

## PRO-ONLY

This task is exclusive to squad-creator-pro. Base mode uses a simplified quality gate
without the 10-axioma framework, weighted scoring, or remediation plan generation.

---

## VETO CONDITIONS

- Axioma 1 (Structural Integrity) FAILS → squad status = BLOCKED, no deployment
- Axioma 2 (Agent Completeness) FAILS → squad status = BLOCKED, no deployment
- Score inflation detected → reject assessment, rerun with corrected rubric

---

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| squad_name_or_path | string | Yes | Name or path to the squad being assessed |
| assessment_scope | string | No | "full" (all 10 axiomas) or "quick" (axiomas 1-5 only). Default: full |

---

## Preconditions

- [ ] Squad folder exists with config.yaml
- [ ] At least 1 agent file present in squad agents/ folder

---

## Axioma Definitions

| # | Axioma | PASS Criteria |
|---|--------|--------------|
| 1 | Structural Integrity | Required folders exist: agents/, config.yaml present |
| 2 | Agent Completeness | All agents have all 6 YAML layers (agent, persona, commands, heuristics, handoff_to, completion_criteria) |
| 3 | Heuristic Quality | Heuristics use SE/ENTÃO format with severity (MANDATORY/RECOMMENDED/VETO) |
| 4 | Voice DNA Fidelity | Agents have vocabulary list (min 8 terms) and never_say (min 3 phrases) |
| 5 | Handoff Completeness | All Tier 1+ agents have explicit handoff_to with when and what_to_pass |
| 6 | Task Executability | Tasks have input params, explicit steps, and output format |
| 7 | Veto Condition Coverage | At least 1 VETO severity heuristic per Tier 1+ agent |
| 8 | Output Example Coverage | All Tier 1+ agents have minimum 2 output examples |
| 9 | Completion Criteria Measurability | All criteria are binary (pass/fail testable), no subjective criteria |
| 10 | Anti-Pattern Documentation | Each agent documents minimum 3 anti-patterns with why_bad |

---

## Steps

1. **@pedro-valerio receives the mission** from squad-chief with squad path
2. Load squad: config.yaml, all agent files, all task files
3. Apply each axioma in sequence, scoring 0-10 with PASS/FAIL determination
4. For each FAIL: document exact gap, PASS-level example, remediation steps, effort estimate
5. Calculate weighted overall score
6. Determine deployment status: DEPLOY_READY (score ≥ 9.0) / REVIEW_NEEDED (score 7.0-8.9) / BLOCKED (any CRITICAL FAIL or score < 7.0)
7. Generate remediation plan sorted by priority (CRITICAL → HIGH → LOW)
8. Return full assessment report to squad-chief

---

## Output

- **Location:** Returned inline to squad-chief
- **Format:** Axioma scorecard + critical findings + remediation plan
- **Sections:**
  - Assessment Summary (overall score, status, counts)
  - Axioma Scorecard (10 rows, score + PASS/FAIL per axioma)
  - Critical Findings (blocking issues with exact remediation)
  - Warnings (non-blocking improvements)
  - Remediation Plan (sorted by priority with effort estimates)

---

## Completion Criteria

- [ ] All 10 axiomas applied (or first 5 if quick mode)
- [ ] Each axioma has numeric score (0-10) and PASS/FAIL
- [ ] All FAILs documented with specific gap description
- [ ] All FAILs have remediation path with effort estimate
- [ ] Overall score calculated as weighted average
- [ ] Deployment status determined (DEPLOY_READY/REVIEW_NEEDED/BLOCKED)
- [ ] Remediation plan sorted by priority
- [ ] No vague findings — all findings specific and actionable
