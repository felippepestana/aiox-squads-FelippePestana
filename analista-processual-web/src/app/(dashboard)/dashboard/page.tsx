"use client";

import { FileText, Clock, AlertTriangle, TrendingUp, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const stats = [
  {
    title: "Total de Análises",
    value: "127",
    change: "+12%",
    trend: "up",
    icon: FileText,
  },
  {
    title: "Prazos em Aberto",
    value: "23",
    change: "+5",
    trend: "down",
    icon: Clock,
  },
  {
    title: "Riscos Identificados",
    value: "8",
    change: "-3",
    trend: "up",
    icon: AlertTriangle,
  },
  {
    title: "Taxa de Sucesso",
    value: "94%",
    change: "+2%",
    trend: "up",
    icon: TrendingUp,
  },
];

const recentAnalyses = [
  {
    id: "1",
    title: "Réu: João Silva - Ação de Cobrança",
    status: "completed",
    date: "2024-01-15",
    score: 92,
    type: "Análise Completa",
  },
  {
    id: "2",
    title: "Empresa ABC - Recurso de Apelação",
    status: "in_progress",
    date: "2024-01-14",
    progress: 65,
    type: "Análise de Recurso",
  },
  {
    id: "3",
    title: "Partes: Maria Santos vs. Banco XYZ",
    status: "completed",
    date: "2024-01-13",
    score: 78,
    type: "Análise de Contrato",
  },
  {
    id: "4",
    title: "Inventário - Família Oliveira",
    status: "pending",
    date: "2024-01-12",
    type: "Análise de Inventário",
  },
];

const upcomingDeadlines = [
  {
    id: "1",
    title: "Contestação - Processo 1234/2024",
    deadline: "2024-01-20",
    daysLeft: 5,
    priority: "high",
  },
  {
    id: "2",
    title: "Recurso - Processo 5678/2023",
    deadline: "2024-01-25",
    daysLeft: 10,
    priority: "medium",
  },
  {
    id: "3",
    title: "Alegações Finais - Processo 9012/2024",
    deadline: "2024-02-01",
    daysLeft: 17,
    priority: "low",
  },
];

function getStatusBadge(status: string) {
  switch (status) {
    case "completed":
      return <Badge className="bg-success text-success-foreground">Concluída</Badge>;
    case "in_progress":
      return <Badge className="bg-warning text-warning-foreground">Em Andamento</Badge>;
    case "pending":
      return <Badge variant="secondary">Pendente</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

function getPriorityBadge(priority: string) {
  switch (priority) {
    case "high":
      return <Badge className="bg-danger text-danger-foreground">Alta</Badge>;
    case "medium":
      return <Badge className="bg-warning text-warning-foreground">Média</Badge>;
    case "low":
      return <Badge variant="secondary">Baixa</Badge>;
    default:
      return <Badge variant="secondary">{priority}</Badge>;
  }
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Bem-vindo de volta!</h2>
          <p className="text-muted-foreground">
            Aqui está um resumo das suas atividades recentes.
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
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span
                    className={
                      stat.trend === "up" ? "text-success" : "text-danger"
                    }
                  >
                    {stat.change}
                  </span>{" "}
                  vs último mês
                </p>
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
                <CardDescription>
                  Suas últimas análises processuais
                </CardDescription>
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
            <div className="space-y-4">
              {recentAnalyses.map((analysis) => (
                <Link
                  key={analysis.id}
                  href={`/dashboard/analises/${analysis.id}`}
                  className="block"
                >
                  <div className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {analysis.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {analysis.type} • {analysis.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {"progress" in analysis && (
                        <div className="w-16">
                          <Progress value={analysis.progress} className="h-2" />
                        </div>
                      )}
                      {"score" in analysis && (
                        <div className="flex items-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10 text-sm font-medium text-success">
                            {analysis.score}
                          </div>
                        </div>
                      )}
                      {getStatusBadge(analysis.status)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Prazos Próximos</CardTitle>
                <CardDescription>
                  Próximos prazos a vencer
                </CardDescription>
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
            <div className="space-y-4">
              {upcomingDeadlines.map((deadline) => (
                <div
                  key={deadline.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {deadline.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Vence em {new Date(deadline.deadline).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-medium ${
                        deadline.daysLeft <= 5
                          ? "text-danger"
                          : deadline.daysLeft <= 10
                          ? "text-warning"
                          : "text-muted-foreground"
                      }`}
                    >
                      {deadline.daysLeft} dias
                    </span>
                    {getPriorityBadge(deadline.priority)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Modelos LLM Ativos</CardTitle>
          <CardDescription>
            Configuração atual do gateway de inteligência artificial
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-success" />
                <span className="text-sm font-medium">DeepSeek V3</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Tarefas simples (resumos, extrações básicas)
              </p>
              <p className="mt-2 text-lg font-semibold">$0.001/1K tokens</p>
            </div>
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-success" />
                <span className="text-sm font-medium">Qwen 2.5 72B</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Tarefas padrão (análises, mapeamentos)
              </p>
              <p className="mt-2 text-lg font-semibold">$0.003/1K tokens</p>
            </div>
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-warning" />
                <span className="text-sm font-medium">Claude 3.5 Sonnet</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Tarefas complexas (decisões, síntese)
              </p>
              <p className="mt-2 text-lg font-semibold">$0.015/1K tokens</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
