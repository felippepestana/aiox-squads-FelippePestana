"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  Clock,
  CheckCircle2,
  Plus,
  ArrowRight,
  Loader2,
  Compass,
} from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  StatCard,
  StatusBadge,
  PageHeader,
  EmptyState,
} from "@aiox/design-system";

interface AnalysisItem {
  id: string;
  processNumber: string | null;
  court: string | null;
  processClass: string | null;
  status: string;
  createdAt: string;
}

interface DeadlineItem {
  id: string;
  description: string;
  dueDate: string;
}

export default function DashboardPage() {
  const [analyses, setAnalyses] = useState<AnalysisItem[]>([]);
  const [deadlines, setDeadlines] = useState<DeadlineItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [a, d] = await Promise.all([
          fetch("/api/analyses?limit=5"),
          fetch("/api/deadlines?upcoming=true"),
        ]);
        const aj = await a.json();
        const dj = await d.json();
        setAnalyses(aj.data ?? []);
        setDeadlines(dj.data ?? []);
      } catch (e) {
        console.error("Error loading dashboard:", e);
      } finally {
        setLoading(false);
      }
    })();
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
      <PageHeader
        title="Bem-vindo de volta!"
        description="Resumo das suas análises processuais."
        actions={
          <Button asChild>
            <Link href="/dashboard/nova-analise">
              <Plus className="mr-2 h-4 w-4" />
              Nova Análise
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={loading ? "—" : stat.value}
            icon={stat.icon}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Análises Recentes</CardTitle>
                <CardDescription>Suas últimas análises</CardDescription>
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
              <div className="space-y-3">
                {analyses.map((a) => (
                  <Link
                    key={a.id}
                    href={`/dashboard/analises/${a.id}`}
                    className="block"
                  >
                    <div className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {a.processNumber || "Análise sem número"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {[a.court, a.processClass].filter(Boolean).join(" • ") ||
                            "Sem metadados"}
                        </p>
                      </div>
                      <StatusBadge status={a.status} />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={FileText}
                title="Nenhuma análise ainda"
                action={
                  <Button size="sm" asChild>
                    <Link href="/dashboard/nova-analise">
                      Criar primeira análise
                    </Link>
                  </Button>
                }
              />
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
              <div className="space-y-3">
                {deadlines.slice(0, 5).map((d) => {
                  const daysLeft = Math.ceil(
                    (new Date(d.dueDate).getTime() - Date.now()) /
                      (1000 * 60 * 60 * 24)
                  );
                  return (
                    <div
                      key={d.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {d.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Vence em{" "}
                          {new Date(d.dueDate).toLocaleDateString("pt-BR")}
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
              <EmptyState icon={Clock} title="Nenhum prazo pendente" />
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Compass className="h-5 w-5" />
            Como funciona
          </CardTitle>
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
