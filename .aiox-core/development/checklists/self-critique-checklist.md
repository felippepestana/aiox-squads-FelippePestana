# Self-Critique Checklist

**Purpose:** Used by @dev at mid-implementation checkpoints (Step 3.5 and Step 5.5 of development workflow). A quick sanity check to catch issues before they compound.

**Usage:** Run via `*checklist self-critique-checklist` or review mentally at checkpoint steps.

---

## Problem Alignment

- [ ] Am I solving the right problem? (Re-read the acceptance criteria now)
- [ ] Is my implementation within story scope? (No Invention principle -- Article IV)
- [ ] Did I add any features not requested in the AC?
- [ ] Am I building what the user needs, not what I think is cool?

---

## Solution Quality

- [ ] Is this the simplest solution that satisfies all AC?
- [ ] Am I over-engineering? (YAGNI -- You Ain't Gonna Need It)
- [ ] Could this be simpler without losing correctness?
- [ ] Am I introducing unnecessary abstractions?
- [ ] Did I introduce any new dependencies that could be avoided?

---

## Completeness

- [ ] Did I miss any edge case from the AC?
- [ ] What happens with empty input? Null? Very large input?
- [ ] What happens if the network fails during this operation?
- [ ] What happens if the user double-clicks or retries?
- [ ] Are there error paths I have not handled?

---

## Code Quality

- [ ] Is the code readable to another developer without explanation?
- [ ] Did I follow the existing patterns in the codebase?
- [ ] Did I respect the IDS protocol? (search for existing solutions before creating new ones)
- [ ] Are my function and variable names descriptive?
- [ ] Is there any duplicated code I should extract?

---

## Security

- [ ] Are there security implications I missed?
- [ ] Am I trusting user input anywhere without validation?
- [ ] Could any of my changes expose sensitive data?
- [ ] Did I accidentally log any sensitive information?

---

## Testing

- [ ] Does this break any existing tests? (Run them now if unsure)
- [ ] Have I written tests for the new logic?
- [ ] Are my tests testing behavior, not implementation details?

---

## Integration

- [ ] Will my changes conflict with other team members' work?
- [ ] Did I check if anyone else is modifying the same files?
- [ ] Are my changes backward compatible with existing consumers?

---

## How to Use

1. Pause at the designated checkpoint step
2. Read each item and honestly assess
3. If any item reveals a concern: address it now, not later
4. If all items pass: continue to the next implementation phase
5. This should take 2-3 minutes -- it is a quick mental review, not a formal audit

---

## Scoring

This checklist is not scored. It is a reflective tool. If more than 3 items reveal concerns, consider pausing to re-evaluate your approach before continuing.
