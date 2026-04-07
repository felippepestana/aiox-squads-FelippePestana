# Infrastructure Security Review Checklist

> Reviewer: devsecops-guardian + infra-coder
> Purpose: Validate IaC security posture before applying to production.
> Usage: Check every item. CRITICAL items are blocking.

---

## 1. State Management [CRITICAL]

- [ ] Terraform state stored remotely (S3, GCS, Azure Blob)
- [ ] State locking enabled (DynamoDB, Consul)
- [ ] State file encrypted at rest
- [ ] No sensitive values in state outputs (use `sensitive = true`)

---

## 2. Identity & Access [CRITICAL]

- [ ] IAM roles follow least privilege (no `*` in actions/resources)
- [ ] No root/admin credentials used for automation
- [ ] Service accounts have scoped permissions per service
- [ ] MFA enabled for console access (documented, not in IaC)
- [ ] API keys rotated on schedule (documented rotation policy)

---

## 3. Network Security

- [ ] VPC configured with public/private subnet separation
- [ ] Security groups are restrictive (no 0.0.0.0/0 on SSH/RDP)
- [ ] Load balancers terminate TLS (HTTPS only, TLS 1.2+)
- [ ] Database instances are in private subnets only
- [ ] VPC Flow Logs enabled for audit trail

---

## 4. Data Protection

- [ ] Encryption at rest enabled for all storage (RDS, S3, EBS)
- [ ] Encryption in transit enforced (TLS between services)
- [ ] Backup strategy defined (automated snapshots, retention period)
- [ ] S3 buckets are private by default (no public access unless justified)

---

## 5. Compliance & Tagging

- [ ] All resources tagged: Project, Environment, Owner, ManagedBy
- [ ] Cost allocation tags enabled for billing visibility
- [ ] Resource naming follows convention: `{project}-{env}-{resource}`
- [ ] Compliance requirements documented (SOC2, HIPAA, GDPR as applicable)

---

## 6. Disaster Recovery

- [ ] Multi-AZ deployment for critical services
- [ ] RTO and RPO targets defined and documented
- [ ] Backup restoration tested within last 30 days
- [ ] Runbook exists for infrastructure recovery
