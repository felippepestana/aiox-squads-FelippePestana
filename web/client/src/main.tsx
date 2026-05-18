import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import { App } from "./App";
import "./styles.css";

// Initialize Sentry (@sentry/react v10: browserTracingIntegration + replayIntegration)
if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE || "development",
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    tracesSampleRate: import.meta.env.MODE === "production" ? 0.1 : 1.0,
    replaysSessionSampleRate: import.meta.env.MODE === "production" ? 0.1 : 1.0,
    replaysOnErrorSampleRate: 1.0,
    debug: import.meta.env.MODE === "development",
  });
}

const SentryApp = Sentry.withProfiler(App);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SentryApp />
  </StrictMode>
);
