import { Library } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function BibliotecaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Biblioteca</h1>
        <p className="text-muted-foreground">
          Jurisprudência e documentos salvos para referência
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Library className="h-5 w-5" />
            Em breve
          </CardTitle>
          <CardDescription>
            A busca semântica de jurisprudência ainda está em desenvolvimento.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] flex-col items-center justify-center text-center">
            <Library className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-sm text-muted-foreground">
              Em breve você poderá pesquisar e salvar jurisprudência aqui.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
