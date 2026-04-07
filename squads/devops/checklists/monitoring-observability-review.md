# Monitoring & Observability Review Checklist

> Reviewer: monitor-sentinel
> Purpose: Validate observability setup covers all critical signals.
> Usage: Check every item before declaring monitoring complete.

---

## 1. SLOs & Error Budgets

- [ ] SLOs defined for each user-facing service (availability, latency)
- [ ] Error budgets calculated and tracked
- [ ] Burn rate alerts configured (fast burn = page, slow burn = ticket)
- [ ] SLO review scheduled (monthly or after incidents)

---

## 2. Golden Signals

- [ ] **Latency**: P50, P95, P99 measured for all HTTP endpoints
- [ ] **Traffic**: Request rate tracked per service and endpoint
- [ ] **Errors**: 4xx and 5xx rates tracked separately
- [ ] **Saturation**: CPU, memory, disk, and connection pool utilization tracked

---

## 3. Dashboards

- [ ] Overview dashboard: top-level health of all services
- [ ] Per-service dashboard: golden signals + service-specific metrics
- [ ] Infrastructure dashboard: node health, resource utilization
- [ ] Dashboards load in < 5 seconds (no expensive queries)

---

## 4. Alerting [CRITICAL]

- [ ] Every alert has a linked runbook with remediation steps
- [ ] Alerts fire on symptoms (user impact), not causes (CPU spike alone)
- [ ] Critical alerts go to pager, warnings go to channel
- [ ] Alert fatigue reviewed: no more than 5 pages/week in steady state
- [ ] No alerts with `continue-on-error` or silenced indefinitely

---

## 5. Logging

- [ ] Structured logging (JSON) with consistent field names
- [ ] Correlation IDs propagated across service boundaries
- [ ] Log levels used correctly (ERROR, WARN, INFO, DEBUG)
- [ ] Log retention policy defined (30d hot, 90d cold minimum)
- [ ] Sensitive data redacted from logs (PII, tokens, passwords)

---

## 6. Tracing (if distributed)

- [ ] Distributed tracing enabled across service boundaries
- [ ] Trace sampling configured (100% for errors, 1-10% for normal traffic)
- [ ] Traces correlated with logs and metrics
- [ ] Slow request traces automatically captured (> P99 threshold)
