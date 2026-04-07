"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Calendar,
  Scale,
  User,
  Building,
  Download,
  Share,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PartiesSection, TimelineSection, ClaimsSection } from "@/components/analysis";

// Type definitions for components
type PartyRole = "author" | "defendant" | "third_party" | "witness" | "expert";
type ClaimStatus = "pending" | "granted" | "denied" | "partial";
type TimelineType = "filing" | "decision" | "hearing" | "motion" | "other";

interface Party {
  name: string;
  role: PartyRole;
  document?: string;
  attorney?: string;
}

interface Claim {
  type: string;
  description: string;
  value?: number;
  status: ClaimStatus;
}

interface TimelineEvent {
  date: string;
  description: string;
  type: TimelineType;
}

// Validation and conversion functions
function isValidPartyRole(value: unknown): value is PartyRole {
  return ["author", "defendant", "third_party", "witness", "expert"].includes(
    String(value)
  );
}

function isValidClaimStatus(value: unknown): value is ClaimStatus {
  return ["pending", "granted", "denied", "partial"].includes(String(value));
}

function isValidTimelineType(value: unknown): value is TimelineType {
  return ["filing", "decision", "hearing", "motion", "other"].includes(
    String(value)
  );
}

function normalizeParty(party: unknown): Party {
  const p = party as Record<string, unknown>;
  const role = isValidPartyRole(p?.role) ? p.role : "third_party";
  return {
    name: String(p?.name || "Desconhecido"),
    role,
    document: p?.document ? String(p.document) : undefined,
    attorney: p?.attorney ? String(p.attorney) : undefined,
  };
}

function normalizeClaim(claim: unknown): Claim {
  const c = claim as Record<string, unknown>;
  const status = isValidClaimStatus(c?.status) ? c.status : "pending";
  return {
    type: String(c?.type || "Genérico"),
    description: String(c?.description || ""),
    value: typeof c?.value === "number" ? c.value : undefined,
    status,
  };
}

