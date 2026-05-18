# Setup Monitoring & Observability

**Task ID:** setup-monitoring
**Execution Type:** Hybrid
**Purpose:** Design and configure a complete observability stack
**Orchestrator:** @monitor-sentinel
**Mode:** Elicitation-based (interactive)
**Quality Standard:** AIOX Level (300+ lines)
**Model:** Sonnet

---

## Overview

```
INPUT (services to monitor + existing stack)
    ↓
[PHASE 0: Service Discovery]
    → Step 0.1: Map services and dependencies
    → Step 0.2: Define SLOs
    ↓
[PHASE 1: Instrumentation]
    → Step 1.1: Metrics (Prometheus/Datadog)
    → Step 1.2: Dashboards (Grafana)
    → Step 1.3: Alerting (Alertmanager/PagerDuty)
    → Step 1.4: Logging (Loki/ELK)
    ↓
[PHASE 2: Validation]
    → Step 2.1: Golden signals coverage check
    → Step 2.2: Alert quality review
    ↓
OUTPUT: Monitoring configuration files + SLO document
```

## Task Anatomy

| Field | Value |
|-------|-------|
| **task_id** | setup-monitoring |
| **purpose** | Design complete observability stack |
| **executor** | Agent |
| **execution_type** | Hybrid |
| **input** | Services list, SLO targets, tool preferences |
| **output** | Prometheus config, Grafana dashboards, alert rules, SLO doc |
| **action_items** | 7 steps across 3 phases |
| **acceptance_criteria** | Golden signals covered, SLOs defined, actionable alerts only |

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `services` | list | Yes | Services to monitor |
| `monitoring_stack` | string | No | Prometheus, Datadog, CloudWatch |
| `slo_targets` | object | No | Availability and latency targets |
| `notification_channels` | list | No | Slack, email, PagerDuty |

## PHASE 0: Service Discovery

### Step 0.1: Service Map
Map all services, their dependencies, and communication patterns.

### Step 0.2: SLO Definition
Define SLOs for each service:
- Availability target (e.g., 99.9%)
- Latency P50, P95, P99 targets
- Error budget calculation

## PHASE 1: Instrumentation

### Step 1.1: Metrics Configuration
Configure metrics collection for:
- Golden signals: latency, traffic, errors, saturation
- Business metrics: requests, conversions, revenue
- Infrastructure metrics: CPU, memory, disk, network

### Step 1.2: Dashboard Design
Create Grafana dashboards:
- **Overview:** System health at a glance
- **Per-Service:** Detailed metrics for each service
- **Infrastructure:** Resource utilization

### Step 1.3: Alert Rules
Configure alerts based on SLOs:
- Burn rate alerts for error budget consumption
- Symptom-based (not cause-based) alerting
- Severity routing (critical → pager, warning → channel)

### Step 1.4: Logging Pipeline
Set up structured logging:
- JSON format with correlation IDs
- Log levels: ERROR, WARN, INFO, DEBUG
- Retention policies

## PHASE 2: Validation

### Step 2.1: Golden Signals Check
- [ ] Latency measured (P50, P95, P99)
- [ ] Traffic measured (requests per second)
- [ ] Error rate measured (5xx, 4xx)
- [ ] Saturation measured (CPU, memory, queue depth)

### Step 2.2: Alert Quality
- [ ] Every alert has a runbook link
- [ ] No alerts on causes (only symptoms)
- [ ] Critical alerts are actionable
- [ ] No duplicate/overlapping alerts

## Completion Criteria

- [ ] SLOs defined for all critical services
- [ ] Golden signals instrumented
- [ ] Grafana dashboards created
- [ ] Alert rules configured with routing
- [ ] Logging pipeline set up with structured format
