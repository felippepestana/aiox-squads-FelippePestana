"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, CheckCircle2, XCircle, Loader2, Clock, MinusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { AgentStatus } from "@/types/analysis";

interface AgentCardProps {
  agentId: string;
  agentName: string;
  status: AgentStatus;
  output?: string;
  model?: string;
  tokensUsed?: number;
}

const STATUS_ICON: Record<AgentStatus, React.ElementType> = {
  running: Loader2,
  done: CheckCircle2,
  error: XCircle,
  pending: Clock,
  skipped: MinusCircle,
};

const STATUS_COLOR: Record<AgentStatus, string> = {
  running: "text-blue-500",
  done: "text-green-500",
  error: "text-red-500",
  pending: "text-gray-400",
  skipped: "text-muted-foreground",
};

const STATUS_LABEL: Record<AgentStatus, string> = {
  running: "Executando",
  done: "Concluído",
  error: "Erro",
  pending: "Pendente",
  skipped: "Ignorado",
};

function abbreviateModel(model: string): string {
  if (model.includes("opus")) return "opus-4-6";
  if (model.includes("sonnet")) return "sonnet-4-6";
  if (model.includes("haiku")) return "haiku-4-5";
  if (model.includes("gpt-4o-mini")) return "gpt-4o-mini";
  if (model.includes("gpt-4o")) return "gpt-4o";
  if (model.includes("gemini")) return "gemini";
  if (model.includes("deepseek")) return "deepseek";
  return model;
}

export default function AgentCard({
  agentId,
  agentName,
  status,
  output,
  model,
  tokensUsed,
}: AgentCardProps) {
  const [expanded, setExpanded] = useState(false);
  const Icon = STATUS_ICON[status];

  return (
    <Card
      className={cn(
        "transition-colors",
        status === "error" && "border-red-200"
      )}
    >
      <CardHeader
        className="cursor-pointer select-none p-4"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {expanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            <Icon
              className={cn(
                "h-4 w-4",
                STATUS_COLOR[status],
                status === "running" && "animate-spin"
              )}
            />
            <span className="text-sm font-medium">{agentName}</span>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              {STATUS_LABEL[status]}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {model && (
              <Badge
                variant="secondary"
                className="text-[10px] px-1.5 py-0 font-mono"
              >
                {abbreviateModel(model)}
              </Badge>
            )}
            {tokensUsed != null && tokensUsed > 0 && (
              <span className="text-[10px] text-muted-foreground tabular-nums">
                {tokensUsed.toLocaleString("pt-BR")} tokens
              </span>
            )}
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="px-4 pb-4 pt-0">
          {output ? (
            <div className="prose prose-sm max-w-none dark:prose-invert rounded-md bg-muted/50 p-4 text-sm leading-relaxed whitespace-pre-wrap">
              {output}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              {status === "pending"
                ? "Aguardando execução..."
                : status === "running"
                ? "Processando..."
                : "Nenhum output disponível."}
            </p>
          )}
        </CardContent>
      )}
    </Card>
  );
}
