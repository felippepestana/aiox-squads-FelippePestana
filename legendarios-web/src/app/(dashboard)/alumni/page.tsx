import { formatDate, formatNumber } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AgentPanel } from "@/components/agent/agent-panel";
import { Users, Heart, Baby, TrendingUp, Star } from "lucide-react";

const MOCK_SEGMENTOS = [
  {
    id: "casados-pais",
    nome: "Casados com Filhos",
    descricao: "Candidatos ideais para REM + LEGADO",
    count: 74,
    ltv: 6080,
    cross_sell: ["REM (D+14)", "LEGADO (D+30)"],
    score_medio: 42,
    cor: "bg-success/10 border-success/20 text-success",
  },
  {
    id: "casados-sem-filhos",
    nome: "Casados sem Filhos",
    descricao: "Cross-sell REM prioritário",
    count: 38,
    ltv: 3490,
    cross_sell: ["REM (D+14)"],
    score_medio: 35,
    cor: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  },
  {
    id: "solteiros-jovens",
    nome: "Solteiros Jovens (18-30)",
    descricao: "Pipeline TOP futuro + indicação",
    count: 45,
    ltv: 1790,
    cross_sell: ["TOP futuro (D+60)", "Indicação"],
    score_medio: 28,
    cor: "bg-purple-500/10 border-purple-500/20 text-purple-400",
  },
  {
    id: "lideres",
    nome: "Líderes / Embaixadores",
    descricao: "Alto engajamento — potenciais embaixadores",
    count: 30,
    ltv: 8500,
    cross_sell: ["Embaixador", "Todos os eventos"],
    score_medio: 48,
    cor: "bg-primary/10 border-primary/20 text-primary",
  },
];

const MOCK_PARTICIPANTES = [
  { id: "1", nome: "Carlos Mendes", evento: "TOP #644 BC", data: "2025-11-15", status_conjugal: "casado", tem_filhos: true, score: 48, como_conheceu: "Instagram", lgpd: true },
  { id: "2", nome: "Rafael Souza", evento: "TOP #644 BC", data: "2025-11-15", status_conjugal: "solteiro", tem_filhos: false, score: 22, como_conheceu: "Amigo", lgpd: true },
  { id: "3", nome: "Marcos Lima", evento: "TOP #555 BC", data: "2024-08-20", status_conjugal: "casado", tem_filhos: true, score: 50, como_conheceu: "YouTube", lgpd: true },
  { id: "4", nome: "André Santos", evento: "TOP #555 BC", data: "2024-08-20", status_conjugal: "casado", tem_filhos: false, score: 33, como_conheceu: "Igreja", lgpd: false },
  { id: "5", nome: "Bruno Ferreira", evento: "TOP #644 BC", data: "2025-11-15", status_conjugal: "solteiro", tem_filhos: false, score: 18, como_conheceu: "Instagram", lgpd: true },
];

