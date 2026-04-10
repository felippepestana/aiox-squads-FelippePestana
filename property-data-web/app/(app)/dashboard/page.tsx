"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Building2, BarChart3, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PropertySummary } from "@/types/property";

export default function DashboardPage() {
  const [properties, setProperties] = useState<PropertySummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/properties")
      .then((res) => res.json())
      .then((data) => setProperties(data))
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }, []);

  const totalProperties = properties.length;
  const totalAnalyses = properties.reduce((s, p) => s + p.analysesCount, 0);
  const thisMonth = new Date().getMonth();
  const analysesThisMonth = properties.filter(
    (p) => new Date(p.createdAt).getMonth() === thisMonth
  ).length;

  const stats = [
    { label: "Imoveis", value: totalProperties, icon: Building2 },
    { label: "Analises", value: totalAnalyses, icon: BarChart3 },
    { label: "Este mes", value: analysesThisMonth, icon: CalendarDays },
  ];

  if (loading) {
    return <p className="text-muted-foreground">Carregando...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link href="/properties/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Imovel
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription>{s.label}</CardDescription>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Property grid */}
      {properties.length === 0 ? (
        <Card className="py-12 text-center">
          <CardContent>
            <Building2 className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 text-muted-foreground">
              Nenhum imovel cadastrado
            </p>
            <Button asChild className="mt-4">
              <Link href="/properties/new">Cadastrar primeiro imovel</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => (
            <Link key={p.id} href={`/properties/${p.id}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">
                      {p.address}
                      {p.number ? `, ${p.number}` : ""}
                    </CardTitle>
                    <Badge variant={p.status === "ready" ? "default" : "secondary"}>
                      {p.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    {p.city} - {p.state}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex gap-4 text-sm text-muted-foreground">
                  <span>{p.documentsCount} docs</span>
                  <span>{p.analysesCount} analises</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
