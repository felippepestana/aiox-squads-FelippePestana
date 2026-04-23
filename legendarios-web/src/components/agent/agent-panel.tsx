"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, Loader2, X, ChevronDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AgentPanelProps {
  eventoId?: string;
  eventoNome?: string;
  className?: string;
}

const QUICK_COMMANDS = [
  { label: "Criar campanha", prompt: "Criar campanha de marketing completa para este evento" },
  { label: "Checklist D-day", prompt: "Gerar checklist operacional completo para o dia do evento" },
  { label: "Relatório semanal", prompt: "Gerar relatório de vendas desta semana com semáforo" },
  { label: "Influenciadores", prompt: "Encontrar influenciadores locais para divulgação do evento" },
  { label: "Plano pós-evento", prompt: "Criar plano de retenção e cross-sell pós-evento" },
];

export function AgentPanel({ eventoId, eventoNome, className }: AgentPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `AHU! Sou o **Legendários Chief** — seu orquestrador de IA para o ciclo completo do evento.\n\nPosso ajudar com:\n- 📣 Campanha de marketing 360° (UC-LP-001)\n- ⚙️ Operação e check-in D-day (UC-LP-002)\n- 📊 Relatórios e analytics (UC-LP-006)\n- 👥 Gestão de alumni e cross-sell (UC-LP-004)\n- 🎯 PRD completo do evento (UC-LP-007)\n\nO que vamos executar hoje?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function adjustTextarea() {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
  }

  async function sendMessage(content: string = input) {
    if (!content.trim() || loading) return;

    const userMsg: Message = { role: "user", content: content.trim(), timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: "legendarios-chief",
          message: content.trim(),
          eventoId,
          history,
        }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "", timestamp: new Date() },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        assistantContent += chunk;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: assistantContent,
            timestamp: new Date(),
          };
          return updated;
        });
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Erro ao contatar o agente. Verifique a configuração da API key.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border border-border bg-card overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-border cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
            <Bot className="h-3.5 w-3.5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground leading-tight">
              Legendários Chief
            </p>
            {eventoNome && (
              <p className="text-[10px] text-muted-foreground leading-tight">
                Contexto: {eventoNome}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-[10px] text-success font-medium">Online</span>
          </div>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            !isExpanded && "-rotate-90"
          )}
        />
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Messages */}
            <div className="flex flex-col gap-3 p-4 max-h-[360px] overflow-y-auto">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex gap-2.5",
                    msg.role === "user" && "flex-row-reverse"
                  )}
                >
                  {msg.role === "assistant" && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 border border-primary/20 flex-shrink-0 mt-0.5">
                      <Sparkles className="h-3 w-3 text-primary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-muted text-foreground rounded-tl-sm",
                      msg.content === "" && loading && "streaming-cursor"
                    )}
                  >
                    {msg.content ? (
                      <span className="whitespace-pre-wrap">{msg.content}</span>
                    ) : (
                      <span className="text-muted-foreground italic">
                        Pensando...
                      </span>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick commands */}
            <div className="px-4 pb-2">
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                {QUICK_COMMANDS.map((cmd) => (
                  <button
                    key={cmd.label}
                    onClick={() => sendMessage(cmd.prompt)}
                    disabled={loading}
                    className="flex-shrink-0 text-[10px] font-medium px-2.5 py-1 rounded-full bg-muted border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all disabled:opacity-50"
                  >
                    {cmd.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="border-t border-border p-3">
              <div className="flex items-end gap-2">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    adjustTextarea();
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Mensagem para o Legendários Chief..."
                  rows={1}
                  className="flex-1 resize-none bg-muted border border-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors min-h-[36px] max-h-[120px]"
                />
                <Button
                  size="icon"
                  disabled={loading || !input.trim()}
                  onClick={() => sendMessage()}
                  className="h-[36px] w-[36px] flex-shrink-0"
                >
                  {loading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
