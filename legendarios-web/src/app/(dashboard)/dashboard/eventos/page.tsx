import { formatBRL, formatDate, formatPercent, statusEventoColor, tipoEventoLabel } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Plus, MapPin, CalendarDays, Users, ExternalLink } from "lucide-react";
import type { Evento } from "@/lib/supabase/types";
import Link from "next/link";

// Mock — replace with Supabase query
const MOCK_EVENTOS: (Evento & { inscritos: number; cidade_nome: string })[] = [
  {
    id: "porto-velho-2026-08",
    nome: "TOP - Destemidos Pioneiros",
    tipo: "TOP",
    cidade_id: "rondonia",
    cidade_nome: "Porto Velho, RO",
    data_inicio: "2026-08-06",
    data_fim: "2026-08-09",
    capacidade_meta: 400,
    capacidade_minima: 150,
    status: "inscricoes_abertas",
    budget_marketing: 25000,
    local: "Serra da Providência, RO",
    plataforma_inscricao: "ticket_and_go",
    ticket_and_go_event_id: "tg-12345",
    sympla_event_id: null,
    configuracoes: {},
    created_at: "2026-04-01T00:00:00Z",
    updated_at: "2026-04-23T00:00:00Z",
    inscritos: 187,
  },
  {
    id: "manaus-rem-2026-06",
    nome: "REM Manaus — Poder do Casal",
    tipo: "REM",
    cidade_id: "amazonas",
    cidade_nome: "Manaus, AM",
    data_inicio: "2026-06-14",
    data_fim: "2026-06-15",
    capacidade_meta: 80,
    capacidade_minima: 30,
    status: "planejamento",
    budget_marketing: 8000,
    local: "A definir",
    plataforma_inscricao: "ticket_and_go",
    ticket_and_go_event_id: null,
    sympla_event_id: null,
    configuracoes: {},
    created_at: "2026-04-20T00:00:00Z",
    updated_at: "2026-04-20T00:00:00Z",
    inscritos: 0,
  },
];

const statusLabels: Record<string, string> = {
  planejamento: "Planejamento",
  inscricoes_abertas: "Inscrições abertas",
  esgotado: "Esgotado",
  em_andamento: "Em andamento",
  encerrado: "Encerrado",
  cancelado: "Cancelado",
};

export default function EventosPage() {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Eventos</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {MOCK_EVENTOS.length} evento(s) ativos no sistema
          </p>
        </div>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          Novo Evento
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {MOCK_EVENTOS.map((evento) => {
          const pct =
            evento.capacidade_meta > 0
              ? (evento.inscritos / evento.capacidade_meta) * 100
              : 0;

          return (
            <Link key={evento.id} href={`/dashboard/eventos/${evento.id}`}>
              <div className="group rounded-xl border border-border bg-card p-5 card-hover cursor-pointer">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Badge variant="gold" className="text-[10px] shrink-0">
                        {evento.tipo}
                      </Badge>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusEventoColor(evento.status)}`}
                      >
                        {statusLabels[evento.status]}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
                      {evento.nome}
                    </h3>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2" />
                </div>

                {/* Meta info */}
                <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 flex-shrink-0" />
                    {evento.cidade_nome}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-3 w-3 flex-shrink-0" />
                    {evento.data_inicio ? formatDate(evento.data_inicio) : "A definir"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3 w-3 flex-shrink-0" />
                    Meta: {evento.capacidade_meta} participantes
                  </span>
                  <span className="flex items-center gap-1.5">
                    Budget: {formatBRL(evento.budget_marketing ?? 0)}
                  </span>
                </div>

                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">Inscritos</span>
                    <span className="font-semibold text-foreground">
                      {evento.inscritos} / {evento.capacidade_meta}{" "}
                      <span className="text-muted-foreground font-normal">
                        ({formatPercent(pct)})
                      </span>
                    </span>
                  </div>
                  <Progress
                    value={pct}
                    className="h-1.5"
                    indicatorClassName={
                      pct >= 90
                        ? "bg-success"
                        : pct >= 70
                          ? "bg-primary"
                          : pct >= 40
                            ? "bg-warning"
                            : "bg-muted-foreground"
                    }
                  />
                </div>

                {/* Ticket and GO badge */}
                {evento.ticket_and_go_event_id && (
                  <div className="mt-3 pt-3 border-t border-border flex items-center gap-1.5">
                    <div className="h-4 w-4 rounded bg-muted flex items-center justify-center">
                      <span className="text-[8px] font-bold text-muted-foreground">T</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      Ticket and GO · ID: {evento.ticket_and_go_event_id}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
