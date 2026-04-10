"use client";

import { DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AgentLog } from "@/types/analysis";

interface CostSummaryProps {
  agentLogs: AgentLog[];
}

// Approximate cost per 1M tokens (input pricing as rough estimate)
const COST_PER_MILLION: Record<string, number> = {
  opus: 15,
  sonnet: 3,
  haiku: 0.25,
  "gpt-4o": 2.5,
  "gpt-4o-mini": 0.15,
  gemini: 1,
  deepseek: 0.27,
};

function getModelCostRate(model: string): number {
  const lower = model.toLowerCase();
  for (const [key, rate] of Object.entries(COST_PER_MILLION)) {
    if (lower.includes(key)) return rate;
  }
  return 1; // fallback rate
}

function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(value);
}

export default function CostSummary({ agentLogs }: CostSummaryProps) {
  const logsWithTokens = agentLogs.filter(
    (log) => log.tokensUsed != null && log.tokensUsed > 0 && log.model
  );

  const totalTokens = logsWithTokens.reduce(
    (sum, log) => sum + (log.tokensUsed ?? 0),
    0
  );

  const estimatedCost = logsWithTokens.reduce((sum, log) => {
    const rate = getModelCostRate(log.model!);
    return sum + ((log.tokensUsed ?? 0) / 1_000_000) * rate;
  }, 0);

  // Group by model for breakdown
  const byModel = new Map<string, { tokens: number; cost: number }>();
  for (const log of logsWithTokens) {
    const model = log.model!;
    const rate = getModelCostRate(model);
    const tokens = log.tokensUsed ?? 0;
    const cost = (tokens / 1_000_000) * rate;

    const existing = byModel.get(model) ?? { tokens: 0, cost: 0 };
    byModel.set(model, {
      tokens: existing.tokens + tokens,
      cost: existing.cost + cost,
    });
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Estimativa de Custo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Totals */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              Total de Tokens
            </p>
            <p className="text-lg font-semibold tabular-nums">
              {totalTokens.toLocaleString("pt-BR")}
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              Custo Estimado
            </p>
            <p className="text-lg font-semibold tabular-nums">
              {formatUsd(estimatedCost)}
            </p>
          </div>
        </div>

        {/* Breakdown by model */}
        {byModel.size > 0 && (
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Por modelo
            </p>
            <div className="space-y-1">
              {Array.from(byModel.entries()).map(([model, data]) => (
                <div
                  key={model}
                  className="flex items-center justify-between text-xs rounded px-2 py-1 bg-muted/30"
                >
                  <span className="font-mono truncate max-w-[50%]">{model}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground tabular-nums">
                      {data.tokens.toLocaleString("pt-BR")} tokens
                    </span>
                    <span className="font-medium tabular-nums">
                      {formatUsd(data.cost)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {logsWithTokens.length === 0 && (
          <p className="text-sm text-muted-foreground italic text-center py-2">
            Nenhum dado de consumo disponível ainda.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
