# Task: Clone Mind

**Task ID:** clone-mind
**Execution Type:** Agent
**Execution Rationale:** "Full research pipeline + DNA extraction + fidelity scoring require LLM reasoning at each step."
**Model:** Opus
**Model Rationale:** "Primary source analysis + heuristic extraction + fidelity assessment = high-complexity non-deterministic reasoning"
**Haiku Eligible:** NO — deep research and pattern extraction require high-capability reasoning
**Purpose:** Clone the mind of a real specialist into an agent-ready YAML block with Voice DNA, Thinking DNA, and fidelity score.
**Orchestrator:** @squad-chief → delegates to @oalanicolas
**Specialist:** @oalanicolas (Knowledge Architect)

---

## PRO-ONLY

This task is exclusive to squad-creator-pro. In base mode, specialist personas are built from user-provided descriptions, not from automated DNA extraction.

---

## VETO CONDITIONS

- Insufficient primary sources (< 2) → flag as SPARSE, do not fabricate
- All heuristics are inferred (no primary source) → VETO, require human review before inclusion
- Fidelity score < 5.0 → clone not deployment-ready, flag for additional research

---

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| specialist_name | string | Yes | Full name of the specialist to clone |
| sources_hint | string | No | Known sources (URLs, books, talks) to prioritize |
| target_agent_id | string | No | If provided, clone output will be formatted for this agent ID |

---

## Preconditions

- [ ] Squad domain has been identified
- [ ] Specialist relevance to domain confirmed by squad-chief

---

## Steps

1. **@oalanicolas receives the mission** from squad-chief
2. Execute `*auto-acquire-sources {specialist_name}` → build source dossier
3. Execute `*extract-voice-dna {specialist_name}` from top 3 sources → Voice DNA block
4. Execute `*extract-thinking-dna {specialist_name}` from top 3 sources → Thinking DNA block
5. Compile minimum 3 output examples (input → output pairs) from primary sources
6. Calculate fidelity score per dimension (Voice, Thinking, Anti-Patterns, Examples)
7. Flag any INFERRED or SPARSE dimensions
8. Format complete agent-ready YAML block

---

## Output

- **Location:** Returned inline to squad-chief for agent file generation
- **Format:** Agent-ready YAML block containing all 6 layers + fidelity score
- **Sections:**
  - Source Dossier (sources by tier)
  - Voice DNA (anchor words, sentence starters, tone, never_say)
  - Thinking DNA (heuristics with source references and confidence levels)
  - Output Examples (minimum 3 input → output pairs)
  - Fidelity Score per dimension
  - SPARSE/INFERRED flags for squad-chief review

---

## Completion Criteria

- [ ] Minimum 3 source candidates identified and classified by tier
- [ ] Voice DNA includes minimum 10 anchor words from primary sources
- [ ] Voice DNA includes minimum 4 never_say phrases
- [ ] Thinking DNA includes minimum 5 heuristics with source references
- [ ] Minimum 1 VETO condition identified or explicitly noted as absent
- [ ] Minimum 3 output examples included
- [ ] Fidelity score calculated per dimension
- [ ] All INFERRED elements labeled and flagged
- [ ] Output formatted as agent-ready YAML block
