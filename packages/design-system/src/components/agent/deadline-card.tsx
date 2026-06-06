"use client";

import { Calendar } from "lucide-react";

import { cn } from "../../lib/cn";
import { Badge } from "../ui/badge";

export interface DeadlineItem {
  id: string;
  description: string;
  dueDate: string;
  urgency?: string;
  priority?: string;
}

function urgencyBadge(urgency?: string) {
  switch ((urgency || "").toUpperCase()) {
    case "CRITICAL":
      return <Badge variant="destructive">Crítico</Badge>;
    case "HIGH":
      return <Badge variant="warning">Alta</Badge>;
    case "LOW":
      return <Badge variant="outline">Baixa</Badge>;
    default:
      return <Badge variant="secondary">Média</Badge>;
  }
}

export function DeadlineCard({
  deadline,
  action,
}: {
  deadline: DeadlineItem;
  action?: React.ReactNode;
}) {
  const daysLeft = Math.ceil(
    (new Date(deadline.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <p className="font-medium">{deadline.description}</p>
          {urgencyBadge(deadline.urgency || deadline.priority)}
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date(deadline.dueDate).toLocaleDateString("pt-BR")}
          </span>
          <span
            className={cn(
              daysLeft < 0
                ? "text-danger"
                : daysLeft <= 5
                ? "text-warning"
                : ""
            )}
          >
            {daysLeft < 0
              ? `${Math.abs(daysLeft)} dia(s) em atraso`
              : `${daysLeft} dia(s) restante(s)`}
          </span>
        </div>
      </div>
      {action}
    </div>
  );
}
