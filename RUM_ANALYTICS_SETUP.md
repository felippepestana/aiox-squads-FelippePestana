# 📊 Real User Monitoring (RUM) Setup Guide

**Status:** Ready to configure | **Priority:** P1 (Medium)
**Service:** Google Analytics 4 (GA4)

---

## Quick Start (10 minutes)

### Google Analytics 4 (Free & Recommended)

1. Go to https://analytics.google.com/
2. Sign in with Google account
3. Create property for your domain
4. Add measurement ID to your app
5. Start collecting real user metrics

---

## Detailed Setup

### Step 1: Create Google Analytics Property

1. **Visit Google Analytics:**
   - https://analytics.google.com/

2. **Create new property:**
   - Property name: `AIOX Chat Interface`
   - Reporting time zone: Your timezone
   - Currency: USD

3. **Create data stream:**
   - Platform: Web
   - Website URL: `https://your-domain.com`
   - Stream name: `aiox-chat-web`

4. **Get Measurement ID:**
   - Format: `G-XXXXXXXXXX`
   - Copy for next step

### Step 2: Install Google Analytics

```bash
npm install @react-google-analytics/core
# or
npm install gtag
```

### Step 3: Add GA4 to Your App

**Client-side (client/src/main.tsx):**

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import './styles.css'

// Google Analytics
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_ID;

// Load GA script
const script = document.createElement('script');
script.async = true;
script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
document.head.appendChild(script);

// Initialize GA
window.dataLayer = window.dataLayer || [];
function gtag(...args: any[]) {
  window.dataLayer.push(arguments);
}
gtag('js', new Date());
gtag('config', GA_MEASUREMENT_ID);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### Step 4: Track Key Events

**Track user interactions:**

```typescript
// In your components
export function trackEvent(eventName: string, eventParams?: Record<string, any>) {
  if (window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
}

// Example: Track chat message
function sendMessage(message: string) {
  trackEvent('message_sent', {
    message_length: message.length,
    session_id: sessionId,
  });

  // ... rest of logic
}

// Example: Track error
function handleError(error: Error) {
  trackEvent('error', {
    error_name: error.name,
    error_message: error.message,
  });
}

// Example: Track page view
function usePageTracking() {
  React.useEffect(() => {
    trackEvent('page_view', {
      page_title: document.title,
      page_location: window.location.href,
    });
  }, []);
}
```

### Step 5: Environment Variables

Add to `.env.production`:

```
VITE_GA_ID=G-XXXXXXXXXX
```

### Step 6: Track Core Web Vitals

**Add web-vitals tracking:**

```bash
npm install web-vitals
```

**Integration (client/src/main.tsx):**

```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendWebVitals(metric: any) {
  if (window.gtag) {
    window.gtag('event', 'web_vitals', {
      metric_id: metric.id,
      metric_value: Math.round(metric.value),
      metric_delta: Math.round(metric.delta),
      metric_name: metric.name,
    });
  }
}

getCLS(sendWebVitals);
getFID(sendWebVitals);
getFCP(sendWebVitals);
getLCP(sendWebVitals);
getTTFB(sendWebVitals);
```

---

## Key Metrics to Track

### User Engagement

```javascript
// Session duration
trackEvent('session_duration', {
  duration: sessionDurationSeconds,
  page_count: numberOfPageViews,
});

// User retention
trackEvent('user_engagement', {
  engagement_time: totalEngagementSeconds,
  session_number: sessionNumber,
});

// Feature usage
trackEvent('feature_used', {
  feature_name: 'chat_interface',
  feature_action: 'message_sent',
  usage_count: totalUsageCount,
});
```

### Performance Metrics

```javascript
// Core Web Vitals
trackEvent('web_vitals', {
  lcp: lcpValue,
  fid: fidValue,
  cls: clsValue,
  ttfb: ttfbValue,
});

// API performance
trackEvent('api_call', {
  endpoint: '/api/chat',
  duration: responseTimeMs,
  status: 200,
});

// Load performance
trackEvent('page_load', {
  dom_interactive: 1500,
  dom_complete: 2000,
  page_load_time: 2500,
});
```

### Error Tracking

```javascript
// JavaScript errors
window.onerror = (msg, url, lineNo, columnNo, error) => {
  trackEvent('error', {
    error_type: 'javascript_error',
    error_message: msg,
    error_url: url,
    error_line: lineNo,
  });
};

// Unhandled promise rejections
window.onunhandledrejection = (event) => {
  trackEvent('error', {
    error_type: 'unhandled_rejection',
    error_reason: event.reason,
  });
};
```

