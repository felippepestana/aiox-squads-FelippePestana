"use client";

import { useEffect, useState } from "react";
import { getBrowserSupabase } from "@/lib/supabase/client";

// Indicador de sessão no cabeçalho. Oculto quando o Supabase não está configurado.
export default function AuthStatus() {
  const supabase = getBrowserSupabase();
  const [email, setEmail] = useState<string | null>(null);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
      setPronto(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  if (!supabase) return null;

  async function sair() {
    if (!supabase) return;
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (!pronto) return <span className="text-xs opacity-0">…</span>;

  if (!email) {
    return (
      <a href="/login" className="text-sm underline">
        Entrar
      </a>
    );
  }

  return (
    <span className="flex items-center gap-2 text-sm">
      <a href="/artefatos" className="hidden sm:inline opacity-90 hover:underline">
        {email}
      </a>
      <button onClick={sair} className="rounded bg-white/15 px-2 py-0.5 text-xs hover:bg-white/25">
        Sair
      </button>
    </span>
  );
}
