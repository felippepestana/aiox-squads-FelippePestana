"use client";

import { useCallback, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RISK_LABELS, type RiskLevel } from "@/lib/triage";
import { isNFCSupported, readNFCTag, writeNFCTag } from "@/lib/nfc";
import {
  Search, Wifi, CheckCircle, AlertCircle, User, Nfc,
  Tag, ChevronLeft, RefreshCw,
} from "lucide-react";

const RISCO_COLOR: Record<string, string> = {
  baixo: "border-green-400 bg-green-50",
  moderado: "border-amber-400 bg-amber-50",
  alto: "border-red-400 bg-red-50",
};

const PRESENCA_LABEL: Record<string, string> = {
  ausente: "Ausente",
  presente: "Presente",
  compra_cancelada: "Cancelado",
};

interface Participant {
  id: string;
  nome: string;
  cpf: string | null;
  telefone: string;
  classificacao_risco: string;
  status: string;
  status_presenca: string;
  status_ingresso: string;
  tipo_participante: string;
  igreja: string | null;
  cidade: string | null;
  tamanho_camisa: string | null;
  codigo_ingresso: string | null;
  mensagens_token: string;
}

type Screen = "search" | "nfc" | "card" | "done";

export default function CheckinPage() {
  const [screen, setScreen] = useState<Screen>("search");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Participant[]>([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<Participant | null>(null);
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [nfcReading, setNfcReading] = useState(false);
  const [nfcWriting, setNfcWriting] = useState(false);
  const [nfcStatus, setNfcStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const nfcAbortRef = useRef<AbortController | null>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); return; }
    setSearching(true);
    try {
      const res = await fetch(`/api/admin/checkin?q=${encodeURIComponent(q)}`);
      const body = await res.json();
      setResults(body.results ?? []);
    } finally {
      setSearching(false);
    }
  }, []);

  function onQueryChange(val: string) {
    setQuery(val);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => search(val), 350);
  }

  function selectParticipant(p: Participant) {
    setSelected(p);
    setScreen("card");
    setError(null);
    setNfcStatus(null);
  }

  async function startNFCRead() {
    if (!isNFCSupported()) { setError("NFC não disponível neste dispositivo"); return; }
    nfcAbortRef.current?.abort();
    const ctrl = new AbortController();
    nfcAbortRef.current = ctrl;
    setNfcReading(true);
    setError(null);
    try {
      const tag = await readNFCTag(ctrl.signal);
      nfcAbortRef.current = null;
      setNfcReading(false);
      // Find participant by id from tag
      const res = await fetch(`/api/admin/checkin?q=${tag.id}`);
      const body = await res.json();
      const found: Participant | undefined = body.results?.[0];
      if (found && found.id === tag.id) {
        selectParticipant(found);
      } else {
        setError("TAG NFC não reconhecida. Tente buscar por nome.");
        setScreen("search");
      }
    } catch (e) {
      nfcAbortRef.current = null;
      setNfcReading(false);
      if (e instanceof Error && e.message !== "Cancelado") {
        setError(e.message);
      }
      setScreen("search");
    }
  }

  function cancelNFC() {
    nfcAbortRef.current?.abort();
    nfcAbortRef.current = null;
    setNfcReading(false);
    setScreen("search");
  }

  async function confirmCheckin() {
    if (!selected) return;
    setCheckinLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/checkin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderista_id: selected.id, status_presenca: "presente" }),
      });
      if (!res.ok) throw new Error("Erro ao registrar presença");
      setSelected(prev => prev ? { ...prev, status_presenca: "presente" } : prev);
      setScreen("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro desconhecido");
    } finally {
      setCheckinLoading(false);
    }
  }

  async function writeNFC() {
    if (!selected || !isNFCSupported()) return;
    setNfcWriting(true);
    setNfcStatus(null);
    try {
      await writeNFCTag({
        id: selected.id,
        nome: selected.nome,
        sanguineo: null,
        plano: null,
        risco: selected.classificacao_risco as RiskLevel,
        imc: null,
        peso: null,
        altura: null,
        comorbidades: [],
        status: selected.status,
        telefone: selected.telefone,
      });
      setNfcStatus("TAG gravada com sucesso!");
    } catch (e) {
      setNfcStatus(e instanceof Error ? e.message : "Erro ao gravar TAG");
    } finally {
      setNfcWriting(false);
    }
  }

  function reset() {
    setScreen("search");
    setQuery("");
    setResults([]);
    setSelected(null);
    setError(null);
    setNfcStatus(null);
  }

  const nfcAvailable = isNFCSupported();

  return (
    <div className="max-w-lg mx-auto space-y-4 py-4">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">Check-in</h1>
        {nfcAvailable && (
          <span className="flex items-center gap-1 text-xs text-green-700 bg-green-100 rounded px-2 py-0.5">
            <Wifi className="w-3 h-3" /> NFC disponível
          </span>
        )}
      </div>

      {/* Search screen */}
      {(screen === "search" || screen === "nfc") && (
        <div className="space-y-4">
          {/* NFC read button */}
          {nfcAvailable && (
            <Card className="border-green-200">
              <CardContent className="pt-4 pb-4">
                {nfcReading ? (
                  <div className="flex flex-col items-center gap-3 py-2">
                    <Nfc className="w-10 h-10 text-green-600 animate-pulse" />
                    <p className="text-sm font-medium">Aproxime a TAG NFC do celular...</p>
                    <Button variant="outline" size="sm" onClick={cancelNFC}>Cancelar</Button>
                  </div>
                ) : (
                  <Button className="w-full bg-green-700 hover:bg-green-800" onClick={startNFCRead}>
                    <Nfc className="w-4 h-4 mr-2" /> Ler TAG NFC
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Separator */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex-1 h-px bg-border" />
            {nfcAvailable ? "ou buscar por nome / CPF" : "Buscar por nome ou CPF"}
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Nome ou CPF..."
              value={query}
              onChange={e => onQueryChange(e.target.value)}
              autoFocus
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}

          {/* Results */}
          {searching && <p className="text-sm text-muted-foreground text-center">Buscando...</p>}
          {!searching && results.length > 0 && (
            <div className="space-y-2">
              {results.map(p => (
                <button
                  key={p.id}
                  onClick={() => selectParticipant(p)}
                  className="w-full text-left border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{p.nome}</p>
                      <p className="text-xs text-muted-foreground">{p.cidade ?? ""} · {p.tipo_participante}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant={p.classificacao_risco as RiskLevel} className="text-xs">
                        {RISK_LABELS[p.classificacao_risco as RiskLevel]}
                      </Badge>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        p.status_presenca === "presente"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {PRESENCA_LABEL[p.status_presenca] ?? p.status_presenca}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
          {!searching && query.length >= 2 && results.length === 0 && (
            <p className="text-sm text-muted-foreground text-center">Nenhum participante encontrado</p>
          )}
        </div>
      )}

      {/* Participant card + check-in */}
      {screen === "card" && selected && (
        <div className="space-y-4">
          <button onClick={() => setScreen("search")} className="flex items-center gap-1 text-sm text-muted-foreground">
            <ChevronLeft className="w-4 h-4" /> Voltar
          </button>

          <Card className={`border-2 ${RISCO_COLOR[selected.classificacao_risco] ?? ""}`}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{selected.nome}</CardTitle>
                  <p className="text-sm text-muted-foreground">{selected.telefone}</p>
                </div>
                <Badge variant={selected.classificacao_risco as RiskLevel}>
                  {RISK_LABELS[selected.classificacao_risco as RiskLevel]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              {selected.cpf && <p><strong>CPF:</strong> {selected.cpf}</p>}
              {selected.codigo_ingresso && <p><strong>Ingresso:</strong> {selected.codigo_ingresso}</p>}
              {selected.tipo_participante && <p><strong>Tipo:</strong> {selected.tipo_participante}</p>}
              {selected.cidade && <p><strong>Cidade:</strong> {selected.cidade}</p>}
              {selected.igreja && <p><strong>Igreja:</strong> {selected.igreja}</p>}
              {selected.tamanho_camisa && <p><strong>Tamanho:</strong> {selected.tamanho_camisa}</p>}
              <p>
                <strong>Presença: </strong>
                <span className={selected.status_presenca === "presente" ? "text-green-700 font-medium" : ""}>
                  {PRESENCA_LABEL[selected.status_presenca] ?? selected.status_presenca}
                </span>
              </p>
              {selected.status_ingresso === "cancelado" && (
                <p className="text-red-600 font-medium">⚠ Ingresso cancelado</p>
              )}
            </CardContent>
          </Card>

          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}

          {/* Check-in button */}
          {selected.status_presenca !== "presente" ? (
            <Button
              className="w-full bg-green-700 hover:bg-green-800 text-white"
              disabled={checkinLoading || selected.status_ingresso === "cancelado"}
              onClick={confirmCheckin}
            >
              <User className="w-4 h-4 mr-2" />
              {checkinLoading ? "Registrando..." : "Confirmar presença"}
            </Button>
          ) : (
            <div className="flex items-center justify-center gap-2 rounded-lg bg-green-50 border border-green-200 py-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-700 font-medium">Presença já confirmada</span>
            </div>
          )}

          {/* NFC write */}
          {nfcAvailable && (
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full"
                disabled={nfcWriting}
                onClick={writeNFC}
              >
                <Tag className="w-4 h-4 mr-2" />
                {nfcWriting ? "Aproxime a TAG..." : "Gravar TAG NFC"}
              </Button>
              {nfcStatus && (
                <p className={`text-sm text-center ${nfcStatus.includes("sucesso") ? "text-green-700" : "text-red-600"}`}>
                  {nfcStatus}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Done screen */}
      {screen === "done" && selected && (
        <div className="space-y-4">
          <Card className="border-green-300 bg-green-50">
            <CardContent className="py-8 text-center space-y-3">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
              <div>
                <p className="text-xl font-bold text-green-800">Check-in realizado!</p>
                <p className="text-sm text-green-700">{selected.nome}</p>
                {selected.tamanho_camisa && (
                  <p className="text-sm font-medium mt-1">Camiseta: <strong>{selected.tamanho_camisa}</strong></p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Offer NFC write after check-in */}
          {nfcAvailable && (
            <div className="space-y-2">
              <Button variant="outline" className="w-full" disabled={nfcWriting} onClick={writeNFC}>
                <Tag className="w-4 h-4 mr-2" />
                {nfcWriting ? "Aproxime a TAG..." : "Gravar TAG NFC agora"}
              </Button>
              {nfcStatus && (
                <p className={`text-sm text-center ${nfcStatus.includes("sucesso") ? "text-green-700" : "text-red-600"}`}>
                  {nfcStatus}
                </p>
              )}
            </div>
          )}

          <Button className="w-full" onClick={reset}>
            <RefreshCw className="w-4 h-4 mr-2" /> Próximo participante
          </Button>
        </div>
      )}
    </div>
  );
}
