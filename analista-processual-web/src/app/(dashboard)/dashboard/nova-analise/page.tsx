"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Upload, File, X, Loader2, FileText, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface FileWithPreview extends File {
  preview?: string;
  id: string;
}

export default function NovaAnalisePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [processInfo, setProcessInfo] = useState({
    processNumber: "",
    court: "",
    processClass: "",
  });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
    }
  }, []);

  const addFiles = (newFiles: File[]) => {
    const filesWithId = newFiles.map((file) =>
      Object.assign(file, {
        id: Math.random().toString(36).substring(7),
        preview: file.type.startsWith("text/")
          ? undefined
          : URL.createObjectURL(file),
      })
    );
    setFiles((prev) => [...prev, ...filesWithId]);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      toast({
        title: "Nenhum arquivo",
        description: "Por favor, envie pelo menos um documento para análise.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const response = await fetch("/api/analyses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "demo-user",
          processNumber: processInfo.processNumber || undefined,
          court: processInfo.court || undefined,
          processClass: processInfo.processClass || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar análise");
      }

      const { data: analysis } = await response.json();

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        await fetch(`/api/analyses/${analysis.id}/documents`, {
          method: "POST",
          body: formData,
        });
      }

      toast({
        title: "Análise criada!",
        description: "Seus documentos estão sendo processados.",
      });

      router.push(`/dashboard/analises/${analysis.id}`);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar a análise. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const courts = [
    "Selecione o tribunal...",
    "STF - Supremo Tribunal Federal",
    "STJ - Superior Tribunal de Justiça",
    "TRF1 - Tribunal Regional Federal 1ª Região",
    "TRF2 - Tribunal Regional Federal 2ª Região",
    "TRF3 - Tribunal Regional Federal 3ª Região",
    "TJSP - Tribunal de Justiça de São Paulo",
    "TJRJ - Tribunal de Justiça do Rio de Janeiro",
    "TJMG - Tribunal de Justiça de Minas Gerais",
    "TJBA - Tribunal de Justiça da Bahia",
  ];

  const processClasses = [
    "Selecione a classe...",
    "Ação Penal - Crimes Comuns",
    "Ação Penal - Crimes contra a Administração Pública",
    "Ação de Cobrança",
    "Ação de Despejo",
    "Ação de Indenização por Danos Morais",
    "Ação de Indenização por Danos Materiais",
    "Ação Declaratória",
    "Ação Penal Privada",
    "Ação Popular",
    "Ação Rescisória",
    "Alienação Fiduciária",
    "Apelação",
    "Ação Civil Pública",
    "Ação Trabalhista",
    "Ação Tributária",
    "Assistência Judiciária",
    "Atos Unilaterais",
    "Ação Monitória",
    "Mandado de Segurança",
    "Medida Cautelar",
    "Processo de Conhecimento",
    "Processo de Execução",
    "Recurso Especial",
    "Recurso Extraordinário",
    "Tutela Antecipada",
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Nova Análise</h1>
        <p className="text-muted-foreground">
          Envie os documentos do processo para análise inteligente
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Processo</CardTitle>
          <CardDescription>
            Opcional. Forneça os dados disponíveis para enriquecimento da análise.
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
                  setProcessInfo((prev) => ({
                    ...prev,
                    processNumber: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="court">Tribunal</Label>
              <select
                id="court"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={processInfo.court}
                onChange={(e) =>
                  setProcessInfo((prev) => ({ ...prev, court: e.target.value }))
                }
              >
                {courts.map((court) => (
                  <option key={court} value={court.includes("Selecione") ? "" : court}>
                    {court}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="processClass">Classe Processual</Label>
            <select
              id="processClass"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={processInfo.processClass}
              onChange={(e) =>
                setProcessInfo((prev) => ({
                  ...prev,
                  processClass: e.target.value,
                }))
              }
            >
              {processClasses.map((clazz) => (
                <option
                  key={clazz}
                  value={clazz.includes("Selecione") ? "" : clazz}
                >
                  {clazz}
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
            Arraste e solte os arquivos ou clique para selecionar. Formatos aceitos:
            PDF, DOCX, TXT, imagens.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
            }`}
          >
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.tiff"
              onChange={handleFileSelect}
              className="absolute inset-0 z-10 cursor-pointer opacity-0"
            />
            <Upload
              className={`h-10 w-10 ${
                isDragging ? "text-primary" : "text-muted-foreground"
              }`}
            />
            <p className="mt-4 text-sm text-muted-foreground">
              {isDragging ? (
                <span className="font-medium text-primary">
                  Solte os arquivos aqui
                </span>
              ) : (
                <>
                  <span className="font-medium text-foreground">
                    Clique para selecionar
                  </span>{" "}
                  ou arraste e solte
                </>
              )}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              PDF, DOC, DOCX, TXT até 10MB
            </p>
          </div>

          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between rounded-lg border bg-muted/50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(file.id)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={isUploading || files.length === 0}>
          {isUploading ? (
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
