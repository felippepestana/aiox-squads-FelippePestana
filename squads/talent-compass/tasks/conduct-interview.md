# conduct-interview

## Task: Conduct the Adaptive Structured Interview

### Metadata
- **executor:** ai-interviewer
- **elicit:** true
- **mode:** interactive
- **output:** interview-responses.yaml

### Inputs Required
```
interview_guide: output of build-interview-guide
candidate: name/identifier
resume: (optional) CV for context
```

### Elicitation
```
Who am I interviewing, and is there a CV to reference?
> [user]

[Then conduct the guide question by question, capturing responses]
```

### Execution Steps

#### Step 1: Open and set expectations
- Warm, brief intro: specific examples help most, no trick questions. Put the candidate at ease without leading.

#### Step 2: Run the core guide
- Ask each core question identically to how it will be asked of every candidate. Do not skip core questions.

#### Step 3: Probe adaptively
- When an answer stays abstract, probe for the candidate's specific Action and measurable Result. Adapt only the probes, not the core questions.

#### Step 4: Capture raw evidence
- Record responses verbatim/summarized as evidence. Do NOT score or editorialize during the interview.

#### Step 5: Close
- Invite the candidate's questions; explain next steps. Hand responses to evidence-scorer.

### Output Format
```yaml
interview_responses:
  candidate: {name}
  responses:
    - competency: {name}
      question: {text}
      answer: {captured response}
      star: {situation, task, action, result}
```

### Veto Conditions
- Cannot skip core guide questions
- Cannot score during the interview
- Cannot ask off-guide questions on protected attributes
- Cannot lead the candidate to a desired answer

### Completion Criteria
- All core questions asked identically
- Responses captured as STAR evidence
- No scoring performed yet
- interview-responses.yaml produced
