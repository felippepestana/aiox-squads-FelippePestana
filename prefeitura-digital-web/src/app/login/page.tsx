"use client";

import { useState } from "react";
import { getBrowserSupabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = getBrowserSupabase();

  async function enviarLink() {
    if (!supabase) return;
    setLoading(true);
    setErro("");
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
      setEnviado(true);
    } catch (e: any) {
      setErro(e?.message || "Falha ao enviar o link.");
    } finally {
      setLoading(false);
    }
  }

  if (!supabase) {
    return (
      <div className="mx-auto max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-brand-fg">Entrar</h1>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Autenticação não configurada. Defina <code>NEXT_PUBLIC_SUPABASE_URL</code> e{" "}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> para habilitar login e salvamento de artefatos. A
          geração de documentos continua disponível sem login.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="text-2xl font-bold text-brand-fg">Entrar</h1>
      <p className="text-sm text-gray-600">
        Receba um link de acesso por e-mail. O login <strong>gov.br</strong> (OIDC) será habilitado como
        provedor externo no roadmap.
      </p>

      {enviado ? (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          Link enviado para <strong>{email}</strong>. Verifique sua caixa de entrada.
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <label className="mb-1 block text-sm font-medium">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nome@prefeitura.gov.br"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
          {erro && <p className="mt-2 rounded bg-red-50 p-2 text-xs text-red-700">{erro}</p>}
          <button
            onClick={enviarLink}
            disabled={loading || !email}
            className="mt-4 w-full rounded bg-brand px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {loading ? "Enviando…" : "Enviar link de acesso"}
          </button>
        </div>
      )}
    </div>
  );
}
