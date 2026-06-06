import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-800">Legendários TOP</h1>
          <p className="text-green-600 mt-1">Sistema de Triagem Médica</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sou participante</CardTitle>
            <CardDescription>
              Preencha sua triagem médica para participar do TOP
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/triagem">Iniciar Triagem</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sou Hakuna</CardTitle>
            <CardDescription>
              Acesse o painel de gestão e validação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/hakuna">Painel Hakuna</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">App de Campo</CardTitle>
            <CardDescription>
              Leitura NFC e prontuário offline para uso no evento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="secondary" className="w-full">
              <Link href="/campo">Abrir App Campo</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
