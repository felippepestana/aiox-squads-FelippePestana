// Cliente Supabase para o servidor (Route Handlers e Server Components),
// integrado aos cookies do Next.js para gerenciar a sessão de autenticação.
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_URL, SUPABASE_ANON_KEY, supabaseEnabled } from "./config";

/**
 * Retorna o cliente Supabase do servidor, ou null quando não configurado.
 * Deve ser chamado dentro de um contexto de request (tem acesso aos cookies).
 */
export async function getServerSupabase() {
  if (!supabaseEnabled) return null;
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Chamado de um Server Component: ignore. A renovação da sessão
          // é tratada pelo middleware quando presente.
        }
      },
    },
  });
}
