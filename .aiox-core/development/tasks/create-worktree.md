# Task: Create Worktree

**Task ID:** create-worktree
**Purpose:** Create isolated git worktree for story implementation
**Agent:** @dev (Dex) — Note: merge/push via @devops only

---

## Steps

- [ ] 1 — Verify story ID format (e.g., "2.1", "3.4")
- [ ] 2 — Check worktree doesn't already exist: `git worktree list`
- [ ] 3 — Create worktree: `git worktree add .aiox/worktrees/story-{story_id} -b story/{story_id}`
- [ ] 4 — Verify creation: check directory exists
- [ ] 5 — Log: "Worktree created at .aiox/worktrees/story-{story_id}"

## Output

```
Worktree: .aiox/worktrees/story-{story_id}
Branch: story/{story_id}
Base: {current_branch}
```

---

_Task Version: 3.0 | Last Updated: 2026-03-13_
