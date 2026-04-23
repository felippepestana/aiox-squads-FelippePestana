import { formatBRL, formatNumber, formatPercent } from "@/lib/utils";
import { VendasChart } from "@/components/dashboard/vendas-chart";
import { SemaforoBadge } from "@/components/dashboard/semaforo-badge";
import { AgentPanel } from "@/components/agent/agent-panel";

const RECEITA_MEDIA = 1165;
const CAP = 400;

const CENARIOS = [
  {
    id: "pessimista",
    nome: "Pessimista",
    pct: 60,
    participantes: Math.round(CAP * 0.6),
    receita_bruta: Math.round(CAP * 0.6 * RECEITA_MEDIA),
    margem: 0.72,
    emoji: "🔴",
    status: "vermelho" as const,
    gasto_operacional: 95000,
    roi_mkt: 3.8,
  },
  {
    id: "realista",
    nome: "Realista",
    pct: 80,
    participantes: Math.round(CAP * 0.8),
    receita_bruta: Math.round(CAP * 0.8 * RECEITA_MEDIA),
    margem: 0.78,
    emoji: "🟡",
    status: "amarelo" as const,
    gasto_operacional: 105000,
    roi_mkt: 5.2,
  },
  {
    id: "otimista",
    nome: "Otimista",
    pct: 95,
    participantes: Math.round(CAP * 0.95),
    receita_bruta: Math.round(CAP * 0.95 * RECEITA_MEDIA),
    margem: 0.84,
    emoji: "🟢",
    status: "verde" as const,
    gasto_operacional: 110000,
    roi_mkt: 6.8,
  },
];

const CHART_DATA = [
  { semana: "Sem 1", inscritos: 12, meta: 33, benchmark: 42 },
  { semana: "Sem 2", inscritos: 31, meta: 67, benchmark: 85 },
  { semana: "Sem 3", inscritos: 58, meta: 100, benchmark: 127 },
  { semana: "Sem 4", inscritos: 80, meta: 133, benchmark: 170 },
  { semana: "Sem 5", inscritos: 105, meta: 167, benchmark: 212 },
  { semana: "Sem 6", inscritos: 142, meta: 200, benchmark: 255 },
  { semana: "Sem 7", inscritos: 187, meta: 233, benchmark: 297 },
  { semana: "Sem 8", inscritos: 0, meta: 267, benchmark: 340 },
  { semana: "Sem 9", inscritos: 0, meta: 300, benchmark: 382 },
  { semana: "Sem 10", inscritos: 0, meta: 333, benchmark: 425 },
  { semana: "Sem 11", inscritos: 0, meta: 367, benchmark: 467 },
  { semana: "Sem 12", inscritos: 0, meta: 400, benchmark: 500 },
];

const ROI_CANAIS = [
  { canal: "Meta Ads", gasto: 9000, receita_attr: 58000, roas: 6.4, leads: 568, cpl: 15.85 },
  { canal: "WhatsApp", gasto: 1900, receita_attr: 42000, roas: 22.1, leads: 156, cpl: 12.18 },
  { canal: "Instagram Orgânico", gasto: 5600, receita_attr: 28000, roas: 5.0, leads: 89, cpl: 62.92 },
  { canal: "Email Marketing", gasto: 1280, receita_attr: 19000, roas: 14.8, leads: 94, cpl: 13.62 },
  { canal: "Indicação", gasto: 500, receita_attr: 35000, roas: 70.0, leads: 82, cpl: 6.10 },
];

