# Containerize Application

**Task ID:** containerize-app
**Execution Type:** Hybrid
**Purpose:** Create production-ready Docker configuration for an application
**Orchestrator:** @container-engineer
**Mode:** Elicitation-based (interactive)
**Quality Standard:** AIOX Level (300+ lines)
**Model:** Sonnet

---

## Overview

```
INPUT (application details: language, framework, ports)
    ↓
[PHASE 0: Application Analysis]
    → Step 0.1: Identify app type, language, dependencies
    → Step 0.2: Identify ports, volumes, environment variables
    ↓
[PHASE 1: Dockerfile Creation]
    → Step 1.1: Choose base image strategy
    → Step 1.2: Write multi-stage Dockerfile
    → Step 1.3: Create .dockerignore
    → Step 1.4: Security hardening
    ↓
[PHASE 2: Orchestration]
    → Step 2.1: Create docker-compose.yml (if needed)
    → Step 2.2: Add health checks and resource limits
    ↓
OUTPUT: Dockerfile + .dockerignore + docker-compose.yml
```

## Task Anatomy

| Field | Value |
|-------|-------|
| **task_id** | containerize-app |
| **purpose** | Create optimized, secure Docker configuration |
| **executor** | Agent |
| **execution_type** | Hybrid |
| **input** | Application language, framework, ports, dependencies |
| **output** | Dockerfile, .dockerignore, docker-compose.yml |
| **action_items** | 7 steps across 3 phases |
| **acceptance_criteria** | Multi-stage build, non-root user, health check, minimal image |

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `language` | string | Yes | Programming language |
| `framework` | string | Yes | Framework (React, Express, Django, etc.) |
| `port` | number | Yes | Application port |
| `needs_compose` | boolean | No | Whether docker-compose is needed |
| `services` | list | No | Additional services (database, cache, etc.) |

## PHASE 0: Application Analysis

### Step 0.1: Identify Application Type
Determine:
- Language and runtime version
- Build process (compiled vs interpreted)
- Static assets vs server-rendered
- Package manager and lock file

### Step 0.2: Runtime Requirements
Identify:
- Exposed ports
- Required environment variables
- Volume mounts (persistent data)
- External service dependencies (DB, cache, queue)

## PHASE 1: Dockerfile Creation

### Step 1.1: Base Image Strategy
Select the optimal base image:
- **Node.js:** `node:20-alpine` (build) → `node:20-alpine` or `gcr.io/distroless/nodejs20` (runtime)
- **Python:** `python:3.12-slim` (build) → `python:3.12-slim` (runtime)
- **Go:** `golang:1.22-alpine` (build) → `scratch` or `gcr.io/distroless/static` (runtime)
- **Java:** `eclipse-temurin:21-jdk-alpine` (build) → `eclipse-temurin:21-jre-alpine` (runtime)

### Step 1.2: Multi-Stage Dockerfile
Write a multi-stage Dockerfile that:
1. **Stage 1 (builder):** Install dependencies, build the application
2. **Stage 2 (runtime):** Copy only necessary files, set user, expose port

### Step 1.3: .dockerignore
Generate `.dockerignore` excluding:
- `.git/`, `node_modules/`, `__pycache__/`
- Test files, documentation, CI configs
- Environment files (`.env`, `.env.local`)
- IDE files (`.vscode/`, `.idea/`)

### Step 1.4: Security Hardening
- Create non-root user
- Set read-only filesystem where possible
- Pin base image digest for reproducibility
- Add HEALTHCHECK instruction
- Remove unnecessary packages

## PHASE 2: Orchestration

### Step 2.1: Docker Compose (if needed)
Create `docker-compose.yml` with:
- Application service with build context
- Database service (PostgreSQL, MySQL, MongoDB)
- Cache service (Redis, Memcached)
- Networking (custom bridge network)
- Volume mounts for persistent data

### Step 2.2: Production Readiness
Add:
- Health check configurations
- Resource limits (CPU, memory)
- Restart policies
- Log driver configuration
- Environment variable management

## Output

- **Dockerfile:** Multi-stage, optimized, secure
- **.dockerignore:** Comprehensive exclusion list
- **docker-compose.yml:** Complete orchestration (if requested)

## Completion Criteria

- [ ] Multi-stage Dockerfile generated
- [ ] Non-root user configured
- [ ] HEALTHCHECK instruction present
- [ ] .dockerignore created
- [ ] Base images pinned to specific versions
- [ ] docker-compose.yml includes all required services (if applicable)
