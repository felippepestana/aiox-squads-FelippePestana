import { useCallback, useRef, useState } from "react";
import {
  Send,
  Paperclip,
  Upload,
  AtSign,
  FileText,
  Scissors,
  ChevronUp,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import MessageBubble from "./MessageBubble";
import type { ChatMessage, DocumentReference } from "../types";

interface ChatInterfaceProps {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  onSendMessage: (
    content: string,
    considerations?: string,
    references?: DocumentReference[],
    targetAgent?: string,
  ) => void;
  onUploadPDF: (file: File) => void;
  onDismissError: () => void;
  onReferenceClick?: (docId: string, page?: number) => void;
  documentCount: number;
}

export default function ChatInterface({
  messages,
  isLoading,
  error,
  scrollRef,
  onSendMessage,
  onUploadPDF,
  onDismissError,
  onReferenceClick,
  documentCount,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [considerations, setConsiderations] = useState("");
  const [showConsiderations, setShowConsiderations] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    if (!input.trim() && !isLoading) return;
    onSendMessage(input, considerations || undefined);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }, [input, considerations, isLoading, onSendMessage]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
      if (e.key === "/" && input === "") {
        setShowCommands(true);
      }
    },
    [handleSend, input],
  );

  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
    if (e.target.value.startsWith("*")) {
      setShowCommands(true);
    } else {
      setShowCommands(false);
    }
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onUploadPDF(file);
        e.target.value = "";
      }
    },
    [onUploadPDF],
  );

  const commands = [
    { cmd: "*intake", desc: "Iniciar analise de processo via PDF", icon: Upload },
    { cmd: "*relatorio", desc: "Gerar relatorio estrategico", icon: FileText },
    { cmd: "*minutar", desc: "Elaborar peca processual", icon: FileText },
    { cmd: "*pesquisar", desc: "Pesquisar jurisprudencia", icon: FileText },
    { cmd: "*recortar", desc: "Recortar trecho do documento", icon: Scissors },
    { cmd: "*agentes", desc: "Ver agentes disponiveis", icon: AtSign },
  ];

  const filteredCommands = input.startsWith("*")
    ? commands.filter((c) => c.cmd.includes(input.toLowerCase()))
    : commands;

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <AnimatePresence>
          {messages
            .filter((m) => m.role !== "system")
            .map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                onReferenceClick={onReferenceClick}
              />
            ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 px-4 py-3"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-legal-gold to-legal-darkgold flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            </div>
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-legal-gold/50 rounded-full animate-pulse-dot" />
              <span
                className="w-2 h-2 bg-legal-gold/50 rounded-full animate-pulse-dot"
                style={{ animationDelay: "0.3s" }}
              />
              <span
                className="w-2 h-2 bg-legal-gold/50 rounded-full animate-pulse-dot"
                style={{ animationDelay: "0.6s" }}
              />
            </div>
            <span className="text-xs text-gray-500">Processando...</span>
          </motion.div>
        )}
      </div>

      {/* Error banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-4 mb-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span className="text-xs text-red-300 flex-1">{error}</span>
            <button onClick={onDismissError}>
              <X className="w-3.5 h-3.5 text-red-400" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Command palette */}
      <AnimatePresence>
        {showCommands && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mx-4 mb-2 glass-panel p-2"
          >
            <div className="text-[10px] text-gray-500 px-2 py-1 uppercase tracking-wider">
              Comandos
            </div>
            {filteredCommands.map(({ cmd, desc, icon: Icon }) => (
              <button
                key={cmd}
                onClick={() => {
                  setInput(cmd + " ");
                  setShowCommands(false);
                  textareaRef.current?.focus();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left"
              >
                <Icon className="w-4 h-4 text-gray-500" />
                <div>
                  <span className="text-sm text-brand-300 font-mono">{cmd}</span>
                  <span className="text-xs text-gray-500 ml-2">{desc}</span>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Considerations panel */}
      <AnimatePresence>
        {showConsiderations && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-4 mb-2"
          >
            <div className="glass-panel p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400 font-medium">
                  Consideracoes do Advogado
                </span>
                <button
                  onClick={() => setShowConsiderations(false)}
                  className="text-gray-500 hover:text-gray-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <textarea
                value={considerations}
                onChange={(e) => setConsiderations(e.target.value)}
                placeholder="Adicione suas consideracoes, estrategia preferida, pontos de atencao..."
                className="input-field text-xs resize-none"
                rows={3}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input area */}
      <div className="p-4 border-t border-white/5">
        <div className="glass-panel flex items-end gap-2 p-2">
          {/* Action buttons */}
          <div className="flex gap-1 pb-1">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-legal-gold transition-colors"
              title="Enviar PDF"
            >
              <Upload className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowConsiderations(!showConsiderations)}
              className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${
                showConsiderations || considerations
                  ? "text-brand-400"
                  : "text-gray-400"
              }`}
              title="Consideracoes"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>

          {/* Text input */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua mensagem ou use * para comandos..."
            className="flex-1 bg-transparent text-sm text-gray-100 placeholder:text-gray-600
                       resize-none focus:outline-none py-2 max-h-40"
            rows={1}
          />

          {/* Document count indicator */}
          {documentCount > 0 && (
            <div className="pb-1">
              <span className="badge-gold text-[10px]">
                <Paperclip className="w-3 h-3 mr-1" />
                {documentCount} doc{documentCount > 1 ? "s" : ""}
              </span>
            </div>
          )}

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white
                       transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed
                       active:scale-95 mb-0.5"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-center mt-2 gap-4">
          <span className="text-[10px] text-gray-600">
            Shift+Enter para nova linha
          </span>
          <span className="text-[10px] text-gray-700">|</span>
          <span className="text-[10px] text-gray-600">
            * para comandos
          </span>
          <span className="text-[10px] text-gray-700">|</span>
          <span className="text-[10px] text-gray-600">
            @agente para direcionar
          </span>
        </div>
      </div>
    </div>
  );
}
