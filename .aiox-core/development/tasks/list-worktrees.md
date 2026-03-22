# Task: List Worktrees

**Task ID:** list-worktrees
**Purpose:** List active worktrees with status
**Agent:** @dev (Dex)

---

## Steps

- [ ] 1 — Run: `git worktree list --porcelain`
- [ ] 2 — Parse output: path, HEAD commit, branch name
- [ ] 3 — For each worktree: check associated build state file
- [ ] 4 — Display table

## Output Format

```
Active Worktrees:
| Story | Branch | Status | Last Modified |
|-------|--------|--------|---------------|
| 2.1   | story/2.1 | RUNNING | 2026-03-13 |
| 2.2   | story/2.2 | COMPLETE | 2026-03-12 |
```

---

_Task Version: 3.0 | Last Updated: 2026-03-13_
