# DevOps Engineer Squad

> **Pipeline-driven infrastructure automation — from code to production with confidence.**

## Quick Start

```bash
# Activate the squad via AIOX chatbot or web portal
# Select squad: devops → agent: devops-chief

# Available commands once active:
*help              # Show all commands
*pipeline          # Design a CI/CD pipeline
*containerize      # Containerize an application
*infra             # Provision infrastructure as code
*monitor           # Set up monitoring & alerting
*security-scan     # Run DevSecOps security assessment
*full-cycle        # End-to-end: pipeline + containers + infra + monitoring
```

---

## What This Squad Does

The DevOps Engineer Squad transforms manual operations into automated, reproducible systems. It covers the full lifecycle from code commit to production monitoring.

### Key Capabilities

- **CI/CD Pipelines**: GitHub Actions, GitLab CI, Jenkins, CircleCI — multi-stage with caching, parallelism, and artifact management
- **Containerization**: Docker multi-stage builds, Compose orchestration, Kubernetes manifests, Helm charts
- **Infrastructure as Code**: Terraform modules, Pulumi programs, CloudFormation templates — with state management and drift detection
- **Observability**: Prometheus + Grafana stacks, structured logging, distributed tracing, SLO/SLI alerting
- **Security**: Container scanning, SAST/DAST in pipelines, secrets management, RBAC policies, compliance auditing

### When to Use

- Starting a new project and need CI/CD from day one
- Migrating from manual deployments to automated pipelines
- Containerizing a monolith or microservices
- Setting up monitoring for production workloads
- Implementing security best practices in your pipeline
- Scaling infrastructure with IaC patterns

---

## Architecture

### Tier 0: Orchestration
**Agent:** `devops-chief`
The entry point — triages requests, routes to specialists, coordinates multi-phase operations.

### Tier 1: Core Engine
| Agent | Focus |
|-------|-------|
| `pipeline-architect` | CI/CD pipeline design and optimization |
| `container-engineer` | Docker, Kubernetes, container orchestration |
| `infra-coder` | Infrastructure as Code (Terraform, Pulumi, CloudFormation) |

### Tier 2: Specialists
| Agent | Focus |
|-------|-------|
| `monitor-sentinel` | Monitoring, alerting, observability, SRE practices |
| `devsecops-guardian` | Security scanning, secrets management, compliance |

---

## Command Reference

| Command | Agent | Purpose | Time |
|---------|-------|---------|------|
| `*help` | Chief | Show all commands | <1m |
| `*pipeline` | pipeline-architect | Design CI/CD pipeline | 5-15m |
| `*containerize` | container-engineer | Containerize application | 5-15m |
| `*infra` | infra-coder | Provision infrastructure | 10-20m |
| `*monitor` | monitor-sentinel | Set up observability | 5-15m |
| `*security-scan` | devsecops-guardian | Security assessment | 5-10m |
| `*full-cycle` | Chief → All | End-to-end automation | 30-60m |

---

## Deployment Strategies

The squad supports multiple deployment strategies:

| Strategy | Risk | Downtime | Complexity | Best For |
|----------|------|----------|------------|----------|
| Rolling | Low | Zero | Low | Most workloads |
| Blue-Green | Low | Zero | Medium | Critical services |
| Canary | Very Low | Zero | High | High-traffic services |
| Recreate | Medium | Yes | Low | Dev/staging environments |

---

## Documentation

- [DevOps Squad Config](config.yaml)
- [Changelog](CHANGELOG.md)
