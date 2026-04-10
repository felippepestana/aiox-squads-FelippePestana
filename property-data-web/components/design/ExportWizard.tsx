"use client";

import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ExportWizardProps {
  analysisId: string;
  onExport: (mode: string, format: string) => void;
  exporting?: boolean;
}

const MODE_OPTIONS = [
  { value: "RELATORIO", label: "Relatório Completo" },
  { value: "LAUDO_ABNT", label: "Laudo ABNT" },
  { value: "CARD", label: "Card Resumo" },
  { value: "SUMMARY", label: "Sumário Executivo" },
] as const;

const FORMAT_OPTIONS = [
  { value: "pdf", label: "PDF" },
  { value: "png", label: "PNG" },
  { value: "md", label: "Markdown" },
] as const;

export default function ExportWizard({
  analysisId,
  onExport,
  exporting = false,
}: ExportWizardProps) {
  const [mode, setMode] = useState("RELATORIO");
  const [format, setFormat] = useState("pdf");

  function handleSubmit() {
    onExport(mode, format);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <FileDown className="h-4 w-4" />
          Exportar Relatório
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`mode-${analysisId}`}>Modo de Exportação</Label>
          <Select value={mode} onValueChange={setMode}>
            <SelectTrigger id={`mode-${analysisId}`}>
              <SelectValue placeholder="Selecione o modo" />
            </SelectTrigger>
            <SelectContent>
              {MODE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`format-${analysisId}`}>Formato</Label>
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger id={`format-${analysisId}`}>
              <SelectValue placeholder="Selecione o formato" />
            </SelectTrigger>
            <SelectContent>
              {FORMAT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={exporting}
        >
          {exporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Gerando...
            </>
          ) : (
            <>
              <FileDown className="mr-2 h-4 w-4" />
              Gerar Relatório
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
