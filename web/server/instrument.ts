// IMPORTANT: importar este módulo no topo de `index.ts` antes de qualquer outro código da app.
// ESM: `import "./instrument.js";` (extensão .js aponta para o ficheiro emitido pelo tsc)
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import * as Sentry from "@sentry/node";

const instrumentDir = path.dirname(fileURLToPath(import.meta.url));
{
  let envPath = path.join(instrumentDir, "../.env");
  if (!fs.existsSync(envPath)) envPath = path.join(instrumentDir, "../../.env");
  if (fs.existsSync(envPath)) dotenv.config({ path: envPath });
  else dotenv.config();
}

const sentryDsn = process.env.SENTRY_DSN?.trim();
if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    integrations: [Sentry.expressIntegration()],
    sendDefaultPii: true,
  });
}
