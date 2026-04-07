# 🚀 Production Monitoring & Alerting Setup

**Status:** Production Ready | **Last Updated:** 2026-03-26

## Overview

AIOX Chat Interface is now in production. This guide covers monitoring, alerting, and incident response.

---

## 1. Error Tracking (Sentry)

### Setup Instructions

```bash
# 1. Create Sentry account at https://sentry.io
# 2. Create project for Node.js + React

# 3. Install Sentry SDK
npm install @sentry/node @sentry/react @sentry/tracing

# 4. Configure server-side (server/index.ts)
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.RequestHandler(),
    new Sentry.Integrations.ErrorHandler(),
  ],
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());

# 5. Configure client-side (client/main.tsx)
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 0.1,
});

# 6. Add to .env
SENTRY_DSN=https://key@sentry.io/project-id
VITE_SENTRY_DSN=https://key@sentry.io/project-id
```

### Error Alert Rules

- **Threshold:** 5+ errors in 10 minutes
- **Severity levels:** ERROR, FATAL
- **Notification:** Slack + Email

---

## 2. Performance Monitoring (Datadog / Google Analytics)

### Core Web Vitals Tracking

```javascript
// Measure LCP, FID, CLS in production
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);  // CLS
getFID(console.log);  // FID
getFCP(console.log);  // FCP
getLCP(console.log);  // LCP
getTTFB(console.log); // TTFB

// Send to analytics
export function sendWebVitals(metric) {
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics/metrics', JSON.stringify(metric));
  }
}
```

### Performance Alerts

| Metric | Alert Threshold | Action |
|--------|-----------------|--------|
| LCP | > 2.5s | Investigate load time |
| FID | > 300ms | Check JavaScript blocking |
| CLS | > 0.25 | Audit layout shifts |
| Bundle | > 250KB | Review dependencies |

---

## 3. Uptime Monitoring (Pingdom / UptimeRobot)

### Configuration

```
Service: AIOX Chat Interface
URL: https://your-domain.com/api/health
Interval: 5 minutes
Timeout: 10 seconds
Retries: 2
Alert on: Any failure
```

### Health Check Endpoint

```javascript
// GET /api/health
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

---

## 4. Log Aggregation (CloudWatch / ELK)

### What to Log

- All API requests/responses
- Errors with stack traces
- Performance metrics (response times)
- User authentication events
- Rate limit violations
- Database queries (in debug mode)

### Log Format

```json
{
  "timestamp": "2026-03-26T18:50:00Z",
  "level": "ERROR",
  "service": "aiox-chat",
  "userId": "user-123",
  "sessionId": "sess-456",
  "message": "Failed to process request",
  "error": "ReferenceError: x is not defined",
  "stack": "...",
  "context": {
    "method": "POST",
    "path": "/api/chat",
    "statusCode": 500,
    "duration": 245
  }
}
```

---

## 5. Real User Monitoring (RUM)

### Collect Metrics

```javascript
// Track page performance
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log('Performance Entry:', entry);
    // Send to analytics
  }
});

observer.observe({ entryTypes: ['navigation', 'resource', 'paint', 'measure'] });
```

### Key Metrics to Track

- Session duration
- Page load distribution
- API response times
- Error frequency
- User interactions (clicks, forms)
- Browser/device breakdown

---

## 6. Alerting Policy

### Slack Notifications

**#alerts channel:**
- P0: Service down (immediate page)
- P1: Error rate > 1% (within 5 min)
- P2: Performance degradation > 20% (within 10 min)
- P3: Warning metrics (info only)

**Template:**
```
🚨 [P1] High Error Rate
Service: aiox-chat
Duration: 5 minutes
Error Rate: 2.5%
Errors: 125
Last Error: ReferenceError in chatStream()
Action: Review logs at [Sentry link]
```

---

## 7. Incident Response

### On-Call Rotation

- **Primary:** DevOps lead (24/7 first week)
- **Secondary:** Engineering lead (backup)
- **Escalation:** Product manager (if customer impact)

### Incident Steps

1. **Detect** → Automated alert to Slack
2. **Acknowledge** → On-call engineer responds within 5 min
3. **Diagnose** → Check logs, metrics, error tracking
4. **Mitigate** → Hotfix, rollback, or scale up
5. **Resolve** → Deploy fix, verify metrics normal
6. **Communicate** → Status update to stakeholders
7. **Postmortem** → Root cause analysis (within 24h)

### Rollback Procedure

```bash
# If deployment causes issues:
git revert ce465f2  # Last known good commit
git push origin main
# CI/CD will auto-deploy previous version
# Estimated time: 5 minutes
```

---

## 8. Weekly Review Checklist

- [ ] Error rate normal (< 0.5%)?
- [ ] All Core Web Vitals green?
- [ ] No spike in response times?
- [ ] Uptime = 100%?
- [ ] No security alerts?
- [ ] Dependency updates available?
- [ ] User feedback collected?
- [ ] Capacity planning reviewed?

---

## 9. Monthly Review Checklist

- [ ] Performance trends analyzed?
- [ ] Cost optimization reviewed?
- [ ] Security audit completed?
- [ ] Disaster recovery tested?
- [ ] Documentation updated?
- [ ] Team training scheduled?
- [ ] Next quarter planning complete?

---

## Resources

- **Sentry Dashboard:** https://sentry.io/organizations/
- **Datadog Dashboard:** https://app.datadoghq.com/
- **GitHub Actions:** https://github.com/felippepestana/aiox-squads-FelippePestana/actions
- **Performance Budget:** See `web/performance-budget.json`

---

## Quick Links

| Tool | URL | Purpose |
|------|-----|---------|
| **Logs** | Sentry dashboard | Error tracking |
| **Metrics** | Datadog dashboard | Performance |
| **Uptime** | UptimeRobot dashboard | Service availability |
| **Incidents** | Slack #alerts | Real-time notifications |
| **Code** | GitHub main branch | Source of truth |

---

**Last Deploy:** 2026-03-26 18:50:50 UTC
**Build:** ce465f2 (AIOX Chat UI Redesign Phase 7)
**Status:** ✅ Production Ready
