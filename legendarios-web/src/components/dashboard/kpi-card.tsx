import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

type Semaforo = "verde" | "amarelo" | "vermelho" | "neutro";

interface KpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: LucideIcon;
  semaforo?: Semaforo;
  trend?: number;
  trendLabel?: string;
  className?: string;
}

const semaforoConfig: Record<
  Semaforo,
  { dot: string; border: string; bg: string }
> = {
  verde: {
    dot: "bg-success",
    border: "border-success/20",
    bg: "bg-success/5",
  },
  amarelo: {
    dot: "bg-warning",
    border: "border-warning/20",
    bg: "bg-warning/5",
  },
  vermelho: {
    dot: "bg-destructive",
    border: "border-destructive/20",
    bg: "bg-destructive/5",
  },
  neutro: {
    dot: "bg-muted-foreground",
    border: "border-border",
    bg: "",
  },
};

export function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  semaforo = "neutro",
  trend,
  trendLabel,
  className,
}: KpiCardProps) {
  const config = semaforoConfig[semaforo];
  const TrendIcon =
    trend === undefined ? null : trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border bg-card p-5 card-hover",
        semaforo !== "neutro" ? config.border : "border-border",
        className
      )}
    >
      {/* Subtle bg tint for status */}
      {semaforo !== "neutro" && (
        <div className={cn("absolute inset-0 rounded-xl", config.bg)} />
      )}

      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {semaforo !== "neutro" && (
              <span
                className={cn(
                  "inline-block h-2 w-2 rounded-full flex-shrink-0",
                  config.dot,
                  semaforo === "verde" && "animate-pulse"
                )}
              />
            )}
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {title}
            </p>
          </div>
          {Icon && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </div>

        <p className="text-2xl font-bold text-foreground leading-tight mb-1">
          {value}
        </p>

        {(subtitle || (TrendIcon && trend !== undefined)) && (
          <div className="flex items-center gap-2 mt-1">
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
            {TrendIcon && trend !== undefined && (
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 text-xs font-medium",
                  trend > 0 ? "text-success" : trend < 0 ? "text-destructive" : "text-muted-foreground"
                )}
              >
                <TrendIcon className="h-3 w-3" />
                {Math.abs(trend)}%{trendLabel && ` ${trendLabel}`}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
