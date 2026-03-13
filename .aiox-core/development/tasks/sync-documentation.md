# Task: Sync Documentation

**Task ID:** sync-documentation
**Purpose:** Sync documentation to match current implementation
**Agent:** @dev (Dex)
**Usage:** `*sync-documentation`

---

## Overview

Ensures all documentation artifacts (README files, CHANGELOG, API docs, story File Lists) accurately reflect the current state of the codebase.

## Steps

- [ ] 1 — Scan for documentation targets:
  - README.md files in project root and key directories
  - CHANGELOG.md
  - Story file File Lists (verify all files listed actually exist)
  - Any `docs/` or `doc/` directory content

- [ ] 2 — For each README found:
  - Verify installation instructions still work (dependencies, commands)
  - Update version numbers if changed
  - Verify feature list matches actual features
  - Update API examples if APIs changed

- [ ] 3 — For CHANGELOG.md:
  - Check git log for unreleased changes since last version
  - Add entries for new features, bug fixes, breaking changes
  - Follow Keep a Changelog format

- [ ] 4 — For Story File Lists:
  - For each file in File List: verify it exists
  - For each recently modified file not in list: add it
  - Flag deleted files as "(deleted)"

- [ ] 5 — Update inline code comments:
  - Scan for TODO/FIXME/HACK comments
  - Identify which are stale (resolved by implementation)
  - Remove stale comments, update relevant ones

- [ ] 6 — Report:
```
📄 Documentation Sync Complete

READMEs updated: {N}
CHANGELOG entries added: {N}
Story File Lists corrected: {N}
TODOs resolved: {N}
Stale TODOs remaining: {N} (list)
```

## Constraints

- NEVER change implementation to match docs — change docs to match implementation
- NEVER modify story sections outside File List (AC, user story, technical notes)

---

_Task Version: 3.0 | Last Updated: 2026-03-13_
