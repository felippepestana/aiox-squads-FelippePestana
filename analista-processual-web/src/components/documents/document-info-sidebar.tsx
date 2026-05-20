'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatFileSize } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DocumentInfoSidebarProps {
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
    extractedText?: string;
  };
}

export function DocumentInfoSidebar({ document }: DocumentInfoSidebarProps) {
  if (!document) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center">
            Selecione um documento para ver detalhes
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Informações</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filename */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-1">Nome</p>
          <p className="text-sm font-medium break-words">{document.filename}</p>
        </div>

        {/* Type */}
        {document.fileType && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-1">Tipo</p>
            <Badge variant="outline" className="text-xs">
              {document.fileType}
            </Badge>
          </div>
        )}

        {/* Size */}
        {document.fileSize && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-1">Tamanho</p>
            <p className="text-sm">{formatFileSize(document.fileSize)}</p>
          </div>
        )}

        {/* Upload Date */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-1">Data</p>
          <p className="text-sm">
            {new Date(document.createdAt).toLocaleString('pt-BR')}
          </p>
        </div>

        {/* Analysis */}
        {document.analysis?.processNumber && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-1">Análise</p>
            <Badge variant="secondary">#{document.analysis.processNumber}</Badge>
          </div>
        )}

        {/* Status */}
        {(document.metadata as Record<string, any>)?.status && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-1">Status</p>
            <Badge
              variant={
                (document.metadata as Record<string, any>)?.status === 'completed'
                  ? 'default'
                  : 'secondary'
              }
            >
              {(document.metadata as Record<string, any>)?.status}
            </Badge>
          </div>
        )}

        {/* Extracted Text Preview */}
        {document.extractedText && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-1">
              Texto Extraído
            </p>
            <p className="text-xs text-muted-foreground bg-muted p-2 rounded max-h-24 overflow-y-auto">
              {document.extractedText.substring(0, 200)}
              {document.extractedText.length > 200 ? '...' : ''}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
