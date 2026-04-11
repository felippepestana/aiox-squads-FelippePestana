"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Play, Download, WifiOff } from "lucide-react";
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

const MAX_SSE_RETRIES = 3;
const SSE_RETRY_DELAY = 2000;

export default function AnalysisPage() {
  const params = useParams<{ id: string; analysisId: string }>();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [agents, setAgents] = useState<AgentLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectionLost, setConnectionLost] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const agentListRef = useRef<HTMLUListElement>(null);
  const mountedRef = useRef(true);

  const handleAgentEvent = useCallback((data: PipelineEvent) => {
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

      // Auto-scroll to latest agent when it finishes
      if (data.type === "agent:done") {
        requestAnimationFrame(() => {
          agentListRef.current?.lastElementChild?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        });
      }
    }

    if (data.type === "pipeline:done") {
      setAnalysis((prev) => (prev ? { ...prev, status: "done" } : prev));
      setConnectionLost(false);
      retryCountRef.current = 0;
      // Refetch full results
      fetch(`/api/analyses/${params.analysisId}`)
        .then((res) => res.json())
        .then((d: Analysis) => {
          if (mountedRef.current) setAnalysis(d);
        });
    }
  }, [params.analysisId]);

  const connectSSE = useCallback(() => {
    // Close any existing connection
    eventSourceRef.current?.close();

    const es = new EventSource(
      `/api/analyses/${params.analysisId}/stream`
    );
    eventSourceRef.current = es;

    es.onopen = () => {
      setConnectionLost(false);
      retryCountRef.current = 0;
    };

    es.onmessage = (event) => {
      try {
        const data: PipelineEvent = JSON.parse(event.data);
        handleAgentEvent(data);

        if (data.type === "pipeline:done") {
          es.close();
          eventSourceRef.current = null;
        }
      } catch {
        // Ignore malformed SSE messages
      }
    };

    es.onerror = () => {
      es.close();
      eventSourceRef.current = null;

      if (!mountedRef.current) return;

      if (retryCountRef.current < MAX_SSE_RETRIES) {
        setConnectionLost(true);
        retryCountRef.current += 1;
        retryTimeoutRef.current = setTimeout(() => {
          if (mountedRef.current) connectSSE();
        }, SSE_RETRY_DELAY);
      } else {
        setConnectionLost(true);
        toast.error("Conexao com o servidor perdida. Recarregue a pagina.");
      }
    };
  }, [params.analysisId, handleAgentEvent]);

  useEffect(() => {
    mountedRef.current = true;

    fetch(`/api/analyses/${params.analysisId}`)
      .then((res) => res.json())
      .then((data: Analysis) => {
        if (!mountedRef.current) return;
        setAnalysis(data);
        setAgents(data.agents ?? []);
        if (data.status === "running") connectSSE();
      })
      .catch(() => {
        if (mountedRef.current) toast.error("Erro ao carregar analise");
      })
      .finally(() => {
        if (mountedRef.current) setLoading(false);
      });

    return () => {
      mountedRef.current = false;
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.analysisId]);

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
    retryCountRef.current = 0;
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
        <div className="flex items-center gap-2">
          {connectionLost && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <WifiOff className="h-3 w-3" />
              Conexao perdida
            </Badge>
          )}
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
            <ul ref={agentListRef} className="space-y-2">
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
