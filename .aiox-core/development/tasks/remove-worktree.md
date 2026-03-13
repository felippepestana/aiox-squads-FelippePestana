# Task: Remove Worktree

**Task ID:** remove-worktree
**Purpose:** Remove completed or stale worktrees
**Agent:** @dev (Dex)

---

## Safety Checks

- [ ] 1 — Verify worktree exists
- [ ] 2 — Check if worktree has uncommitted changes: WARN if yes, require confirmation
- [ ] 3 — Check if story is in Done status (safe to remove) or confirm intent

## Steps

- [ ] 4 — Run: `git worktree remove .aiox/worktrees/story-{story_id}`
- [ ] 5 — If --force flag: `git worktree remove --force .aiox/worktrees/story-{story_id}`
- [ ] 6 — Delete branch if merged: `git branch -d story/{story_id}`
- [ ] 7 — Clean up state file: `.aiox/builds/build-{story_id}.json`

---

_Task Version: 3.0 | Last Updated: 2026-03-13_
