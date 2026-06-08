import { config } from "dotenv";

/**
 * Side-effect module that loads local env files. Import this FIRST (before any
 * module that reads process.env at import time, e.g. the LLM gateway) so a
 * standalone process (the worker) sees the same variables Next injects from
 * .env.local. No-op when the files are absent; never overrides variables
 * already present in the platform environment.
 */
config({ path: ".env.local" });
config();
