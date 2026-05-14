"use client";

import { useState, useCallback } from "react";
import { Upload, FileText, X, Loader2, CheckCircle, AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export interface FileWithProgress extends File {
  id: string;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  error?: string;
}

interface UploadSectionProps {
  onFilesReady: (files: File[]) => void;
  isSubmitting?: boolean;
}

export function UploadSection({ onFilesReady, isSubmitting }: UploadSectionProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<FileWithProgress[]>([]);

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
    const maxSize = 10 * 1024 * 1024; // 10MB
    const validFiles = newFiles.filter((file) => {
      if (file.size > maxSize) {
        console.warn(`${file.name} excede 10MB`);
        return false;
      }
      return true;
    });

    const filesWithProgress = validFiles.map((file) =>
      Object.assign(file, {
        id: Math.random().toString(36).substring(7),
        progress: 0,
        status: "pending" as const,
      })
    );

    setFiles((prev) => [...prev, ...filesWithProgress]);
    onFilesReady([...files.filter((f) => f.status !== "error"), ...validFiles]);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const filtered = prev.filter((f) => f.id !== id);
      onFilesReady(filtered);
      return filtered;
    });
  };

  const retryFile = (id: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, status: "pending" as const, progress: 0, error: undefined } : f
      )
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const completedCount = files.filter((f) => f.status === "completed").length;
  const totalCount = files.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documentos</CardTitle>
        <CardDescription>
          Arraste e solte os arquivos ou clique para selecionar. Formatos aceitos: PDF, DOCX, TXT, imagens.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Drag-drop area */}
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
            disabled={isSubmitting}
          />
          <Upload
            className={`h-10 w-10 ${isDragging ? "text-primary" : "text-muted-foreground"}`}
          />
          <p className="mt-4 text-sm text-muted-foreground">
            {isDragging ? (
              <span className="font-medium text-primary">Solte os arquivos aqui</span>
            ) : (
              <>
                <span className="font-medium text-foreground">Clique para selecionar</span> ou
                arraste e solte
              </>
            )}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">PDF, DOC, DOCX, TXT até 10MB</p>
        </div>

        {/* Files list with progress */}
        {files.length > 0 && (
          <div className="space-y-3">
            {/* Progress summary */}
            {totalCount > 0 && (
              <div className="space-y-2 rounded-lg bg-muted/50 p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">
                    {completedCount} de {totalCount} arquivo(s)
                  </span>
                  <span className="text-muted-foreground">
                    {Math.round((completedCount / totalCount) * 100)}%
                  </span>
                </div>
                <Progress value={(completedCount / totalCount) * 100} className="h-2" />
              </div>
            )}

            {/* File items */}
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between rounded-lg border bg-muted/50 p-3"
                >
                  <div className="flex flex-1 items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      {file.status === "completed" ? (
                        <CheckCircle className="h-5 w-5 text-success" />
                      ) : file.status === "error" ? (
                        <AlertCircle className="h-5 w-5 text-danger" />
                      ) : file.status === "uploading" ? (
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      ) : (
                        <FileText className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{formatFileSize(file.size)}</span>
                        {file.status === "uploading" && (
                          <>
                            <span>•</span>
                            <span>{file.progress}%</span>
                          </>
                        )}
                        {file.status === "error" && file.error && (
                          <>
                            <span>•</span>
                            <span className="text-danger">{file.error}</span>
                          </>
                        )}
                      </div>

                      {/* Progress bar for uploading files */}
                      {file.status === "uploading" && (
                        <Progress value={file.progress} className="mt-2 h-1.5" />
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="ml-4 flex gap-1 flex-shrink-0">
                    {file.status === "error" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => retryFile(file.id)}
                        title="Retry upload"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => removeFile(file.id)}
                      disabled={file.status === "uploading"}
                      title="Remove file"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
