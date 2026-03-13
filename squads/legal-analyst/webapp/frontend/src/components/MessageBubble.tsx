import { Bot, User, Paperclip, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import type { ChatMessage } from "../types";

interface MessageBubbleProps {
  message: ChatMessage;
  onReferenceClick?: (docId: string, page?: number) => void;
}

const AGENT_COLORS: Record<string, string> = {
  "legal-chief": "from-legal-gold to-legal-darkgold",
  "barbosa-classifier": "from-amber-500 to-amber-700",
  "fux-procedural": "from-cyan-500 to-cyan-700",
  "cnj-compliance": "from-emerald-500 to-emerald-700",
  "mendes-researcher": "from-blue-500 to-blue-700",
  "toffoli-aggregator": "from-indigo-500 to-indigo-700",
  "moraes-analyst": "from-purple-500 to-purple-700",
  "carmem-relator": "from-pink-500 to-pink-700",
  "fachin-precedent": "from-rose-500 to-rose-700",
  "nunes-quantitative": "from-teal-500 to-teal-700",
  "barroso-strategist": "from-brand-500 to-brand-700",
  "theodoro-validator": "from-green-500 to-green-700",
  "marinoni-quality": "from-lime-500 to-lime-700",
  "datajud-formatter": "from-orange-500 to-orange-700",
  "weber-indexer": "from-yellow-500 to-yellow-700",
};

export default function MessageBubble({ message, onReferenceClick }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  if (isSystem) return null;

  const agentColor = message.agent_id
    ? AGENT_COLORS[message.agent_id] || "from-gray-500 to-gray-700"
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar */}
      <div className="shrink-0 mt-1">
        {isUser ? (
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <User className="w-4 h-4 text-gray-300" />
          </div>
        ) : (
          <div
            className={`w-8 h-8 rounded-lg bg-gradient-to-br ${agentColor} flex items-center justify-center shadow-lg`}
          >
            <Bot className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      {/* Content */}
      <div
        className={`max-w-[80%] ${
          isUser
            ? "bg-brand-600/20 border border-brand-500/20 rounded-2xl rounded-tr-md"
            : "glass-panel-light rounded-2xl rounded-tl-md"
        } px-4 py-3`}
      >
        {/* Agent name */}
        {message.agent_name && (
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold text-brand-300">
              {message.agent_name}
            </span>
            {message.metadata?.phase && (
              <span className="badge-gray text-[10px]">
                {String(message.metadata.phase)}
              </span>
            )}
          </div>
        )}

        {/* Message content */}
        <div className="markdown-body text-sm">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>

        {/* References */}
        {message.references.length > 0 && (
          <div className="mt-2 pt-2 border-t border-white/5 flex flex-wrap gap-1.5">
            {message.references.map((ref, idx) => (
              <button
                key={idx}
                onClick={() => onReferenceClick?.(ref.doc_id, ref.page)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 hover:bg-white/10
                           text-[11px] text-gray-400 hover:text-gray-200 transition-colors border border-white/5"
              >
                <FileText className="w-3 h-3" />
                <span>
                  Doc. {ref.doc_id}
                  {ref.page ? `, fl. ${ref.page}` : ""}
                  {ref.page_range ? `, fls. ${ref.page_range}` : ""}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Attachments */}
        {message.attachments.length > 0 && (
          <div className="mt-2 pt-2 border-t border-white/5 flex gap-1.5">
            {message.attachments.map((att, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10
                           text-[11px] text-emerald-300 border border-emerald-500/10"
              >
                <Paperclip className="w-3 h-3" />
                {att}
              </span>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <div className="mt-1.5 text-[10px] text-gray-600">
          {new Date(message.timestamp).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </motion.div>
  );
}
