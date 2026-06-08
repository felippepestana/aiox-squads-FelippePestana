"use client";

import * as React from "react";
import { Upload, FileText, X } from "lucide-react";

import { cn } from "../../lib/cn";
import { Button } from "../ui/button";

export interface DropzoneFile {
  id: string;
  name: string;
  size: number;
}

interface FileDropzoneProps {
  files: DropzoneFile[];
  onFilesAdded: (files: File[]) => void;
  onFileRemoved: (id: string) => void;
  accept?: string;
  multiple?: boolean;
  hint?: string;
  className?: string;
}

function formatSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function FileDropzone({
  files,
  onFilesAdded,
  onFileRemoved,
  accept = ".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.tiff",
  multiple = true,
  hint = "PDF, DOCX, TXT, imagens — até 10MB",
  className,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    onFilesAdded(Array.from(e.dataTransfer.files));
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={handleDrop}
        className={cn(
          "relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
        )}
      >
        <input
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={(e) => {
            if (e.target.files) onFilesAdded(Array.from(e.target.files));
            e.target.value = "";
          }}
          className="absolute inset-0 z-10 cursor-pointer opacity-0"
        />
        <Upload
          className={cn(
            "h-10 w-10",
            isDragging ? "text-primary" : "text-muted-foreground"
          )}
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
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
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
                    {formatSize(file.size)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onFileRemoved(file.id)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
