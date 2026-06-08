# design-survey

## Task: Design a Bias-Free Listening Instrument

### Metadata
- **executor:** survey-designer
- **elicit:** true
- **mode:** generative
- **output:** survey-design.yaml

### Inputs Required
```text
need: the listening need (matches workflow input `need`)
audience: who is surveyed and the segments that matter
cadence: annual climate | quarterly pulse | eNPS | ad-hoc
drivers: the engagement drivers to measure this cycle
min_group_size: minimum group size for any reported cut (anonymity by design)
```

### Elicitation
```text
What do you want to measure this cycle, and for which audience?
> [user]

Cadence (climate/pulse/eNPS), key drivers, and the minimum group size for reporting?
> [user or skip]
```

### Execution Steps

#### Step 1: Choose the smallest instrument that answers the need
- Prefer the fewest items; every item must map to a decision someone could make.

#### Step 2: Write bias-free items
- One consistent scale; remove leading, double-barreled and loaded wording.
- Include eNPS (0-10) where relevant + 1 open-ended question.

#### Step 3: Set anonymity by design
- Define the minimum group size and which cuts are allowed; exclude demographic combinations that could re-identify a respondent.

### Output Format (`survey-design.yaml`)
```yaml
survey_design:
  audience: ""
  cadence: ""              # climate | pulse | enps | ad-hoc
  items:
    - { id: "", text: "", scale: "", driver: "" }
  open_question: ""
  enps: true
  reporting:
    min_group_size: 0      # no cut reported below this
    allowed_cuts: []       # safe segments only
    blocked_cuts: []       # combinations that re-identify
```

### Veto Conditions
- Leading/double-barreled items → rewrite before output.
- Allowed cuts that could re-identify respondents → remove.
- No minimum group size set → fix.

### Completion Criteria
- Short, bias-free instrument with eNPS + open question, and an explicit reporting/anonymity plan. Hand off to sentiment-analyst once fielded.
