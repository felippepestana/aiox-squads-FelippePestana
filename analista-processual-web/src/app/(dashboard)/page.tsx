import { Scale, FileText, Clock, AlertTriangle, TrendingUp, Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const stats = [
  {
    title: "Processos Analisados",
    value: "127",
    change: "+12 hoje",
    icon: Scale,
    trend: "up",
  },
  {
    title: "Prazos Pendentes",
    value: "34",
    change: "8 urgentes",
    icon: Clock,
    trend: "neutral",
  },
  {
    title: "Taxa de Sucesso",
    value: "94.2%",
    change: "+2.1% este mês",
    icon: TrendingUp,
    trend: "up",
  },
  {
    title: "Alertas Críticos",
    value: "3",
    change: "Requer atenção",
    icon: AlertTriangle,
    trend: "down",
  },
];

const recentAnalyses = [
  {
    id: "1",
    processNumber: "0001234-56.2024.8.26.0100",
    court: "TJSP",
    processClass: "Cível",
    status: "completed",
    date: "2024-01-15",
  },
  {
    id: "2",
    processNumber: "0005678-90.2024.5.26.0100",
    court: "TRF3",
    processClass: "Trabalhista",
    status: "processing",
    date: "2024-01-15",
  },
  {
    id: "3",
    processNumber: "0009012-34.2024.2.26.0100",
    court: "TJMG",
    processClass: "Penal",
    status: "completed",
    date: "2024-01-14",
  },
];

const upcomingDeadlines = [
  {
    id: "1",
    description: "Contestação - Ação de Cobrança",
    dueDate: "2024-01-20",
    daysRemaining: 3,
    priority: "critical",
  },
  {
    id: "2",
    description: "Recurso - Apelação",
    dueDate: "2024-01-25",
    daysRemaining: 8,
    priority: "high",
  },
  {
    id: "3",
    description: "Audiência - Conciliação",
    dueDate: "2024-02-05",
    daysRemaining: 15,
    priority: "normal",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral da sua análise processual
          </p>
        </div>
        <Button asChild>
          <Link href="/analise">
            <Upload className="mr-2 h-4 w-4" />
            Novo Processo
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Analyses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Análises Recentes
            </CardTitle>
            <CardDescription>
              Últimas análises de processos realizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAnalyses.map((analysis) => (
                <Link
                  key={analysis.id}
                  href={`/analise/${analysis.id}`}
                  className="block"
                >
                  <div className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50">
                    <div className="space-y-1">
                      <p className="font-mono text-sm font-medium">
                        {analysis.processNumber}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {analysis.court} • {analysis.processClass}
                      </p>
                    </div>
                    <Badge
                      variant={
                        analysis.status === "completed"
                          ? "success"
                          : "warning"
                      }
                    >
                      {analysis.status === "completed"
                        ? "Concluído"
                        : "Processando"}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
            <Button variant="outline" className="mt-4 w-full" asChild>
              <Link href="/analise">Ver todas as análises</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Prazos Próximos
            </CardTitle>
            <CardDescription>
              Alertas de prazos pendentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingDeadlines.map((deadline) => (
                <div
                  key={deadline.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {deadline.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Vencimento:{" "}
                      {new Date(deadline.dueDate).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <Badge
                    variant={
                      deadline.priority === "critical"
                        ? "destructive"
                        : deadline.priority === "high"
                        ? "warning"
                        : "secondary"
                    }
                  >
                    {deadline.daysRemaining} dias
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="mt-4 w-full">
              Ver calendário completo
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Acesso rápido às principais funcionalidades
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Button variant="outline" className="h-20 flex-col gap-2" asChild>
            <Link href="/analise">
              <Upload className="h-6 w-6" />
              <span>Upload de Processo</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2" asChild>
            <Link href="/biblioteca">
              <FileText className="h-6 w-6" />
              <span>Biblioteca</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2">
            <Scale className="h-6 w-6" />
            <span>Buscar Jurisprudência</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2" asChild>
            <Link href="/config">
              <Clock className="h-6 w-6" />
              <span>Configurações</span>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
