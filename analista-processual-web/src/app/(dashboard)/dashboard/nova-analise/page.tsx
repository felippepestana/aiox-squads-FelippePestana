"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  PageHeader,
  FileDropzone,
  type DropzoneFile,
} from "@aiox/design-system";
import { useToast } from "@/hooks/use-toast";

interface TrackedFile {
  id: string;
  file: File;
}

const courts = [
  "STF - Supremo Tribunal Federal",
  "STJ - Superior Tribunal de Justiça",
  "TRF1 - Tribunal Regional Federal 1ª Região",
  "TRF3 - Tribunal Regional Federal 3ª Região",
  "TJSP - Tribunal de Justiça de São Paulo",
  "TJRJ - Tribunal de Justiça do Rio de Janeiro",
  "TJMG - Tribunal de Justiça de Minas Gerais",
];

const processClasses = [
  "Ação de Cobrança",
  "Ação de Indenização por Danos Morais",
  "Ação de Indenização por Danos Materiais",
  "Ação de Despejo",
  "Ação Declaratória",
  "Ação Monitória",
  "Apelação",
  "Mandado de Segurança",
  "Processo de Conhecimento",
  "Processo de Execução",
  "Recurso Especial",
];

export default function NovaAnalisePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [tracked, setTracked] = useState<TrackedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processInfo, setProcessInfo] = useState({
    processNumber: "",
    court: "",
    processClass: "",
  });

  const dropzoneFiles: DropzoneFile[] = tracked.map((t) => ({
    id: t.id,
    name: t.file.name,
    size: t.file.size,
  }));

  const handleFilesAdded = (files: File[]) => {
    const next = files.map((file) => ({
      id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 7)}`,
      file,
    }));
    setTracked((prev) => [...prev, ...next]);
  };

  const handleFileRemoved = (id: string) => {
    setTracked((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSubmit = async () => {
    if (tracked.length === 0) {
      toast({
        title: "Nenhum arquivo",
        description: "Envie pelo menos um documento para análise.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/analyses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          processNumber: processInfo.processNumber || undefined,
          court: processInfo.court || undefined,
          processClass: processInfo.processClass || undefined,
        }),
      });
      if (!response.ok) throw new Error("Erro ao criar análise");
      const { data: analysis } = await response.json();

      for (const t of tracked) {
        const formData = new FormData();
        formData.append("file", t.file);
        await fetch(`/api/analyses/${analysis.id}/documents`, {
          method: "POST",
          body: formData,
        });
      }

      toast({
        title: "Documentos enviados",
        description: "Acompanhe os agentes trabalhando na análise.",
      });

      // Navigate immediately; the detail page starts the pipeline and shows it live.
      router.push(`/dashboard/analises/${analysis.id}?start=1`);
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível criar a análise. Tente novamente.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        title="Nova Análise"
        description="Envie os documentos do processo para a análise multiagente"
      />

      <Card>
        <CardHeader>
          <CardTitle>Informações do Processo</CardTitle>
          <CardDescription>
            Opcional. Forneça os dados disponíveis para enriquecer a análise.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="processNumber">Número do Processo</Label>
              <Input
                id="processNumber"
                placeholder="0001234-56.2024.8.26.0000"
                value={processInfo.processNumber}
                onChange={(e) =>
                  setProcessInfo((p) => ({ ...p, processNumber: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="court">Tribunal</Label>
              <select
                id="court"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={processInfo.court}
                onChange={(e) =>
                  setProcessInfo((p) => ({ ...p, court: e.target.value }))
                }
              >
                <option value="">Selecione o tribunal...</option>
                {courts.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="processClass">Classe Processual</Label>
            <select
              id="processClass"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={processInfo.processClass}
              onChange={(e) =>
                setProcessInfo((p) => ({ ...p, processClass: e.target.value }))
              }
            >
              <option value="">Selecione a classe...</option>
              {processClasses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documentos</CardTitle>
          <CardDescription>
            Arraste e solte ou clique. Texto, PDF e DOCX têm o conteúdo extraído
            automaticamente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileDropzone
            files={dropzoneFiles}
            onFilesAdded={handleFilesAdded}
            onFileRemoved={handleFileRemoved}
          />
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || tracked.length === 0}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Iniciar Análise
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
