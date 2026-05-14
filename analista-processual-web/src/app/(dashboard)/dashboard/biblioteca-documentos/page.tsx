'use client';

import { useState, useEffect } from 'react';
import { Grid, List, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  DocumentSearchBar,
  DocumentFilters,
  DocumentGrid,
  DocumentPreviewModal,
  DocumentMoveDialog,
  DocumentUploadArea,
  DocumentBreadcrumb,
} from '@/components/documents';

export default function BibliotecaDocumentosPage() {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [documents, setDocuments] = useState<any[]>([]);
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<any>({});

  const [previewDocument, setPreviewDocument] = useState<any>(null);
  const [moveDocument, setMoveDocument] = useState<any>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const pageSize = 20;

  // Load analyses
  useEffect(() => {
    const loadAnalyses = async () => {
      try {
        const response = await fetch('/api/analyses');
        if (response.ok) {
          const data = await response.json();
          setAnalyses(data);
        }
      } catch (error) {
        console.error('Failed to load analyses:', error);
      }
    };

    loadAnalyses();
  }, []);

  // Load documents
  useEffect(() => {
    const loadDocuments = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          search: searchQuery,
          page: page.toString(),
          limit: pageSize.toString(),
          ...filters,
        });

        const response = await fetch(`/api/documents?${params}`);
        if (response.ok) {
          const data = await response.json();
          setDocuments(data.documents || []);
          setTotal(data.total || 0);
        }
      } catch (error) {
        toast({
          title: 'Erro',
          description: 'Falha ao carregar documentos',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, [searchQuery, page, filters, toast]);

  const handleUpload = async (files: File[]) => {
    // Implementar upload para backend
    console.log('Upload files:', files);
    setIsUploadOpen(false);
  };

  const handleDelete = async (document: any) => {
    if (!confirm(`Deletar "${document.filename}"?`)) return;

    try {
      const response = await fetch(`/api/documents/${document.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Sucesso',
          description: 'Documento deletado',
        });
        setDocuments(documents.filter((d) => d.id !== document.id));
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao deletar documento',
        variant: 'destructive',
      });
    }
  };

  const handleMove = async (targetAnalysisId: string) => {
    if (!moveDocument) return;

    try {
      const response = await fetch(`/api/documents/${moveDocument.id}/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetAnalysisId }),
      });

      if (response.ok) {
        toast({
          title: 'Sucesso',
          description: 'Documento movido',
        });
        setDocuments(documents.filter((d) => d.id !== moveDocument.id));
        setMoveDocument(null);
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao mover documento',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-1">Biblioteca de Documentos</h1>
        <p className="text-muted-foreground">
          Explore e gerencie todos os seus documentos
        </p>
      </div>

      {/* Breadcrumb */}
      <DocumentBreadcrumb
        items={[
          { label: 'Dashboard', onClick: () => {} },
          { label: 'Biblioteca de Documentos', active: true },
        ]}
      />

      {/* Upload Area */}
      {isUploadOpen && (
        <Card className="p-4">
          <DocumentUploadArea
            onFilesSelected={handleUpload}
            isUploading={loading}
          />
        </Card>
      )}

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <DocumentFilters
            onFiltersChange={setFilters}
            analyses={analyses}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <DocumentSearchBar onSearch={setSearchQuery} />

            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                onClick={() => setIsUploadOpen(!isUploadOpen)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Upload
              </Button>
            </div>
          </div>

          {/* Documents Grid */}
          <DocumentGrid
            documents={documents}
            loading={loading}
            selectedIds={selectedIds}
            onSelect={(id) => {
              setSelectedIds(
                selectedIds.includes(id)
                  ? selectedIds.filter((sid) => sid !== id)
                  : [...selectedIds, id]
              );
            }}
            onPreview={setPreviewDocument}
            onDelete={handleDelete}
            onMove={setMoveDocument}
            mode={viewMode}
            showAnalysisInfo={true}
            total={total}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
          />
        </div>
      </div>

      {/* Modals */}
      <DocumentPreviewModal
        isOpen={!!previewDocument}
        onClose={() => setPreviewDocument(null)}
        document={previewDocument}
        onDelete={() => {
          handleDelete(previewDocument);
          setPreviewDocument(null);
        }}
        onMove={() => setMoveDocument(previewDocument)}
      />

      <DocumentMoveDialog
        isOpen={!!moveDocument}
        onClose={() => setMoveDocument(null)}
        document={moveDocument}
        analyses={analyses}
        onConfirm={handleMove}
      />
    </div>
  );
}
