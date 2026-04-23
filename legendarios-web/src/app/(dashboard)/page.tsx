import { createServerClient } from "@/lib/supabase/server";
import { formatBRL, formatNumber, formatPercent, semaforoStatus } from "@/lib/utils";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { SemaforoGeral } from "@/components/dashboard/semaforo-badge";
import { VendasChart } from "@/components/dashboard/vendas-chart";
import { LoteProgress } from "@/components/dashboard/lote-progress";
import { AgentPanel } from "@/components/agent/agent-panel";
import {
  Users,
  DollarSign,
  Layers,
  Clock,
  MapPin,
  CalendarDays,
  TrendingUp,
} from "lucide-react";

// Mock data — replace with real Supabase queries in production
const MOCK_EVENTO = {
  id: "porto-velho-2026-08",
  nome: "TOP - Destemidos Pioneiros",
  tipo: "TOP",
  cidade: "Porto Velho, RO",
  data_inicio: "2026-08-06",
  capacidade_meta: 400,
  budget_marketing: 25000,
  status: "inscricoes_abertas",
};

const MOCK_KPIs = {
  inscritos: 187,
  meta: 400,
  receita: 218330,
  receita_meta: 596000,
  semana_atual: 7,
  semanas_total: 12,
  lote_atual: "Guerreiro",
  vagas_restantes_lote: 23,
  gasto_mkt: 10800,
  cpl: 47.2,
  roas: 5.1,
};

const MOCK_LOTES = [
  { id: "1", evento_id: "porto-velho-2026-08", numero: 1, nome: "Pioneiro", preco: 990, vagas: 30, vendidas: 30, data_inicio_venda: null, data_fim_venda: "2026-05-15", gatilho_quantidade: 30, status: "encerrado" as const, ticket_and_go_lote_id: null, created_at: "" },
  { id: "2", evento_id: "porto-velho-2026-08", numero: 2, nome: "Explorador", preco: 1190, vagas: 50, vendidas: 50, data_inicio_venda: null, data_fim_venda: "2026-06-01", gatilho_quantidade: 50, status: "encerrado" as const, ticket_and_go_lote_id: null, created_at: "" },
  { id: "3", evento_id: "porto-velho-2026-08", numero: 3, nome: "Guerreiro", preco: 1390, vagas: 80, vendidas: 57, data_inicio_venda: null, data_fim_venda: "2026-07-01", gatilho_quantidade: 80, status: "ativo" as const, ticket_and_go_lote_id: null, created_at: "" },
  { id: "4", evento_id: "porto-velho-2026-08", numero: 4, nome: "Legado", preco: 1590, vagas: 100, vendidas: 0, data_inicio_venda: null, data_fim_venda: "2026-07-20", gatilho_quantidade: 80, status: "pendente" as const, ticket_and_go_lote_id: null, created_at: "" },
  { id: "5", evento_id: "porto-velho-2026-08", numero: 5, nome: "Especial", preco: 1790, vagas: 140, vendidas: 50, data_inicio_venda: null, data_fim_venda: "2026-08-01", gatilho_quantidade: null, status: "pendente" as const, ticket_and_go_lote_id: null, created_at: "" },
];

const MOCK_CHART_DATA = [
  { semana: "Sem 1", inscritos: 12, meta: 33, benchmark: 42 },
  { semana: "Sem 2", inscritos: 31, meta: 67, benchmark: 85 },
  { semana: "Sem 3", inscritos: 58, meta: 100, benchmark: 127 },
  { semana: "Sem 4", inscritos: 80, meta: 133, benchmark: 170 },
  { semana: "Sem 5", inscritos: 105, meta: 167, benchmark: 212 },
  { semana: "Sem 6", inscritos: 142, meta: 200, benchmark: 255 },
  { semana: "Sem 7", inscritos: 187, meta: 233, benchmark: 297 },
];

