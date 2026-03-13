import { useCallback, useEffect, useState } from "react";
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  Search,
  Scissors,
  Image,
  Copy,
  ZoomIn,
  ZoomOut,
  X,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { DocumentClip, DocumentMetadata, DocumentPage } from "../types";

interface PDFViewerProps {
  documents: DocumentMetadata[];
  activeDoc: DocumentMetadata | null;
  onSelectDoc: (doc: DocumentMetadata) => void;
  activePage: number;
  onPageChange: (page: number) => void;
  onLoadPage: (docId: string, page: number) => Promise<DocumentPage>;
  onClip: (data: {
    doc_id: string;
    page_start: number;
    page_end?: number;
    clip_type: string;
    label: string;
  }) => void;
  onSearch: (docId: string, query: string) => void;
  searchResults: any[];
  clips: DocumentClip[];
  thumbnails: Record<string, string>;
  onLoadThumbnail: (docId: string, page: number) => void;
}

export default function PDFViewer({
  documents,
  activeDoc,
  onSelectDoc,
  activePage,
  onPageChange,
  onLoadPage,
  onClip,
  onSearch,
  searchResults,
  clips,
  thumbnails,
  onLoadThumbnail,
}: PDFViewerProps) {
  const [pageContent, setPageContent] = useState<DocumentPage | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [clipLabel, setClipLabel] = useState("");
  const [showClipDialog, setShowClipDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedText, setSelectedText] = useState("");

  useEffect(() => {
    if (activeDoc) {
      setLoading(true);
      onLoadPage(activeDoc.doc_id, activePage)
        .then((page) => setPageContent(page))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [activeDoc, activePage, onLoadPage]);

  useEffect(() => {
    if (activeDoc) {
      for (let i = 1; i <= Math.min(activeDoc.total_pages, 10); i++) {
        onLoadThumbnail(activeDoc.doc_id, i);
      }
    }
  }, [activeDoc, onLoadThumbnail]);

  const handleSearch = useCallback(() => {
    if (activeDoc && searchQuery.trim()) {
      onSearch(activeDoc.doc_id, searchQuery);
    }
  }, [activeDoc, searchQuery, onSearch]);

  const handleClipPage = useCallback(() => {
    if (!activeDoc) return;
    onClip({
      doc_id: activeDoc.doc_id,
      page_start: activePage,
      clip_type: "excerpt",
      label: clipLabel || `Trecho fl. ${activePage}`,
    });
    setShowClipDialog(false);
    setClipLabel("");
  }, [activeDoc, activePage, clipLabel, onClip]);

  const handleClipImage = useCallback(() => {
    if (!activeDoc) return;
    onClip({
      doc_id: activeDoc.doc_id,
      page_start: activePage,
      clip_type: "image",
      label: clipLabel || `Imagem fl. ${activePage}`,
    });
    setShowClipDialog(false);
    setClipLabel("");
  }, [activeDoc, activePage, clipLabel, onClip]);

  const handleTextSelect = useCallback(() => {
    const selection = window.getSelection()?.toString();
    if (selection) setSelectedText(selection);
  }, []);

  if (documents.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-gray-600" />
        </div>
        <h3 className="text-sm font-medium text-gray-400 mb-2">
          Nenhum documento carregado
        </h3>
        <p className="text-xs text-gray-600 max-w-[240px]">
          Envie um PDF pelo chat para iniciar a analise. Use o botao de upload ou
          arraste o arquivo.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Document tabs */}
      <div className="border-b border-white/5 px-3 py-2 flex gap-2 overflow-x-auto">
        {documents.map((doc) => (
          <button
            key={doc.doc_id}
            onClick={() => onSelectDoc(doc)}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeDoc?.doc_id === doc.doc_id
                ? "bg-brand-600/20 text-brand-300 border border-brand-500/20"
                : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <FileText className="w-3 h-3" />
              <span className="truncate max-w-[120px]">{doc.filename}</span>
              <span className="badge-gray text-[9px]">{doc.doc_id}</span>
            </span>
          </button>
        ))}
      </div>

      {activeDoc && (
        <>
          {/* Toolbar */}
          <div className="border-b border-white/5 px-3 py-2 flex items-center gap-2">
            {/* Navigation */}
            <button
              onClick={() => onPageChange(Math.max(1, activePage - 1))}
              disabled={activePage <= 1}
              className="p-1.5 rounded hover:bg-white/10 text-gray-400 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-gray-400 min-w-[80px] text-center">
              Fl. <strong className="text-white">{activePage}</strong> /{" "}
              {activeDoc.total_pages}
            </span>
            <button
              onClick={() =>
                onPageChange(Math.min(activeDoc.total_pages, activePage + 1))
              }
              disabled={activePage >= activeDoc.total_pages}
              className="p-1.5 rounded hover:bg-white/10 text-gray-400 disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="w-px h-5 bg-white/10 mx-1" />

            {/* Actions */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`p-1.5 rounded hover:bg-white/10 transition-colors ${
                showSearch ? "text-brand-400" : "text-gray-400"
              }`}
              title="Buscar no documento"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowClipDialog(!showClipDialog)}
              className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-legal-gold transition-colors"
              title="Recortar trecho"
            >
              <Scissors className="w-4 h-4" />
            </button>
            <button
              onClick={() =>
                onClip({
                  doc_id: activeDoc.doc_id,
                  page_start: activePage,
                  clip_type: "image",
                  label: `Imagem fl. ${activePage}`,
                })
              }
              className="p-1.5 rounded hover:bg-white/10 text-gray-400 transition-colors"
              title="Capturar como imagem"
            >
              <Image className="w-4 h-4" />
            </button>

            {/* Doc metadata */}
            <div className="ml-auto flex items-center gap-2 text-[10px] text-gray-600">
              {activeDoc.process_number && (
                <span className="badge-gold">{activeDoc.process_number}</span>
              )}
              {activeDoc.court && (
                <span className="badge-gray">{activeDoc.court}</span>
              )}
            </div>
          </div>

          {/* Search bar */}
          <AnimatePresence>
            {showSearch && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-b border-white/5 px-3 py-2"
              >
                <div className="flex gap-2">
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Buscar no documento..."
                    className="input-field text-xs py-1.5"
                  />
                  <button onClick={handleSearch} className="btn-secondary text-xs px-3">
                    Buscar
                  </button>
                </div>
                {searchResults.length > 0 && (
                  <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                    {searchResults.map((r, i) => (
                      <button
                        key={i}
                        onClick={() => onPageChange(r.page)}
                        className="w-full text-left px-2 py-1.5 rounded bg-white/5 hover:bg-white/10 text-xs"
                      >
                        <span className="text-brand-300">Fl. {r.page}</span>
                        <span className="text-gray-500 ml-2 truncate">
                          {r.context}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Clip dialog */}
          <AnimatePresence>
            {showClipDialog && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-b border-white/5 px-3 py-3"
              >
                <div className="glass-panel-light p-3">
                  <div className="text-xs text-gray-400 mb-2 font-medium">
                    Recortar pagina {activePage}
                  </div>
                  <input
                    value={clipLabel}
                    onChange={(e) => setClipLabel(e.target.value)}
                    placeholder="Label do recorte (ex: Clausula 5.2)"
                    className="input-field text-xs py-1.5 mb-2"
                  />
                  <div className="flex gap-2">
                    <button onClick={handleClipPage} className="btn-primary text-xs flex-1">
                      <Scissors className="w-3 h-3 mr-1 inline" />
                      Recortar Texto
                    </button>
                    <button onClick={handleClipImage} className="btn-gold text-xs flex-1">
                      <Image className="w-3 h-3 mr-1 inline" />
                      Capturar Imagem
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main content area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Page thumbnails sidebar */}
            <div className="w-20 border-r border-white/5 overflow-y-auto p-2 space-y-2">
              {Array.from({ length: activeDoc.total_pages }, (_, i) => i + 1).map(
                (pn) => {
                  const key = `${activeDoc.doc_id}-${pn}`;
                  return (
                    <button
                      key={pn}
                      onClick={() => onPageChange(pn)}
                      className={`w-full rounded-lg overflow-hidden border-2 transition-all ${
                        pn === activePage
                          ? "border-brand-500 shadow-lg shadow-brand-500/20"
                          : "border-transparent hover:border-white/20"
                      }`}
                    >
                      {thumbnails[key] ? (
                        <img
                          src={`data:image/png;base64,${thumbnails[key]}`}
                          alt={`Fl. ${pn}`}
                          className="w-full"
                        />
                      ) : (
                        <div className="w-full aspect-[3/4] bg-white/5 flex items-center justify-center">
                          <span className="text-[10px] text-gray-600">{pn}</span>
                        </div>
                      )}
                      <div className="text-[9px] text-gray-500 text-center py-0.5">
                        {pn}
                      </div>
                    </button>
                  );
                },
              )}
            </div>

            {/* Page content */}
            <div
              className="flex-1 overflow-y-auto p-6"
              onMouseUp={handleTextSelect}
            >
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
                </div>
              ) : pageContent ? (
                <div className="max-w-3xl mx-auto">
                  {/* Page header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-gray-500">
                      Fl. {pageContent.page_number} | {pageContent.word_count} palavras
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(pageContent.text);
                        }}
                        className="p-1 rounded hover:bg-white/10 text-gray-500"
                        title="Copiar texto"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Text content */}
                  <div className="bg-white/[0.02] rounded-xl p-6 border border-white/5 font-serif text-sm text-gray-300 leading-relaxed whitespace-pre-wrap select-text">
                    {pageContent.text || (
                      <span className="italic text-gray-600">
                        Pagina sem texto extraido (pode conter apenas imagens)
                      </span>
                    )}
                  </div>

                  {/* Page images */}
                  {pageContent.images.length > 0 && (
                    <div className="mt-4 space-y-3">
                      <span className="text-xs text-gray-500 font-medium">
                        Imagens na pagina
                      </span>
                      <div className="grid grid-cols-2 gap-3">
                        {pageContent.images.map((img, idx) => (
                          <div
                            key={idx}
                            className="rounded-lg border border-white/10 overflow-hidden"
                          >
                            <img
                              src={`/clips/${img.split("/").pop()}`}
                              alt={`Imagem ${idx + 1}`}
                              className="w-full"
                            />
                            <div className="px-2 py-1 bg-white/5 flex items-center justify-between">
                              <span className="text-[10px] text-gray-500">
                                Imagem {idx + 1}
                              </span>
                              <button
                                onClick={() =>
                                  onClip({
                                    doc_id: activeDoc.doc_id,
                                    page_start: activePage,
                                    clip_type: "image",
                                    label: `Imagem ${idx + 1}, fl. ${activePage}`,
                                  })
                                }
                                className="text-[10px] text-brand-400 hover:text-brand-300"
                              >
                                Recortar
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Selected text action */}
                  {selectedText && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="fixed bottom-24 right-8 glass-panel p-3 flex items-center gap-2 shadow-2xl"
                    >
                      <span className="text-xs text-gray-400 max-w-[200px] truncate">
                        "{selectedText}"
                      </span>
                      <button
                        onClick={() => {
                          onClip({
                            doc_id: activeDoc.doc_id,
                            page_start: activePage,
                            clip_type: "excerpt",
                            label: selectedText.slice(0, 50),
                          });
                          setSelectedText("");
                        }}
                        className="btn-primary text-xs px-2 py-1"
                      >
                        Recortar
                      </button>
                      <button
                        onClick={() => setSelectedText("")}
                        className="p-1 text-gray-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-600 text-sm">
                  Selecione uma pagina
                </div>
              )}
            </div>

            {/* Clips sidebar */}
            {clips.length > 0 && (
              <div className="w-56 border-l border-white/5 overflow-y-auto p-3">
                <h4 className="text-[11px] uppercase tracking-wider text-gray-500 font-medium mb-3">
                  Recortes ({clips.length})
                </h4>
                <div className="space-y-2">
                  {clips.map((clip) => (
                    <div
                      key={clip.clip_id}
                      className="glass-panel-light p-2.5 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono text-brand-300">
                          {clip.clip_id}
                        </span>
                        <span className="badge-gray text-[9px]">
                          fl. {clip.page_start}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-400 font-medium mb-1">
                        {clip.label}
                      </div>
                      {clip.content_text && (
                        <div className="text-[10px] text-gray-600 line-clamp-3">
                          {clip.content_text}
                        </div>
                      )}
                      {clip.image_path && (
                        <div className="mt-1 text-[10px] text-emerald-400 flex items-center gap-1">
                          <Image className="w-3 h-3" />
                          Imagem capturada
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
