'use client';

import { useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Analysis {
  id: string;
  processNumber?: string;
}

interface DocumentMoveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  document?: {
    id: string;
    filename: string;
    analysis?: {
      id: string;
      processNumber?: string;
    };
  };
  analyses: Analysis[];
  onConfirm: (targetAnalysisId: string) => Promise<void>;
}

export function DocumentMoveDialog({
  isOpen,
  onClose,
  document,
  analyses,
  onConfirm,
}: DocumentMoveDialogProps) {
  const [selectedAnalysisId, setSelectedAnalysisId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  if (!document) return null;

  const filteredAnalyses = analyses.filter(
    (a) =>
      a.id !== document.analysis?.id &&
      (a.processNumber?.includes(searchTerm) || a.id.includes(searchTerm))
  );

  const handleConfirm = async () => {
    if (!selectedAnalysisId) return;

    setIsLoading(true);
    try {
      await onConfirm(selectedAnalysisId);
      onClose();
      setSelectedAnalysisId('');
      setSearchTerm('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mover Documento</DialogTitle>
          <DialogDescription>
            Mova "{document.filename}" para outra análise
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {document.analysis?.processNumber && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">
                  Documento está atualmente em: <strong>#{document.analysis.processNumber}</strong>
                </p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="search" className="text-xs font-semibold">
              Buscar Análise
            </Label>
            <Input
              id="search"
              placeholder="Buscar por nº processual..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="analysis" className="text-xs font-semibold">
              Selecione a Análise de Destino
            </Label>
            <Select value={selectedAnalysisId} onValueChange={setSelectedAnalysisId} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha uma análise..." />
              </SelectTrigger>
              <SelectContent>
                {filteredAnalyses.length === 0 ? (
                  <div className="p-2 text-center text-sm text-muted-foreground">
                    Nenhuma análise encontrada
                  </div>
                ) : (
                  filteredAnalyses.map((analysis) => (
                    <SelectItem key={analysis.id} value={analysis.id}>
                      {analysis.processNumber ? `#${analysis.processNumber}` : `ID: ${analysis.id.slice(0, 8)}`}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedAnalysisId || isLoading}
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Mover
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
