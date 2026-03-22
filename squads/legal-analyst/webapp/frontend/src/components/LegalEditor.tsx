import { useCallback, useState } from "react";
import {
  FileText,
  Download,
  Copy,
  Plus,
  Scissors,
  Image,
  Link2,
  AlignLeft,
  Bold,
  List,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { DocumentClip, DocumentMetadata, DocumentReference } from "../types";

interface LegalEditorProps {
  documents: DocumentMetadata[];
  clips: DocumentClip[];
  onDraft: (data: {
    piece_type: string;
    considerations: string;
    instructions: string;
    clips: string[];
    references: DocumentReference[];
  }) => void;
  onReport: (focusAreas: string[]) => void;
  isLoading: boolean;
}

const PIECE_TYPES = [
  { value: "contrarrazoes", label: "Contrarrazoes" },
  { value: "recurso_especial", label: "Recurso Especial" },
  { value: "recurso_extraordinario", label: "Recurso Extraordinario" },
  { value: "agravo_instrumento", label: "Agravo de Instrumento" },
  { value: "peticao_inicial", label: "Peticao Inicial" },
  { value: "contestacao", label: "Contestacao" },
  { value: "parecer", label: "Parecer Juridico" },
  { value: "memoriais", label: "Memoriais" },
  { value: "embargos_declaracao", label: "Embargos de Declaracao" },
  { value: "mandado_seguranca", label: "Mandado de Seguranca" },
];

export default function LegalEditor({
  documents,
  clips,
  onDraft,
  onReport,
  isLoading,
}: LegalEditorProps) {
  const [pieceType, setPieceType] = useState("contrarrazoes");
  const [content, setContent] = useState("");
  const [considerations, setConsiderations] = useState("");
  const [instructions, setInstructions] = useState("");
  const [selectedClips, setSelectedClips] = useState<string[]>([]);
  const [showClipSelector, setShowClipSelector] = useState(false);
  const [showRefInsert, setShowRefInsert] = useState(false);
  const [refDocId, setRefDocId] = useState("");
  const [refPage, setRefPage] = useState("");

  const handleDraft = useCallback(() => {
    const references: DocumentReference[] = [];
    if (refDocId) {
      references.push({
        doc_id: refDocId,
        page: refPage ? parseInt(refPage) : undefined,
        label: "",
        ref_type: "page",
      });
    }
    onDraft({
      piece_type: pieceType,
      considerations,
      instructions,
      clips: selectedClips,
      references,
    });
  }, [pieceType, considerations, instructions, selectedClips, refDocId, refPage, onDraft]);

  const toggleClip = useCallback((clipId: string) => {
    setSelectedClips((prev) =>
      prev.includes(clipId)
        ? prev.filter((c) => c !== clipId)
        : [...prev, clipId],
    );
  }, []);

  const insertReference = useCallback((docId: string, page?: number) => {
    const ref = page
      ? `(Doc. ID ${docId}, fl. ${page})`
      : `(Doc. ID ${docId})`;
    setContent((prev) => prev + " " + ref);
    setShowRefInsert(false);
  }, []);

  const insertClipContent = useCallback((clip: DocumentClip) => {
    const ref = `\n\n[Recorte: Doc. ID ${clip.doc_id}, fl. ${clip.page_start} - ${clip.label}]\n"${clip.content_text.slice(0, 500)}"\n`;
    setContent((prev) => prev + ref);
  }, []);

  const copyContent = useCallback(() => {
    navigator.clipboard.writeText(content);
  }, [content]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header toolbar */}
      <div className="border-b border-white/5 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-legal-gold" />
            Editor de Pecas Processuais
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => onReport([])}
              className="btn-secondary text-xs flex items-center gap-1"
            >
              <FileText className="w-3 h-3" />
              Relatorio
            </button>
            <button
              onClick={handleDraft}
              disabled={isLoading}
              className="btn-gold text-xs flex items-center gap-1"
            >
              {isLoading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <FileText className="w-3 h-3" />
              )}
              Gerar Minuta
            </button>
          </div>
        </div>

        {/* Piece type selector */}
        <div className="flex items-center gap-3">
          <label className="text-[10px] text-gray-500 uppercase tracking-wider shrink-0">
            Tipo de Peca
          </label>
          <div className="relative flex-1">
            <select
              value={pieceType}
              onChange={(e) => setPieceType(e.target.value)}
              className="input-field text-xs py-1.5 appearance-none pr-8"
            >
              {PIECE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main editor area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        <div className="flex-1 flex flex-col">
          {/* Editor toolbar */}
          <div className="border-b border-white/5 px-4 py-2 flex items-center gap-1">
            <button className="p-1.5 rounded hover:bg-white/10 text-gray-500">
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button className="p-1.5 rounded hover:bg-white/10 text-gray-500">
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button className="p-1.5 rounded hover:bg-white/10 text-gray-500">
              <List className="w-3.5 h-3.5" />
            </button>

            <div className="w-px h-5 bg-white/10 mx-1" />

            <button
              onClick={() => setShowRefInsert(!showRefInsert)}
              className={`p-1.5 rounded hover:bg-white/10 transition-colors ${
                showRefInsert ? "text-brand-400" : "text-gray-500"
              }`}
              title="Inserir remissao"
            >
              <Link2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setShowClipSelector(!showClipSelector)}
              className={`p-1.5 rounded hover:bg-white/10 transition-colors ${
                showClipSelector ? "text-legal-gold" : "text-gray-500"
              }`}
              title="Inserir recorte"
            >
              <Scissors className="w-3.5 h-3.5" />
            </button>

            <div className="ml-auto flex gap-1">
              <button
                onClick={copyContent}
                className="p-1.5 rounded hover:bg-white/10 text-gray-500"
                title="Copiar"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 rounded hover:bg-white/10 text-gray-500" title="Exportar">
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Reference insert */}
          <AnimatePresence>
            {showRefInsert && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-b border-white/5 px-4 py-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-500">Remissao:</span>
                  <select
                    value={refDocId}
                    onChange={(e) => setRefDocId(e.target.value)}
                    className="input-field text-xs py-1 w-40"
                  >
                    <option value="">Doc. ID</option>
                    {documents.map((d) => (
                      <option key={d.doc_id} value={d.doc_id}>
                        {d.doc_id} - {d.filename}
                      </option>
                    ))}
                  </select>
                  <input
                    value={refPage}
                    onChange={(e) => setRefPage(e.target.value)}
                    placeholder="Fl."
                    className="input-field text-xs py-1 w-16"
                    type="number"
                  />
                  <button
                    onClick={() =>
                      insertReference(refDocId, refPage ? parseInt(refPage) : undefined)
                    }
                    disabled={!refDocId}
                    className="btn-primary text-xs px-2 py-1"
                  >
                    Inserir
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Clip selector */}
          <AnimatePresence>
            {showClipSelector && clips.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-b border-white/5 px-4 py-2 max-h-32 overflow-y-auto"
              >
                <div className="flex flex-wrap gap-1.5">
                  {clips.map((clip) => (
                    <button
                      key={clip.clip_id}
                      onClick={() => insertClipContent(clip)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white/5 hover:bg-white/10
                                 text-[11px] text-gray-400 hover:text-gray-200 transition-colors border border-white/5"
                    >
                      {clip.image_path ? (
                        <Image className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Scissors className="w-3 h-3 text-legal-gold" />
                      )}
                      <span>{clip.label}</span>
                      <span className="text-gray-600">fl.{clip.page_start}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Text area */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Conteudo da peca processual...

O editor permite:
- Digitar texto livremente
- Inserir remissoes a documentos (Doc. ID, fl.)
- Inserir recortes de texto e imagens
- Gerar minuta automatica com IA

Use a barra de ferramentas para inserir referencias e recortes do processo."
            className="flex-1 p-6 bg-transparent text-sm text-gray-200 font-serif leading-relaxed
                       resize-none focus:outline-none placeholder:text-gray-700"
          />

          {/* Status bar */}
          <div className="border-t border-white/5 px-4 py-1.5 flex items-center gap-4 text-[10px] text-gray-600">
            <span>{content.split(/\s+/).filter(Boolean).length} palavras</span>
            <span>{content.length} caracteres</span>
            {selectedClips.length > 0 && (
              <span className="text-legal-gold">
                {selectedClips.length} recorte(s) selecionado(s)
              </span>
            )}
          </div>
        </div>

        {/* Right panel: Considerations & Instructions */}
        <div className="w-72 border-l border-white/5 flex flex-col overflow-y-auto">
          <div className="p-3 border-b border-white/5">
            <h4 className="text-[11px] uppercase tracking-wider text-gray-500 font-medium mb-2">
              Consideracoes do Advogado
            </h4>
            <textarea
              value={considerations}
              onChange={(e) => setConsiderations(e.target.value)}
              placeholder="Suas consideracoes sobre o caso, estrategia preferida, pontos de atencao..."
              className="input-field text-xs resize-none"
              rows={4}
            />
          </div>

          <div className="p-3 border-b border-white/5">
            <h4 className="text-[11px] uppercase tracking-wider text-gray-500 font-medium mb-2">
              Instrucoes para a Minuta
            </h4>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Instrucoes especificas para a geracao da peca (tom, enfase, argumentos preferidos...)"
              className="input-field text-xs resize-none"
              rows={4}
            />
          </div>

          {/* Documents for reference */}
          <div className="p-3 border-b border-white/5">
            <h4 className="text-[11px] uppercase tracking-wider text-gray-500 font-medium mb-2">
              Documentos para Remissao
            </h4>
            {documents.length === 0 ? (
              <p className="text-[11px] text-gray-600">
                Nenhum documento carregado.
              </p>
            ) : (
              <div className="space-y-1.5">
                {documents.map((doc) => (
                  <div
                    key={doc.doc_id}
                    className="flex items-center gap-2 px-2 py-1.5 rounded bg-white/5 text-[11px]"
                  >
                    <FileText className="w-3 h-3 text-gray-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-gray-300 truncate">{doc.filename}</div>
                      <div className="text-gray-600">
                        ID: {doc.doc_id} | {doc.total_pages} fls.
                      </div>
                    </div>
                    <button
                      onClick={() => insertReference(doc.doc_id)}
                      className="text-brand-400 hover:text-brand-300 shrink-0"
                      title="Inserir remissao"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Clips for insertion */}
          <div className="p-3">
            <h4 className="text-[11px] uppercase tracking-wider text-gray-500 font-medium mb-2">
              Recortes Disponiveis
            </h4>
            {clips.length === 0 ? (
              <p className="text-[11px] text-gray-600">
                Nenhum recorte. Use o visualizador de PDF para criar recortes.
              </p>
            ) : (
              <div className="space-y-1.5">
                {clips.map((clip) => (
                  <button
                    key={clip.clip_id}
                    onClick={() => insertClipContent(clip)}
                    className={`w-full text-left px-2 py-1.5 rounded text-[11px] transition-colors ${
                      selectedClips.includes(clip.clip_id)
                        ? "bg-legal-gold/10 border border-legal-gold/20"
                        : "bg-white/5 hover:bg-white/10 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {clip.image_path ? (
                        <Image className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Scissors className="w-3 h-3 text-legal-gold" />
                      )}
                      <span className="text-gray-300 truncate">{clip.label}</span>
                    </div>
                    <div className="text-gray-600 mt-0.5">
                      Doc. {clip.doc_id}, fl. {clip.page_start}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
