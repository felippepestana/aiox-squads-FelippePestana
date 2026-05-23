"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { readNFCTag, isNFCSupported, type NFCTagData } from "@/lib/nfc";
import { saveProntuarioOffline, getPendingProntuarios, markProntuarioSynced } from "@/lib/offline-db";
import { RISK_LABELS, type RiskLevel } from "@/lib/triage";
import {
  Wifi, WifiOff, Nfc, AlertCircle, ChevronLeft,
  Camera, Save, RefreshCw
} from "lucide-react";

type Screen = "home" | "reading" | "profile" | "prontuario" | "syncing";

const RISK_BG: Record<string, string> = {
  baixo: "bg-green-50 border-green-200",
  moderado: "bg-amber-50 border-amber-200",
  alto: "bg-red-50 border-red-200",
};

export default function CampoApp() {
  const [screen, setScreen] = useState<Screen>("home");
  const [participant, setParticipant] = useState<NFCTagData | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [nfcError, setNfcError] = useState<string | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [hakuna, setHakuna] = useState("");

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  useEffect(() => {
    getPendingProntuarios().then((p) => setPendingCount(p.length));
  }, [screen]);

  async function startNFCRead() {
    setScreen("reading");
    setNfcError(null);
    try {
      const data = await readNFCTag();
      setParticipant(data);
      setScreen("profile");
    } catch (e) {
      setNfcError(e instanceof Error ? e.message : "Erro ao ler TAG");
      setScreen("home");
    }
  }

  async function syncProntuarios() {
    if (!isOnline) return;
    setSyncing(true);
    try {
      const pending = await getPendingProntuarios();
      for (const p of pending) {
        // Convert base64 photos to URLs via Supabase Storage
        const fotos_urls: string[] = [];
        for (const base64 of p.fotos_base64) {
          const blob = await (await fetch(base64)).blob();
          const formData = new FormData();
          formData.append("file", blob, `foto-${Date.now()}.jpg`);
          formData.append("prontuario_id", p.id);
          formData.append("senderista_id", p.senderista_id);
          const res = await fetch("/api/prontuarios/foto", { method: "POST", body: formData });
          if (res.ok) {
            const { url } = await res.json();
            fotos_urls.push(url);
          }
        }

        const res = await fetch("/api/prontuarios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: p.id,
            senderista_id: p.senderista_id,
            queixas: p.queixas,
            condutas: p.condutas,
            fotos_urls,
            created_at: p.created_at,
          }),
        });
        if (res.ok) await markProntuarioSynced(p.id);
      }
      setPendingCount(0);
    } catch (e) {
      console.error("Sync error:", e);
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-sm">
        <span className="font-bold text-green-400">Legendários Campo</span>
        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <button onClick={syncProntuarios} disabled={syncing || !isOnline} className="flex items-center gap-1 text-amber-400">
              <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
              {pendingCount} pendente(s)
            </button>
          )}
          {isOnline ? (
            <span className="flex items-center gap-1 text-green-400"><Wifi className="w-4 h-4" /> Online</span>
          ) : (
            <span className="flex items-center gap-1 text-gray-400"><WifiOff className="w-4 h-4" /> Offline</span>
          )}
        </div>
      </div>

      <div className="p-4">
        {/* Home */}
        {screen === "home" && (
          <div className="space-y-4 mt-8">
            <div className="text-center mb-8">
              <Nfc className="w-16 h-16 mx-auto text-green-400 mb-3" />
              <h1 className="text-2xl font-bold">App de Campo</h1>
              <p className="text-gray-400 text-sm mt-1">Leitura NFC e prontuário offline</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Seu nome (Hakuna)</label>
              <input
                value={hakuna}
                onChange={(e) => setHakuna(e.target.value)}
                placeholder="Ex: Dr. João"
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>

            {nfcError && (
              <div className="flex items-center gap-2 bg-red-900 rounded p-3 text-sm">
                <AlertCircle className="w-4 h-4 text-red-400" />
                {nfcError}
              </div>
            )}

            {!isNFCSupported() ? (
              <div className="bg-amber-900 rounded p-4 text-sm">
                <p className="font-medium text-amber-300">NFC não disponível</p>
                <p className="text-amber-400 mt-1">Abra esta página no Chrome para Android.</p>
              </div>
            ) : (
              <Button
                onClick={startNFCRead}
                className="w-full h-16 text-lg bg-green-600 hover:bg-green-700"
              >
                <Nfc className="w-6 h-6 mr-2" />
                Aproximar TAG NFC
              </Button>
            )}

            {isOnline && pendingCount > 0 && (
              <Button
                onClick={syncProntuarios}
                disabled={syncing}
                variant="outline"
                className="w-full border-gray-600 text-gray-300"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
                Sincronizar {pendingCount} prontuário(s) offline
              </Button>
            )}
          </div>
        )}

        {/* Reading NFC */}
        {screen === "reading" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
            <Nfc className="w-24 h-24 text-green-400 animate-pulse" />
            <h2 className="text-xl font-bold">Aguardando TAG...</h2>
            <p className="text-gray-400">Aproxime a TAG NFC do participante ao celular</p>
            <Button variant="outline" onClick={() => setScreen("home")} className="border-gray-600 text-gray-300">
              Cancelar
            </Button>
          </div>
        )}

        {/* Participant profile */}
        {screen === "profile" && participant && (
          <ParticipantProfile
            participant={participant}
            onBack={() => setScreen("home")}
            onProntuario={() => setScreen("prontuario")}
          />
        )}

        {/* Prontuário form */}
        {screen === "prontuario" && participant && (
          <ProntuarioForm
            participant={participant}
            hakuna={hakuna}
            onBack={() => setScreen("profile")}
            onSaved={() => { setScreen("home"); getPendingProntuarios().then((p) => setPendingCount(p.length)); }}
          />
        )}
      </div>
    </div>
  );
}

