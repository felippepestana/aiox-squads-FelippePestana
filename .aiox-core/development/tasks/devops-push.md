# ═══════════════════════════════════════════════════════════════════════════════
# TASK: DevOps — Push to Remote
# ID: devops-push
# Version: 1.0.0
# Purpose: Push committed changes to remote with pre-push quality gates
#          and retry logic for transient network failures.
# Agent: @devops (Gage) — EXCLUSIVE
# ═══════════════════════════════════════════════════════════════════════════════

## Overview

Executes the complete push workflow: pre-push quality checks → push with retry
logic → verification. This is the ONLY task authorized to push to remote.
Other agents calling `git push` directly violate Constitution Article II.

---

## Inputs

| Parameter  | Type    | Required | Description                                              |
|------------|---------|----------|----------------------------------------------------------|
| branch     | string  | NO       | Branch to push. Default: current branch.                 |
| remote     | string  | NO       | Remote name. Default: origin.                            |
| force      | boolean | NO       | Force push. ONLY allowed for main in specific cases.     |
| skip_gates | boolean | NO       | Skip pre-push quality gates. Default: false. WARN if true.|

---

## Preconditions

- [ ] At least 1 local commit ahead of remote (`git status` shows "Your branch is ahead")
- [ ] Not force-pushing to a branch other than main (or explicit approval given)

---

## PHASE 0: Pre-Push Quality Gates

**Checkpoint:** Code is ready to push. Gates passed or explicitly skipped.

### Action Items

- [ ] 0.1 — Run `git status` to confirm working tree and staged state
- [ ] 0.2 — Run `git log --oneline origin/{branch}..HEAD` to review commits to be pushed
- [ ] 0.3 — **IF `skip_gates` is true**: output "WARNING: Pre-push gates skipped by caller request" and proceed to Phase 1
- [ ] 0.4 — Run lint check (if package.json exists with lint script): `npm run lint`
- [ ] 0.5 — Run type check (if TypeScript): `npm run typecheck` or `npx tsc --noEmit`
- [ ] 0.6 — Run tests (if test script exists): `npm test -- --passWithNoTests`
- [ ] 0.7 — If any check fails:
  - Output which check failed and the error message
  - DO NOT push
  - Delegate fix to @dev: "Gate failed: {details}. @dev must fix before push."

### Phase 0 Checkpoint

- [ ] All quality gates passed (or explicitly skipped)
- [ ] Commits to push reviewed

---

## PHASE 1: Determine Push Command

**Checkpoint:** Push command built correctly for the scenario.

### Action Items

- [ ] 1.1 — Get current branch: `git branch --show-current`
- [ ] 1.2 — Check if branch has upstream: `git rev-parse --abbrev-ref {branch}@{upstream}` (suppress errors)
- [ ] 1.3 — Build push command:
  - **New branch (no upstream)**: `git push -u {remote} {branch}`
  - **Existing branch**: `git push {remote} {branch}`
  - **Force push (explicit)**: `git push -f {remote} {branch}` (only after confirmation)
- [ ] 1.4 — If force push requested on a branch that is NOT main:
  - WARN: "Force push on non-main branch. This rewrites history. Confirm?"
  - In YOLO mode: proceed with force push on non-main
  - For main branch force push: always confirm regardless of mode

### Phase 1 Checkpoint

- [ ] Push command determined
- [ ] Force push warnings issued if applicable

---

## PHASE 2: Execute Push with Retry Logic

**Checkpoint:** Push succeeds or all retries exhausted with clear error.

### Action Items

- [ ] 2.1 — Execute push command (attempt 1 of 4)
- [ ] 2.2 — If push succeeds: skip to Phase 3
- [ ] 2.3 — If push fails with NETWORK error (timeout, connection refused, unable to connect):
  - Wait 5 seconds
  - Retry (attempt 2 of 4)
- [ ] 2.4 — If push fails again with network error:
  - Wait 10 seconds
  - Retry (attempt 3 of 4)
- [ ] 2.5 — If push fails again with network error:
  - Wait 20 seconds
  - Retry (attempt 4 of 4)
- [ ] 2.6 — If push fails with NON-NETWORK error (authentication, rejected, conflict):
  - DO NOT retry
  - Output specific error and remediation steps:
    - `rejected (non-fast-forward)` → "Remote has changes. Run git pull --rebase first."
    - `authentication failed` → "Check SSH keys or token: git remote -v"
    - `remote: Permission to` → "No push permission to this remote. Check access."
- [ ] 2.7 — After 4 failed network retries: BLOCK with error details

### Phase 2 Checkpoint

- [ ] Push succeeded OR all retries exhausted with clear error message

---

## PHASE 3: Verify and Report

**Checkpoint:** Push confirmed on remote.

### Action Items

- [ ] 3.1 — Run `git log --oneline -3` to show recent commit history
- [ ] 3.2 — Output success summary:
  - Branch name
  - Remote name
  - Number of commits pushed
  - Latest commit hash and message
  - Remote URL (for PR link context)
- [ ] 3.3 — Suggest next step: "Run @devops pr-automation to create a PR"

### Phase 3 Checkpoint

- [ ] Push confirmed in git log
- [ ] Success summary output
- [ ] Next step suggested

---

## Acceptance Criteria

1. Pre-push quality gates ran (or skip explicitly documented)
2. Push executed with correct command (with -u for new branches)
3. Maximum 4 retry attempts for network failures
4. Non-network failures do not trigger retries
5. Push confirmation output includes: branch, remote, commit count, latest hash
6. Force push on main branch requires explicit confirmation

---

## Error Handling

| Error                       | Retries | Action                                          |
|-----------------------------|---------|--------------------------------------------------|
| Network timeout             | Yes (4x)| Exponential backoff: 5s, 10s, 20s               |
| non-fast-forward rejection  | No      | Instruct git pull --rebase, then retry manually  |
| Authentication failure      | No      | Check SSH keys / token                           |
| Protected branch            | No      | Cannot push directly, open PR instead            |
| Local no commits ahead      | N/A     | BLOCK — nothing to push                          |
