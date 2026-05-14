'use client';

import { useState } from 'react';
import { X, Download, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatFileSize } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document?: {
    id: string;
    filename: string;
    fileType?: string;
    fileSize?: number;
    createdAt: Date;
    analysis?: {
      id: string;
      processNumber?: string;
    };
    metadata?: Record<string, any>;
  };
  onDownload?: (documentId: string) => void;
  onDelete?: () => void;
  onMove?: () => void;
}

export function DocumentPreviewModal({
  isOpen,
  onClose,
  document,
  onDownload,
  onDelete,
  onMove,
}: DocumentPreviewModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!document) return null;

  const isImage = document.fileType?.includes('image');
  const isPdf = document.fileType?.includes('pdf');
  const isText = document.fileType?.includes('text') || document.fileType === '.txt';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold truncate">{document.filename}</h2>
              <div className="flex gap-2 mt-2 flex-wrap text-xs text-muted-foreground">
                {document.fileSize && (
                  <span>{formatFileSize(document.fileSize)}</span>
                )}
                <span>•</span>
                <span>
                  {formatDistanceToNow(new Date(document.createdAt), {
                    locale: ptBR,
                    addSuffix: true,
                  })}
                </span>
                {document.analysis?.processNumber && (
                  <>
                    <span>•</span>
                    <span>Análise: #{document.analysis.processNumber}</span>
                  </>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Preview Content */}
        <div className="mt-4 border border-border rounded-lg p-4 bg-muted min-h-64 max-h-96 overflow-auto flex items-center justify-center">
          {isLoading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Carregando preview...</p>
            </div>
          ) : isImage ? (
            <img
              src={`data:${document.fileType};base64,${document.metadata?.base64Data || ''}`}
              alt={document.filename}
              className="max-w-full max-h-full"
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
            />
          ) : isPdf ? (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Preview de PDF não está disponível
              </p>
              <Button onClick={() => onDownload?.(document.id)} size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download para visualizar
              </Button>
            </div>
          ) : isText ? (
            <pre className="text-xs overflow-auto max-w-full">
              Conteúdo de texto será exibido aqui...
            </pre>
          ) : (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Tipo de arquivo não suportado para preview
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end mt-4">
          {onDelete && (
            <Button variant="destructive" size="sm" onClick={onDelete}>
              Deletar
            </Button>
          )}
          {onMove && (
            <Button variant="outline" size="sm" onClick={onMove}>
              Mover
            </Button>
          )}
          {onDownload && (
            <Button
              size="sm"
              onClick={() => onDownload(document.id)}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
