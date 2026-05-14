'use client';

import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Loader2, X } from 'lucide-react';
import { formatFileSize } from '@/lib/utils';

interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

interface DocumentUploadProgressProps {
  files: UploadedFile[];
  onRemove?: (fileId: string) => void;
  onRetry?: (fileId: string) => void;
}

export function DocumentUploadProgress({
  files,
  onRemove,
  onRetry,
}: DocumentUploadProgressProps) {
  if (files.length === 0) return null;

  const totalFiles = files.length;
  const completedFiles = files.filter((f) => f.status === 'completed').length;
  const errorFiles = files.filter((f) => f.status === 'error').length;

  return (
    <div className="space-y-3">
      {/* Summary */}
      <div className="text-sm text-muted-foreground">
        {completedFiles} de {totalFiles} arquivos
        {errorFiles > 0 && <span className="text-danger ml-2">({errorFiles} erro)</span>}
      </div>

      {/* File Items */}
      <div className="space-y-2">
        {files.map((file) => (
          <div key={file.id} className="flex items-center gap-3 p-2 border border-border rounded-lg">
            <div className="flex-shrink-0">
              {file.status === 'completed' && (
                <CheckCircle className="w-4 h-4 text-success" />
              )}
              {file.status === 'error' && (
                <AlertCircle className="w-4 h-4 text-danger" />
              )}
              {(file.status === 'uploading' || file.status === 'pending') && (
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline gap-2">
                <p className="text-sm font-medium truncate">{file.file.name}</p>
                <span className="text-xs text-muted-foreground flex-shrink-0">
                  {formatFileSize(file.file.size)}
                </span>
              </div>

              {file.status === 'uploading' && (
                <div className="flex items-center gap-2 mt-1">
                  <Progress value={file.progress} className="flex-1" />
                  <span className="text-xs text-muted-foreground w-8 text-right">
                    {file.progress}%
                  </span>
                </div>
              )}

              {file.status === 'error' && file.error && (
                <p className="text-xs text-danger mt-1">{file.error}</p>
              )}
            </div>

            <div className="flex-shrink-0 flex gap-1">
              {file.status === 'error' && onRetry && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onRetry(file.id)}
                  className="h-6 px-2 text-xs"
                >
                  Retry
                </Button>
              )}
              {onRemove && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onRemove(file.id)}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
