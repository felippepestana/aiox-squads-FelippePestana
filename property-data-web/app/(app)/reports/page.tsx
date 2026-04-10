"use client";

import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ExportItem {
  id: string;
  analysisId: string;
  propertyAddress: string;
  mode: string;
  format: string;
  url: string;
  createdAt: string;
}

const modeOptions = [
  { value: "all", label: "Todos" },
  { value: "RELATORIO", label: "Relatorio" },
  { value: "LAUDO_ABNT", label: "Laudo ABNT" },
];

const formatOptions = [
  { value: "all", label: "Todos" },
  { value: "pdf", label: "PDF" },
  { value: "png", label: "PNG" },
  { value: "md", label: "Markdown" },
];

export default function ReportsPage() {
  const [exports, setExports] = useState<ExportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modeFilter, setModeFilter] = useState("all");
  const [formatFilter, setFormatFilter] = useState("all");

  useEffect(() => {
    fetch("/api/exports")
      .then((res) => res.json())
      .then(setExports)
      .catch(() => setExports([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = exports.filter((e) => {
    if (modeFilter !== "all" && e.mode !== modeFilter) return false;
    if (formatFilter !== "all" && e.format !== formatFilter) return false;
    return true;
  });

  if (loading) return <p className="text-muted-foreground">Carregando...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Relatorios</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={modeFilter}
          onChange={(e) => setModeFilter(e.target.value)}
        >
          {modeOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={formatFilter}
          onChange={(e) => setFormatFilter(e.target.value)}
        >
          {formatOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <Card className="py-12 text-center">
          <CardContent>
            <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 text-muted-foreground">
              Nenhum relatorio encontrado.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((ex) => (
            <a
              key={ex.id}
              href={ex.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">
                      {ex.propertyAddress}
                    </CardTitle>
                    <Badge variant="outline">{ex.format.toUpperCase()}</Badge>
                  </div>
                  <CardDescription>
                    {ex.mode === "LAUDO_ABNT" ? "Laudo ABNT" : "Relatorio"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {new Date(ex.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
