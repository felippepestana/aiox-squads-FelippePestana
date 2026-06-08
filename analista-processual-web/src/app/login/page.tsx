import { Suspense } from "react";
import Link from "next/link";
import { Scale } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  const authEnabled = isSupabaseConfigured();

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <Scale className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="mt-4">Analista Processual</CardTitle>
          <CardDescription>
            {authEnabled
              ? "Entre com sua conta para acessar suas análises."
              : "Autenticação não configurada. A plataforma opera em modo demo."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {authEnabled ? (
            <Suspense fallback={null}>
              <LoginForm />
            </Suspense>
          ) : (
            <>
              <p className="text-center text-sm text-muted-foreground">
                Configure <code>NEXT_PUBLIC_SUPABASE_URL</code> e{" "}
                <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> para habilitar o login.
                Por enquanto, acesse o painel diretamente.
              </p>
              <Button asChild className="w-full">
                <Link href="/dashboard">Entrar no modo demo</Link>
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
