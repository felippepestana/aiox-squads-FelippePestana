"use client";

import * as React from "react";
import {
  Compass,
  ScanSearch,
  CalendarClock,
  ShieldAlert,
  FileCheck2,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  Circle,
  type LucideIcon,
} from "lucide-react";

import { cn } from "../../lib/cn";
import { Progress } from "../ui/progress";

export interface PipelineStep {
  key: string;
  label: string;
  description: string;
  icon: LucideIcon;
  /** progresso (0-100) em que a etapa inicia */
  startAt: number;
  /** progresso (0-100) em que a etapa é considerada concluída */
  doneAt: number;
}

/**
 * Etapas do pipeline multiagente do analista-processual. Os limiares espelham
 * os percentuais emitidos pelo ChiefAgent (onProgress).
 */
export const AGENT_PIPELINE_STEPS: PipelineStep[] = [
  {
    key: "navigator",
    label: "Navegador",
    description: "Indexa e organiza os documentos",
    icon: Compass,
    startAt: 5,
    doneAt: 25,
  },
  {
    key: "extractor",
    label: "Extrator",
    description: "Extrai partes, pedidos e cronologia",
    icon: ScanSearch,
    startAt: 25,
    doneAt: 50,
  },
  {
    key: "calculator",
    label: "Calculador",
    description: "Calcula prazos processuais (CPC)",
    icon: CalendarClock,
    startAt: 50,
    doneAt: 70,
  },
  {
    key: "risk",
    label: "Mapeador de Riscos",
    description: "Identifica riscos e recomendações",
    icon: ShieldAlert,
    startAt: 70,
    doneAt: 85,
  },
  {
    key: "chief",
    label: "Síntese",
    description: "Consolida o relatório final",
    icon: FileCheck2,
    startAt: 85,
    doneAt: 100,
  },
];

type PipelineStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | string;
type StepState = "done" | "active" | "pending" | "failed";

interface PipelineStepperProps {
  status: PipelineStatus;
  progress?: number;
  currentStep?: string | null;
  steps?: PipelineStep[];
  className?: string;
}

function resolveStepState(
  step: PipelineStep,
  progress: number,
  status: PipelineStatus
): StepState {
  if (status === "COMPLETED") return "done";
  if (progress >= step.doneAt) return "done";
  const isActive = progress >= step.startAt && progress < step.doneAt;
  if (isActive) return status === "FAILED" ? "failed" : "active";
  return "pending";
}

const stateIcon: Record<StepState, LucideIcon> = {
  done: CheckCircle2,
  active: Loader2,
  failed: AlertTriangle,
  pending: Circle,
};

export function PipelineStepper({
  status,
  progress = 0,
  currentStep,
  steps = AGENT_PIPELINE_STEPS,
  className,
}: PipelineStepperProps) {
  const effectiveProgress = status === "COMPLETED" ? 100 : progress;

  return (
    <div className={cn("space-y-5", className)}>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">
            {status === "COMPLETED"
              ? "Análise concluída"
              : status === "FAILED"
              ? "Análise interrompida"
              : currentStep || "Processando documentos..."}
          </span>
          <span className="tabular-nums text-muted-foreground">
            {Math.round(effectiveProgress)}%
          </span>
        </div>
        <Progress
          value={effectiveProgress}
          indicatorClassName={
            status === "FAILED"
              ? "bg-danger"
              : status === "COMPLETED"
              ? "bg-success"
              : "bg-primary"
          }
        />
      </div>

      <ol className="space-y-3">
        {steps.map((step) => {
          const state = resolveStepState(step, effectiveProgress, status);
          const StepIcon = step.icon;
          const StateIcon = stateIcon[state];
          return (
            <li
              key={step.key}
              className={cn(
                "flex items-center gap-3 rounded-lg border p-3 transition-colors",
                state === "active" && "border-primary/40 bg-primary/5",
                state === "done" && "border-success/30 bg-success/5",
                state === "failed" && "border-danger/40 bg-danger/5",
                state === "pending" && "opacity-60"
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                  state === "active" && "bg-primary/10 text-primary",
                  state === "done" && "bg-success/10 text-success",
                  state === "failed" && "bg-danger/10 text-danger",
                  state === "pending" && "bg-muted text-muted-foreground"
                )}
              >
                <StepIcon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{step.label}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {step.description}
                </p>
              </div>
              <StateIcon
                className={cn(
                  "h-5 w-5 shrink-0",
                  state === "active" && "animate-spin text-primary",
                  state === "done" && "text-success",
                  state === "failed" && "text-danger",
                  state === "pending" && "text-muted-foreground/40"
                )}
              />
            </li>
          );
        })}
      </ol>
    </div>
  );
}
