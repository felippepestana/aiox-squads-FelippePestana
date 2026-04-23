"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Loader2, Shield, Zap } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast.error("Erro ao enviar magic link", { description: error.message });
    } else {
      setSent(true);
      toast.success("Magic link enviado!", {
        description: "Verifique seu email para acessar a plataforma.",
      });
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(43 55% 55%) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-4 gold-glow">
            <span className="text-2xl font-bold gold-text">L</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Legendários Platform
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Gestão full-service dos seus eventos
          </p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl p-8">
          {!sent ? (
            <>
              <h2 className="text-lg font-semibold mb-1">Entrar na plataforma</h2>
              <p className="text-muted-foreground text-sm mb-6">
                Enviaremos um magic link para o seu email de coordenador.
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-foreground mb-1.5"
                  >
                    Email institucional
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="coordenador@legendarios.com.br"
                    className="w-full px-3.5 py-2.5 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Enviar magic link
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="w-3.5 h-3.5 flex-shrink-0" />
                <span>
                  Acesso restrito a coordenadores autorizados pelo Movimento
                  Legendários. LGPD-compliant.
                </span>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-success/10 border border-success/20 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-success" />
              </div>
              <h2 className="text-lg font-semibold mb-2">Link enviado!</h2>
              <p className="text-muted-foreground text-sm">
                Verifique o email{" "}
                <span className="text-foreground font-medium">{email}</span> e
                clique no link para acessar a plataforma.
              </p>
              <button
                onClick={() => setSent(false)}
                className="mt-6 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Usar outro email
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Plataforma exclusiva — Movimento Legendários © 2026
        </p>
      </div>
    </div>
  );
}
