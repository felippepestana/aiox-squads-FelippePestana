# write-jd

## Task: Write a Skills-Based Job Description + Success Profile

### Metadata
- **executor:** role-designer
- **elicit:** true
- **mode:** generative
- **output:** job-description.yaml

### Inputs Required
```text
role: title/family the work belongs to
purpose: why the role exists (the outcome it owns)
outcomes: what success looks like in 6–12 months
context: team, stakeholders, modality (presencial|remoto|hibrido)
level_hint: optional level of work (IC/management track)
```

### Elicitation
```text
What role are we describing, and what outcome does it own in the first 12 months?
> [user]

Who does it work with, and is there an existing role family/level to anchor to?
> [user or skip]
```

### Execution Steps

#### Step 1: Start from outcomes
- Define the 6–12 month outcomes the role must produce before listing any task.

#### Step 2: Derive skills
- Translate outcomes into core skills + level of work; name the skill, not a degree/tenure proxy.

#### Step 3: Split must vs. nice
- Mark each requirement must-have or nice-to-have; challenge every must-have that narrows the pool.

#### Step 4: Inclusive pass + level
- Strip coded/jargon language; set the level of work and hand to comp-strategist for banding.

### Output Format
```yaml
job_description:
  role: {title}
  family: {role family}
  level: {IC/M level of work}
  purpose: {one line — the outcome it owns}
  outcomes_12mo:
    - {outcome}
  core_skills:
    - { skill: {name}, level: {needed level}, must_have: true }
  nice_to_have:
    - {skill}
  scope_of_work: {what it owns / where it escalates}
  inclusive_language_checked: true
  next: "route to comp-strategist for band; equity-gate before publish"
```

### Veto Conditions
- Cannot write title-first or as a task dump
- Cannot use degree/tenure as a proxy for a demonstrable skill
- Cannot ship coded/exclusionary language
- Cannot publish before the equity-gate

### Completion Criteria
- Outcomes defined before tasks/skills
- Skills named with level; must vs. nice split
- Level of work set; routed to comp-strategist
- Language inclusive and jargon-explained
