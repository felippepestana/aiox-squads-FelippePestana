import Link from "next/link";
import {
  Building2,
  Scale,
  Eye,
  FileSearch,
  Leaf,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const features = [
  {
    icon: FileSearch,
    title: "Pesquisa Registral",
    description:
      "Analise automatizada de matriculas, escrituras e certidoes com extracao inteligente de dados.",
  },
  {
    icon: Scale,
    title: "Analise Legislativa",
    description:
      "Verificacao de conformidade com legislacao urbanistica, zoneamento e restricoes legais aplicaveis.",
  },
  {
    icon: Building2,
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
  {
    icon: Leaf,
    title: "Verificacao Ambiental",
    description:
      "Analise de restricoes ambientais, areas de preservacao e conformidade com normas ecologicas.",
  },
  {
    icon: FileText,
    title: "Relatorio Profissional",
    description:
      "Geracao de relatorios completos em PDF com dados consolidados prontos para tomada de decisao.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-primary/5 to-background">
      {/* Hero */}
      <section className="w-full max-w-4xl mx-auto px-6 py-28 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Levantamento Imobiliario{" "}
          <span className="text-primary">Inteligente</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          10 agentes de IA especializados analisam seu imovel em registral,
          legislacao, urbanismo, avaliacao ABNT e mais.
        </p>
        <div className="mt-10">
          <Button asChild size="lg" className="px-8 text-base">
            <Link href="/register">Comecar Agora</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="w-full max-w-4xl mx-auto px-6 pb-24">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {features.map((f) => (
            <Card
              key={f.title}
              className="text-center transition-shadow hover:shadow-md"
            >
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

      {/* Footer */}
      <footer className="w-full border-t py-6 text-center text-sm text-muted-foreground">
        Property Data Squad v1.0
      </footer>
    </div>
  );
}
