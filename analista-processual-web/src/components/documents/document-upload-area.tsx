'use client';

import { useState, useCallback } from 'react';
import { Upload, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DocumentUploadAreaProps {
  onFilesSelected: (files: File[]) => void;
  maxSize?: number;
  accept?: string;
  disabled?: boolean;
  isUploading?: boolean;
}

const ACCEPTED_TYPES = {
  'application/pdf': ['.pdf'],
  'text/plain': ['.txt'],
  'text/markdown': ['.md'],
  'application/json': ['.json'],
  'text/csv': ['.csv'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
};

export function DocumentUploadArea({
  onFilesSelected,
  maxSize = 10 * 1024 * 1024,
  accept,
  disabled = false,
  isUploading = false,
}: DocumentUploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const droppedFiles = Array.from(e.dataTransfer.files);
      const validFiles = droppedFiles.filter((file) => file.size <= maxSize);

      if (validFiles.length !== droppedFiles.length) {
        console.warn('Alguns arquivos excedem o tamanho máximo');
      }

      onFilesSelected(validFiles);
    },
    [maxSize, onFilesSelected]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const selectedFiles = Array.from(e.target.files);
        onFilesSelected(selectedFiles);
      }
    },
    [onFilesSelected]
  );

  const acceptTypes = accept || Object.keys(ACCEPTED_TYPES).join(',');

  return (
    <Card
      className={cn(
        'border-2 border-dashed transition-colors cursor-pointer',
        isDragging ? 'border-primary bg-blue-50' : 'border-border',
        disabled || isUploading ? 'opacity-50 cursor-not-allowed' : ''
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <label className="block p-8 text-center cursor-pointer">
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 bg-gray-100 rounded-lg">
            <Upload
              className={cn(
                'w-6 h-6',
                isDragging ? 'text-primary' : 'text-muted-foreground'
              )}
            />
          </div>
          <div>
            <p className="font-semibold text-sm">
              {isUploading
                ? 'Enviando documentos...'
                : isDragging
                  ? 'Solte os arquivos aqui'
                  : 'Arraste documentos aqui'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              ou{' '}
              <span className="text-primary font-medium">clique para selecionar</span>
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Máximo {Math.round(maxSize / (1024 * 1024))} MB por arquivo
          </p>
        </div>
        <input
          type="file"
          multiple
          onChange={handleFileInput}
          accept={acceptTypes}
          disabled={disabled || isUploading}
          className="hidden"
        />
      </label>
    </Card>
  );
}
