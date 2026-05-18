# Full DevOps Cycle

**Task ID:** full-devops-cycle
**Execution Type:** Hybrid
**Purpose:** End-to-end DevOps automation — pipeline, containers, infrastructure, monitoring, security
**Orchestrator:** @devops-chief
**Mode:** Elicitation-based (interactive)
**Quality Standard:** AIOX Level (500+ lines)
**Model:** Opus

---

## Overview

```
INPUT (project details + cloud target)
    ↓
[PHASE 1: CI/CD Pipeline]          → @pipeline-architect
    → Design and generate pipeline
    ↓
[PHASE 2: Containerization]        → @container-engineer
    → Dockerfile + docker-compose
    ↓
[PHASE 3: Infrastructure]          → @infra-coder
    → Terraform/IaC configuration
    ↓
[PHASE 4: Monitoring]              → @monitor-sentinel
    → Observability stack
    ↓
[PHASE 5: Security]                → @devsecops-guardian
    → Security scanning integration
    ↓
OUTPUT: Complete DevOps setup ready for production
```

## Task Anatomy

| Field | Value |
|-------|-------|
| **task_id** | full-devops-cycle |
| **purpose** | Complete DevOps automation from scratch |
| **executor** | Agent (multi-agent orchestration) |
| **execution_type** | Hybrid |
| **input** | Project stack, cloud provider, deployment requirements |
| **output** | Pipeline config, Dockerfile, IaC, monitoring, security setup |
| **action_items** | 5 phases, each delegated to specialist agent |
| **acceptance_criteria** | All phases complete with integration between them |

## Orchestration

The DevOps Chief coordinates this task by sequentially engaging each specialist:

1. **Pipeline Architect** — Designs the CI/CD pipeline
2. **Container Engineer** — Containerizes the application
3. **Infra Coder** — Provisions cloud infrastructure
4. **Monitor Sentinel** — Sets up observability
5. **DevSecOps Guardian** — Integrates security scanning

Each phase builds on the previous one. The pipeline references the Docker build.
The infrastructure hosts the containers. The monitoring watches the infrastructure.
The security scanning is embedded in the pipeline.

## Completion Criteria

- [ ] CI/CD pipeline generated and includes all stages
- [ ] Application containerized with production-ready Dockerfile
- [ ] Infrastructure provisioned as code with remote state
- [ ] Monitoring configured with SLOs and alerting
- [ ] Security scanning integrated into pipeline
- [ ] All components reference each other consistently
