# ═══════════════════════════════════════════════════════════════════════════════
# TASK: Sync Documentation
# ID: sync-documentation
# Version: 3.0.0
# Purpose: Synchronize documentation with current implementation — update
#          README files, CHANGELOG entries, API docs, and inline docs to
#          match the actual codebase state.
# Agent: @dev (Dex)
# Phase in Pipeline: general
# ═══════════════════════════════════════════════════════════════════════════════

## Overview

Documentation drift is inevitable. This task detects gaps between implementation
and documentation, then updates docs to match reality. It covers README files,
CHANGELOG entries, API documentation, squad documentation, and inline code
documentation.

### What This Task Syncs

| Documentation Type | Source of Truth | Output Location |
|-------------------|-----------------|-----------------|
| README.md | Current directory structure + features | Root and squad READMEs |
| CHANGELOG.md | Git log since last changelog entry | CHANGELOG.md files |
| API docs | Source code exports and types | docs/ or inline |
| Squad docs | Squad agents/tasks/workflows | squad README + config |
| Inline docs | Code logic | JSDoc/TSDoc in source files |

---

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| scope | string | YES | What to sync: "readme", "changelog", "api", "squad", "all" |
| target | string | NO | Specific path to sync (default: project root) |
| since | string | NO | For changelog: git ref to start from (default: last tag) |

---

## Preconditions

- [ ] Target path exists
- [ ] Git history available (for changelog)
- [ ] Source files exist (for API docs)

---

## PHASE 0: Documentation Audit

**Checkpoint:** Documentation gaps identified.

### Action Items

- [ ] 0.1 — Scan for documentation files:
  - Find all README.md files
  - Find all CHANGELOG.md files
  - Find doc/ directories
  - Find squad documentation (config.yaml, squad.yaml)
- [ ] 0.2 — For each documentation file, check last modified date vs source files
- [ ] 0.3 — Identify stale documentation:
  - README references features that no longer exist
  - CHANGELOG missing recent commits
  - API docs don't match current exports
  - Squad config doesn't list all agents/tasks
- [ ] 0.4 — List all gaps found:
  ```yaml
  gaps:
    - type: "readme"
      file: "README.md"
      issue: "Missing section for new feature X"
    - type: "changelog"
      file: "CHANGELOG.md"
      issue: "Missing entries since v1.2.0"
  ```

### Phase 0 Checkpoint

- [ ] Documentation files found
- [ ] Gaps identified
- [ ] Sync plan created

---

## PHASE 1: README Sync

**Checkpoint:** README files accurate and current.

*Skip if scope does not include "readme" or "all"*

### Action Items

- [ ] 1.1 — For EACH README.md found:
  - Read current README content
  - Scan the directory for current state (files, features, structure)
  - Compare README claims against reality
- [ ] 1.2 — Update README sections:
  - Project/squad description (if changed)
  - Installation/usage instructions (if changed)
  - Feature list (add new, remove deleted)
  - Directory structure diagram (if changed)
  - Agent/task lists for squad READMEs (if changed)
  - Badge information (version, status)
- [ ] 1.3 — Verify all links in README are valid (file references)
- [ ] 1.4 — Maintain README style consistency

### Phase 1 Checkpoint

- [ ] READMEs updated to match current state
- [ ] No dead links

---

## PHASE 2: CHANGELOG Sync

**Checkpoint:** CHANGELOG entries up to date.

*Skip if scope does not include "changelog" or "all"*

### Action Items

- [ ] 2.1 — Determine the last documented version/date in CHANGELOG
- [ ] 2.2 — Run `git log --oneline {since}..HEAD` to get new commits
- [ ] 2.3 — Categorize commits:
  ```yaml
  categories:
    Added: [feat commits]
    Changed: [refactor, update commits]
    Fixed: [fix commits]
    Removed: [remove, delete commits]
    Documentation: [docs commits]
    Internal: [chore commits]
  ```
- [ ] 2.4 — Generate new CHANGELOG entry:
  ```markdown
  ## [Unreleased] - {YYYY-MM-DD}

  ### Added
  - {feature description} ({commit ref})

  ### Changed
  - {change description} ({commit ref})

  ### Fixed
  - {fix description} ({commit ref})
  ```
- [ ] 2.5 — Prepend to CHANGELOG.md (newest first)

### Phase 2 Checkpoint

- [ ] New commits categorized
- [ ] CHANGELOG entry created
- [ ] Entry prepended to file

---

## PHASE 3: Squad Documentation Sync

**Checkpoint:** Squad docs match actual agents/tasks/workflows.

*Skip if scope does not include "squad" or "all"*

### Action Items

- [ ] 3.1 — For EACH squad in `squads/`:
  - List actual agents in `agents/` directory
  - List actual tasks in `tasks/` directory
  - List actual workflows in `workflows/` directory
  - Read `config.yaml` and `squad.yaml`
- [ ] 3.2 — Compare actual vs documented:
  - Agents listed in config vs agents in directory
  - Tasks referenced in workflows vs tasks that exist
  - Commands listed in README vs actual agent commands
- [ ] 3.3 — Update squad config.yaml if agents/tasks changed
- [ ] 3.4 — Update squad README.md with current agent/task lists
- [ ] 3.5 — Update squad.yaml manifest if metadata changed

### Phase 3 Checkpoint

- [ ] Squad configs match actual content
- [ ] Squad READMEs accurate
- [ ] No phantom references (docs referencing deleted content)

---

## PHASE 4: Validation

**Checkpoint:** All synced documentation is accurate.

### Action Items

- [ ] 4.1 — Re-read all updated documentation files
- [ ] 4.2 — Verify no formatting issues introduced
- [ ] 4.3 — Verify no content was accidentally deleted
- [ ] 4.4 — Run lint on markdown files if linter available
- [ ] 4.5 — Display sync summary:
  ```
  Documentation Sync Complete:
  - READMEs updated: N
  - CHANGELOGs updated: N
  - Squad configs updated: N
  - Total gaps resolved: N
  ```

### Phase 4 Checkpoint

- [ ] All updates verified
- [ ] No formatting issues
- [ ] Summary displayed

---

## Acceptance Criteria

1. Documentation gaps identified and listed
2. Updated documentation matches current implementation
3. No dead links in README files
4. CHANGELOG has entries for all recent commits
5. Squad documentation matches actual agents/tasks
6. No formatting issues introduced
7. No content accidentally removed

---

## Output Specification

| Field | Value |
|-------|-------|
| Primary Output | Updated documentation files |
| Secondary Output | Sync report with gaps resolved |

---

## Dependencies

| Resource | Type | Path |
|----------|------|------|
| README files | doc | Various locations |
| CHANGELOG files | doc | Various locations |
| Squad configs | config | `squads/*/config.yaml` |

---

## Error Handling

| Error | Action |
|-------|--------|
| No README found | Create minimal README from directory analysis |
| No CHANGELOG found | Create new CHANGELOG with current state |
| Squad config invalid YAML | Fix YAML syntax, then update |
| Git history unavailable | Skip CHANGELOG phase, document limitation |

---

_Task Version: 3.0.0_
_Last Updated: 2026-03-13_
