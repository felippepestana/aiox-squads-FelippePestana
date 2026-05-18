# 👥 Team Training & Incident Response Plan

**Status:** Ready to execute | **Priority:** P1 (High)
**Timeline:** Week 1 of production

---

## Training Schedule

### Monday - Kickoff Session (1 hour)

**Participants:** Full squad
**Agenda:**

```
1. Deployment overview (10 min)
   - What was deployed
   - Current metrics
   - Architecture diagram

2. Monitoring tools tour (20 min)
   - Sentry dashboard walkthrough
   - GA4 real-time metrics
   - UptimeRobot status page

3. On-call rotation (15 min)
   - Who's on-call this week
   - How to acknowledge alerts
   - Escalation procedures

4. Q&A (15 min)
```

**Materials:**
- PowerPoint presentation
- Screenshot tour of dashboards
- Quick reference card

---

### Tuesday - Sentry Deep Dive (1 hour)

**Participants:** DevOps + Senior Engineers
**Topics:**

```
1. Sentry features (15 min)
   - Error grouping
   - Source maps
   - Release tracking
   - Integrations

2. Incident investigation (20 min)
   - How to read error details
   - Breadcrumbs and context
   - Finding root cause
   - Session replay

3. Hands-on practice (20 min)
   - Create test error
   - Investigate error in Sentry
   - Create issue in GitHub
   - Assign to developer

4. Best practices (5 min)
   - When to ignore errors
   - How to mark as resolved
   - Creating custom tags
```

**Lab exercise:**
- Intentionally trigger an error
- Investigate full error flow
- Document findings

---

### Wednesday - Performance Optimization (1 hour)

**Participants:** Frontend + DevOps
**Topics:**

```
1. Core Web Vitals overview (15 min)
   - LCP optimization
   - FID reduction
   - CLS prevention
   - TTFB improvement

2. GA4 performance metrics (15 min)
   - Real-time performance
   - Core Web Vitals dashboard
   - User impact analysis
   - Performance by device/browser

3. Optimization strategies (20 min)
   - Code splitting
   - Image optimization
   - Caching strategies
   - Database query optimization

4. Performance budget (10 min)
   - Current budget: 170KB
   - Monitoring bundle size
   - Dependency review process
```

**Exercise:**
- Review performance dashboard
- Identify slow APIs
- Suggest optimizations

---

### Thursday - Incident Response Simulation (1.5 hours)

**Participants:** Full squad + product
**Scenario:** Service outage during peak usage

**Timeline:**

```
T+0 min: Alert received in Slack
- Alert: "Service down - 5 failed checks"
- Immediate actions:
  ✓ On-call acknowledges
  ✓ Investigates health endpoint
  ✓ Checks recent deployments

T+5 min: Diagnosis
- Found: New memory leak in latest build
- Decision: Rollback previous version
- Execute: git revert + git push

T+10 min: Deployment
- CI/CD starts deployment
- Service recovers
- Health checks passing

T+15 min: Verification
- All metrics green
- Users can access again
- Error rate < 0.1%

T+20 min: Communication
- Post to #incidents
- Notify stakeholders
- Estimate downtime: 15 minutes

T+30 min: Documentation
- Create GitHub issue
- Schedule postmortem for tomorrow
- Document findings
```

**Team responsibilities:**

```
🟦 On-call engineer:
- Responds to alerts (within 5 min)
- Diagnoses issue
- Decides on fix/rollback
- Executes solution

🟨 Senior engineer:
- Advises on complex issues
- Reviews hotfixes
- Escalates if needed

🟩 DevOps engineer:
- Monitors deployment
- Handles infrastructure
- Manages secrets/configs

🟪 Product manager:
- Updates customers
- Tracks impact
- Business decisions
```

---

## On-Call Rotation

### Week 1 (March 27 - April 2)

```
Monday-Wednesday:    Sarah (DevOps Lead)
Thursday-Friday:     Alex (Senior Backend)
Weekend:             Carlos (DevOps)
```

### Responsibilities

**During on-call (24/7):**
- Acknowledge alerts within 5 minutes
- Investigate production issues
- Execute fixes or rollbacks
- Communicate status to team
- Maintain postmortem notes

**Shift handoff:**
- 9am EST → brief incoming engineer
- Review active incidents
- Share relevant context
- Answer questions

---

## Incident Response Flowchart

```
ALERT RECEIVED
    ↓
Acknowledge in Slack (< 5 min)
    ↓
Check dashboard:
├─ Is /api/health passing? YES → skip to logs
└─ NO → Emergency: Initiate rollback
        git revert <COMMIT>
        git push origin main
    ↓
Review Sentry for errors
    ↓
Is it a known issue?
├─ YES → Apply known fix
└─ NO → Investigate further
    ↓
Identify root cause
    ↓
Fix available?
├─ YES → Create hotfix PR → merge → deploy
├─ NO → Rollback to previous version
└─ UNKNOWN → Page senior engineer
    ↓
Monitor metrics (5+ min)
    ↓
Status recovered?
├─ YES → Document incident → schedule postmortem
└─ NO → Escalate to VP Engineering
```

