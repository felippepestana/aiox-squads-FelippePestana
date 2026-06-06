"use client";

import { AlertTriangle, CheckCircle } from "lucide-react";

import { cn } from "../../lib/cn";

export interface RiskItem {
  type: string;
  description?: string;
  severity?: string;
}

function severityColor(severity?: string) {
  switch ((severity || "").toUpperCase()) {
    case "CRITICAL":
    case "HIGH":
      return "bg-danger";
    case "MEDIUM":
      return "bg-warning";
    default:
      return "bg-info";
  }
}

export function RiskList({ risks }: { risks: RiskItem[] }) {
  if (!risks || risks.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <CheckCircle className="h-4 w-4 text-success" />
        Nenhum risco crítico identificado
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {risks.map((risk, index) => (
        <div
          key={index}
          className="flex items-start gap-3 rounded-lg border p-3"
        >
          <div
            className={cn(
              "mt-1 h-2 w-2 shrink-0 rounded-full",
              severityColor(risk.severity)
            )}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              <p className="font-medium">{risk.type}</p>
            </div>
            {risk.description && (
              <p className="mt-0.5 text-sm text-muted-foreground">
                {risk.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
