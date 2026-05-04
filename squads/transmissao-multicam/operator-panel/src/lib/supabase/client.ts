"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

let _client: ReturnType<typeof createBrowserClient<Database>> | null = null;

// Returns a singleton browser-side Supabase client.
// Safe to call from any Client Component.
export function getSupabaseClient() {
  if (!_client) {
    const url  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? "";
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

    if (!url || !anon) {
      // Supabase not configured — panel degrades gracefully (local YAML fallback).
      return null;
    }

    _client = createBrowserClient<Database>(url, anon);
  }
  return _client;
}

export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
