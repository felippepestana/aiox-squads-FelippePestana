# synthesize-profile

## Task: Synthesize Multi-Lens Behavioral Profile

### Metadata
- **executor:** profiler-dna-chief
- **elicit:** false
- **mode:** synthesis
- **output:** behavioral-profile.yaml

### Inputs Required
```
disc_read, bigfive_read, (optional) enneagram_lens
```

### Elicitation
```
(no elicitation; synthesizes existing reads)
```

### Execution Steps

#### Step 1: Reconcile lenses
- Combine DISC + Big Five + (optional) Enneagram into one coherent narrative.

#### Step 2: Note disagreements
- Where lenses disagree, surface the tension rather than averaging.

#### Step 3: Derive working guidance
- Summarize how to communicate, manage and onboard this person.

#### Step 4: Route to ethics gate
- Send the profile to ethics-gate before delivery.

### Output Format
```yaml
behavioral_profile:
  narrative: {one coherent story}
  lens_agreement: {where they align/diverge}
  working_guidance: [{...}]
  confidence: low|medium|high
  weight: 0
```

### Veto Conditions
- Cannot output a selection score
- Cannot deliver before ethics-gate PASS

### Completion Criteria
- Lenses reconciled into one narrative
- Disagreements noted
- Working guidance derived
- Routed to ethics-gate
