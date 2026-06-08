"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Clock,
  AlertTriangle,
  Loader2,
  Calendar,
  Scale,
  User,
  Download,
  Share,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  StatCard,
  StatusBadge,
  PipelineStepper,
  EmptyState,
  PartiesSection,
  TimelineSection,
  ClaimsSection,
  RiskList,
  DeadlineCard,
} from "@aiox/design-system";
import { useToast } from "@/hooks/use-toast";

type PartyRole = "author" | "defendant" | "third_party" | "witness" | "expert";
type ClaimStatus = "pending" | "granted" | "denied" | "partial";
type TimelineType = "filing" | "decision" | "hearing" | "motion" | "other";

function normalizeParty(party: unknown) {
  const p = party as Record<string, unknown>;
  const roles: PartyRole[] = [
    "author",
    "defendant",
    "third_party",
    "witness",
    "expert",
  ];
  const role = roles.includes(p?.role as PartyRole)
    ? (p.role as PartyRole)
    : "third_party";
  return {
    name: String(p?.name || "Desconhecido"),
    role,
    document: p?.document ? String(p.document) : undefined,
    attorney: p?.attorney ? String(p.attorney) : undefined,
  };
}

function normalizeClaim(claim: unknown) {
  const c = claim as Record<string, unknown>;
  const statuses: ClaimStatus[] = ["pending", "granted", "denied", "partial"];
  const status = statuses.includes(c?.status as ClaimStatus)
    ? (c.status as ClaimStatus)
    : "pending";
  return {
    type: String(c?.type || "Genérico"),
    description: String(c?.description || ""),
    value: typeof c?.value === "number" ? c.value : undefined,
    status,
  };
}

function normalizeTimeline(event: unknown) {
  const e = event as Record<string, unknown>;
  const types: TimelineType[] = [
    "filing",
    "decision",
    "hearing",
    "motion",
    "other",
  ];
  const type = types.includes(e?.type as TimelineType)
    ? (e.type as TimelineType)
    : "other";
  return {
    date: String(e?.date || new Date().toISOString()),
    description: String(e?.description || ""),
    type,
  };
}

interface AnalysisDetail {
  id: string;
  processNumber: string | null;
  court: string | null;
  processClass: string | null;
  status: string;
  progress?: number;
  currentStep?: string | null;
  result: Record<string, unknown> | null;
  createdAt: string;
  documents: Array<{ id: string; filename: string; fileType: string | null }>;
  deadlines: Array<{
    id: string;
    description: string;
    dueDate: string;
    priority: string;
    urgency?: string;
    status: string;
  }>;
  events: Array<{ id: string; event: string; createdAt: string }>;
}

interface LiveState {
  status: string;
  progress: number;
  currentStep: string | null;
}

function AnaliseDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const id = params.id as string;

  const [analysis, setAnalysis] = useState<AnalysisDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [live, setLive] = useState<LiveState>({
    status: "PENDING",
    progress: 0,
    currentStep: null,
  });
  const startedRef = useRef(false);

  const fetchAnalysis = useCallback(async () => {
    const response = await fetch(`/api/analyses/${id}`);
    if (!response.ok) throw new Error("Análise não encontrada");
    const { data } = (await response.json()) as { data: AnalysisDetail };
    setAnalysis(data);
    setLive({
      status: data.status,
      progress: data.progress ?? (data.status === "COMPLETED" ? 100 : 0),
      currentStep: data.currentStep ?? null,
    });
    return data;
  }, [id]);

  const streamProcessing = useCallback(async () => {
    try {
      const res = await fetch(`/api/analyses/${id}/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!res.body) {
        await fetchAnalysis();
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      setLive((prev) => ({ ...prev, status: "PROCESSING" }));

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split("\n\n");
        buffer = chunks.pop() || "";
        for (const chunk of chunks) {
          const eventMatch = chunk.match(/^event: (.+)$/m);
          const dataMatch = chunk.match(/^data: (.+)$/m);
          if (!dataMatch) continue;
          const event = eventMatch?.[1];
          const data = JSON.parse(dataMatch[1]);
          if (event === "progress") {
            setLive({
              status: "PROCESSING",
              progress: data.progress ?? 0,
              currentStep: data.step ?? null,
            });
          } else if (event === "done") {
            setLive((prev) => ({
              ...prev,
              status: data.status,
              progress: 100,
            }));
          }
        }
      }
    } catch {
      // fall through to refetch
    } finally {
      await fetchAnalysis().catch(() => undefined);
    }
  }, [id, fetchAnalysis]);

  // Initial load + decide whether to stream or poll.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchAnalysis();
        if (cancelled || startedRef.current) return;
        const shouldStart = searchParams.get("start") === "1";
        if (data.status === "PENDING" && shouldStart) {
          startedRef.current = true;
          streamProcessing();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchAnalysis, streamProcessing, searchParams]);

  // Poll while processing if we are not actively streaming (e.g. revisited tab).
  useEffect(() => {
    if (live.status !== "PROCESSING" && live.status !== "PENDING") return;
    if (startedRef.current) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/analyses/${id}/status`);
        const { data } = await res.json();
        if (!data) return;
        setLive({
          status: data.status,
          progress: data.progress ?? 0,
          currentStep: data.currentStep ?? null,
        });
        if (data.status === "COMPLETED" || data.status === "FAILED") {
          await fetchAnalysis();
        }
      } catch {
        // ignore
      }
    }, 3500);
    return () => clearInterval(interval);
  }, [live.status, id, fetchAnalysis]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAnalysis().catch(() => undefined);
    setRefreshing(false);
  }, [fetchAnalysis]);

  const handleExport = useCallback(() => {
    if (!analysis) return;
    const blob = new Blob([JSON.stringify(analysis, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analise-${analysis.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [analysis]);

  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href.split("?")[0]);
      toast({
        title: "Link copiado",
        description: "O link da análise foi copiado.",
      });
    } catch {
      toast({
        title: "Não foi possível copiar",
        description: "Copie o endereço da página manualmente.",
        variant: "destructive",
      });
    }
  }, [toast]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Carregando análise...</p>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <EmptyState
          icon={AlertTriangle}
          title={error || "Análise não encontrada"}
          action={
            <Button variant="outline" asChild>
              <Link href="/dashboard/analises">Voltar às análises</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const result = analysis.result;
  const isComplete = analysis.status === "COMPLETED";
  const isRunning = live.status === "PROCESSING" || live.status === "PENDING";
  const extracted = (result?.extractedData as Record<string, unknown>) || null;
  const risks = (result?.risks as Array<{
    type: string;
    description?: string;
    severity?: string;
  }>) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/analises">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                {analysis.processNumber || "Análise sem número"}
              </h1>
              <StatusBadge status={live.status} />
            </div>
            <p className="text-muted-foreground">
              {analysis.court && `${analysis.court} • `}
              {analysis.processClass || "Classe não especificada"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Atualizar
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share className="mr-2 h-4 w-4" />
            Compartilhar
          </Button>
          <Button size="sm" onClick={handleExport} disabled={!isComplete}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Live pipeline while running */}
      {isRunning && (
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Agentes em ação
            </CardTitle>
            <CardDescription>
              Acompanhe o pipeline multiagente analisando os documentos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PipelineStepper
              status={live.status}
              progress={live.progress}
              currentStep={live.currentStep}
            />
          </CardContent>
        </Card>
      )}

      {analysis.status === "FAILED" && (
        <Card className="border-danger/50">
          <CardContent className="flex items-start gap-3 py-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-danger" />
            <div>
              <p className="font-medium">A análise falhou</p>
              <p className="text-sm text-muted-foreground">
                {(result?.error as string) ||
                  "Ocorreu um erro durante o processamento. Tente novamente."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {isComplete && result && (
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            title="Score de Risco"
            value={result.score != null ? `${result.score}/100` : "N/A"}
            icon={Scale}
            hint={String(result.scoreDescription || "Análise completada")}
          />
          <StatCard
            title="Partes"
            value={String(result.partiesCount ?? 0)}
            icon={User}
            hint="Identificadas"
          />
          <StatCard
            title="Prazos"
            value={analysis.deadlines.length}
            icon={Calendar}
            hint="Identificados"
          />
          <StatCard
            title="Riscos"
            value={String(result.risksCount ?? 0)}
            icon={AlertTriangle}
            hint="Encontrados"
          />
        </div>
      )}

      <Tabs defaultValue="visao-geral" className="space-y-4">
        <TabsList>
          <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="dados-extraidos">Dados Extraídos</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
          <TabsTrigger value="prazos">Prazos</TabsTrigger>
          <TabsTrigger value="eventos">Eventos</TabsTrigger>
        </TabsList>

        <TabsContent value="visao-geral" className="space-y-4">
          {isComplete && result ? (
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Resumo da Análise
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-sm">
                    {(result.summary as string) || "Resumo não disponível."}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Riscos Identificados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RiskList risks={risks} />
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="py-10">
                {isRunning ? (
                  <div className="text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                    <p className="mt-4 text-sm text-muted-foreground">
                      {live.currentStep || "Processando documentos..."}
                    </p>
                  </div>
                ) : (
                  <EmptyState
                    icon={AlertTriangle}
                    title="Sem resultado disponível"
                    description="A análise não produziu um resultado."
                  />
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="dados-extraidos" className="space-y-4">
          {isComplete && extracted ? (
            <div className="grid gap-6 lg:grid-cols-2">
              <PartiesSection
                parties={
                  Array.isArray(extracted.parties)
                    ? (extracted.parties as unknown[]).map(normalizeParty)
                    : []
                }
              />
              <ClaimsSection
                claims={
                  Array.isArray(extracted.claims)
                    ? (extracted.claims as unknown[]).map(normalizeClaim)
                    : []
                }
              />
              <div className="lg:col-span-2">
                <TimelineSection
                  timeline={
                    Array.isArray(extracted.timeline)
                      ? (extracted.timeline as unknown[]).map(normalizeTimeline)
                      : []
                  }
                />
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="py-10">
                <EmptyState
                  icon={isRunning ? Loader2 : AlertTriangle}
                  title={
                    isRunning ? "Extraindo dados..." : "Dados não disponíveis"
                  }
                  description={
                    isRunning
                      ? "Os dados aparecem assim que a análise concluir."
                      : "Aguarde o processamento da análise."
                  }
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="documentos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documentos Analisados</CardTitle>
              <CardDescription>
                {analysis.documents.length} documento(s) enviado(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analysis.documents.length > 0 ? (
                <div className="space-y-2">
                  {analysis.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-3 rounded-lg border p-3"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{doc.filename}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc.fileType || "Tipo desconhecido"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState icon={FileText} title="Nenhum documento enviado" />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prazos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Prazos Processuais</CardTitle>
              <CardDescription>
                {analysis.deadlines.length} prazo(s) identificado(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analysis.deadlines.length > 0 ? (
                <div className="space-y-3">
                  {analysis.deadlines.map((deadline) => (
                    <DeadlineCard key={deadline.id} deadline={deadline} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Clock}
                  title="Nenhum prazo identificado"
                  description="Os prazos aparecem após uma análise concluída."
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="eventos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Eventos</CardTitle>
              <CardDescription>
                Linha do tempo das ações desta análise
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analysis.events.length > 0 ? (
                <div className="relative space-y-4 border-l-2 border-border pl-6">
                  {[...analysis.events].reverse().map((event) => (
                    <div key={event.id} className="relative">
                      <div className="absolute -left-[25px] h-4 w-4 rounded-full border-2 border-background bg-primary" />
                      <p className="font-medium">
                        {event.event.replace(/_/g, " ")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.createdAt).toLocaleString("pt-BR")}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState icon={Clock} title="Nenhum evento registrado" />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AnaliseDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <AnaliseDetailContent />
    </Suspense>
  );
}
