"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ShieldCheck, ShieldAlert, Loader2 } from "lucide-react";

interface QualityGate {
  id: string;
  name: string;
  passed: boolean;
  blocking: boolean;
  detail: string;
}

interface HarmonizeResponse {
  useCase: { id: string; name: string; confidence: number; method: string; rationale: string };
  deliverableType: string;
  reply: string;
  summary: string;
  qualityGates: QualityGate[];
  disclaimer: string;
}

export default function AssistentePage() {
  const [demand, setDemand] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<HarmonizeResponse | null>(null);

  async function handleSubmit() {
    if (!demand.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: demand }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Falha ao processar a demanda.");
      }
      setResult(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="space-y-1">
        <h1 className="flex items-center gap-2 text-2xl font-semibold text-foreground">
          <Sparkles className="h-6 w-6 text-brand-gold" />
          Assistente Legal Performance
        </h1>
        <p className="text-sm text-muted-foreground">
          Descreva sua demanda jurídica. O sistema classifica o caso e executa o
          fluxo de agentes adequado (análise, estratégia, recurso, pesquisa ou perícia).
        </p>
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <textarea
            value={demand}
            onChange={(e) => setDemand(e.target.value)}
            rows={5}
            placeholder="Ex.: Preciso analisar a viabilidade de recurso especial contra acórdão que negou indenização por danos morais..."
            className="w-full resize-y rounded-md border border-border bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Resultado requer revisão humana antes de uso externo.
            </span>
            <Button onClick={handleSubmit} disabled={loading || !demand.trim()}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando...
                </>
              ) : (
                "Analisar demanda"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-danger/50">
          <CardContent className="pt-6 text-sm text-danger">{error}</CardContent>
        </Card>
      )}

      {result && (
        <div className="space-y-4 animate-fade-in">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle>{result.useCase.name}</CardTitle>
                <Badge variant="secondary">{result.useCase.id}</Badge>
                <Badge variant="outline">
                  {(result.useCase.confidence * 100).toFixed(0)}% · {result.useCase.method}
                </Badge>
                <Badge variant="info">{result.deliverableType}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">{result.useCase.rationale}</p>
              <p className="text-sm font-medium text-foreground">{result.summary}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quality Gates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {result.qualityGates.map((g) => (
                <div key={g.id} className="flex items-start gap-2 text-sm">
                  {g.passed ? (
                    <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                  ) : (
                    <ShieldAlert className="mt-0.5 h-4 w-4 flex-shrink-0 text-danger" />
                  )}
                  <span>
                    <span className="font-medium">{g.id} — {g.name}</span>
                    {g.blocking && (
                      <Badge variant="outline" className="ml-2">bloqueante</Badge>
                    )}
                    <span className="block text-muted-foreground">{g.detail}</span>
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Entregável</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="max-h-[600px] overflow-auto whitespace-pre-wrap rounded-md bg-muted p-4 font-mono text-xs text-foreground">
                {result.reply}
              </pre>
            </CardContent>
          </Card>

          <p className="text-xs italic text-muted-foreground">{result.disclaimer}</p>
        </div>
      )}
    </div>
  );
}
