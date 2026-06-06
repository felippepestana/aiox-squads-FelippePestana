// Supabase client for server-side persistence (Apex-Talent / talent-compass).
//
// Persistence is OPTIONAL by design: if the SUPABASE_* env vars are not set, the
// client is null and all repository calls become no-ops. This keeps the web app
// (and CI builds without secrets) fully functional — the interview AI endpoints
// work with or without a database; persistence is best-effort.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null | undefined;

/** Returns a service-role Supabase client, or null if not configured. */
export function getDb(): SupabaseClient | null {
  if (cached !== undefined) return cached;
  const url = process.env.SUPABASE_URL?.trim();
  // Service-role key: server-only secret. Never expose to the client.
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) {
    cached = null;
    return cached;
  }
  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}

/** True when database persistence is configured. */
export function dbEnabled(): boolean {
  return getDb() !== null;
}
