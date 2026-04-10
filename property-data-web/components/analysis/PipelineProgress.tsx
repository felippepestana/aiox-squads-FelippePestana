"use client";

import {
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  MinusCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { AgentLog, AgentStatus } from "@/types/analysis";

interface PipelineProgressProps {
  agentLogs: AgentLog[];
  isRunning: boolean;
}

const TIER_MAP: Record<string, string> = {
  "leitor-documental": "Tier 0",
  "pesquisador-registral": "Tier 1",
  "analista-legislativo": "Tier 1",
  "analista-urbanistico": "Tier 1",
  "analista-visual": "Tier 1",
  "avaliador-imovel": "Tier 1",
  "analista-ambiental": "Tier 2",
  "analista-condominial": "Tier 2",
  "relator-imobiliario": "Sintese",
  "property-data-chief": "Tier 0",
};

const STATUS_CONFIG: Record<
  AgentStatus,
  { icon: React.ElementType; color: string; barValue: number }
> = {
  running: { icon: Loader2, color: "text-blue-500", barValue: -1 },
  done: { icon: CheckCircle2, color: "text-green-500", barValue: 100 },
  error: { icon: XCircle, color: "text-red-500", barValue: 100 },
  pending: { icon: Clock, color: "text-gray-400", barValue: 0 },
  skipped: { icon: MinusCircle, color: "text-muted-foreground", barValue: 0 },
};

const TIER_BADGE_COLORS: Record<string, string> = {
  "Tier 0": "bg-violet-100 text-violet-700 border-violet-200",
  "Tier 1": "bg-blue-100 text-blue-700 border-blue-200",
  "Tier 2": "bg-amber-100 text-amber-700 border-amber-200",
  Sintese: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

function abbreviateModel(model: string): string {
  if (model.includes("opus")) return "claude-opus-4-6";
  if (model.includes("sonnet")) return "claude-sonnet-4-6";
  if (model.includes("haiku")) return "claude-haiku-4-5";
  if (model.includes("gpt-4o-mini")) return "gpt-4o-mini";
  if (model.includes("gpt-4o")) return "gpt-4o";
  if (model.includes("gemini")) return "gemini";
  if (model.includes("deepseek")) return "deepseek";
  return model;
}

export default function PipelineProgress({
  agentLogs,
  isRunning,
}: PipelineProgressProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Pipeline de Agentes
        </h3>
        {isRunning && (
          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
        )}
      </div>

      <div className="space-y-2">
        {agentLogs.map((log) => {
          const tier = TIER_MAP[log.agentId] ?? log.tier ?? "Tier 1";
          const config = STATUS_CONFIG[log.status];
          const Icon = config.icon;
          const isIndeterminate = log.status === "running";

          return (
            <div
              key={log.agentId}
              className={cn(
                "rounded-lg border p-3 transition-colors",
                log.status === "running" && "border-blue-200 bg-blue-50/50",
                log.status === "done" && "border-green-200 bg-green-50/30",
                log.status === "error" && "border-red-200 bg-red-50/30",
                log.status === "pending" && "border-gray-200 bg-gray-50/30",
                log.status === "skipped" && "border-gray-100 bg-muted/30"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon
                    className={cn(
                      "h-4 w-4 flex-shrink-0",
                      config.color,
                      log.status === "running" && "animate-spin"
                    )}
                  />
                  <span className="text-sm font-medium">{log.agentName}</span>
                  <Badge
                    variant="outline"
                    className={cn("text-[10px] px-1.5 py-0", TIER_BADGE_COLORS[tier])}
                  >
                    {tier}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  {log.model && (
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0 font-mono"
                    >
                      {abbreviateModel(log.model)}
                    </Badge>
                  )}
                  {log.tokensUsed != null && log.tokensUsed > 0 && (
                    <span className="text-[10px] text-muted-foreground tabular-nums">
                      {log.tokensUsed.toLocaleString("pt-BR")} tokens
                    </span>
                  )}
                </div>
              </div>

              <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                {isIndeterminate ? (
                  <div className="h-full w-1/3 animate-pulse rounded-full bg-blue-400" />
                ) : (
                  <Progress
                    value={config.barValue}
                    className="h-1.5"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
