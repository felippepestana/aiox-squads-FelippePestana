"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Plus,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AnalysisItem {
  id: string;
  processNumber: string | null;
  court: string | null;
  processClass: string | null;
  status: string;
  createdAt: string;
  _count?: { deadlines: number };
}

interface DeadlineItem {
  id: string;
  description: string;
  dueDate: string;
  urgency: string;
}

function getStatusBadge(status: string) {
  switch (status) {
    case "COMPLETED":
      return <Badge className="bg-success text-success-foreground">Concluída</Badge>;
    case "PROCESSING":
      return (
        <Badge className="bg-warning text-warning-foreground">
          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
          Processando
        </Badge>
      );
    case "FAILED":
      return <Badge className="bg-danger text-danger-foreground">Falhou</Badge>;
    default:
      return <Badge variant="secondary">Pendente</Badge>;
  }
}

export default function DashboardPage() {
  const [analyses, setAnalyses] = useState<AnalysisItem[]>([]);
  const [deadlines, setDeadlines] = useState<DeadlineItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [analysesRes, deadlinesRes] = await Promise.all([
          fetch("/api/analyses?limit=5"),
          fetch("/api/deadlines?upcoming=true"),
        ]);
        const analysesJson = await analysesRes.json();
        const deadlinesJson = await deadlinesRes.json();
        setAnalyses(analysesJson.data ?? []);
        setDeadlines(deadlinesJson.data ?? []);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const completed = analyses.filter((a) => a.status === "COMPLETED").length;
  const processing = analyses.filter(
    (a) => a.status === "PROCESSING" || a.status === "PENDING"
  ).length;

  const stats = [
    { title: "Análises (recentes)", value: analyses.length, icon: FileText },
    { title: "Prazos pendentes", value: deadlines.length, icon: Clock },
    { title: "Concluídas", value: completed, icon: CheckCircle2 },
    { title: "Em processamento", value: processing, icon: Loader2 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Bem-vindo de volta!</h2>
          <p className="text-muted-foreground">
            Resumo das suas análises processuais.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/nova-analise">
            <Plus className="mr-2 h-4 w-4" />
            Nova Análise
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? "—" : stat.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Análises Recentes</CardTitle>
                <CardDescription>Suas últimas análises processuais</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/analises">
                  Ver todas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex h-[160px] items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : analyses.length > 0 ? (
              <div className="space-y-4">
                {analyses.map((analysis) => (
                  <Link
                    key={analysis.id}
                    href={`/dashboard/analises/${analysis.id}`}
                    className="block"
                  >
                    <div className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {analysis.processNumber || "Análise sem número"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {[analysis.court, analysis.processClass]
                            .filter(Boolean)
                            .join(" • ") || "Sem metadados"}
                        </p>
                      </div>
                      {getStatusBadge(analysis.status)}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex h-[160px] flex-col items-center justify-center text-center">
                <FileText className="h-10 w-10 text-muted-foreground/50" />
                <p className="mt-3 text-sm text-muted-foreground">
                  Nenhuma análise ainda.
                </p>
                <Button className="mt-3" size="sm" asChild>
                  <Link href="/dashboard/nova-analise">Criar primeira análise</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Prazos Próximos</CardTitle>
                <CardDescription>Próximos prazos a vencer</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/prazos">
                  Ver todos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex h-[160px] items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : deadlines.length > 0 ? (
              <div className="space-y-4">
                {deadlines.slice(0, 5).map((deadline) => {
                  const daysLeft = Math.ceil(
                    (new Date(deadline.dueDate).getTime() - Date.now()) /
                      (1000 * 60 * 60 * 24)
                  );
                  return (
                    <div
                      key={deadline.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {deadline.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Vence em{" "}
                          {new Date(deadline.dueDate).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          daysLeft <= 5 ? "text-danger" : "text-muted-foreground"
                        }`}
                      >
                        {daysLeft} dia(s)
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex h-[160px] flex-col items-center justify-center text-center">
                <Clock className="h-10 w-10 text-muted-foreground/50" />
                <p className="mt-3 text-sm text-muted-foreground">
                  Nenhum prazo pendente.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Como funciona</CardTitle>
          <CardDescription>
            Pipeline multiagente de análise processual
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { n: "1", t: "Navegador", d: "Indexa e organiza os documentos" },
              { n: "2", t: "Extrator", d: "Extrai partes, pedidos e cronologia" },
              { n: "3", t: "Calculador", d: "Calcula prazos processuais (CPC)" },
              { n: "4", t: "Mapeador", d: "Identifica riscos e recomendações" },
            ].map((step) => (
              <div key={step.n} className="rounded-lg border p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {step.n}
                </div>
                <p className="mt-2 text-sm font-medium">{step.t}</p>
                <p className="mt-1 text-xs text-muted-foreground">{step.d}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
