import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "./config";

/**
 * Browser-side Supabase client. Only call this when `isSupabaseConfigured()` is
 * true (the login form guards on it before using the client).
 */
export function createClient() {
  const { url, anonKey } = getSupabaseEnv();
  return createBrowserClient(url, anonKey);
}
