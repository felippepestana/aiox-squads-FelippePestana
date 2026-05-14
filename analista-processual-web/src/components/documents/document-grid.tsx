'use client';

import { DocumentCard } from './document-card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface Document {
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
}

interface DocumentGridProps {
  documents: Document[];
  loading?: boolean;
  selectedIds?: string[];
  onSelect?: (id: string) => void;
  onPreview?: (document: Document) => void;
  onDelete?: (document: Document) => void;
  onMove?: (document: Document) => void;
  showAnalysisInfo?: boolean;
  mode?: 'grid' | 'list';
  total?: number;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
}

export function DocumentGrid({
  documents,
  loading = false,
  selectedIds = [],
  onSelect,
  onPreview,
  onDelete,
  onMove,
  showAnalysisInfo = true,
  mode = 'grid',
  total = 0,
  page = 1,
  pageSize = 20,
  onPageChange,
}: DocumentGridProps) {
  if (loading && documents.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
          <p className="text-sm text-muted-foreground">Carregando documentos...</p>
        </div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-base font-medium">Nenhum documento encontrado</p>
          <p className="text-sm text-muted-foreground mt-1">
            Tente ajustar seus filtros ou fazer upload de novos documentos
          </p>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-4">
      {/* Documents Grid/List */}
      {mode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {documents.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              isSelected={selectedIds.includes(doc.id)}
              onClick={() => onSelect?.(doc.id)}
              onPreview={() => onPreview?.(doc)}
              onDelete={() => onDelete?.(doc)}
              onMove={() => onMove?.(doc)}
              showAnalysisInfo={showAnalysisInfo}
              mode="grid"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              isSelected={selectedIds.includes(doc.id)}
              onClick={() => onSelect?.(doc.id)}
              onPreview={() => onPreview?.(doc)}
              onDelete={() => onDelete?.(doc)}
              onMove={() => onMove?.(doc)}
              showAnalysisInfo={showAnalysisInfo}
              mode="list"
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="text-sm text-muted-foreground">
            Página <span className="font-medium">{page}</span> de{' '}
            <span className="font-medium">{totalPages}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(page + 1)}
            disabled={page === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Summary */}
      {total > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          Mostrando {(page - 1) * pageSize + 1} a{' '}
          {Math.min(page * pageSize, total)} de {total} documentos
        </p>
      )}
    </div>
  );
}
