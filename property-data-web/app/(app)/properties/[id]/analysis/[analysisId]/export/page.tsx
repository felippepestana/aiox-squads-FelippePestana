"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileDown, FileText } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ExportRecord {
  id: string;
  mode: string;
  format: string;
  url: string;
  content?: string;
  createdAt: string;
}

const modes = [
  { value: "RELATORIO", label: "Relatorio" },
  { value: "LAUDO_ABNT", label: "Laudo ABNT" },
];

const formats = [
  { value: "pdf", label: "PDF" },
  { value: "png", label: "PNG" },
  { value: "md", label: "Markdown" },
];

function downloadMarkdown(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ExportPage() {
  const params = useParams<{ id: string; analysisId: string }>();
  const [exports, setExports] = useState<ExportRecord[]>([]);
  const [selectedMode, setSelectedMode] = useState("RELATORIO");
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  const [exporting, setExporting] = useState(false);
  const [lastMarkdown, setLastMarkdown] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/analyses/${params.analysisId}/exports`)
      .then((res) => res.json())
      .then(setExports)
      .catch(() => setExports([]));
  }, [params.analysisId]);

  async function handleExport() {
    setExporting(true);
    setLastMarkdown(null);

    try {
      const res = await fetch(`/api/exports/${params.analysisId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: selectedMode, format: selectedFormat }),
      });
      if (!res.ok) throw new Error("Erro ao gerar exportacao");
      const data: ExportRecord = await res.json();
      setExports((prev) => [data, ...prev]);
      toast.success("Exportacao gerada com sucesso!");

      // If markdown, store the content for immediate download
      if (selectedFormat === "md" && data.content) {
        setLastMarkdown(data.content);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro inesperado");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon">
          <Link
            href={`/properties/${params.id}/analysis/${params.analysisId}`}
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Exportar Relatorio</h1>
      </div>

      {/* Export wizard */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Nova Exportacao</CardTitle>
          <CardDescription>Escolha o modo e formato do relatorio</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Modo</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
              >
                {modes.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Formato</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedFormat}
                onChange={(e) => {
                  setSelectedFormat(e.target.value);
                  setLastMarkdown(null);
                }}
              >
                {formats.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleExport} disabled={exporting}>
              <FileDown className="mr-2 h-4 w-4" />
              {exporting ? "Gerando..." : "Gerar Relatorio"}
            </Button>
            {lastMarkdown && (
              <Button
                variant="outline"
                onClick={() =>
                  downloadMarkdown(
                    lastMarkdown,
                    `relatorio-${params.analysisId}.md`
                  )
                }
              >
                <FileText className="mr-2 h-4 w-4" />
                Baixar Markdown
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Export history */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Historico de Exportacoes</CardTitle>
        </CardHeader>
        <CardContent>
          {exports.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma exportacao realizada.
            </p>
          ) : (
            <ul className="space-y-2">
              {exports.map((ex) => (
                <li
                  key={ex.id}
                  className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{ex.mode}</Badge>
                    <Badge variant="outline">{ex.format}</Badge>
                    <span className="text-muted-foreground">
                      {new Date(ex.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {ex.format === "md" && ex.content && (
                      <button
                        type="button"
                        onClick={() =>
                          downloadMarkdown(
                            ex.content!,
                            `relatorio-${ex.id}.md`
                          )
                        }
                        className="text-primary hover:underline"
                      >
                        Baixar .md
                      </button>
                    )}
                    {ex.url && (
                      <a
                        href={ex.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Download
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