export default function AnalyticsPage() {
  const totalGasto = ROI_CANAIS.reduce((s, c) => s + c.gasto, 0);
  const totalLeads = ROI_CANAIS.reduce((s, c) => s + c.leads, 0);
  const roasGeral = ROI_CANAIS.reduce((s, c) => s + c.receita_attr, 0) / totalGasto;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Analytics</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Dashboard financeiro · Semana 7 de 12 · TOP Porto Velho 2026
          </p>
        </div>
      </div>

      {/* Semáforo geral */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-foreground">Status Geral — Semana 7</h3>
          <SemaforoBadge status="amarelo" label="🟡 47% da meta — Atenção" size="lg" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { metric: "Inscritos", atual: "187", meta: "400", status: "vermelho" as const },
            { metric: "Receita", atual: "R$ 218K", meta: "R$ 596K", status: "vermelho" as const },
            { metric: "CPL", atual: "R$ 47", meta: "≤ R$ 90", status: "verde" as const },
            { metric: "ROAS", atual: "5.1x", meta: "≥ 4x", status: "verde" as const },
            { metric: "Conv. Lead", atual: "19%", meta: "≥ 15%", status: "verde" as const },
            { metric: "Taxa Churn", atual: "3%", meta: "≤ 5%", status: "verde" as const },
          ].map((item) => (
            <div key={item.metric} className="text-center">
              <SemaforoBadge status={item.status} size="sm" className="mx-auto mb-1.5 block w-fit" />
              <p className="text-sm font-bold text-foreground">{item.atual}</p>
              <p className="text-[10px] text-muted-foreground">{item.metric}</p>
              <p className="text-[10px] text-muted-foreground">Meta: {item.meta}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <VendasChart data={CHART_DATA} title="Projeção de Vendas — 12 Semanas" />

      {/* Financial scenarios */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Projeção Financeira — 3 Cenários
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CENARIOS.map((c) => (
            <div
              key={c.id}
              className={`rounded-xl border bg-card p-5 ${
                c.id === "realista" ? "border-primary/40 gold-glow" : "border-border"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-foreground">{c.nome}</span>
                <SemaforoBadge status={c.status} size="sm" label={`${c.pct}%`} />
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Participantes</span>
                  <span className="font-semibold text-foreground">{formatNumber(c.participantes)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Receita Bruta</span>
                  <span className="font-semibold text-foreground">{formatBRL(c.receita_bruta)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Receita Líquida</span>
                  <span className="font-semibold text-foreground">
                    {formatBRL(Math.round(c.receita_bruta * c.margem))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Margem</span>
                  <span className="font-semibold text-foreground">
                    {formatPercent(c.margem * 100)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ROAS Mkt</span>
                  <span className="font-semibold text-foreground">{c.roi_mkt}x</span>
                </div>
                {c.id === "realista" && (
                  <div className="pt-1 border-t border-border">
                    <p className="text-[10px] text-primary font-semibold">Cenário base recomendado</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ROI by channel + Agent */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <h3 className="text-sm font-semibold text-foreground mb-3">ROI por Canal</h3>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="text-left py-2.5 px-4 text-muted-foreground font-medium">Canal</th>
                  <th className="text-right py-2.5 px-3 text-muted-foreground font-medium">Gasto</th>
                  <th className="text-right py-2.5 px-3 text-muted-foreground font-medium">Leads</th>
                  <th className="text-right py-2.5 px-3 text-muted-foreground font-medium">CPL</th>
                  <th className="text-right py-2.5 px-3 text-muted-foreground font-medium">ROAS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ROI_CANAIS.map((canal) => (
                  <tr key={canal.canal} className="hover:bg-muted/20 transition-colors">
                    <td className="py-2.5 px-4 font-medium text-foreground">{canal.canal}</td>
                    <td className="py-2.5 px-3 text-right text-muted-foreground">
                      {formatBRL(canal.gasto)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-muted-foreground">
                      {formatNumber(canal.leads)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-muted-foreground">
                      {formatBRL(canal.cpl)}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span
                        className={
                          canal.roas >= 10
                            ? "text-success font-bold"
                            : canal.roas >= 5
                              ? "text-primary font-semibold"
                              : "text-muted-foreground"
                        }
                      >
                        {canal.roas.toFixed(1)}x
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 border-border bg-muted/10">
                  <td className="py-2.5 px-4 font-bold text-foreground">Total</td>
                  <td className="py-2.5 px-3 text-right font-bold text-foreground">
                    {formatBRL(totalGasto)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-foreground">
                    {formatNumber(totalLeads)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-foreground">
                    {formatBRL(totalGasto / totalLeads)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-primary">
                    {roasGeral.toFixed(1)}x
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Benchmark note */}
          <div className="mt-3 p-3 rounded-lg border border-muted bg-muted/20">
            <p className="text-[11px] text-muted-foreground">
              <span className="font-semibold text-foreground">Benchmark Balneário Camboriú (TOP #555):</span>{" "}
              500 participantes · ROAS 6.2x · CPL R$ 52 · Taxa conv. 28% · Receita bruta R$ 745K.
              Porto Velho meta: 70–80% desses KPIs.
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">IA Analytics</h3>
          <AgentPanel
            eventoId="porto-velho-2026-08"
            eventoNome="TOP - Destemidos Pioneiros"
            className="sticky top-6"
          />
        </div>
      </div>
    </div>
  );
}
