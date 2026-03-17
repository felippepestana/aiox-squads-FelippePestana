# Task: Research Then Create Agent (Pro)

**Task ID:** research-then-create-agent
**Execution Type:** Agent
**Execution Rationale:** "Multi-step pipeline: research → DNA extraction → architecture → creation → validation. Each step requires judgment."
**Model:** Opus → Sonnet → Haiku
**Model Rationale:** "Model routing: Opus for research/creation, Sonnet for positioning, Haiku for formatting/validation"
**Purpose:** Create a domain-specific agent using automated research, DNA extraction, and specialist delegation.
**Orchestrator:** @squad-chief
**Specialists:** @oalanicolas (DNA extraction), @pedro-valerio (validation), @thiago_finch (positioning)

---

## PRO OVERRIDE

This task overrides the base `create-agent.md` when pro mode is active.
Override path: `squads/squad-creator-pro/workflows/wf-research-then-create-agent.yaml`

---

## VETO CONDITIONS

- DNA extraction fidelity < 5.0 → do not create agent from low-fidelity clone
- Agent has no VETO heuristic after creation → flag for revision
- Agent file > 1500 lines of primarily philosophical content → VETO, enforce curation

---

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| specialist_name | string | Yes | Name of the specialist to clone OR domain description for synthetic agent |
| squad_name | string | Yes | Target squad for the agent |
| tier | number | Yes | Target tier (0=Chief, 1=Master, 2=Specialist, 3=Support) |
| role | string | Yes | Agent role/specialty description |
| sources_hint | string | No | Known sources to prioritize in research |

---

## Preconditions

- [ ] Squad exists with config.yaml
- [ ] Tier structure defined in squad architecture

---

## Steps

1. **squad-chief receives request** and determines creation mode:
   - Real specialist → delegate to @oalanicolas for DNA extraction
   - Synthetic/domain agent → proceed to architecture directly
2. **@oalanicolas** (if real specialist): Execute clone-mind pipeline → return YAML block with fidelity score
3. **squad-chief** reviews extraction output → approves or requests refinement
4. **@thiago_finch** (optional): Validates agent positioning within squad domain — is this agent filling a real gap?
5. **squad-chief** generates agent file from extraction + templates
6. **@pedro-valerio**: Runs axioma assessment on new agent file
7. **squad-chief**: Applies remediation if any axioma FAILs found
8. Return completed agent file to user

---

## Output

- **Location:** `squads/{squad_name}/agents/{agent_id}.md`
- **Format:** Full 6-layer agent YAML in activation-notice wrapper
- **Quality Target:** Score ≥ 8.0 on axioma assessment

---

## Completion Criteria

- [ ] Agent file created at correct path
- [ ] All 6 YAML layers present (agent, persona, commands, heuristics, handoff_to, completion_criteria)
- [ ] If mind-cloned: fidelity score ≥ 7.0
- [ ] Minimum 5 heuristics with correct severity levels
- [ ] Minimum 1 VETO heuristic
- [ ] Minimum 3 output examples
- [ ] Handoff_to defined with at least 1 target agent
- [ ] Axioma assessment score ≥ 8.0
