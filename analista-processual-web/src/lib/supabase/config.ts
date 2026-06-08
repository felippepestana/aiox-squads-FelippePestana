/**
 * Supabase is optional. When the public URL and anon key are not set, the app
 * runs in "demo mode": no authentication, analyses are attributed to a single
 * demo profile. This mirrors the graceful-degradation pattern used by the LLM
 * gateway (`isConfigured()`), keeping local dev and smoke tests working without
 * external credentials.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function getSupabaseEnv(): { url: string; anonKey: string } {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
  };
}
