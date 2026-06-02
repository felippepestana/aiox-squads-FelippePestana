"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Clock, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DeadlineItem {
  id: string;
  description: string;
  dueDate: string;
  priority: string;
  urgency: string;
  status: string;
  analysis?: {
    id: string;
    processNumber: string | null;
    court: string | null;
  };
}

function getUrgencyBadge(urgency: string) {
  switch (urgency) {
    case "CRITICAL":
      return <Badge className="bg-danger text-danger-foreground">Crítico</Badge>;
    case "HIGH":
      return <Badge className="bg-warning text-warning-foreground">Alta</Badge>;
    case "LOW":
      return <Badge variant="outline">Baixa</Badge>;
    default:
      return <Badge variant="secondary">Média</Badge>;
  }
}

export default function PrazosPage() {
  const [deadlines, setDeadlines] = useState<DeadlineItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDeadlines() {
      try {
        const response = await fetch("/api/deadlines?upcoming=true");
        const { data } = await response.json();
        setDeadlines(data ?? []);
      } catch (error) {
        console.error("Error fetching deadlines:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDeadlines();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Prazos</h1>
        <p className="text-muted-foreground">
          Prazos processuais identificados nas suas análises
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Próximos prazos</CardTitle>
          <CardDescription>
            Prazos pendentes ordenados por data de vencimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-[200px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : deadlines.length > 0 ? (
            <div className="space-y-3">
              {deadlines.map((deadline) => {
                const daysLeft = Math.ceil(
                  (new Date(deadline.dueDate).getTime() - Date.now()) /
                    (1000 * 60 * 60 * 24)
                );
                return (
                  <div
                    key={deadline.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{deadline.description}</p>
                        {getUrgencyBadge(deadline.urgency)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(deadline.dueDate).toLocaleDateString("pt-BR")}
                        </span>
                        <span className={daysLeft <= 5 ? "text-warning" : ""}>
                          {daysLeft} dia(s) restante(s)
                        </span>
                        {deadline.analysis && (
                          <Link
                            href={`/dashboard/analises/${deadline.analysis.id}`}
                            className="hover:underline"
                          >
                            {deadline.analysis.processNumber || "Ver análise"}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex h-[200px] flex-col items-center justify-center text-center">
              <Clock className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-sm text-muted-foreground">
                Nenhum prazo pendente. Os prazos aparecem aqui após uma análise concluída.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
