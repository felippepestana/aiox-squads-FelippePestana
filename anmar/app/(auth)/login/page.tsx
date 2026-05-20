"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction } from "@/actions/staff";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2 } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {pending ? "Entrando..." : "Entrar"}
    </Button>
  );
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const [error, setError] = useState<string | null>(
    searchParams.error === "auth_callback_failed" ? "Falha na autenticação. Tente novamente." : null
  );

  async function handleLogin(formData: FormData) {
    const result = await loginAction(formData);
    if (result?.error) setError(result.error);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-primary-light via-background to-brand-gold-light">
      <div className="w-full max-w-sm space-y-8 px-4">
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary text-white text-2xl font-bold shadow-lg shadow-brand-primary/30">
            A
          </div>
          <h1 className="text-2xl font-bold text-brand-dark">Clínica Anmar</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestão Inteligente de Estética &amp; Saúde
          </p>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-xl shadow-black/5">
          <h2 className="mb-6 text-lg font-semibold text-brand-dark">Acesse sua conta</h2>
          <form action={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}
            <SubmitButton />
          </form>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Plataforma protegida por LGPD · v1.0.0
        </p>
      </div>
    </div>
  );
}
