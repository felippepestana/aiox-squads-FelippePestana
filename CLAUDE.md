# CLAUDE.md — AIOX Squads Repository

## Project Overview

**AIOX Squads** is the community repository for AI agent squads built on the [AIOX framework](https://github.com/SynkraAI/aiox-core). It functions like an npm registry — users discover, install, and contribute "squads" (packages of specialized AI agents with consistent Voice DNA and decision heuristics).

**Core concept:** If a single AI agent is an employee, a Squad is an entire department of specialized agents that work together in a domain.

**License:** MIT
**Primary language:** Portuguese (English docs at `doc/README.en.md`)

---

## Repository Structure

```
/
├── README.md                  # Main docs (Portuguese)
├── doc/
│   ├── README.en.md           # English docs
│   └── assets/                # Header images, logos
└── squads/                    # All squad packages
    ├── apex/                  # Frontend ultra-premium (14 agents)
    ├── curator/               # Video content curation (11 agents)
    ├── deep-research/         # Research & data analysis (5 agents)
    ├── dispatch/              # Parallel execution engine (8 agents)
    ├── education/             # Instructional design (16 agents)
    ├── kaizen/                # System monitoring & improvement (7 agents)
    ├── seo/                   # SEO optimization (3 agents)
    ├── squad-creator/         # Meta-squad for creating squads (1 agent + tools)
    └── squad-creator-pro/     # Pro version of squad creator
```

### Squad Internal Structure

Each squad follows a consistent layout:

```
squads/{squad-name}/
├── agents/           # Agent definition files (.md)
├── tasks/            # Task definitions (.md)
├── templates/        # YAML/MD execution templates
├── workflows/        # Workflow orchestration (.yaml)
├── checklists/       # Quality assurance checklists
├── config/           # Configuration files
├── data/             # Domain-specific reference data
├── config.yaml       # (or squad.yaml) Squad configuration
├── README.md         # Squad documentation
└── CHANGELOG.md      # Version history
```

---

## Tech Stack

- **Markdown (.md):** Agent definitions, tasks, documentation — the primary format
- **YAML (.yaml):** Squad configuration, workflows, task definitions
- **Python (>= 3.10):** Validation scripts, analytics, automation
- **Node.js (>= 18.0.0):** Squad generation, guide generation, scaffolding
- **Bash:** Validation and setup shell scripts

### Key Dependencies

**Python** (used by dispatch, squad-creator):
- `PyYAML`, `pydantic`, `tenacity`, `pybreaker`, `rich`

**Node.js** (used by squad-creator):
- `js-yaml`

---

## Build, Validation & Scripts

There is no traditional build step. The project uses validation scripts to ensure squad quality.

### Running Validation

```bash
# From squad-creator directory
cd squads/squad-creator

# Run all validations
bash scripts/validate-all.sh

# Validate a specific squad
bash scripts/validate-squad.sh {squad-name}

# Check squad completeness
bash scripts/verify-squad-completeness.sh {squad-name}
```

### npm Scripts (in `squads/squad-creator/package.json`)

```bash
npm run analytics    # python3 scripts/squad-analytics.py squad-creator
npm run validate     # python3 scripts/validate-squad-structure.py
npm run refresh      # python3 scripts/refresh-registry.py --write
npm run greeting     # node scripts/generate-squad-greeting.js squad-creator squad-chief
npm run guide        # node scripts/generate-squad-guide.js squad-creator
```

### Validation Tools (in `squads/squad-creator/scripts/`)

| Script | Purpose |
|--------|---------|
| `validate-squad-structure.py` | Structural validation |
| `yaml_validator.py` | YAML schema validation |
| `checklist_validator.py` | Checklist validation |
| `naming_validator.py` | Naming convention enforcement |
| `dependency_check.py` | Dependency verification |
| `security_scanner.py` | Security analysis |
| `coherence-validator.py` | Code coherence checks |
| `squad-analytics.py` | Generate squad statistics |
| `scaffold-squad.cjs` | Scaffold a new squad |

---

## Testing

There is no Jest/Vitest/pytest test suite. Quality assurance is handled through:

1. **Validation scripts** — structural, YAML, naming, dependency, security, coherence
2. **Checklist-based quality gates** — up to 9 checklists per squad
3. **Quality scoring** with maturity levels:
   - **DRAFT:** score < 7.0
   - **DEVELOPING:** score >= 7.0
   - **OPERATIONAL:** score >= 9.0 (tested in production)

To validate before a PR, run `*validate-squad {name}` and ensure score >= 7.0.

---

## Linting & Formatting

No ESLint, Prettier, or similar tools at root. Code quality is enforced through:

- Python validation scripts (naming conventions, YAML schemas, coherence)
- Structured markdown format requirements for agent files
- Manual review during PR process

---

## CI/CD

No GitHub Actions or CI pipelines are configured. Validation is local/manual before PRs.

**PR workflow:**
1. Fork the repository
2. Create or modify a squad
3. Run `*validate-squad {name}` locally
4. Achieve score >= 7.0
5. Open a PR with validation score

---

## Architecture & Key Concepts

### Tier System (Agent Hierarchy)

Every squad follows a chain of command:

```
Tier 0 — Chief/Orchestrator (routes & classifies intent)
├── Tier 1 — Masters (primary domain specialists)
├── Tier 2 — Specialists (sub-domain experts)
├── Tier 3 — Support/QA (validation, templates, analytics)
├── Tier 4 — Advanced Specialists (niche)
└── Tier 5 — QA/Validation (final checks)
```

### Agent Anatomy (6-Layer Format)

Every agent is a structured `.md` file with:

```yaml
agent:       # Identity — name, id, tier
persona:     # Function and communication style
voice_dna:   # Cloned vocabulary, phrase patterns, anti-patterns
heuristics:  # SE/THEN decision rules with veto conditions
examples:    # Concrete input/output pairs (minimum 3)
handoffs:    # When to stop and delegate to another agent
```

### Handoff Protocol

- Always visible to the user (announced before delegation)
- Max 5 chained handoffs
- "Done" closes the chain
- Cross-squad handoffs supported via `/` slash commands

### Composition

Squads are composable — you can mix multiple squads (e.g., copy + brand + data) in the same project. Agents know how to hand off between squads.

---

## Squad Inventory

| Squad | Version | Agents | Purpose |
|-------|---------|--------|---------|
| **apex** | 1.1.0 | 14 | Frontend ultra-premium (Web/Mobile/Spatial) |
| **curator** | — | 11 | Video content curation & structuring |
| **deep-research** | — | 5 | Research & data analysis |
| **dispatch** | 1.0.0 | 8 | Parallel execution engine with wave optimization |
| **education** | 1.0.0 | 16 | Instructional design (pedagogical frameworks) |
| **kaizen** | 1.3.0 | 7 | System monitoring & continuous improvement |
| **seo** | — | 3 | SEO optimization & technical auditing |
| **squad-creator** | 4.0.0 | 1+tools | Meta-squad for creating new squads |
| **squad-creator-pro** | — | — | Pro features (mind cloning, model routing) |

**Total: 73+ specialized agents across 9 squads.**

---

## Conventions for AI Assistants

### When Modifying Squads

- Follow the 6-layer agent format exactly (`agent`, `persona`, `voice_dna`, `heuristics`, `examples`, `handoffs`)
- Maintain the tier hierarchy — don't bypass the Chief for routing
- Preserve Voice DNA patterns — agents should sound like their cloned specialists
- Keep heuristics deterministic with SE/THEN rules and veto conditions
- Include minimum 3 input/output examples per agent
- Run validation (`validate-squad.sh`) after any squad changes

### When Creating New Squads

- Use the squad-creator scaffold: `node squads/squad-creator/scripts/scaffold-squad.cjs {name}`
- Follow the standard directory layout (agents/, tasks/, templates/, workflows/, checklists/, config/)
- Include `config.yaml` or `squad.yaml`, `README.md`, and `CHANGELOG.md`
- Target a validation score >= 7.0 before submitting

### File Naming

- Agent files: `{squad-name}-{role}.md` (e.g., `apex-lead.md`)
- Task files: descriptive kebab-case `.md` files
- Config files: `config.yaml` or `squad.yaml`
- Workflows: `.yaml` files in `workflows/`

### Commit Message Style

Follow the conventional commits pattern observed in the repo:

```
feat: add {squad-name} squad — {brief description}
fix: {description}
docs: {description}
chore({scope}): {description}
refactor({scope}): {description}
```

### Language

- Documentation in Portuguese is the default (with English alternatives in `doc/`)
- Agent definitions and technical content may be in English or Portuguese
- Squad-specific content follows the squad's primary language

---

## Installation & Usage

**Prerequisites:** AIOX framework must be installed (`npx aios-core init`)

```bash
# Install a squad via AIOX CLI
@squad-chief
*download-squad {squad-name}

# Or manually copy
cp -r squads/{squad-name} /your-project/squads/{squad-name}

# Activate the squad chief
@{squad-name}-chief

# See available commands
*help
```

**Supported IDEs/CLIs:** Claude Code (full support), Codex CLI, Gemini CLI, Cursor