function ParticipantProfile({
  participant,
  onBack,
  onProntuario,
}: {
  participant: NFCTagData;
  onBack: () => void;
  onProntuario: () => void;
}) {
  const riskBg = RISK_BG[participant.risco] ?? "bg-gray-800 border-gray-600";

  return (
    <div className="space-y-4">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-400">
        <ChevronLeft className="w-4 h-4" /> Voltar
      </button>

      <div className={`rounded-lg border p-4 ${riskBg} text-gray-900`}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold">{participant.nome}</h2>
          <Badge variant={participant.risco as RiskLevel}>
            {RISK_LABELS[participant.risco as RiskLevel]}
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-gray-500">Tipo sanguíneo</p>
            <p className="font-medium">{participant.sanguineo ?? "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-500">IMC</p>
            <p className="font-medium">{participant.imc ?? "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-500">Peso / Altura</p>
            <p className="font-medium">{participant.peso ?? "?"} kg / {participant.altura ?? "?"} cm</p>
          </div>
          <div>
            <p className="text-gray-500">Plano de saúde</p>
            <p className="font-medium">{participant.plano ?? "Não"}</p>
          </div>
        </div>
        {participant.comorbidades?.length > 0 && (
          <div className="mt-3">
            <p className="text-gray-500 text-sm">Comorbidades</p>
            <p className="text-sm font-medium">{participant.comorbidades.join(", ")}</p>
          </div>
        )}
        <div className="mt-3">
          <p className="text-gray-500 text-sm">Status</p>
          <p className="text-sm font-medium capitalize">{participant.status}</p>
        </div>
      </div>

      <Button onClick={onProntuario} className="w-full h-12 bg-green-600 hover:bg-green-700">
        Abrir Prontuário
      </Button>
    </div>
  );
}

function ProntuarioForm({
  participant,
  hakuna,
  onBack,
  onSaved,
}: {
  participant: NFCTagData;
  hakuna: string;
  onBack: () => void;
  onSaved: () => void;
}) {
  const [queixas, setQueixas] = useState("");
  const [condutas, setCondutas] = useState("");
  const [fotos, setFotos] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) setFotos((p) => [...p, ev.target!.result as string]);
    };
    reader.readAsDataURL(file);
  }

  async function save() {
    setSaving(true);
    await saveProntuarioOffline({
      senderista_id: participant.id,
      hakuna_email: hakuna,
      queixas,
      condutas,
      fotos_base64: fotos,
    });
    setSaving(false);
    onSaved();
  }

  return (
    <div className="space-y-4">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-400">
        <ChevronLeft className="w-4 h-4" /> Voltar
      </button>

      <h2 className="text-lg font-bold">Prontuário — {participant.nome}</h2>

      <div className="space-y-2">
        <label className="text-sm text-gray-400">Queixas</label>
        <textarea
          value={queixas}
          onChange={(e) => setQueixas(e.target.value)}
          placeholder="Descreva as queixas do participante..."
          className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white min-h-[100px] text-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-gray-400">Condutas</label>
        <textarea
          value={condutas}
          onChange={(e) => setCondutas(e.target.value)}
          placeholder="Descreva as condutas adotadas..."
          className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white min-h-[100px] text-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-gray-400">Fotos ({fotos.length})</label>
        <label className="flex items-center gap-2 cursor-pointer bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm">
          <Camera className="w-4 h-4 text-gray-400" />
          <span className="text-gray-400">Adicionar foto</span>
          <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhoto} />
        </label>
        {fotos.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {fotos.map((f, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={f} alt={`Foto ${i + 1}`} className="w-16 h-16 object-cover rounded" />
            ))}
          </div>
        )}
      </div>

      <Button onClick={save} disabled={saving || (!queixas && !condutas)} className="w-full h-12 bg-green-600">
        <Save className="w-4 h-4 mr-2" />
        {saving ? "Salvando..." : "Salvar prontuário (offline)"}
      </Button>
    </div>
  );
}
