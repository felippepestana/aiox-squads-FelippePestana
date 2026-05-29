"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RISK_LABELS, type RiskLevel } from "@/lib/triage";
import {
  Users, UserCheck, AlertCircle, Heart, Activity,
  Clock, CheckCircle, RefreshCw, Plus, X,
} from "lucide-react";

const TIPO_LABEL: Record<string, string> = {
  predica: "Prédica",
  hidratacao: "Hidratação",
  acampamento: "Acampamento",
  checkpoint: "Checkpoint",
  chegada: "Chegada",
  saida: "Saída",
  outro: "Outro",
};

const TIPO_COLOR: Record<string, string> = {
  predica: "bg-purple-100 text-purple-800",
  hidratacao: "bg-blue-100 text-blue-800",
  acampamento: "bg-orange-100 text-orange-800",
  checkpoint: "bg-gray-100 text-gray-700",
  chegada: "bg-green-100 text-green-800",
  saida: "bg-red-100 text-red-800",
  outro: "bg-gray-100 text-gray-700",
};

interface Stats {
  total: number;
  presente: number;
  ausente: number;
  risco_alto: number;
  risco_alto_presente: number;
  aprovados: number;
  pendentes: number;
  mensagens_nao_lidas: number;
}

interface Senderista {
  id: string;
  nome: string;
  classificacao_risco: string;
  status: string;
  status_presenca: string;
  tipo_participante: string;
  cidade: string | null;
  telefone: string;
  tamanho_camisa: string | null;
  codigo_ingresso: string | null;
}

interface Atividade {
  id: string;
  nome: string;
  tipo: string;
  descricao: string | null;
  hora_planejada: string | null;
  hora_real: string | null;
  evento_nome: string | null;
}

interface DashboardData {
  stats: Stats;
  senderistas: Senderista[];
  atividades: Atividade[];
}

type Tab = "geral" | "presenca" | "atividades";

