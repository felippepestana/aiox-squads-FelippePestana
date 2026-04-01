// IMPORTANT: importar este módulo no topo de `index.ts` antes de qualquer outro código da app.
// ESM: `import "./instrument.js";` (extensão .js aponta para o ficheiro emitido pelo tsc)
import "dotenv/config";
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "https://ed547a62b8180b7ec6f287f6250b38c4@o4511115568218112.ingest.us.sentry.io/4511115573723136",
  integrations: [Sentry.expressIntegration()],
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});
