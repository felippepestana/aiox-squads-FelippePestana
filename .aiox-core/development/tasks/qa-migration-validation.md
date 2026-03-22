# Task: QA Migration Validation

**Task ID:** qa-migration-validation
**Purpose:** Validate database migrations before applying to production
**Agent:** @qa (Quinn)

---

## Steps

For each new migration file:

- [ ] 1 — Read migration file completely
- [ ] 2 — **Safety checks:**
  - [ ] Is there a DOWN migration (rollback)?
  - [ ] Is the UP migration reversible?
  - [ ] Does it lock tables excessively (ALTER TABLE on large tables)?
  - [ ] Does it drop data (DROP COLUMN, DROP TABLE)? If yes: is data backed up?
- [ ] 3 — **Correctness checks:**
  - [ ] Column types match application models?
  - [ ] Indexes created for commonly queried columns?
  - [ ] Foreign key constraints properly defined?
  - [ ] NOT NULL constraints have defaults for existing rows?
- [ ] 4 — **Security checks:**
  - [ ] No sensitive data exposed in migration (no hardcoded values)?
  - [ ] RLS policies updated if new tables added?
  - [ ] Permissions granted/revoked appropriately?
- [ ] 5 — **Test migration:**
  - [ ] Apply to test/staging environment
  - [ ] Verify application still works
  - [ ] Run rollback (DOWN migration), verify it completes
  - [ ] Re-apply UP migration, verify it's idempotent

## Verdict

APPROVED | NEEDS_ROLLBACK_PLAN | REJECTED (with reason)

---
_Task Version: 3.0 | Last Updated: 2026-03-13_
