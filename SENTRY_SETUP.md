# 🔍 Sentry Error Tracking Setup Guide

**Status:** Ready to configure | **Priority:** P0 (High)

## Step 1: Create Sentry Account

1. Go to https://sentry.io/signup/
2. Create account with GitHub/Google or email
3. Create organization (e.g., "AIOX Squad")
4. Create project:
   - Name: `aiox-chat-web`
   - Platform: `Node.js` (for server)
   - Platform: `React` (for client)

## Step 2: Get Sentry DSN

```
Server DSN:  https://your-key@sentry.io/project-id
Client DSN:  https://your-key@sentry.io/project-id
```

Save these for the environment variables.

## Step 3: Install Dependencies

```bash
cd web
npm install @sentry/node @sentry/react @sentry/tracing
```

## Step 4: Configure Server-Side (server/index.ts)

Add at the top of your file:

```typescript
import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

// Initialize Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || "development",
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.RequestHandler(),
    new Sentry.Integrations.ErrorHandler(),
    nodeProfilingIntegration(),
  ],
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  profilesSampleRate: 0.1,
  debug: process.env.NODE_ENV === "development",
});

const app = express();

// Add Sentry middleware BEFORE other middleware
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

Add error handler at the end (AFTER all other routes):

```typescript
// Error handler - must be last
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', error);
  Sentry.captureException(error);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Graceful shutdown
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  Sentry.captureException(reason);
});
```

## Step 5: Configure Client-Side (client/src/main.tsx)

```typescript
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE || "development",
  integrations: [
    new BrowserTracing(),
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  tracesSampleRate: import.meta.env.MODE === "production" ? 0.1 : 1.0,
  replaysSessionSampleRate: import.meta.env.MODE === "production" ? 0.1 : 1.0,
  replaysOnErrorSampleRate: 1.0,
  debug: import.meta.env.MODE === "development",
});

// Wrap your app with Sentry
const sentryApp = Sentry.withProfiler(App);
```

## Step 6: Environment Variables

Create `.env.production`:

```
# Sentry Error Tracking
SENTRY_DSN=https://YOUR_KEY@sentry.io/YOUR_PROJECT_ID
SENTRY_ENVIRONMENT=production
SENTRY_TRACES_SAMPLE_RATE=0.1
SENTRY_REPLAYS_SESSION_SAMPLE_RATE=0.1

# Client-side
VITE_SENTRY_DSN=https://YOUR_KEY@sentry.io/YOUR_PROJECT_ID
VITE_SENTRY_ENVIRONMENT=production
```

## Step 7: Configure Slack Integration

1. In Sentry Dashboard → Settings → Integrations
2. Search for "Slack"
3. Click "Install"
4. Authorize with your Slack workspace
5. Select #alerts channel
6. Configure alert rules:

   **Alert Rules:**
   - Event Count: 10+ errors in 5 minutes
   - Severity: Error, Fatal
   - Notification: Slack #alerts

## Step 8: Test Error Tracking

Add test endpoint to `server/index.ts`:

```typescript
// Test error endpoint (remove in production)
app.get('/api/test-error', (req, res) => {
  const error = new Error('Test error from Sentry');
  Sentry.captureException(error);
  res.status(500).json({ error: 'Test error sent to Sentry' });
});
```

Then test:
```bash
curl http://localhost:8787/api/test-error
# Check Sentry dashboard for the error
```

## Step 9: Setup Release Tracking

```bash
# In your CI/CD or deployment script
SENTRY_ORG=your-org SENTRY_PROJECT=aiox-chat-web \
SENTRY_AUTH_TOKEN=your-token \
sentry-cli releases create
```

## Step 10: Create Alerts & Dashboards

**Dashboard Setup:**

1. Sentry → Dashboards → Create Dashboard
2. Add widgets:
   - Error rate over time
   - Top errors
   - Affected users
   - Error trends by environment

**Alert Rules:**

1. Error count > 10 in 5 minutes → Slack
2. New issue created → Email
3. Regression detected → Slack
4. High velocity error → Page on-call

## Monitoring Checklist

- [ ] Sentry account created
- [ ] DSN keys added to .env
- [ ] Server-side integration implemented
- [ ] Client-side integration implemented
- [ ] Slack integration configured
- [ ] Alert rules created
- [ ] Dashboard created
- [ ] Test error verified in Sentry
- [ ] Team trained on using Sentry
- [ ] On-call rotation updated

## Quick Reference

| Action | Command |
|--------|---------|
| View errors | https://sentry.io/organizations/your-org/issues/ |
| Create release | `sentry-cli releases create` |
| Upload sourcemaps | `sentry-cli releases files upload-sourcemaps` |
| Test integration | `curl http://localhost:8787/api/test-error` |

## Links

- **Sentry Docs:** https://docs.sentry.io/
- **Node.js Integration:** https://docs.sentry.io/platforms/node/
- **React Integration:** https://docs.sentry.io/platforms/javascript/guides/react/
- **Alerts:** https://docs.sentry.io/alerts/alert-rules/

---

**Timeline:** 1-2 hours to fully setup
**Effort:** Low | **Impact:** High (visibility into production errors)
