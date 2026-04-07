# Security Assessment

**Task ID:** security-assessment
**Execution Type:** Hybrid
**Purpose:** Perform DevSecOps security assessment and integrate scanning into pipeline
**Orchestrator:** @devsecops-guardian
**Mode:** Elicitation-based (interactive)
**Quality Standard:** AIOX Level (300+ lines)
**Model:** Sonnet

---

## Overview

```
INPUT (codebase + pipeline + infrastructure scope)
    ↓
[PHASE 0: Scope Definition]
    → Step 0.1: Define assessment scope
    → Step 0.2: Identify existing security measures
    ↓
[PHASE 1: Security Scanning]
    → Step 1.1: Secrets audit
    → Step 1.2: Dependency scanning (SCA)
    → Step 1.3: Static analysis (SAST)
    → Step 1.4: Container scanning
    → Step 1.5: Infrastructure review
    ↓
[PHASE 2: Report & Remediation]
    → Step 2.1: Risk-prioritized findings report
    → Step 2.2: Pipeline integration configuration
    ↓
OUTPUT: Security report + scanning pipeline configuration
```

## Task Anatomy

| Field | Value |
|-------|-------|
| **task_id** | security-assessment |
| **purpose** | Assess security posture and integrate scanning |
| **executor** | Agent |
| **execution_type** | Hybrid |
| **input** | Codebase language, pipeline config, infra details |
| **output** | Security report, scanning config, remediation priorities |
| **action_items** | 8 steps across 3 phases |
| **acceptance_criteria** | No critical findings unaddressed, scanning in pipeline |

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `language` | string | Yes | Primary language |
| `scope` | string | Yes | code, pipeline, infra, or all |
| `ci_platform` | string | No | For pipeline integration |
| `container_images` | list | No | Images to scan |

## PHASE 0: Scope Definition

### Step 0.1: Assessment Scope
Determine what to assess: source code, dependencies, container images, infrastructure, or full scope.

### Step 0.2: Current Security Posture
Identify existing security measures: current tools, policies, scanning.

## PHASE 1: Security Scanning

### Step 1.1: Secrets Audit
Scan for leaked credentials using Gitleaks/TruffleHog patterns.

### Step 1.2: Dependency Scanning
Check dependencies for known vulnerabilities (CVEs).

### Step 1.3: Static Analysis
Review code for OWASP Top 10 vulnerabilities.

### Step 1.4: Container Scanning
Scan container images for OS and library vulnerabilities.

### Step 1.5: Infrastructure Review
Check IaC configurations for misconfigurations (open ports, wildcard policies, unencrypted storage).

## PHASE 2: Report & Remediation

### Step 2.1: Security Report
Generate a risk-prioritized report:
- Critical (fix immediately)
- High (fix within 1 week)
- Medium (fix within 1 month)
- Low (track and address)

### Step 2.2: Pipeline Integration
Generate CI/CD pipeline configuration with security scanning stages.

## Completion Criteria

- [ ] All scope areas assessed
- [ ] Findings prioritized by risk
- [ ] Remediation steps provided for critical/high findings
- [ ] Pipeline scanning configuration generated
- [ ] No secrets found in codebase (or immediately flagged)
