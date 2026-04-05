# ⏰ Uptime Monitoring Setup Guide

**Status:** Ready to configure | **Priority:** P0 (High)
**Services:** UptimeRobot or Pingdom

---

## Quick Start (5 minutes)

### UptimeRobot (Free tier available)

1. Go to https://uptimerobot.com/
2. Sign up (free account)
3. Create monitor:
   - **Type:** HTTP(s)
   - **URL:** `https://your-domain.com/api/health`
   - **Interval:** 5 minutes
   - **Timeout:** 10 seconds
   - **Retries:** 2

4. Add notifications:
   - Slack webhook
   - Email
   - SMS (paid)

---

## Detailed Setup

### Option 1: UptimeRobot (Recommended for small projects)

**Pros:**
- Free tier: 50 monitors
- 5-minute check interval
- Slack/Email alerts
- Status page included

**Cons:**
- Limited advanced features
- Max 50 monitors on free tier

**Setup Steps:**

1. **Create Account**
   - Visit https://uptimerobot.com/signup
   - Sign up with email

2. **Create Monitor**
   ```
   Monitor Type: HTTP(s)
   URL: https://your-domain.com/api/health
   Friendly Name: AIOX Chat - Health Check
   Check Interval: 5 minutes
   Timeout: 10 seconds
   HTTP Method: GET
   Alert Contacts: Slack, Email
   ```

3. **Configure Slack Integration**
   - Settings → Integrations → Slack
   - Authorize with your workspace
   - Select #alerts channel
   - Alert on: Down, Recovered

4. **Create Status Page**
   - Monitors → Status Page
   - Add your monitor
   - Share with team

---

### Option 2: Pingdom (Premium alternative)

**Pros:**
- Advanced analytics
- Multiple locations
- RUM integration
- API access

**Cons:**
- Paid plan required
- More complex setup

**Setup Steps:**

1. Create account: https://www.pingdom.com/
2. Create check:
   ```
   Type: HTTP Check
   URL: https://your-domain.com/api/health
   Check interval: 5 minutes
   Location: 3+ data centers
   Alert threshold: 2 failed checks
   ```

3. Add integrations:
   - Slack
   - PagerDuty
   - Email

---

## Health Check Endpoint

**Current implementation** (in `server/index.ts`):

```typescript
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '1.0.0'
  });
});
```

**Response example:**
```json
{
  "status": "healthy",
  "timestamp": "2026-03-27T10:30:00Z",
  "uptime": 3600,
  "memory": {
    "rss": 52428800,
    "heapTotal": 20971520,
    "heapUsed": 10485760
  },
  "version": "1.0.0"
}
```

---

## Alert Configuration

### Slack Integration

**Setup:**
1. UptimeRobot → Settings → Integrations → Slack
2. Authorize bot
3. Select #alerts channel

**Example alerts:**
```
🔴 DOWN: AIOX Chat Health Check
Service: https://your-domain.com/api/health
Last check: 2 failures
Time down: 5 minutes
Action: [View Dashboard] [Page On-Call]

🟢 RECOVERED: AIOX Chat Health Check
Service: https://your-domain.com/api/health
Down time: 5 minutes
Response time: 150ms
```

### Email Alerts

**Recipients:**
- DevOps lead (primary)
- Engineering lead (secondary)
- Product manager (FYI)

---

## Monitoring Dashboard

### UptimeRobot Status Page

Example URL: `https://aiox-squad.uptimerobot.com`

Share with:
- [ ] Customer success team
- [ ] Support team
- [ ] Marketing team
- [ ] Executive stakeholders

### Dashboard Metrics

```
Current Status: 🟢 Healthy
Uptime (30 days): 99.98%
Average Response: 145ms
Last Down: 2026-03-26 (1 incident)

Recent Events:
✅ 2026-03-27 - Service recovered
🔴 2026-03-26 - Service down (2 min)
✅ 2026-03-26 - Health check passing
```

---

## Alert Rules by Severity

### P0 - Critical (Immediate page)
```
Condition: Service down > 2 minutes
Action: Page on-call engineer
Response time: < 5 minutes
Notification: Slack + SMS + Email
```

### P1 - High (Alert)
```
Condition: Response time > 5 seconds
Action: Alert DevOps team
Response time: < 15 minutes
Notification: Slack + Email
```

### P2 - Medium (Info)
```
Condition: Response time > 2 seconds
Action: Log to dashboard
Response time: < 1 hour
Notification: Email only
```

---

## Testing

### Test Monitor from CLI

```bash
# Test health endpoint
curl -v https://your-domain.com/api/health

# Expected response (200 OK)
# {
#   "status": "healthy",
#   "timestamp": "...",
#   "uptime": ...
# }
```

### Simulate Down Scenario

```bash
# Temporarily disable health endpoint to test alerts
# Then restore to verify recovery notifications work
```

---

## Weekly Review

**Checklist:**
- [ ] 0 critical incidents
- [ ] Uptime ≥ 99.9%
- [ ] Average response ≤ 500ms
- [ ] Alert accuracy (no false positives)
- [ ] All team members acknowledge alerts
- [ ] Status page updated

---

## Cost Breakdown

| Service | Free Tier | Paid Tier | Use Case |
|---------|-----------|-----------|----------|
| **UptimeRobot** | 50 monitors | $10/mo | Best for small projects |
| **Pingdom** | None | $10/mo | Advanced analytics |
| **Datadog** | None | $15/mo | Full observability |

**Recommendation:** Start with UptimeRobot free tier

---

## Escalation Procedure

**If service goes down:**

1. **Notification received** (Slack alert)
2. **On-call confirms** (within 5 min)
3. **Diagnose issue:**
   - Check server logs (Sentry)
   - Check system resources
   - Check recent deploys
4. **Decide action:**
   - If hotfix possible: Deploy fix
   - If not: Rollback previous version
5. **Monitor recovery:**
   - Health checks pass
   - Alert recovered notification
6. **Communicate:**
   - Post-incident in #incidents
   - Schedule postmortem (24h)

---

## Resources

- **UptimeRobot:** https://uptimerobot.com/
- **Pingdom:** https://www.pingdom.com/
- **Datadog:** https://www.datadoghq.com/
- **Health Check Best Practices:** https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/

---

**Timeline:** 15 minutes to setup
**Effort:** Very Low | **Impact:** High (production visibility)
