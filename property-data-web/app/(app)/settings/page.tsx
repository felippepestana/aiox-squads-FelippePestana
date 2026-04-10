import Link from "next/link";
import { Key } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Configuracoes</h1>

      {/* Profile info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Perfil</CardTitle>
          <CardDescription>
            Informacoes da sua conta
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>
            As informacoes de perfil sao gerenciadas pelo provedor de
            autenticacao (Supabase Auth). Para alterar email ou senha, utilize
            as opcoes do painel de autenticacao.
          </p>
        </CardContent>
      </Card>

      {/* Navigation to sub-pages */}
      <Link href="/settings/api-keys">
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Key className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Chaves de API</CardTitle>
              <CardDescription>
                Gerencie suas chaves de API para provedores LLM
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      </Link>
    </div>
  );
}
