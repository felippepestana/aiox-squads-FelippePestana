# ═══════════════════════════════════════════════════════════════════════════════
# TASK: DevOps — Commit Workflow
# ID: devops-commit
# Version: 1.0.0
# Purpose: Commit staged changes with conventional commit format.
#          Includes secrets detection and pre-commit validation.
# Agent: @devops (Gage) — EXCLUSIVE
# ═══════════════════════════════════════════════════════════════════════════════

## Overview

Creates a git commit from staged changes using Conventional Commits format.
Runs secrets detection before committing. Never skips pre-commit hooks.

---

## Inputs

| Parameter    | Type   | Required | Description                                              |
|--------------|--------|----------|----------------------------------------------------------|
| message_hint | string | NO       | Short description hint. Task will generate final message.|
| scope        | string | NO       | Conventional commit scope (e.g., "auth", "api", "ui")    |
| type         | enum   | NO       | Conventional commit type. Auto-detected if not provided. |

---

## Preconditions

- [ ] Files are staged (`git status` shows staged changes)
- [ ] Not on protected branch without explicit approval

---

## PHASE 0: Validate Staged State

**Checkpoint:** Staged changes are safe to commit.

### Action Items

- [ ] 0.1 — Run `git status --short` to see staged and unstaged files
- [ ] 0.2 — Verify at least 1 file is staged. If nothing staged: BLOCK and output "No staged changes. Run git add <files> first."
- [ ] 0.3 — Run `git diff --cached --stat` to see scope of staged changes

### Phase 0 Checkpoint

- [ ] At least 1 file staged
- [ ] Staged file list reviewed

---

## PHASE 1: Secrets Detection

**Checkpoint:** No secrets or credentials in staged changes.

### Action Items

- [ ] 1.1 — Run `git diff --cached` to inspect actual content of staged changes
- [ ] 1.2 — Scan for SECRET PATTERNS (BLOCK if found):
  - `password\s*=\s*["'][^"']+["']` (hardcoded passwords)
  - `api[_-]?key\s*=\s*["'][^"']+["']` (API keys)
  - `secret\s*=\s*["'][^"']+["']` (secrets)
  - `token\s*=\s*["'][^"']+["']` (tokens)
  - `BEGIN (RSA|EC|OPENSSH) PRIVATE KEY` (private keys)
  - AWS key patterns: `AKIA[0-9A-Z]{16}`
  - Long base64 strings in non-data files
- [ ] 1.3 — Check `.env*` files are NOT staged (they belong in .gitignore)
- [ ] 1.4 — Check `credentials.json`, `secrets.yaml`, `*.pem`, `*.key` are NOT staged
- [ ] 1.5 — If secrets found: BLOCK with specific file and pattern identified

### Phase 1 Checkpoint

- [ ] Zero secrets detected in staged changes
- [ ] No .env files staged
- [ ] No credential files staged

---

## PHASE 2: Generate Conventional Commit Message

**Checkpoint:** Commit message follows Conventional Commits spec.

### Action Items

- [ ] 2.1 — Analyze staged files to determine change type:
  - New files only → likely `feat`
  - Bug fix patterns (issue references, "fix", error handling) → `fix`
  - Only test files → `test`
  - Only docs → `docs`
  - Refactor (no behavior change) → `refactor`
  - Build/config files → `chore` or `build`
  - Style/formatting only → `style`
- [ ] 2.2 — Use `type` from input if provided, else use auto-detected type
- [ ] 2.3 — Determine scope from staged file paths:
  - Files in `src/auth/` → scope `auth`
  - Files in `src/api/` or `app/api/` → scope `api`
  - Files in `components/` or `src/ui/` → scope `ui`
  - Mixed files → use the primary changed area
  - Use `scope` from input if provided
- [ ] 2.4 — Write subject line: `{type}({scope}): {concise description}`
  - Max 72 characters total
  - Lowercase after colon
  - No period at end
  - Imperative mood: "add", "fix", "update" (not "added", "fixed")
- [ ] 2.5 — Optionally write body (for complex changes):
  - What changed and why (not how — the diff shows how)
  - Breaking changes: start with `BREAKING CHANGE:` on a new line
- [ ] 2.6 — Present generated message to user before committing

### Phase 2 Checkpoint

- [ ] Message follows `{type}({scope}): {description}` format
- [ ] Subject line ≤ 72 characters
- [ ] Type is a valid Conventional Commits type

---

## PHASE 3: Execute Commit

**Checkpoint:** Commit created successfully.

### Action Items

- [ ] 3.1 — Execute commit:
  ```bash
  git commit -m "$(cat <<'EOF'
  {subject line}

  {optional body}
  EOF
  )"
  ```
- [ ] 3.2 — NEVER use `--no-verify` (skip hooks). If hook fails: fix the issue, then retry.
- [ ] 3.3 — If commit fails due to pre-commit hook:
  - Read the hook error message
  - Fix the specific issue (lint error, format error, test failure)
  - Re-stage the fixed files
  - Retry the commit (create NEW commit, do not amend)
- [ ] 3.4 — After successful commit: run `git log --oneline -3` to confirm
- [ ] 3.5 — Output: commit hash (short), message, files committed

### Phase 3 Checkpoint

- [ ] `git log --oneline -1` shows new commit
- [ ] Commit hash confirmed
- [ ] Output includes commit details

---

## Acceptance Criteria

1. At least 1 file is staged before attempting commit
2. Zero secrets or credential files in staged changes
3. Commit message follows Conventional Commits format
4. Subject line is ≤ 72 characters
5. No `--no-verify` flag used
6. Commit exists in `git log` after task completes

---

## Conventional Commits Reference

| Type       | When to Use                              |
|------------|------------------------------------------|
| `feat`     | New feature added                        |
| `fix`      | Bug fix                                  |
| `docs`     | Documentation changes only               |
| `style`    | Formatting, no logic change              |
| `refactor` | Code restructure, no feature/fix         |
| `test`     | Adding or updating tests                 |
| `chore`    | Build process, dependency updates        |
| `build`    | Build system changes                     |
| `ci`       | CI/CD configuration                      |
| `perf`     | Performance improvement                  |
| `revert`   | Reverting a previous commit              |

---

## Error Handling

| Error                    | Action                                              |
|--------------------------|-----------------------------------------------------|
| Nothing staged           | BLOCK — output git add instructions                 |
| Secret detected          | BLOCK — identify pattern and file, do not commit    |
| Pre-commit hook fails    | Fix issue, re-stage, create new commit              |
| Commit on wrong branch   | WARN — confirm branch with user before proceeding   |
