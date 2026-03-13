# Task: Verify Subtask Completion

**Task ID:** verify-subtask
**Execution Type:** Agent or Script
**Model:** Haiku (preferred for deterministic checks)
**Purpose:** Verify that a subtask from implementation.yaml is truly complete
**Agent:** @dev (Dex)
**Part of:** Autonomous Development Engine (ADE)

---

## Overview

After `plan-execute-subtask.md` completes, this task runs independent verification of the subtask's acceptance criteria. Uses configured verification type from implementation.yaml.

---

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `subtask_id` | string | YES | Subtask to verify |
| `implementation_file` | path | YES | implementation.yaml with verification config |
| `story_file` | path | YES | Story file to verify AC against |

---

## Verification by Type

### `type: command`
- [ ] Run the command from `verification.command`
- [ ] Match output against `verification.expectedOutput` (regex)
- [ ] Timeout: `verification.timeout` seconds (default 30s)
- [ ] PASS if output matches | FAIL if not

### `type: api`
- [ ] Make the specified API call (method, endpoint, payload)
- [ ] Verify response status code matches expected
- [ ] Verify response body matches expected schema
- [ ] PASS if matches | FAIL if not

### `type: browser`
- [ ] Open the specified URL
- [ ] Check browser console for errors (zero errors required)
- [ ] Verify specified DOM elements exist
- [ ] PASS if no errors and elements found | FAIL otherwise

### `type: e2e`
- [ ] Run the specified e2e test command
- [ ] All e2e tests must pass
- [ ] Screenshot on failure for debugging
- [ ] PASS if all pass | FAIL if any fail

### `type: manual`
- [ ] Display manual verification steps to user
- [ ] Wait for user confirmation: "Verified ✅" or "Not verified ❌"
- [ ] Log user's response
- [ ] PASS if user confirms | FAIL if user denies

### `type: none`
- [ ] Skip verification
- [ ] Log: "[SKIP] No verification configured for {subtask_id}"
- [ ] Auto-PASS

---

## Verification Gate

```
IF verification PASS:
    - Log: "✅ Subtask {subtask_id} VERIFIED"
    - Mark subtask as "verified: true" in implementation.yaml state
    - Return PASS

IF verification FAIL:
    - Log: "❌ Subtask {subtask_id} VERIFICATION FAILED"
    - Log: failure details (output, expected, actual)
    - Return FAIL with details
    - Trigger: retry implementation OR escalate
```

---

## Output

```yaml
verification_result:
  subtask_id: "{id}"
  type: "{command|api|browser|e2e|manual|none}"
  status: "PASS | FAIL"
  evidence: "{command output or API response or screenshot path}"
  timestamp: "{iso}"
  duration_ms: "{duration}"
```

---

_Task Version: 3.0_
_Part of: ADE — Autonomous Development Engine_
_Last Updated: 2026-03-13_
