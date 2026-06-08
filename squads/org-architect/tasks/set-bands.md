# set-bands

## Task: Define and Benchmark Salary Bands + Leveling

### Metadata
- **executor:** comp-strategist
- **elicit:** true
- **mode:** generative
- **output:** salary-band.yaml

### Inputs Required
```text
role: role/level to band (from role-designer)
level: IC/management level of work
market: geography + market reference (e.g., P50 tech SP)
posture: lead | match | lag
currency: e.g., BRL/month
market_data: optional benchmark inputs
```

### Elicitation
```text
Which role/level are we banding, and what market are we targeting (geo + percentile)?
> [user]

Lead, match or lag the market — and any benchmark data you already have?
> [user or skip]
```

### Execution Steps

#### Step 1: Anchor the midpoint
- Set the midpoint to the target market reference for the level; state the percentile + posture.

#### Step 2: Set the spread
- Define min/max around the midpoint (range spread); leave room to grow within level.

#### Step 3: Placement logic
- Define compa-ratio placement (new vs. proficient vs. top of level), anchored on skills — never prior salary.

#### Step 4: Compression + gate
- Check overlap/compression vs. adjacent levels; route to equity-gate before publish.

### Output Format
```yaml
salary_band:
  role: {role}
  level: {level}
  currency: {BRL/month}
  market_reference: { percentile: {P50}, posture: match|lead|lag }
  min: {value}
  midpoint: {value}
  max: {value}
  range_spread: {±% around midpoint}
  placement:
    new_in_level: {~compa-ratio}
    proficient: {~1.0}
    top_of_level: {~compa-ratio}
  compression_check: {flag or none}
  rationale: "midpoint ties to {market ref}; spread allows growth in level"
  next: "route to equity-gate before communicate/publish"
```

### Veto Conditions
- Cannot publish a band without a stated market reference + rationale
- Cannot anchor placement on prior salary or negotiation
- Cannot let protected attributes/proxies into pay logic
- Cannot communicate before equity-gate passes

### Completion Criteria
- Midpoint tied to a stated market reference + posture
- Min/max/spread and compa-ratio placement defined
- Compression checked vs. adjacent levels
- Routed to equity-gate