function fmtTime(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export default function EventoDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("geral");
  const [presencaFilter, setPresencaFilter] = useState<"todos" | "presente" | "ausente">("todos");
  const [riscoFilter, setRiscoFilter] = useState<string>("");
  const [searchQ, setSearchQ] = useState("");
  const [showAddAtiv, setShowAddAtiv] = useState(false);
  const [newAtiv, setNewAtiv] = useState({ nome: "", tipo: "checkpoint", hora_planejada: "" });
  const [savingAtiv, setSavingAtiv] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetch72h = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/evento");
      if (res.ok) {
        setData(await res.json());
        setLastRefresh(new Date());
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch72h();
    const interval = setInterval(fetch72h, 30_000);
    return () => clearInterval(interval);
  }, [fetch72h]);

  async function marcarRealizado(id: string) {
    await fetch("/api/admin/evento", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, nome: "", tipo: "outro", hora_real: new Date().toISOString() }),
    });
    fetch72h();
  }

  async function addAtividade() {
    setSavingAtiv(true);
    try {
      const res = await fetch("/api/admin/evento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: newAtiv.nome,
          tipo: newAtiv.tipo,
          hora_planejada: newAtiv.hora_planejada || null,
        }),
      });
      if (res.ok) {
        setShowAddAtiv(false);
        setNewAtiv({ nome: "", tipo: "checkpoint", hora_planejada: "" });
        fetch72h();
      }
    } finally {
      setSavingAtiv(false);
    }
  }

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        Carregando dashboard...
      </div>
    );
  }

  const { stats, senderistas, atividades } = data;
  const presencaPercent = stats.total > 0 ? Math.round((stats.presente / stats.total) * 100) : 0;

  const filteredParticipants = senderistas.filter(s => {
    if (presencaFilter !== "todos" && s.status_presenca !== presencaFilter) return false;
    if (riscoFilter && s.classificacao_risco !== riscoFilter) return false;
    if (searchQ && !s.nome.toLowerCase().includes(searchQ.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Controle do Evento</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Atualizado: {lastRefresh.toLocaleTimeString("pt-BR")} · auto-refresh 30s
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={fetch72h}>
          <RefreshCw className="w-3 h-3 mr-1" /> Atualizar
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-gray-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground mt-1">Total inscritos</p>
              </div>
              <Users className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className={`${stats.presente > 0 ? "bg-green-50 border-green-200" : ""}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-green-700">{stats.presente}</p>
                <p className="text-xs text-muted-foreground mt-1">Presentes ({presencaPercent}%)</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className={`${stats.risco_alto_presente > 0 ? "bg-red-50 border-red-200" : ""}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-red-700">{stats.risco_alto_presente}</p>
                <p className="text-xs text-muted-foreground mt-1">Risco alto presentes</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className={`${stats.mensagens_nao_lidas > 0 ? "bg-amber-50 border-amber-200" : ""}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-amber-700">{stats.mensagens_nao_lidas}</p>
                <p className="text-xs text-muted-foreground mt-1">Msgs não lidas</p>
              </div>
              <Heart className="w-8 h-8 text-amber-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Presence bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{stats.presente} presentes</span>
          <span>{stats.ausente} aguardando</span>
        </div>
        <div className="h-3 rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-500"
            style={{ width: `${presencaPercent}%` }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b">
        {(["geral", "presenca", "atividades"] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === t ? "border-green-600 text-green-700" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "geral" ? "Geral" : t === "presenca" ? "Presença" : "Atividades"}
          </button>
        ))}
      </div>

      {/* Tab: Geral */}
      {tab === "geral" && (
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Por risco</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {(["alto", "moderado", "baixo"] as RiskLevel[]).map(r => {
                const count = senderistas.filter(s => s.classificacao_risco === r).length;
                const present = senderistas.filter(s => s.classificacao_risco === r && s.status_presenca === "presente").length;
                return (
                  <div key={r} className="flex items-center justify-between text-sm">
                    <Badge variant={r}>{RISK_LABELS[r]}</Badge>
                    <span className="text-muted-foreground">
                      {present}/{count} presentes
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">Status médico</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Aprovados</span>
                <strong className="text-green-700">{stats.aprovados}</strong>
              </div>
              <div className="flex justify-between">
                <span>Pendentes / exames</span>
                <strong className="text-amber-700">{stats.pendentes}</strong>
              </div>
              <div className="flex justify-between">
                <span>Risco alto total</span>
                <strong className="text-red-700">{stats.risco_alto}</strong>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab: Presença */}
      {tab === "presenca" && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Input
              placeholder="Buscar por nome..."
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              className="flex-1 min-w-40 h-8 text-sm"
            />
            <select
              value={presencaFilter}
              onChange={e => setPresencaFilter(e.target.value as "todos" | "presente" | "ausente")}
              className="h-8 text-sm border rounded px-2"
            >
              <option value="todos">Todos</option>
              <option value="presente">Presentes</option>
              <option value="ausente">Ausentes</option>
            </select>
            <select
              value={riscoFilter}
              onChange={e => setRiscoFilter(e.target.value)}
              className="h-8 text-sm border rounded px-2"
            >
              <option value="">Todos riscos</option>
              <option value="alto">Risco Alto</option>
              <option value="moderado">Moderado</option>
              <option value="baixo">Baixo</option>
            </select>
          </div>

          <p className="text-xs text-muted-foreground">{filteredParticipants.length} participante(s)</p>

          <div className="space-y-1 max-h-[60vh] overflow-y-auto">
            {filteredParticipants.map(s => (
              <div key={s.id} className="flex items-center justify-between border rounded px-3 py-2 text-sm hover:bg-gray-50">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{s.nome}</p>
                  <p className="text-xs text-muted-foreground">{s.cidade ?? ""} {s.tamanho_camisa ? `· ${s.tamanho_camisa}` : ""}</p>
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <Badge variant={s.classificacao_risco as RiskLevel} className="text-xs">
                    {RISK_LABELS[s.classificacao_risco as RiskLevel]}
                  </Badge>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                    s.status_presenca === "presente"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {s.status_presenca === "presente" ? "✓" : "—"}
                  </span>
                </div>
              </div>
            ))}
            {filteredParticipants.length === 0 && (
              <p className="text-center text-muted-foreground py-8 text-sm">Nenhum participante encontrado</p>
            )}
          </div>
        </div>
      )}

      {/* Tab: Atividades */}
      {tab === "atividades" && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">{atividades.length} atividade(s) planejada(s)</p>
            <Button size="sm" onClick={() => setShowAddAtiv(!showAddAtiv)}>
              {showAddAtiv ? <X className="w-4 h-4" /> : <><Plus className="w-4 h-4 mr-1" /> Nova</>}
            </Button>
          </div>

          {showAddAtiv && (
            <Card className="border-green-200">
              <CardContent className="pt-4 space-y-3">
                <Input
                  placeholder="Nome da atividade"
                  value={newAtiv.nome}
                  onChange={e => setNewAtiv(p => ({ ...p, nome: e.target.value }))}
                />
                <div className="grid grid-cols-2 gap-2">
                  <select
                    className="h-9 text-sm border rounded px-2 w-full"
                    value={newAtiv.tipo}
                    onChange={e => setNewAtiv(p => ({ ...p, tipo: e.target.value }))}
                  >
                    {Object.entries(TIPO_LABEL).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                  <Input
                    type="datetime-local"
                    className="text-sm h-9"
                    value={newAtiv.hora_planejada}
                    onChange={e => setNewAtiv(p => ({ ...p, hora_planejada: e.target.value }))}
                  />
                </div>
                <Button
                  size="sm"
                  className="w-full"
                  disabled={!newAtiv.nome || savingAtiv}
                  onClick={addAtividade}
                >
                  {savingAtiv ? "Salvando..." : "Adicionar atividade"}
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="space-y-2">
            {atividades.length === 0 && (
              <p className="text-center text-muted-foreground py-8 text-sm">
                Nenhuma atividade cadastrada. Adicione a programação do evento.
              </p>
            )}
            {atividades.map(a => (
              <div key={a.id} className="flex items-center gap-3 border rounded-lg p-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TIPO_COLOR[a.tipo] ?? "bg-gray-100"}`}>
                      {TIPO_LABEL[a.tipo] ?? a.tipo}
                    </span>
                    <span className="font-medium text-sm">{a.nome}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Planejado: {fmtTime(a.hora_planejada)}
                    </span>
                    {a.hora_real && (
                      <span className="flex items-center gap-1 text-green-700">
                        <CheckCircle className="w-3 h-3" />
                        Realizado: {fmtTime(a.hora_real)}
                      </span>
                    )}
                  </div>
                </div>
                {!a.hora_real && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={() => marcarRealizado(a.id)}
                  >
                    <Activity className="w-3 h-3 mr-1" /> Realizado
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
