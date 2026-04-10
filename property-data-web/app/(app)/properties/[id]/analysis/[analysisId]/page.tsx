"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Play, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { AnalysisStatus, AgentLog, PipelineEvent } from "@/types/analysis";

interface Analysis {
  id: string;
  propertyId: string;
  useCase: string;
  status: AnalysisStatus;
  agents: AgentLog[];
  result?: Record<string, unknown>;
}

const RESULT_TABS = [
  "Registral",
  "Legislativo",
  "Urbanistico",
  "Ambiental",
  "Condominial",
  "Avaliacao",
  "Visual",
];

export default function AnalysisPage() {
  const params = useParams<{ id: string; analysisId: string }>();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [agents, setAgents] = useState<AgentLog[]>([]);
  const [loading, setLoading] = useState(true);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    fetch(`/api/analyses/${params.analysisId}`)
      .then((res) => res.json())
      .then((data: Analysis) => {
        setAnalysis(data);
        setAgents(data.agents ?? []);
        if (data.status === "running") connectSSE();
      })
      .catch(() => toast.error("Erro ao carregar analise"))
      .finally(() => setLoading(false));

    return () => eventSourceRef.current?.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.analysisId]);

  function connectSSE() {
    const es = new EventSource(
      `/api/analyses/${params.analysisId}/stream`
    );
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      const data: PipelineEvent = JSON.parse(event.data);

      if (data.type === "agent:start" || data.type === "agent:done") {
        setAgents((prev) => {
          const idx = prev.findIndex((a) => a.agentId === data.agentId);
          const log: AgentLog = {
            agentId: data.agentId!,
            agentName: data.agentName ?? data.agentId!,
            tier: "",
            status: data.status ?? "running",
            model: data.model,
            tokensUsed: data.tokensUsed,
          };
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = { ...next[idx], ...log };
            return next;
          }
          return [...prev, log];
        });
      }

      if (data.type === "pipeline:done") {
        setAnalysis((prev) => (prev ? { ...prev, status: "done" } : prev));
        es.close();
        // Refetch full results
        fetch(`/api/analyses/${params.analysisId}`)
          .then((res) => res.json())
          .then((d: Analysis) => setAnalysis(d));
      }
    };

    es.onerror = () => es.close();
  }

  async function handleStart() {
    const res = await fetch(
      `/api/analyses/${params.analysisId}/start`,
      { method: "POST" }
    );
    if (!res.ok) {
      toast.error("Erro ao iniciar analise");
      return;
    }
    setAnalysis((prev) => (prev ? { ...prev, status: "running" } : prev));
    connectSSE();
  }

  if (loading) return <p className="text-muted-foreground">Carregando...</p>;
  if (!analysis) return <p className="text-destructive">Analise nao encontrada.</p>;

  const doneCount = agents.filter((a) => a.status === "done").length;
  const progressPct = agents.length > 0 ? (doneCount / agents.length) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Analise {analysis.useCase}</h1>
        <Badge
          variant={
            analysis.status === "done"
              ? "default"
              : analysis.status === "error"
                ? "destructive"
                : "secondary"
          }
        >
          {analysis.status}
        </Badge>
      </div>

      {/* Pending: start button */}
      {analysis.status === "pending" && (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-8">
            <p className="text-muted-foreground">
              Analise pronta para ser iniciada.
            </p>
            <Button onClick={handleStart}>
              <Play className="mr-2 h-4 w-4" />
              Iniciar Analise
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Running: pipeline progress */}
      {analysis.status === "running" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pipeline em execucao</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={progressPct} />
            <ul className="space-y-2">
              {agents.map((a) => (
                <li
                  key={a.agentId}
                  className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                >
                  <span>{a.agentName}</span>
                  <Badge
                    variant={
                      a.status === "done"
                        ? "default"
                        : a.status === "error"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {a.status}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Done: results tabs */}
      {analysis.status === "done" && analysis.result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resultados</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={RESULT_TABS[0]}>
              <TabsList className="flex-wrap">
                {RESULT_TABS.map((tab) => (
                  <TabsTrigger key={tab} value={tab}>
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>
              {RESULT_TABS.map((tab) => (
                <TabsContent key={tab} value={tab}>
                  <pre className="overflow-auto rounded-md bg-muted p-4 text-sm">
                    {JSON.stringify(
                      (analysis.result as Record<string, unknown>)[
                        tab.toLowerCase()
                      ] ?? "Sem dados para esta secao.",
                      null,
                      2
                    )}
                  </pre>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Export section */}
      {analysis.status === "done" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Exportar</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link
                href={`/properties/${params.id}/analysis/${params.analysisId}/export`}
              >
                <Download className="mr-2 h-4 w-4" />
                Exportar Relatorio
              </Link>
            </Button>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
