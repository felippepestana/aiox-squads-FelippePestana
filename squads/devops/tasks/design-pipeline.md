# Design CI/CD Pipeline

**Task ID:** design-pipeline
**Execution Type:** Hybrid
**Purpose:** Design and generate a complete CI/CD pipeline configuration for the user's project
**Orchestrator:** @pipeline-architect
**Mode:** Elicitation-based (interactive)
**Quality Standard:** AIOX Level (300+ lines)
**Model:** Sonnet

---

## Overview

```
INPUT (project tech stack + CI/CD platform preference)
    ↓
[PHASE 0: Stack Analysis]
    → Step 0.1: Identify language, framework, package manager
    → Step 0.2: Identify test framework and deployment target
    ↓
[PHASE 1: Pipeline Design]
    → Step 1.1: Define stages (lint → test → build → scan → deploy)
    → Step 1.2: Add caching strategy
    → Step 1.3: Add parallelism and matrix builds
    → Step 1.4: Add deployment gates and rollback
    ↓
[PHASE 2: Generation & Validation]
    → Step 2.1: Generate pipeline configuration file
    → Step 2.2: Validate against best practices checklist
    ↓
OUTPUT: Pipeline configuration file + optimization notes
```

## Task Anatomy

| Field | Value |
|-------|-------|
| **task_id** | design-pipeline |
| **purpose** | Design and generate optimized CI/CD pipeline |
| **executor** | Agent |
| **execution_type** | Hybrid |
| **input** | Tech stack, CI/CD platform, deployment target |
| **output** | Pipeline configuration file(s) |
| **action_items** | 8 steps across 3 phases |
| **acceptance_criteria** | Pipeline includes caching, tests, security scan, deploy gates |

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `language` | string | Yes | Primary programming language |
| `framework` | string | Yes | Web framework or library |
| `ci_platform` | string | Yes | GitHub Actions, GitLab CI, Jenkins |
| `deploy_target` | string | Yes | Where the app is deployed |
| `test_framework` | string | No | Testing framework used |

## PHASE 0: Stack Analysis

### Step 0.1: Gather Stack Information
Ask the user about their tech stack if not already provided. Identify:
- Language and version
- Framework and package manager
- Test framework
- Build tool (if applicable)

### Step 0.2: Identify Deployment Target
Determine where the application is deployed:
- Cloud provider (AWS, GCP, Azure)
- Platform (Kubernetes, ECS, Lambda, Cloud Run, VPS, Vercel, Netlify)
- Environment structure (dev, staging, production)

## PHASE 1: Pipeline Design

### Step 1.1: Define Pipeline Stages
Design the stage sequence based on the stack:

1. **Checkout & Setup** — Clone repo, set up language runtime
2. **Install** — Install dependencies with caching
3. **Lint & Format** — Code quality checks
4. **Test** — Unit tests, integration tests (parallel if possible)
5. **Build** — Compile/bundle application
6. **Security Scan** — SAST + dependency scanning
7. **Deploy Staging** — Deploy to staging environment
8. **Deploy Production** — Deploy to production (with approval gate)

### Step 1.2: Caching Strategy
Add caching for:
- Package manager cache (node_modules, pip cache, maven cache)
- Build cache (Docker layers, compiled artifacts)
- Test cache (if applicable)

### Step 1.3: Optimization
- Matrix builds for multi-version testing
- Parallel test execution
- Conditional stages (skip deploy on feature branches)
- Artifact passing between stages

### Step 1.4: Safety Layer
- Branch protection alignment
- Required status checks
- Deployment approval gates for production
- Rollback mechanism
- Failure notifications (Slack, email)

## PHASE 2: Generation & Validation

### Step 2.1: Generate Configuration
Generate the complete CI/CD configuration file for the chosen platform.

### Step 2.2: Validate
Check against the Pipeline Quality Checklist:
- [ ] Caching enabled for dependencies
- [ ] Tests run before build
- [ ] Security scanning included
- [ ] Staging deploy before production
- [ ] Production deploy has approval gate
- [ ] Failure notifications configured
- [ ] Secrets use environment variables (not hard-coded)
- [ ] Pipeline is idempotent (safe to re-run)

## Output

- **Format:** YAML (platform-specific configuration file)
- **Location:** Project root (`.github/workflows/`, `.gitlab-ci.yml`, `Jenkinsfile`)
- **Includes:** Comments explaining each stage and optimization

## Completion Criteria

- [ ] Pipeline configuration generated for the correct CI/CD platform
- [ ] All stages defined with proper dependencies
- [ ] Caching strategy implemented
- [ ] Security scanning stage included
- [ ] Deployment gates configured
- [ ] Failure notifications set up
