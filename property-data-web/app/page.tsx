import Link from "next/link";
import { Building2, Scale, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const features = [
  {
    icon: Building2,
    title: "Pesquisa Registral",
    description:
      "Analise automatizada de matriculas, escrituras e certidoes com extracao inteligente de dados.",
  },
  {
    icon: Scale,
    title: "Avaliacao ABNT",
    description:
      "Laudos de avaliacao conforme NBR 14653 com metodologia de mercado e tratamento estatistico.",
  },
  {
    icon: Eye,
    title: "Analise Visual",
    description:
      "Processamento de imagens aereas e fotos do imovel para avaliacao de estado e conformidade.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero */}
      <section className="w-full max-w-5xl px-6 py-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Levantamento Imobiliario Inteligente
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Pesquisa registral, avaliacao e analise visual de imoveis potencializada
          por agentes de IA especializados.
        </p>
        <div className="mt-8">
          <Button asChild size="lg">
            <Link href="/login">Comecar agora</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="w-full max-w-5xl px-6 pb-24">
        <div className="grid gap-6 sm:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="text-center">
              <CardHeader>
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{f.title}</CardTitle>
                <CardDescription>{f.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
