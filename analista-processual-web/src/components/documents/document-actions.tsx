'use client';

import { Eye, Download, Trash2, ArrowRight } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface DocumentActionsProps {
  documentId: string;
  onPreview?: () => void;
  onDownload?: () => void;
  onMove?: () => void;
  onDelete?: () => void;
  size?: 'default' | 'sm' | 'lg';
}

export function DocumentActions({
  onPreview,
  onDownload,
  onMove,
  onDelete,
  size = 'default',
}: DocumentActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={size}>
          ⋮
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {onPreview && (
          <DropdownMenuItem onClick={onPreview}>
            <Eye className="w-4 h-4 mr-2" />
            Visualizar
          </DropdownMenuItem>
        )}
        {onDownload && (
          <DropdownMenuItem onClick={onDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </DropdownMenuItem>
        )}
        {onMove && (
          <DropdownMenuItem onClick={onMove}>
            <ArrowRight className="w-4 h-4 mr-2" />
            Mover para...
          </DropdownMenuItem>
        )}
        {onDelete && (
          <>
            <DropdownMenuSeparator />
          </>
        )}
        {onDelete && (
          <DropdownMenuItem onClick={onDelete} className="text-danger">
            <Trash2 className="w-4 h-4 mr-2" />
            Deletar
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
