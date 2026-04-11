"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Plus, FileUp, MapPin, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PropertyDetail {
  id: string;
  address: string;
  number: string | null;
  neighborhood: string | null;
  city: string;
  state: string;
  type: string;
  area: number | null;
  matricula: string | null;
  documents: { id: string; type: string; name: string }[];
  analyses: { id: string; useCase: string; status: string; createdAt: string }[];
}

export default function PropertyDetailPage() {
  const params = useParams<{ id: string }>();
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/properties/${params.id}`)
      .then((res) => res.json())
      .then(setProperty)
      .catch(() => setProperty(null))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <p className="text-muted-foreground">Carregando...</p>;
  if (!property) return <p className="text-destructive">Imovel nao encontrado.</p>;

  const statusColor: Record<string, "default" | "secondary" | "destructive"> = {
    done: "default",
    running: "secondary",
    pending: "secondary",
    error: "destructive",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {property.address}
        {property.number ? `, ${property.number}` : ""}
      </h1>

      {/* Vistoria CTA */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <p className="font-medium">📱 Vistoria em Campo</p>
            <p className="text-sm text-muted-foreground">
              Use seu celular para fotografar o imovel e responder perguntas
              qualificadoras
            </p>
          </div>
          <Button asChild className="min-h-[48px] w-full gap-2 sm:w-auto">
            <Link href={`/properties/${property.id}/vistoria`}>
              <Camera className="h-5 w-5" />
              Iniciar Vistoria
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Property info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-4 w-4" /> Informacoes do Imovel
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <span className="text-muted-foreground">Cidade: </span>
            {property.city} - {property.state}
          </div>
          <div>
            <span className="text-muted-foreground">Tipo: </span>
            {property.type}
          </div>
          {property.area && (
            <div>
              <span className="text-muted-foreground">Area: </span>
              {property.area} m2
            </div>
          )}
          {property.matricula && (
            <div>
              <span className="text-muted-foreground">Matricula: </span>
              {property.matricula}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documents */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Documentos</CardTitle>
            <CardDescription>
              {property.documents.length} documento(s) anexado(s)
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <FileUp className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </CardHeader>
        <CardContent>
          {property.documents.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum documento enviado ainda.
            </p>
          ) : (
            <ul className="space-y-2">
              {property.documents.map((doc) => (
                <li
                  key={doc.id}
                  className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                >
                  <span>{doc.name}</span>
                  <Badge variant="secondary">{doc.type}</Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Analyses */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Analises</CardTitle>
            <CardDescription>
              {property.analyses.length} analise(s) realizadas
            </CardDescription>
          </div>
          <Button asChild size="sm">
            <Link href={`/properties/${property.id}/analysis/new`}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Analise
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {property.analyses.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma analise realizada.
            </p>
          ) : (
            <ul className="space-y-2">
              {property.analyses.map((a) => (
                <li key={a.id}>
                  <Link
                    href={`/properties/${property.id}/analysis/${a.id}`}
                    className="flex items-center justify-between rounded-md border px-3 py-2 text-sm transition-colors hover:bg-muted"
                  >
                    <span>{a.useCase}</span>
                    <Badge variant={statusColor[a.status] ?? "secondary"}>
                      {a.status}
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