---

## Google Analytics Dashboard

### Create Custom Dashboard

**Key Metrics to Display:**

1. **Real-time overview**
   - Active users now
   - Sessions (last 24h)
   - Page views (last 7d)

2. **Performance metrics**
   - LCP distribution
   - FID by device
   - CLS events
   - TTFB average

3. **User behavior**
   - Top pages
   - User journey
   - Bounce rate
   - Session duration

4. **Error tracking**
   - Error frequency
   - Error types
   - Affected users
   - Error trends

### Create Alerts

**Setup alerts for:**

```
Condition: LCP > 2.5s for 5% of sessions
Action: Email alert

Condition: Error rate > 1%
Action: Email alert

Condition: Drop in users > 50%
Action: Slack alert
```

---

## Integration with Sentry

**Send GA metrics to Sentry:**

```typescript
import * as Sentry from '@sentry/react';

export function trackAndReport(eventName: string, eventData: any) {
  // Track in GA
  trackEvent(eventName, eventData);

  // Report to Sentry for correlation
  Sentry.captureMessage(eventName, 'info', {
    contexts: {
      analytics: eventData,
    },
  });
}
```

---

## Weekly Metrics Review

### Template Report

```markdown
## Week of March 27 - April 2

### Usage
- Total sessions: 1,245
- Unique users: 892
- Average session: 8m 23s
- Bounce rate: 12%

### Performance
- LCP P75: 0.95s (target: <1.2s) ✅
- FID P75: 48ms (target: <100ms) ✅
- CLS P75: 0.06 (target: <0.1) ✅

### Errors
- Total errors: 3
- Error rate: 0.24%
- Top error: "Cannot read property..."

### Insights
- ✅ All Core Web Vitals in green
- ✅ Session duration up 15% week-over-week
- ⚠️ 3 new JavaScript errors reported
```

---

## Advanced Features

### User Segmentation

```javascript
// Track user type
trackEvent('user_identified', {
  user_type: 'free_tier', // or 'pro_tier'
  user_age: '25-34',
  user_location: 'BR',
});

// Analyze by segment
// In GA4: Add segment filter
```

### Attribution Tracking

```javascript
// Track conversion source
trackEvent('conversion', {
  conversion_type: 'premium_signup',
  source: 'organic_search',
  medium: 'google',
  campaign: 'brand_awareness',
  value: 99.99,
});
```

### Custom Events

```javascript
// Your custom events
trackEvent('chat_completed', {
  message_count: 12,
  duration: 5 * 60, // 5 minutes
  success: true,
});

trackEvent('feature_request', {
  feature_name: 'voice_chat',
  priority: 'high',
});
```

---

## Privacy & Compliance

### GDPR Compliance

1. **Add consent banner:**
   ```javascript
   // Before tracking, get user consent
   if (userConsentsToTracking) {
     gtag('consent', 'update', {
       'analytics_storage': 'granted'
     });
   }
   ```

2. **Privacy policy update:**
   - Document GA4 usage
   - Explain data collection
   - Link to Google Privacy Policy

3. **Data retention:**
   - Default: 14 months
   - Minimum: 2 months
   - Can be adjusted in GA4 settings

### Data Anonymization

```javascript
// Anonymize IP addresses
gtag('config', GA_MEASUREMENT_ID, {
  'anonymize_ip': true
});

// Don't send personally identifiable info
// ❌ WRONG: trackEvent('user_signup', { email: user.email })
// ✅ RIGHT: trackEvent('user_signup', { user_id: hashUserEmail(user.email) })
```

---

## Troubleshooting

### Check GA4 is Working

1. Open browser DevTools (F12)
2. Go to Console tab
3. Type: `window.gtag('event', 'test_event')`
4. Check Google Analytics Real-time report
5. Should see event within 5 seconds

### Common Issues

| Issue | Solution |
|-------|----------|
| Events not appearing | Check Measurement ID is correct |
| Wrong property | Verify GA4 property ID in .env |
| Data delayed | GA4 has 24-48h reporting delay |
| Missing Core Web Vitals | Install web-vitals package |

---

## Resources

- **Google Analytics 4:** https://analytics.google.com/
- **GA4 Setup Guide:** https://support.google.com/analytics/answer/9304153
- **Web Vitals:** https://web.dev/vitals/
- **GA4 Events:** https://support.google.com/analytics/answer/9322688
- **Privacy Guide:** https://support.google.com/analytics/answer/7576959

---

**Timeline:** 30 minutes to fully setup
**Effort:** Low | **Impact:** Medium (user insights)
**Cost:** Free
