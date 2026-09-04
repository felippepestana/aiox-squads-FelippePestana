import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Renova a sessão do Supabase a cada request (recomendado pelo @supabase/ssr).
// Quando o Supabase não está configurado, é um no-op.
export async function middleware(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  let res = NextResponse.next({ request: req });

  if (!url || !anon) return res;

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
        res = NextResponse.next({ request: req });
        cookiesToSet.forEach(({ name, value, options }) =>
          res.cookies.set(name, value, options)
        );
      },
    },
  });

  // Dispara a renovação dos tokens, se necessário.
  await supabase.auth.getUser();
  return res;
}

export const config = {
  // Ignora assets estáticos; cobre páginas e rotas de API.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
