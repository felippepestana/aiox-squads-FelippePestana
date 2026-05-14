'use client';

import { useState } from 'react';
import { FileIcon, FilePdf, FileText, Image, Eye, Download, Trash2, ArrowRight, MoreVertical } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatFileSize } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DocumentCardProps {
  document: {
    id: string;
    filename: string;
    fileType?: string;
    fileSize?: number;
    storagePath?: string;
    createdAt: Date;
    analysis?: {
      id: string;
      processNumber?: string;
    };
    metadata?: Record<string, any>;
  };
  isSelected?: boolean;
  onClick?: () => void;
  onPreview?: () => void;
  onDelete?: () => void;
  onMove?: () => void;
  showAnalysisInfo?: boolean;
  mode?: 'grid' | 'list';
}

export function DocumentCard({
  document,
  isSelected,
  onClick,
  onPreview,
  onDelete,
  onMove,
  showAnalysisInfo = true,
  mode = 'grid',
}: DocumentCardProps) {
  const [isHovering, setIsHovering] = useState(false);

  const getFileIcon = () => {
    const type = document.fileType?.toLowerCase() || '';
    if (type.includes('pdf')) return <FilePdf className="w-8 h-8 text-red-500" />;
    if (type.includes('text') || type === '.txt') return <FileText className="w-8 h-8 text-blue-500" />;
    if (type.includes('image')) return <Image className="w-8 h-8 text-green-500" />;
    return <FileIcon className="w-8 h-8 text-gray-500" />;
  };

  const getStatusColor = () => {
    const metadata = document.metadata as Record<string, any> | undefined;
    const status = metadata?.status || 'pending';
    if (status === 'completed') return 'bg-green-100 text-green-800';
    if (status === 'processing') return 'bg-amber-100 text-amber-800';
    if (status === 'error') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (mode === 'list') {
    return (
      <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-border transition">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onClick}
          className="w-4 h-4 rounded border-border"
        />
        <div className="flex-shrink-0">{getFileIcon()}</div>
        <div className="flex-grow min-w-0">
          <p className="font-medium truncate text-sm">{document.filename}</p>
          {showAnalysisInfo && document.analysis?.processNumber && (
            <p className="text-xs text-muted-foreground">Análise: {document.analysis.processNumber}</p>
          )}
        </div>
        <div className="text-xs text-muted-foreground whitespace-nowrap">
          {document.fileSize && <span>{formatFileSize(document.fileSize)}</span>}
        </div>
        <div className="text-xs text-muted-foreground whitespace-nowrap">
          {formatDistanceToNow(new Date(document.createdAt), { locale: ptBR, addSuffix: true })}
        </div>
        <div className="flex-shrink-0">
          <Badge variant="secondary" className={getStatusColor()}>
            {(document.metadata as Record<string, any>)?.status || 'pronto'}
          </Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onPreview && (
              <DropdownMenuItem onClick={onPreview}>
                <Eye className="w-4 h-4 mr-2" /> Visualizar
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => handleDownload(document)}>
              <Download className="w-4 h-4 mr-2" /> Download
            </DropdownMenuItem>
            {onMove && (
              <DropdownMenuItem onClick={onMove}>
                <ArrowRight className="w-4 h-4 mr-2" /> Mover
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem onClick={onDelete} className="text-danger">
                <Trash2 className="w-4 h-4 mr-2" /> Deletar
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // Grid mode
  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-lg ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
          <div className="flex justify-center items-center w-10 h-10 bg-gray-100 rounded">
            {getFileIcon()}
          </div>
          {isHovering && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onPreview && (
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onPreview();
                  }}>
                    <Eye className="w-4 h-4 mr-2" /> Visualizar
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(document);
                }}>
                  <Download className="w-4 h-4 mr-2" /> Download
                </DropdownMenuItem>
                {onMove && (
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onMove();
                  }}>
                    <ArrowRight className="w-4 h-4 mr-2" /> Mover
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }} className="text-danger">
                    <Trash2 className="w-4 h-4 mr-2" /> Deletar
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <h3 className="font-medium text-sm mb-2 truncate">{document.filename}</h3>

        {showAnalysisInfo && document.analysis?.processNumber && (
          <p className="text-xs text-muted-foreground mb-2">#{document.analysis.processNumber}</p>
        )}

        <div className="flex gap-2 mb-2 flex-wrap">
          {document.fileSize && (
            <Badge variant="outline" className="text-xs">
              {formatFileSize(document.fileSize)}
            </Badge>
          )}
        </div>

        <div className="mt-auto pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(document.createdAt), { locale: ptBR, addSuffix: true })}
          </p>
        </div>
      </div>
    </Card>
  );
}

async function handleDownload(document: { id: string; filename: string; storagePath?: string }) {
  try {
    if (document.storagePath) {
      const link = document.createElement('a');
      link.href = document.storagePath;
      link.download = document.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Fallback: fetch from API if storagePath not available
      const response = await fetch(`/api/documents/${document.id}/download`);
      if (!response.ok) throw new Error('Download falhou');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = document.filename;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error('Erro ao fazer download:', error);
  }
}