function normalizeTimelineEvent(event: unknown): TimelineEvent {
  const e = event as Record<string, unknown>;
  const type = isValidTimelineType(e?.type) ? e.type : "other";
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
  result: Record<string, unknown> | null;
  createdAt: string;
  documents: Array<{
    id: string;
    filename: string;
    fileType: string | null;
  }>;
  deadlines: Array<{
    id: string;
    description: string;
    dueDate: string;
    priority: string;
    status: string;
  }>;
  events: Array<{
    id: string;
    event: string;
    createdAt: string;
  }>;
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
    case "PENDING":
      return <Badge variant="secondary">Pendente</Badge>;
    case "FAILED":
      return <Badge className="bg-danger text-danger-foreground">Falhou</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

function getPriorityBadge(priority: string) {
  switch (priority) {
    case "CRITICAL":
      return <Badge className="bg-danger text-danger-foreground">Crítico</Badge>;
    case "HIGH":
      return <Badge className="bg-warning text-warning-foreground">Alta</Badge>;
    case "NORMAL":
      return <Badge variant="secondary">Normal</Badge>;
    case "LOW":
      return <Badge variant="outline">Baixa</Badge>;
    default:
      return <Badge variant="secondary">{priority}</Badge>;
  }
}

export default function AnaliseDetailPage() {
  const params = useParams();
  const [analysis, setAnalysis] = useState<AnalysisDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        const response = await fetch(`/api/analyses/${params.id}`);
        if (!response.ok) {
          throw new Error("Análise não encontrada");
        }
        const { data } = await response.json();
        setAnalysis(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    }

    fetchAnalysis();
  }, [params.id]);

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
        <div className="text-center">
          <AlertTriangle className="mx-auto h-8 w-8 text-danger" />
          <p className="mt-4 text-lg font-medium">{error || "Análise não encontrada"}</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/dashboard/analises">Voltar às análises</Link>
          </Button>
        </div>
      </div>
    );
  }

  const result = analysis.result as Record<string, unknown> | null;
  const isComplete = analysis.status === "COMPLETED";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
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
              {getStatusBadge(analysis.status)}
            </div>
            <p className="text-muted-foreground">
              {analysis.court && `${analysis.court} • `}
              {analysis.processClass || "Classe não especificada"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
          <Button variant="outline" size="sm">
            <Share className="mr-2 h-4 w-4" />
            Compartilhar
          </Button>
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {isComplete && result && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Score Geral</CardTitle>
              <Scale className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {result.score ? `${result.score}/100` : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">
                {String(result.scoreDescription || "Análise completada")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Partes</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {String(result.partiesCount || "N/A")}
              </div>
              <p className="text-xs text-muted-foreground">Identificadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prazos</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analysis.deadlines.length}
              </div>
              <p className="text-xs text-muted-foreground">Identificados</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Riscos</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {String(result.risksCount || 0)}
              </div>
              <p className="text-xs text-muted-foreground">Encontrados</p>
            </CardContent>
          </Card>
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
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap text-sm">
                      {result.summary as string || "Resumo não disponível."}
                    </p>
                  </div>
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
                  {(result.risks as Array<{ type: string; description: string; severity: string }>)?.length >
                  0 ? (
                    <div className="space-y-3">
                      {(result.risks as Array<{ type: string; description: string; severity: string }>).map(
                        (risk, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 rounded-lg border p-3"
                          >
                            <div
                              className={`mt-0.5 h-2 w-2 rounded-full ${
                                risk.severity === "HIGH"
                                  ? "bg-danger"
                                  : risk.severity === "MEDIUM"
                                  ? "bg-warning"
                                  : "bg-info"
                              }`}
                            />
                            <div>
                              <p className="font-medium">{risk.type}</p>
                              <p className="text-sm text-muted-foreground">
                                {risk.description}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-success" />
                      Nenhum risco crítico identificado
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex h-[300px] items-center justify-center">
                <div className="text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                  <p className="mt-4 text-lg font-medium">
                    {analysis.status === "PROCESSING"
                      ? "Processando documentos..."
                      : "Aguardando processamento"}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Este processo pode levar alguns minutos.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="dados-extraidos" className="space-y-4">
          {isComplete && result && result.extractedData ? (
            <div className="grid gap-6 lg:grid-cols-2">
              <PartiesSection
                parties={
                  Array.isArray(
                    (result.extractedData as Record<string, unknown>)?.parties
                  )
                    ? (
                        (result.extractedData as Record<string, unknown>)
                          ?.parties as unknown[]
                      ).map(normalizeParty)
                    : []
                }
              />
              <ClaimsSection
                claims={
                  Array.isArray(
                    (result.extractedData as Record<string, unknown>)?.claims
                  )
                    ? (
                        (result.extractedData as Record<string, unknown>)
                          ?.claims as unknown[]
                      ).map(normalizeClaim)
                    : []
                }
              />
              <div className="lg:col-span-2">
                <TimelineSection
                  timeline={
                    Array.isArray(
                      (result.extractedData as Record<string, unknown>)?.timeline
                    )
                      ? (
                          (result.extractedData as Record<string, unknown>)
                            ?.timeline as unknown[]
                        ).map(normalizeTimelineEvent)
                      : []
                  }
                />
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="flex h-[300px] items-center justify-center">
                <div className="text-center">
                  {analysis.status === "PROCESSING" ? (
                    <>
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                      <p className="mt-4 text-lg font-medium">Processando documentos...</p>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-4 text-lg font-medium">Dados não disponíveis</p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Aguarde o processamento da análise
                      </p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="documentos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documentos Analisados</CardTitle>
              <CardDescription>
                {analysis.documents.length} documento(s) enviado(s) para análise
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analysis.documents.length > 0 ? (
                <div className="space-y-2">
                  {analysis.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex items-center gap-3">
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
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-[200px] items-center justify-center border-2 border-dashed">
                  <div className="text-center">
                    <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Nenhum documento enviado
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prazos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Prazos Processuais</CardTitle>
              <CardDescription>
                {analysis.deadlines.length} prazo(s) identificado(s) na análise
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analysis.deadlines.length > 0 ? (
                <div className="space-y-3">
                  {analysis.deadlines.map((deadline) => {
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
                            {getPriorityBadge(deadline.priority)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(deadline.dueDate).toLocaleDateString(
                                "pt-BR"
                              )}
                            </span>
                            <span
                              className={
                                daysLeft < 0
                                  ? "text-danger"
                                  : daysLeft <= 5
                                  ? "text-warning"
                                  : ""
                              }
                            >
                              {daysLeft < 0
                                ? `${Math.abs(daysLeft)} dia(s) em atraso`
                                : `${daysLeft} dia(s) restante(s)`}
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Marcar como concluído
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex h-[200px] items-center justify-center border-2 border-dashed">
                  <div className="text-center">
                    <Clock className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Nenhum prazo identificado
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="eventos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Eventos</CardTitle>
              <CardDescription>
                Linha do tempo de todas as ações realizadas nesta análise
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analysis.events.length > 0 ? (
                <div className="relative space-y-4 border-l-2 border-border pl-6">
                  {[...analysis.events].reverse().map((event) => (
                    <div key={event.id} className="relative">
                      <div className="absolute -left-[25px] h-4 w-4 rounded-full border-2 border-background bg-primary" />
                      <div className="space-y-1">
                        <p className="font-medium">{event.event.replace(/_/g, " ")}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.createdAt).toLocaleString("pt-BR")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-[200px] items-center justify-center border-2 border-dashed">
                  <div className="text-center">
                    <Clock className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Nenhum evento registrado
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
