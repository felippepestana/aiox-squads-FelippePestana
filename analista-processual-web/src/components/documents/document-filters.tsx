'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface DocumentFiltersProps {
  onFiltersChange: (filters: {
    types: string[];
    dateFrom?: string;
    dateTo?: string;
    analyses?: string[];
  }) => void;
  analyses?: { id: string; processNumber?: string }[];
}

const FILE_TYPES = ['PDF', 'Word', 'Imagem', 'Texto'];
const FILE_TYPE_EXTENSIONS = {
  'PDF': ['pdf'],
  'Word': ['docx', 'doc'],
  'Imagem': ['png', 'jpg', 'jpeg', 'gif', 'webp'],
  'Texto': ['txt', 'md', 'csv'],
};

export function DocumentFilters({
  onFiltersChange,
  analyses = [],
}: DocumentFiltersProps) {
  const [types, setTypes] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedAnalyses, setSelectedAnalyses] = useState<string[]>([]);

  const handleTypeToggle = (type: string) => {
    const newTypes = types.includes(type)
      ? types.filter((t) => t !== type)
      : [...types, type];
    setTypes(newTypes);
    onFiltersChange({
      types: newTypes,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      analyses: selectedAnalyses.length > 0 ? selectedAnalyses : undefined,
    });
  };

  const handleAnalysisToggle = (id: string) => {
    const newAnalyses = selectedAnalyses.includes(id)
      ? selectedAnalyses.filter((a) => a !== id)
      : [...selectedAnalyses, id];
    setSelectedAnalyses(newAnalyses);
    onFiltersChange({
      types,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      analyses: newAnalyses.length > 0 ? newAnalyses : undefined,
    });
  };

  const handleDateChange = (type: 'from' | 'to', value: string) => {
    if (type === 'from') {
      setDateFrom(value);
    } else {
      setDateTo(value);
    }
    onFiltersChange({
      types,
      dateFrom: type === 'from' ? value || undefined : dateFrom || undefined,
      dateTo: type === 'to' ? value || undefined : dateTo || undefined,
      analyses: selectedAnalyses.length > 0 ? selectedAnalyses : undefined,
    });
  };

  const hasFilters = types.length > 0 || dateFrom || dateTo || selectedAnalyses.length > 0;

  return (
    <Card className="sticky top-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Filtros</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Types */}
        <div>
          <Label className="text-xs font-semibold mb-2 block">Tipo de Arquivo</Label>
          <div className="space-y-2">
            {FILE_TYPES.map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={types.includes(type)}
                  onChange={() => handleTypeToggle(type)}
                  className="w-4 h-4 rounded border-border"
                />
                <span className="text-sm">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div>
          <Label className="text-xs font-semibold mb-2 block">Data</Label>
          <div className="space-y-2">
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => handleDateChange('from', e.target.value)}
              className="text-sm"
            />
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => handleDateChange('to', e.target.value)}
              className="text-sm"
            />
          </div>
        </div>

        {/* Analyses */}
        {analyses.length > 0 && (
          <div>
            <Label className="text-xs font-semibold mb-2 block">Análise</Label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {analyses.map((analysis) => (
                <label key={analysis.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedAnalyses.includes(analysis.id)}
                    onChange={() => handleAnalysisToggle(analysis.id)}
                    className="w-4 h-4 rounded border-border"
                  />
                  <span className="text-sm truncate">#{analysis.processNumber || analysis.id.slice(0, 8)}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Clear Filters */}
        {hasFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setTypes([]);
              setDateFrom('');
              setDateTo('');
              setSelectedAnalyses([]);
              onFiltersChange({
                types: [],
              });
            }}
            className="w-full text-xs"
          >
            <X className="w-3 h-3 mr-1" />
            Limpar Filtros
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
