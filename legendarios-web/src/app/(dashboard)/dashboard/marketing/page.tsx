import { formatBRL, formatNumber, formatPercent } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgentPanel } from "@/components/agent/agent-panel";
import {
  Megaphone,
  Instagram,
  Mail,
  MessageSquare,
  Users,
  TrendingUp,
  DollarSign,
  Eye,
  MousePointer,
} from "lucide-react";

const MOCK_CAMPANHAS = [
  {
    id: "1",
    nome: "Awareness — Fase 1",
    tipo: "meta_ads",
    status: "concluido",
    budget: 2500,
    gasto: 2500,
    impressoes: 142000,
    cliques: 4260,
    leads: 248,
    conversoes: 38,
    ctr: 3.0,
    cpl: 10.08,
    period: "Sem 1-4",
  },
  {
    id: "2",
    nome: "Tráfego + Leads — Fase 2",
    tipo: "meta_ads",
    status: "ativo",
    budget: 6500,
    gasto: 4800,
    impressoes: 98000,
    cliques: 5100,
    leads: 320,
    conversoes: 62,
    ctr: 5.2,
    cpl: 15.0,
    period: "Sem 4-9",
  },
  {
    id: "3",
    nome: "Instagram Orgânico — 12 sem",
    tipo: "instagram",
    status: "ativo",
    budget: 3500,
    gasto: 2100,
    impressoes: 67000,
    cliques: 3400,
    leads: 89,
    conversoes: 21,
    ctr: 5.07,
    cpl: 23.6,
    period: "Sem 1-12",
  },
  {
    id: "4",
    nome: "WhatsApp Business — 6 fases",
    tipo: "whatsapp",
    status: "ativo",
    budget: 1200,
    gasto: 700,
    impressoes: 0,
    cliques: 0,
    leads: 156,
    conversoes: 47,
    ctr: 0,
    cpl: 4.49,
    period: "Contínuo",
  },
  {
    id: "5",
    nome: "Email Marketing — 8 disparos",
    tipo: "email",
    status: "ativo",
    budget: 800,
    gasto: 480,
    impressoes: 0,
    cliques: 0,
    leads: 94,
    conversoes: 19,
    ctr: 0,
    cpl: 5.11,
    period: "Contínuo",
  },
];

const tipoConfig: Record<string, { icon: typeof Megaphone; label: string; color: string }> = {
  meta_ads: { icon: Megaphone, label: "Meta Ads", color: "text-blue-400" },
  instagram: { icon: Instagram, label: "Instagram", color: "text-pink-400" },
  whatsapp: { icon: MessageSquare, label: "WhatsApp", color: "text-success" },
  email: { icon: Mail, label: "Email", color: "text-warning" },
  influenciador: { icon: Users, label: "Influenciador", color: "text-purple-400" },
};

const statusVariant = {
  ativo: "success" as const,
  concluido: "muted" as const,
  pausado: "warning" as const,
  rascunho: "outline" as const,
};

const statusLabel: Record<string, string> = {
  ativo: "Ativo",
  concluido: "Concluído",
  pausado: "Pausado",
  rascunho: "Rascunho",
};

const totalGasto = MOCK_CAMPANHAS.reduce((s, c) => s + c.gasto, 0);
const totalLeads = MOCK_CAMPANHAS.reduce((s, c) => s + c.leads, 0);
const totalConversoes = MOCK_CAMPANHAS.reduce((s, c) => s + c.conversoes, 0);
const totalImpress = MOCK_CAMPANHAS.reduce((s, c) => s + c.impressoes, 0);
const cplMedio = totalGasto / totalLeads;
const roas = 218330 / totalGasto;

export default function MarketingPage() {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Marketing</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            TOP - Destemidos Pioneiros · Porto Velho, RO
          </p>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Gasto", value: formatBRL(totalGasto), sub: `de ${formatBRL(25000)} budget`, icon: DollarSign },
          { label: "Impressões", value: formatNumber(totalImpress), sub: "alcance total", icon: Eye },
          { label: "Leads Gerados", value: formatNumber(totalLeads), sub: `CPL médio: ${formatBRL(cplMedio)}`, icon: MousePointer },
          { label: "ROAS", value: `${roas.toFixed(1)}x`, sub: "Meta: 4x · BC: 6.2x", icon: TrendingUp },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {kpi.label}
              </p>
              <kpi.icon className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <p className="text-xl font-bold text-foreground">{kpi.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Budget allocation bar */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Alocação de Budget — R$ 25.000
        </h3>
        <div className="space-y-3">
          {[
            { canal: "Meta Ads", pct: 45, valor: 11250, color: "bg-blue-500" },
            { canal: "Criativo", pct: 20, valor: 5000, color: "bg-purple-500" },
            { canal: "Influenciadores", pct: 20, valor: 5000, color: "bg-pink-500" },
            { canal: "Tools (WA + Email)", pct: 10, valor: 2500, color: "bg-warning" },
            { canal: "Contingência", pct: 5, valor: 1250, color: "bg-muted-foreground" },
          ].map((item) => (
            <div key={item.canal}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground font-medium">{item.canal}</span>
                <span className="text-foreground font-semibold">
                  {formatBRL(item.valor)}{" "}
                  <span className="text-muted-foreground font-normal">({item.pct}%)</span>
                </span>
              </div>
              <Progress value={item.pct * 2} className="h-1.5" indicatorClassName={item.color} />
            </div>
          ))}
        </div>
      </div>

      {/* Campaigns + Agent */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Campanhas Ativas</h3>

          {MOCK_CAMPANHAS.map((camp) => {
            const config = tipoConfig[camp.tipo] ?? tipoConfig.meta_ads;
            const Icon = config.icon;
            const budgetPct = camp.budget > 0 ? (camp.gasto / camp.budget) * 100 : 0;
            const taxaConv = camp.leads > 0 ? (camp.conversoes / camp.leads) * 100 : 0;

            return (
              <div
                key={camp.id}
                className="rounded-xl border border-border bg-card p-4 card-hover"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                      <Icon className={`h-4 w-4 ${config.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{camp.nome}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {config.label} · {camp.period}
                      </p>
                    </div>
                  </div>
                  <Badge variant={statusVariant[camp.status as keyof typeof statusVariant]}>
                    {statusLabel[camp.status]}
                  </Badge>
                </div>

                <div className="grid grid-cols-4 gap-3 text-xs mb-3">
                  <div>
                    <p className="text-muted-foreground">Gasto</p>
                    <p className="font-semibold text-foreground">{formatBRL(camp.gasto)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Leads</p>
                    <p className="font-semibold text-foreground">{formatNumber(camp.leads)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">CPL</p>
                    <p className="font-semibold text-foreground">{formatBRL(camp.cpl)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Conv.</p>
                    <p className="font-semibold text-foreground">{formatPercent(taxaConv)}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                    <span>Budget utilizado</span>
                    <span>{formatPercent(budgetPct)}</span>
                  </div>
                  <Progress value={budgetPct} className="h-1" />
                </div>
              </div>
            );
          })}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">IA Marketing</h3>
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
