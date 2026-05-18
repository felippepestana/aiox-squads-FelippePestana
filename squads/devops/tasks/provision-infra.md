# Provision Infrastructure

**Task ID:** provision-infra
**Execution Type:** Hybrid
**Purpose:** Generate Infrastructure as Code for cloud resource provisioning
**Orchestrator:** @infra-coder
**Mode:** Elicitation-based (interactive)
**Quality Standard:** AIOX Level (300+ lines)
**Model:** Sonnet

---

## Overview

```
INPUT (cloud provider + resource requirements)
    ↓
[PHASE 0: Requirements]
    → Step 0.1: Cloud provider and region
    → Step 0.2: Resource inventory (compute, DB, networking)
    ↓
[PHASE 1: Architecture & Code]
    → Step 1.1: Design architecture
    → Step 1.2: Create module structure
    → Step 1.3: Generate IaC code
    → Step 1.4: Configure state backend
    ↓
[PHASE 2: Validation]
    → Step 2.1: Cost estimation
    → Step 2.2: Security review
    ↓
OUTPUT: Terraform/Pulumi/CloudFormation files + documentation
```

## Task Anatomy

| Field | Value |
|-------|-------|
| **task_id** | provision-infra |
| **purpose** | Generate IaC for cloud infrastructure |
| **executor** | Agent |
| **execution_type** | Hybrid |
| **input** | Cloud provider, resources, IaC tool preference |
| **output** | IaC source files, state backend config, documentation |
| **action_items** | 7 steps across 3 phases |
| **acceptance_criteria** | Remote state, tagged resources, least privilege, cost estimate |

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `cloud_provider` | string | Yes | AWS, GCP, Azure |
| `iac_tool` | string | No | Terraform (default), Pulumi, CloudFormation |
| `resources` | list | Yes | Resources to provision |
| `environment` | string | Yes | dev, staging, production |
| `region` | string | Yes | Cloud region |

## PHASE 0: Requirements

### Step 0.1: Provider & Region
Confirm cloud provider, region, and IaC tool. Default to Terraform if no preference.

### Step 0.2: Resource Inventory
List all resources needed:
- **Compute:** EC2, Cloud Run, Lambda, ECS, GKE
- **Database:** RDS, Cloud SQL, DynamoDB, Firestore
- **Storage:** S3, GCS, EFS
- **Networking:** VPC, subnets, load balancer, DNS
- **Security:** IAM roles, security groups, secrets

## PHASE 1: Architecture & Code

### Step 1.1: Architecture Design
Design the cloud architecture considering:
- High availability (multi-AZ)
- Network segmentation (public/private subnets)
- Load balancing strategy
- Auto-scaling rules

### Step 1.2: Module Structure
```
infra/
├── main.tf
├── variables.tf
├── outputs.tf
├── providers.tf
├── backend.tf
├── modules/
│   ├── networking/
│   ├── compute/
│   ├── database/
│   └── monitoring/
└── environments/
    ├── dev.tfvars
    ├── staging.tfvars
    └── prod.tfvars
```

### Step 1.3: Generate IaC Code
Generate complete Terraform/Pulumi code with:
- Provider configuration with version pinning
- Variable definitions with validation rules
- Resource definitions with proper tagging
- Output definitions for key attributes
- Environment-specific variable files

### Step 1.4: State Backend
Configure remote state:
- S3 + DynamoDB (AWS)
- GCS (GCP)
- Azure Blob Storage (Azure)
- State locking enabled
- Encryption at rest

## PHASE 2: Validation

### Step 2.1: Cost Estimation
Provide rough cost estimates for the provisioned resources.

### Step 2.2: Security Review
Verify:
- [ ] No wildcard IAM policies
- [ ] Encryption at rest enabled
- [ ] Network access restricted (security groups/firewall rules)
- [ ] Secrets managed via secret manager (not plaintext)
- [ ] All resources tagged

## Completion Criteria

- [ ] IaC files generated for the correct provider
- [ ] Remote state backend configured
- [ ] All resources tagged (environment, team, project)
- [ ] Provider versions pinned
- [ ] Variable validation rules included
- [ ] Cost estimate provided
