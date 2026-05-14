"use client";

import { useState } from "react";
import { Plus, Grid, List, Search, Trash2, Download, Eye, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DocumentUploadArea,
  DocumentCard,
  DocumentGrid,
  DocumentPreviewModal,
  DocumentMoveDialog,
} from "@/components/documents";

interface Document {
  id: string;
  filename: string;
  fileType: string | null;
  size?: number;
  createdAt?: string;
  status?: "processed" | "processing" | "error";
}

interface DocumentsPanelProps {
  analysisId: string;
  documents: Document[];
  onUpload?: (files: File[]) => Promise<void>;
  onDelete?: (docId: string) => Promise<void>;
  onMove?: (docId: string, toAnalysisId: string) => Promise<void>;
  isLoading?: boolean;
  isReadOnly?: boolean;
}

export function DocumentsPanel({
  analysisId,
  documents,
  onUpload,
  onDelete,
  onMove,
  isLoading = false,
  isReadOnly = false,
}: DocumentsPanelProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const filteredDocs = documents.filter((doc) =>
    doc.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedDoc = documents.find((d) => d.id === selectedDocId);

  const handleUpload = async (files: File[]) => {
    setIsUploading(true);
    try {
      if (onUpload) {
        await onUpload(files);
      }
      setShowUpload(false);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (docId: string) => {
    if (confirm("Tem certeza que deseja deletar este documento?")) {
      if (onDelete) {
        await onDelete(docId);
        if (selectedDocId === docId) {
          setSelectedDocId(null);
        }
      }
    }
  };

  const handleMove = async (toAnalysisId: string) => {
    if (selectedDocId && onMove) {
      await onMove(selectedDocId, toAnalysisId);
      setShowMoveDialog(false);
      setSelectedDocId(null);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "N/A";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      {/* Upload Section */}
      {!isReadOnly && !showUpload && (
        <div className="flex gap-2">
          <Button
            onClick={() => setShowUpload(true)}
            size="sm"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Upload Documento
          </Button>
        </div>
      )}

      {showUpload && !isReadOnly && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="pt-6">
            <DocumentUploadArea
              onFilesSelected={handleUpload}
              isLoading={isUploading}
              maxSize={10 * 1024 * 1024}
            />
            <div className="mt-3 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowUpload(false)}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and View Toggle */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar documentos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant={viewMode === "grid" ? "default" : "outline"}
          size="icon"
          onClick={() => setViewMode("grid")}
        >
          <Grid className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "outline"}
          size="icon"
          onClick={() => setViewMode("list")}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>

      {/* Documents Display */}
      {isLoading ? (
        <Card>
          <CardContent className="flex h-[200px] items-center justify-center">
            <p className="text-muted-foreground">Carregando documentos...</p>
          </CardContent>
        </Card>
      ) : filteredDocs.length === 0 ? (
        <Card>
          <CardContent className="flex h-[200px] items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">
                {documents.length === 0
                  ? "Nenhum documento enviado"
                  : "Nenhum documento encontrado"}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {viewMode === "grid" ? (
            <DocumentGrid
              documents={filteredDocs as any}
              selectedIds={selectedDocId ? [selectedDocId] : []}
              onSelect={(docId) => setSelectedDocId(docId)}
              onPreview={(docId) => {
                setSelectedDocId(docId);
                setShowPreview(true);
              }}
              onDelete={handleDelete}
              onMove={() => setShowMoveDialog(true)}
            />
          ) : (
            <div className="space-y-2">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`flex items-center justify-between rounded-lg border p-3 cursor-pointer transition-colors ${
                    selectedDocId === doc.id
                      ? "bg-primary/10 border-primary"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{doc.filename}</p>
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      <span>{doc.fileType || "Desconhecido"}</span>
                      {doc.size && <span>{formatFileSize(doc.size)}</span>}
                      {doc.status && (
                        <Badge
                          variant={
                            doc.status === "processed"
                              ? "secondary"
                              : doc.status === "processing"
                              ? "outline"
                              : "destructive"
                          }
                          className="text-xs"
                        >
                          {doc.status === "processed"
                            ? "✓ Processado"
                            : doc.status === "processing"
                            ? "⏳ Processando"
                            : "✗ Erro"}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="ml-4 flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDocId(doc.id);
                        setShowPreview(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {!isReadOnly && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDocId(doc.id);
                            setShowMoveDialog(true);
                          }}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-danger hover:text-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(doc.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Info Sidebar */}
      {selectedDoc && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-base">Informações do Documento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground">Nome</p>
              <p className="font-medium">{selectedDoc.filename}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Tipo</p>
              <p className="font-medium">{selectedDoc.fileType || "Desconhecido"}</p>
            </div>
            {selectedDoc.size && (
              <div>
                <p className="text-muted-foreground">Tamanho</p>
                <p className="font-medium">{formatFileSize(selectedDoc.size)}</p>
              </div>
            )}
            {selectedDoc.createdAt && (
              <div>
                <p className="text-muted-foreground">Enviado em</p>
                <p className="font-medium">
                  {new Date(selectedDoc.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
            )}
            {selectedDoc.status && (
              <div>
                <p className="text-muted-foreground">Status</p>
                <Badge
                  variant={
                    selectedDoc.status === "processed"
                      ? "secondary"
                      : selectedDoc.status === "processing"
                      ? "outline"
                      : "destructive"
                  }
                >
                  {selectedDoc.status === "processed"
                    ? "✓ Processado"
                    : selectedDoc.status === "processing"
                    ? "⏳ Processando"
                    : "✗ Erro"}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Preview Modal */}
      {selectedDoc && showPreview && (
        <DocumentPreviewModal
          document={selectedDoc as any}
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          onDelete={() => {
            handleDelete(selectedDoc.id);
            setShowPreview(false);
          }}
          onMove={() => {
            setShowPreview(false);
            setShowMoveDialog(true);
          }}
        />
      )}

      {/* Move Dialog */}
      {selectedDoc && showMoveDialog && (
        <DocumentMoveDialog
          isOpen={showMoveDialog}
          onClose={() => setShowMoveDialog(false)}
          onMove={handleMove}
          currentAnalysisId={analysisId}
        />
      )}
    </div>
  );
}