---

## Quick Reference Card

### Emergency Contacts

```
On-Call (Primary):     +1 555-0101
Engineering Lead:      +1 555-0102
Product Manager:       +1 555-0103
VP Engineering:        +1 555-0104
```

### Critical Commands

```bash
# Check service status
curl https://your-domain.com/api/health

# View recent logs
gh api repos/felippepestana/aiox-squads-FelippePestana/actions/runs

# Rollback to previous version
git revert ce465f2
git push origin main

# Check deployment status
gh run list -L 1

# Monitor error rate (Sentry)
# https://sentry.io/organizations/your-org/issues/

# Check uptime (UptimeRobot)
# https://uptimerobot.com/dashboard
```

### Alert Severity Levels

```
🔴 CRITICAL (P0)
- Service completely down
- Action: Page on-call + senior engineer
- SLA: Response in 5 min

🟠 HIGH (P1)
- Partial outage or severe degradation
- Action: Alert DevOps team
- SLA: Response in 15 min

🟡 MEDIUM (P2)
- Performance degradation
- Action: Log and investigate
- SLA: Response in 1 hour

🔵 LOW (P3)
- Minor issues
- Action: Document for next sprint
- SLA: Next business day
```

---

## Postmortem Template

**File:** `postmortems/INCIDENT-YYYY-MM-DD.md`

```markdown
# Incident Postmortem

**Date:** 2026-03-27
**Duration:** 15 minutes (T+10:00 to T+10:15)
**Severity:** P0 - Service Outage

## Summary
Brief 1-2 sentence summary of what happened.

## Timeline
- T+0: Alert received
- T+5: Root cause identified
- T+10: Fix deployed
- T+15: Service recovered

## Root Cause
What was the underlying issue?
Why did it happen?
Was it preventable?

## Impact
- Users affected: ~500
- Revenue impact: ~$0
- Data loss: None
- SLA breach: Yes (15 min > 5 min target)

## Action Items
- [ ] Implement fix (Owner: Alex, Due: 2026-03-28)
- [ ] Add monitoring (Owner: Sarah, Due: 2026-03-29)
- [ ] Update runbook (Owner: Carlos, Due: 2026-03-29)
- [ ] Team training (Owner: PM, Due: 2026-04-03)

## Prevention
How do we prevent this in the future?
- Add pre-deployment memory check
- Implement gradual rollout
- Add load test to CI/CD

## Links
- [Sentry Report](#)
- [GitHub Issue](#)
- [Slack Thread](#)
```

---

## Tools Overview

### Sentry
- **Purpose:** Error tracking & investigation
- **Key feature:** Stack traces, breadcrumbs, session replay
- **Access:** https://sentry.io/
- **Training:** 30 min deep dive needed

### UptimeRobot
- **Purpose:** Uptime monitoring & alerts
- **Key feature:** 5-min checks, Slack alerts
- **Access:** https://uptimerobot.com/
- **Training:** 10 min overview needed

### Google Analytics
- **Purpose:** Real user metrics
- **Key feature:** Core Web Vitals, user behavior
- **Access:** https://analytics.google.com/
- **Training:** 20 min walkthrough needed

### GitHub
- **Purpose:** Issue tracking & deployment
- **Key feature:** PR workflow, Actions, releases
- **Access:** https://github.com/
- **Training:** Already familiar

### Slack
- **Purpose:** Alert notifications
- **Key feature:** Channels, integrations
- **Access:** Existing workspace
- **Training:** Configure channels

---

## Learning Resources

### For Developers
- [ ] Watch: "Production Debugging" tutorial (15 min)
- [ ] Read: Sentry best practices guide
- [ ] Practice: Create test error in Sentry

### For DevOps
- [ ] Watch: "Incident Response" training (30 min)
- [ ] Read: Rollback procedures
- [ ] Practice: Execute test rollback

### For Product Managers
- [ ] Watch: "Monitoring Dashboards" tour (20 min)
- [ ] Read: SLA definitions
- [ ] Practice: Create customer communication

---

## Success Criteria

**By end of Week 1:**
- [ ] All team members trained
- [ ] On-call rotation published
- [ ] Incident response procedure tested
- [ ] Dashboards configured
- [ ] Alert rules verified

**First production incident:**
- [ ] Resolved in < 30 minutes
- [ ] Root cause identified
- [ ] Postmortem documented
- [ ] Improvements implemented

---

## Schedule

```
Monday, March 27    - Kickoff session (1h)
Tuesday, March 28   - Sentry training (1h)
Wednesday, March 29 - Performance training (1h)
Thursday, March 30  - Incident simulation (1.5h)
Friday, March 31    - Debrief & Q&A (30 min)
```

**Total training time:** 5 hours

---

## Next Steps

1. **Schedule meetings** with all participants
2. **Prepare presentations** for each session
3. **Setup dashboards** before training
4. **Document procedures** in team wiki
5. **Assign on-call** rotations for 2 weeks

---

**Owner:** DevOps Lead | **Due:** 2026-03-31
