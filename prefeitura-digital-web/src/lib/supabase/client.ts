"use client";

// Cliente Supabase para o navegador (componentes "use client").
import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON_KEY, supabaseEnabled } from "./config";

/**
 * Retorna o cliente Supabase do navegador, ou null quando não configurado.
 * Os componentes devem checar o retorno e degradar quando for null.
 */
export function getBrowserSupabase() {
  if (!supabaseEnabled) return null;
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
