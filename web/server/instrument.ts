// IMPORTANT: importar este módulo no topo de `index.ts` antes de qualquer outro código da app.
// ESM: `import "./instrument.js";` (extensão .js aponta para o ficheiro emitido pelo tsc)
import "dotenv/config";
import * as Sentry from "@sentry/node";

const sentryDsn = process.env.SENTRY_DSN?.trim();
if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    integrations: [Sentry.expressIntegration()],
    sendDefaultPii: true,
  });
}
