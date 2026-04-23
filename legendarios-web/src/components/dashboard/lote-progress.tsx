import { cn, formatBRL, formatPercent } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import type { Lote } from "@/lib/supabase/types";

interface LoteProgressProps {
  lotes: Lote[];
  compact?: boolean;
}

const loteStatusConfig = {
  pendente: { label: "Pendente", color: "text-muted-foreground", dot: "bg-muted-foreground" },
  ativo: { label: "Ativo", color: "text-primary", dot: "bg-primary animate-pulse" },
  encerrado: { label: "Encerrado", color: "text-muted-foreground", dot: "bg-muted-foreground" },
};

export function LoteProgress({ lotes, compact = false }: LoteProgressProps) {
  const totalVendidas = lotes.reduce((sum, l) => sum + l.vendidas, 0);
  const totalVagas = lotes.reduce((sum, l) => sum + l.vagas, 0);
  const loteAtivo = lotes.find((l) => l.status === "ativo");

  return (
    <div className="space-y-3">
      {/* Summary bar */}
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
        <span className="font-medium text-foreground">
          {totalVendidas} / {totalVagas} vagas
        </span>
        <span>{formatPercent((totalVendidas / totalVagas) * 100)}</span>
      </div>

      {/* Per-lote breakdown */}
      <div className="space-y-2.5">
        {lotes.map((lote) => {
          const pct = lote.vagas > 0 ? (lote.vendidas / lote.vagas) * 100 : 0;
          const config = loteStatusConfig[lote.status];
          const isActive = lote.status === "ativo";

          return (
            <div key={lote.id} className={cn(compact && "opacity-75 hover:opacity-100 transition-opacity")}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className={cn("h-1.5 w-1.5 rounded-full flex-shrink-0", config.dot)} />
                  <span
                    className={cn(
                      "text-xs font-medium",
                      isActive ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {lote.nome}
                  </span>
                  {isActive && (
                    <span className="text-[10px] font-semibold text-primary bg-primary/10 border border-primary/20 rounded-full px-1.5 py-0.5">
                      Ativo
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className={cn("font-semibold", isActive ? "text-primary" : "text-muted-foreground")}>
                    {formatBRL(lote.preco)}
                  </span>
                  <span className="text-muted-foreground">
                    {lote.vendidas}/{lote.vagas}
                  </span>
                </div>
              </div>
              <Progress
                value={pct}
                className="h-1.5"
                indicatorClassName={cn(
                  isActive ? "bg-primary" : lote.status === "encerrado" ? "bg-muted-foreground" : "bg-muted-foreground/30"
                )}
              />
            </div>
          );
        })}
      </div>

      {/* Next lote info */}
      {loteAtivo && (
        <div className="pt-1 text-[11px] text-muted-foreground">
          Próximo lote encerra em:{" "}
          <span className="text-warning font-medium">
            {loteAtivo.gatilho_quantidade
              ? `${loteAtivo.vagas - loteAtivo.vendidas} vagas restantes ou `
              : ""}
            {loteAtivo.data_fim_venda
              ? new Date(loteAtivo.data_fim_venda).toLocaleDateString("pt-BR")
              : "sem data definida"}
          </span>
          {" "}(dual trigger)
        </div>
      )}
    </div>
  );
}