export default function AlumniPage() {
  const totalAlumni = MOCK_SEGMENTOS.reduce((s, seg) => s + seg.count, 0);
  const ltvTotal = MOCK_SEGMENTOS.reduce((s, seg) => s + seg.count * seg.ltv, 0);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Alumni / CRM</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Gestão de comunidade pós-evento · LGPD compliant
          </p>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Alumni Totais", value: formatNumber(totalAlumni), icon: Users, sub: "base ativa" },
          { label: "LTV Potencial", value: `R$ ${(ltvTotal / 1000).toFixed(0)}K`, icon: TrendingUp, sub: "cross-sell total" },
          { label: "Casados", value: "60%", icon: Heart, sub: "candidatos REM" },
          { label: "Com Filhos", value: "40%", icon: Baby, sub: "candidatos LEGADO" },
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-5">
          {/* Segments */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Segmentos CRM
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MOCK_SEGMENTOS.map((seg) => (
                <div
                  key={seg.id}
                  className={`rounded-xl border p-4 ${seg.cor} card-hover`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-bold">{seg.nome}</p>
                      <p className="text-[10px] opacity-75 mt-0.5">{seg.descricao}</p>
                    </div>
                    <span className="text-lg font-bold">{seg.count}</span>
                  </div>

                  <div className="space-y-1.5 mt-3">
                    <div className="flex items-center justify-between text-[10px]">
                      <span>Score médio</span>
                      <span className="font-semibold">{seg.score_medio}/50</span>
                    </div>
                    <Progress
                      value={(seg.score_medio / 50) * 100}
                      className="h-1 bg-current/10"
                      indicatorClassName="bg-current opacity-60"
                    />
                  </div>

                  <div className="mt-3 pt-2 border-t border-current/20">
                    <p className="text-[10px] font-medium mb-1">Cross-sell:</p>
                    <div className="flex flex-wrap gap-1">
                      {seg.cross_sell.map((cs) => (
                        <span
                          key={cs}
                          className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-current/10 border border-current/20"
                        >
                          {cs}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-[10px] font-semibold mt-2 opacity-75">
                    LTV potencial: R$ {seg.ltv.toLocaleString("pt-BR")} / alumni
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Alumni table */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Alumni Recentes
            </h3>
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left py-2.5 px-4 text-muted-foreground font-medium">Nome</th>
                    <th className="text-left py-2.5 px-3 text-muted-foreground font-medium hidden sm:table-cell">Evento</th>
                    <th className="text-center py-2.5 px-3 text-muted-foreground font-medium">Perfil</th>
                    <th className="text-center py-2.5 px-3 text-muted-foreground font-medium">Score</th>
                    <th className="text-center py-2.5 px-3 text-muted-foreground font-medium">LGPD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {MOCK_PARTICIPANTES.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-2.5 px-4 font-medium text-foreground">{p.nome}</td>
                      <td className="py-2.5 px-3 text-muted-foreground hidden sm:table-cell">
                        {p.evento}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {p.status_conjugal === "casado" && (
                            <Heart className="h-3 w-3 text-pink-400" />
                          )}
                          {p.tem_filhos && (
                            <Baby className="h-3 w-3 text-blue-400" />
                          )}
                          {!p.status_conjugal && !p.tem_filhos && "—"}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="h-3 w-3 text-primary" />
                          <span className="font-semibold text-foreground">{p.score}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {p.lgpd ? (
                          <Badge variant="success" className="text-[9px]">Opt-in</Badge>
                        ) : (
                          <Badge variant="destructive" className="text-[9px]">Sem consentimento</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Post-event sequence */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Sequência Pós-Evento (D+0 → D+90)
            </h3>
            <div className="relative">
              <div className="absolute left-3.5 top-0 bottom-0 w-px bg-border" />
              <div className="space-y-4">
                {[
                  { fase: "D+0", nome: "Chama Viva", cor: "bg-success", desc: "3 mensagens WhatsApp (gratidão, depoimento, próximos passos)" },
                  { fase: "D+3", nome: "Reconhecimento", cor: "bg-primary", desc: "Certificado digital + call para RPM mensal" },
                  { fase: "D+14", nome: "Cross-sell REM", cor: "bg-blue-500", desc: "Convite REM para casados + oferta especial alumni" },
                  { fase: "D+30", nome: "Cross-sell LEGADO", cor: "bg-purple-500", desc: "Convite LEGADO para pais + depoimento para próxima campanha" },
                  { fase: "D+60", nome: "Embaixador", cor: "bg-warning", desc: "Programa 'Traga um Legendário' + UTM de indicação pessoal" },
                  { fase: "D+90", nome: "Reativação", cor: "bg-muted-foreground", desc: "Próximo TOP da região ou RPM especial" },
                ].map((etapa) => (
                  <div key={etapa.fase} className="flex gap-4 ml-7">
                    <div className={`absolute left-2.5 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full ${etapa.cor}`} style={{ marginTop: "2px" }}>
                      <span className="text-[8px] font-bold text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-bold text-muted-foreground">{etapa.fase}</span>
                        <span className="text-xs font-semibold text-foreground">{etapa.nome}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">{etapa.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">IA Comunidade</h3>
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