export default async function DashboardPage() {
  const pctInscritos = (MOCK_KPIs.inscritos / MOCK_KPIs.meta) * 100;
  const pctReceita = (MOCK_KPIs.receita / MOCK_KPIs.receita_meta) * 100;
  const semanasRestantes = MOCK_KPIs.semanas_total - MOCK_KPIs.semana_atual;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary bg-primary/10 border border-primary/20 rounded-full px-2.5 py-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Inscrições abertas
            </span>
          </div>
          <h1 className="text-xl font-bold text-foreground">{MOCK_EVENTO.nome}</h1>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {MOCK_EVENTO.cidade}
            </span>
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3" /> 06 ago 2026
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> Semana {MOCK_KPIs.semana_atual}/{MOCK_KPIs.semanas_total}
            </span>
          </div>
        </div>

        <SemaforoGeral pct={pctInscritos} />
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard
          title="Inscritos"
          value={`${formatNumber(MOCK_KPIs.inscritos)} / ${formatNumber(MOCK_KPIs.meta)}`}
          subtitle={`${formatPercent(pctInscritos)} da meta`}
          icon={Users}
          semaforo={semaforoStatus(MOCK_KPIs.inscritos, MOCK_KPIs.meta)}
          trend={12}
          trendLabel="vs sem passada"
        />
        <KpiCard
          title="Receita Bruta"
          value={formatBRL(MOCK_KPIs.receita)}
          subtitle={`Meta: ${formatBRL(MOCK_KPIs.receita_meta)}`}
          icon={DollarSign}
          semaforo={semaforoStatus(MOCK_KPIs.receita, MOCK_KPIs.receita_meta)}
          trend={8}
          trendLabel="vs sem passada"
        />
        <KpiCard
          title="Lote Ativo"
          value={MOCK_KPIs.lote_atual}
          subtitle={`${MOCK_KPIs.vagas_restantes_lote} vagas restantes`}
          icon={Layers}
          semaforo="amarelo"
        />
        <KpiCard
          title="Semanas Restantes"
          value={String(semanasRestantes)}
          subtitle={`para o evento`}
          icon={Clock}
          semaforo={semanasRestantes <= 2 ? "vermelho" : semanasRestantes <= 4 ? "amarelo" : "verde"}
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
            CPL Médio
          </p>
          <p className="text-xl font-bold text-foreground">{formatBRL(MOCK_KPIs.cpl)}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Meta: R$ 90 · BC: R$ 52
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
            ROAS
          </p>
          <p className="text-xl font-bold text-success">{MOCK_KPIs.roas}x</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Meta: 4x · BC: 6.2x
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
            Gasto Mkt
          </p>
          <p className="text-xl font-bold text-foreground">{formatBRL(MOCK_KPIs.gasto_mkt)}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {formatPercent((MOCK_KPIs.gasto_mkt / MOCK_EVENTO.budget_marketing) * 100)} do budget
          </p>
        </div>
      </div>

      {/* Chart + Lotes + Agent */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Chart */}
        <div className="xl:col-span-2">
          <VendasChart data={MOCK_CHART_DATA} />
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Lote progress */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Lotes</h3>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Ticket and GO
                </span>
              </div>
            </div>
            <LoteProgress lotes={MOCK_LOTES} />
          </div>

          {/* Agent panel */}
          <AgentPanel
            eventoId={MOCK_EVENTO.id}
            eventoNome={MOCK_EVENTO.nome}
          />
        </div>
      </div>

      {/* Benchmark comparison */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Comparativo — Porto Velho vs. Balneário Camboriú (TOP #555)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Métrica</th>
                <th className="text-right py-2 px-4 text-muted-foreground font-medium">Porto Velho</th>
                <th className="text-right py-2 px-4 text-muted-foreground font-medium">Meta (80% BC)</th>
                <th className="text-right py-2 pl-4 text-muted-foreground font-medium">Benchmark BC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                {
                  metrica: "Participantes",
                  atual: "187",
                  meta: "320",
                  benchmark: "500",
                  status: semaforoStatus(187, 320),
                },
                {
                  metrica: "CPL",
                  atual: "R$ 47",
                  meta: "≤ R$ 62",
                  benchmark: "R$ 52",
                  status: "verde" as const,
                },
                {
                  metrica: "ROAS",
                  atual: "5.1x",
                  meta: "≥ 5.0x",
                  benchmark: "6.2x",
                  status: "verde" as const,
                },
                {
                  metrica: "Taxa conv. lead→inscrição",
                  atual: "19%",
                  meta: "≥ 18%",
                  benchmark: "28%",
                  status: "verde" as const,
                },
                {
                  metrica: "Receita bruta",
                  atual: "R$ 218K",
                  meta: "R$ 477K",
                  benchmark: "R$ 745K",
                  status: semaforoStatus(218330, 477000),
                },
              ].map((row) => (
                <tr key={row.metrica} className="hover:bg-muted/20 transition-colors">
                  <td className="py-2.5 pr-4 text-foreground font-medium">{row.metrica}</td>
                  <td className="py-2.5 px-4 text-right">
                    <span
                      className={
                        row.status === "verde"
                          ? "text-success font-semibold"
                          : row.status === "amarelo"
                            ? "text-warning font-semibold"
                            : "text-destructive font-semibold"
                      }
                    >
                      {row.atual}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right text-muted-foreground">{row.meta}</td>
                  <td className="py-2.5 pl-4 text-right text-muted-foreground">{row.benchmark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
