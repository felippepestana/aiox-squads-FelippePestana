import { cn } from "@/lib/utils";

type SemaforoStatus = "verde" | "amarelo" | "vermelho";

interface SemaforoBadgeProps {
  status: SemaforoStatus;
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const statusConfig: Record<
  SemaforoStatus,
  { text: string; dot: string; bg: string; border: string }
> = {
  verde: {
    text: "text-success",
    dot: "bg-success",
    bg: "bg-success/10",
    border: "border-success/25",
  },
  amarelo: {
    text: "text-warning",
    dot: "bg-warning",
    bg: "bg-warning/10",
    border: "border-warning/25",
  },
  vermelho: {
    text: "text-destructive",
    dot: "bg-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/25",
  },
};

const defaultLabels: Record<SemaforoStatus, string> = {
  verde: "No caminho",
  amarelo: "Atenção",
  vermelho: "Intervenção",
};

export function SemaforoBadge({
  status,
  label,
  size = "md",
  className,
}: SemaforoBadgeProps) {
  const config = statusConfig[status];
  const displayLabel = label ?? defaultLabels[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        config.bg,
        config.border,
        config.text,
        size === "sm" && "px-2 py-0.5 text-[10px]",
        size === "md" && "px-2.5 py-1 text-xs",
        size === "lg" && "px-3 py-1.5 text-sm",
        className
      )}
    >
      <span
        className={cn(
          "rounded-full flex-shrink-0",
          config.dot,
          status === "verde" && "animate-pulse",
          size === "sm" && "h-1.5 w-1.5",
          size === "md" && "h-2 w-2",
          size === "lg" && "h-2.5 w-2.5"
        )}
      />
      {displayLabel}
    </span>
  );
}

export function SemaforoGeral({
  pct,
  className,
}: {
  pct: number;
  className?: string;
}) {
  const status: SemaforoStatus =
    pct >= 90 ? "verde" : pct >= 70 ? "amarelo" : "vermelho";
  const label =
    pct >= 90
      ? `🟢 ${pct.toFixed(0)}% da meta — Excelente`
      : pct >= 70
        ? `🟡 ${pct.toFixed(0)}% da meta — Atenção`
        : `🔴 ${pct.toFixed(0)}% da meta — Intervenção urgente`;

  return (
    <SemaforoBadge
      status={status}
      label={label}
      size="lg"
      className={className}
    />
  );
}
