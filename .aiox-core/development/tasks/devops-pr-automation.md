# ═══════════════════════════════════════════════════════════════════════════════
# TASK: DevOps — PR Automation
# ID: devops-pr-automation
# Version: 1.0.0
# Purpose: Create a GitHub Pull Request with proper title, description,
#          labels, and reviewers using the conventional PR template.
# Agent: @devops (Gage) — EXCLUSIVE
# ═══════════════════════════════════════════════════════════════════════════════

## Overview

Gathers branch context (commits, diffs, story reference), generates a
conventional PR title and structured body, and creates the PR via `gh pr create`.
Only @devops has authority to create PRs — other agents attempting this violate
Constitution Article II.

---

## Inputs

| Parameter    | Type    | Required | Description                                          |
|--------------|---------|----------|------------------------------------------------------|
| story_id     | string  | NO       | Story ID this PR implements (e.g., "E001.1")         |
| base_branch  | string  | NO       | Base branch for PR. Default: main.                   |
| draft        | boolean | NO       | Create as draft PR. Default: false.                  |
| reviewers    | string  | NO       | Comma-separated GitHub usernames to request review   |

---

## Preconditions

- [ ] `gh` CLI is installed and authenticated (`gh auth status`)
- [ ] Current branch is pushed to remote (upstream set)
- [ ] Not on main/master branch (cannot PR from main to main)

---

## PHASE 0: Gather Context

**Checkpoint:** All PR context collected.

### Action Items

- [ ] 0.1 — Get current branch name: `git branch --show-current`
- [ ] 0.2 — Determine base branch (from input or detect default branch): `gh repo view --json defaultBranchRef --jq '.defaultBranchRef.name'`
- [ ] 0.3 — Get commits on this branch vs base: `git log --oneline {base}...HEAD`
- [ ] 0.4 — Get changed files summary: `git diff {base}...HEAD --stat`
- [ ] 0.5 — Get full diff for context (used for PR summary, not included in output): `git diff {base}...HEAD`
- [ ] 0.6 — If `story_id` provided: read `.aiox/stories/{story_id}.story.md` for story context
- [ ] 0.7 — If no `story_id`: infer from branch name (pattern: `feat/E001-1-*` → story E001.1)

### Phase 0 Checkpoint

- [ ] Branch name confirmed
- [ ] Base branch confirmed
- [ ] Commit list reviewed
- [ ] Changed files reviewed

---

## PHASE 1: Generate PR Title

**Checkpoint:** PR title follows conventional format and is under 70 characters.

### Action Items

- [ ] 1.1 — Analyze commits to determine the dominant change type (feat/fix/docs/etc.)
- [ ] 1.2 — Determine scope from branch name or story:
  - Branch `feat/add-auth` → scope `auth`
  - Branch `fix/E001-1-login-bug` → scope `login`
  - Story title → derive scope from domain
- [ ] 1.3 — Write PR title: `{type}({scope}): {concise description}`
  - Max 70 characters
  - Lowercase after colon
  - Imperative mood
  - If single commit: derive from commit message
  - If multiple commits: derive from the overall goal
- [ ] 1.4 — If story_id available: optionally append ` [E001.1]` to title

### Phase 1 Checkpoint

- [ ] Title follows conventional format
- [ ] Title ≤ 70 characters

---

## PHASE 2: Generate PR Body

**Checkpoint:** PR body is structured, informative, and passes quality check.

### Action Items

- [ ] 2.1 — Write **Summary** section (3-5 bullet points):
  - What was changed
  - Why it was changed (business value)
  - Any breaking changes (or "No breaking changes")
  - Reference to story if applicable: "Implements story E001.1: {title}"
- [ ] 2.2 — Write **Changes** section — categorized list of changes:
  - New files created
  - Modified files
  - Deleted files (if any)
- [ ] 2.3 — Write **Test Plan** section — markdown checklist:
  - [ ] How to verify the main happy path
  - [ ] How to verify key error cases
  - [ ] Any manual testing steps needed
  - [ ] Automated tests to check (test file names)
- [ ] 2.4 — Write **Screenshots** section (if UI changes):
  - Placeholder: "<!-- Add screenshots if this includes UI changes -->"
- [ ] 2.5 — Write **Notes** section (if relevant):
  - Deployment notes
  - Migration needed
  - Follow-up stories or known limitations

### Phase 2 Checkpoint

- [ ] Summary has 3+ bullets
- [ ] Test Plan is actionable (specific, not generic)
- [ ] Breaking changes explicitly noted (or confirmed absent)

---

## PHASE 3: Create PR

**Checkpoint:** PR created and URL confirmed.

### Action Items

- [ ] 3.1 — Verify `gh auth status` is authenticated
- [ ] 3.2 — Build the `gh pr create` command:
  ```bash
  gh pr create \
    --title "{title}" \
    --body "$(cat <<'EOF'
  ## Summary

  {bullets}

  ## Changes

  {changed files}

  ## Test Plan

  {checklist}

  ## Notes

  {notes}

  Story: {story_id} — {story_title}
  EOF
  )" \
    --base {base_branch} \
    {--draft if draft=true} \
    {--reviewer {reviewers} if provided}
  ```
- [ ] 3.3 — Execute `gh pr create` command
- [ ] 3.4 — Capture PR URL from output
- [ ] 3.5 — Run `gh pr view {pr_number}` to confirm PR was created
- [ ] 3.6 — Output PR URL and number prominently

### Phase 3 Checkpoint

- [ ] PR created (URL returned by gh)
- [ ] PR confirmed via gh pr view
- [ ] PR URL output to user

---

## Acceptance Criteria

1. `gh` CLI is authenticated before attempting PR creation
2. PR title follows `{type}({scope}): {description}` format
3. PR title ≤ 70 characters
4. PR body has Summary, Changes, Test Plan sections
5. Test Plan is a markdown checklist (not prose)
6. PR URL is output to user after creation
7. PR is not created from main branch

---

## PR Title Format Reference

| Scenario                  | Example Title                              |
|---------------------------|--------------------------------------------|
| New feature               | `feat(auth): add password reset flow`      |
| Bug fix                   | `fix(api): handle null user in session`    |
| Documentation             | `docs(readme): add installation steps`     |
| Dependency update         | `chore(deps): upgrade next.js to 15.2.0`   |
| Multiple features in epic | `feat(e001): implement user onboarding`    |

---

## Error Handling

| Error                    | Action                                              |
|--------------------------|-----------------------------------------------------|
| gh not authenticated     | Run `gh auth login` and retry                       |
| Branch not pushed        | Run devops-push task first, then retry              |
| PR already exists        | Run `gh pr view` and output existing PR URL         |
| No commits on branch     | BLOCK — nothing to PR                               |
| Creating PR from main    | BLOCK — cannot PR from main to main                 |
