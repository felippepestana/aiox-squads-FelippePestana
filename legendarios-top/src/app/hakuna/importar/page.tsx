"use client";

import { useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, CheckCircle, AlertCircle, FileSpreadsheet, X, MessageSquare } from "lucide-react";

interface ImportResult {
  imported: number;
  updated: number;
  skipped: number;
  errors: string[];
}

export default function ImportarPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [fatalError, setFatalError] = useState<string | null>(null);
  const [waSending, setWaSending] = useState(false);
  const [waResult, setWaResult] = useState<{ sent: number; failed: number; total: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  function handleFile(f: File | null) {
    if (!f) return;
    const ext = f.name.split(".").pop()?.toLowerCase();
    if (ext !== "xlsx" && ext !== "xls") {
      setFatalError("Somente arquivos .xlsx ou .xls são aceitos.");
      return;
    }
    setFile(f);
    setResult(null);
    setFatalError(null);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0] ?? null);
  }

  async function submit() {
    if (!file) return;
    setLoading(true);
    setFatalError(null);
    setResult(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/importar-ticketgo", { method: "POST", body: fd });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Erro na importação");
      setResult(body);
    } catch (e) {
      setFatalError(e instanceof Error ? e.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  async function sendWhatsApp() {
    setWaSending(true);
    try {
      const res = await fetch("/api/admin/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "batch_mensagens_links" }),
      });
      const body = await res.json();
      setWaResult(body);
    } finally {
      setWaSending(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Importar Planilha TICKETGO</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Importe participantes diretamente da planilha exportada pelo TICKETGO (.xlsx).
          Registros existentes (mesmo CPF) serão atualizados automaticamente.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Arquivo TICKETGO</CardTitle>
          <CardDescription>
            Exporte a planilha no TICKETGO em formato .xlsx e arraste aqui ou clique para selecionar.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Drop zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              dragging ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-green-400 hover:bg-gray-50"
            }`}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
          >
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <FileSpreadsheet className="w-8 h-8 text-green-600" />
                <div className="text-left">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); setFile(null); setResult(null); }}
                  className="ml-2 text-gray-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Upload className="w-10 h-10" />
                <p className="text-sm">Arraste o arquivo .xlsx aqui ou clique para selecionar</p>
              </div>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={e => handleFile(e.target.files?.[0] ?? null)}
          />

          {fatalError && (
            <div className="flex items-start gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              {fatalError}
            </div>
          )}

          <Button
            className="w-full"
            disabled={!file || loading}
            onClick={submit}
          >
            {loading ? "Importando..." : "Importar participantes"}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <CardTitle>Resultado da Importação</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                <p className="text-3xl font-bold text-green-700">{result.imported}</p>
                <p className="text-sm text-green-600 mt-1">Importados / Atualizados</p>
              </div>
              <div className="rounded-lg bg-gray-50 border p-4">
                <p className="text-3xl font-bold text-gray-700">{result.skipped}</p>
                <p className="text-sm text-muted-foreground mt-1">Ignorados</p>
              </div>
              <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                <p className="text-3xl font-bold text-red-700">{result.errors.length}</p>
                <p className="text-sm text-red-600 mt-1">Erros</p>
              </div>
            </div>

            {result.errors.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-red-700">Detalhes dos erros:</p>
                <ul className="space-y-1 max-h-40 overflow-y-auto">
                  {result.errors.map((e, i) => (
                    <li key={i} className="text-xs text-red-600 flex gap-1">
                      <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              Participantes importados estão disponíveis no painel principal.
              A triagem médica foi calculada automaticamente com base em idade e comorbidades declaradas.
            </p>

            {/* WhatsApp batch send */}
            <div className="border rounded-lg p-4 bg-green-50 border-green-200 space-y-3">
              <p className="text-sm font-medium text-green-900">
                Enviar link de mensagens via WhatsApp
              </p>
              <p className="text-xs text-green-700">
                Envia automaticamente o link do portal de mensagens para o WhatsApp de cada cônjuge/responsável cadastrado.
              </p>
              {waResult ? (
                <p className="text-sm text-green-800 font-medium">
                  ✓ {waResult.sent} enviados · {waResult.failed} falhas de {waResult.total} total
                </p>
              ) : (
                <Button
                  size="sm"
                  className="bg-green-700 hover:bg-green-800"
                  disabled={waSending}
                  onClick={sendWhatsApp}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {waSending ? "Enviando..." : "Enviar WhatsApp para cônjuges"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Field mapping reference */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Mapeamento de colunas TICKETGO → Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-1 pr-4">Coluna TICKETGO</th>
                  <th className="text-left py-1">Campo no sistema</th>
                </tr>
              </thead>
              <tbody className="divide-y text-muted-foreground">
                {[
                  ["Nome", "nome"],
                  ["Cpf", "cpf (normalizado 11 dígitos)"],
                  ["Email", "email"],
                  ["Telefone", "telefone"],
                  ["Nascimento", "data_nascimento"],
                  ["Peso / Altura", "peso_kg / altura_cm → IMC calculado"],
                  ["Cond. médica? + Cond. detalhada", "comorbidades → classificacao_risco calculado"],
                  ["Uso medicamento? + Medicamento", "uso_medicamento / medicamentos"],
                  ["Igreja", "igreja"],
                  ["Nome / WhatsApp / E-mail Esposa", "nome_conjuge / whatsapp_conjuge / email_conjuge"],
                  ["Restrição alim.", "restricao_alimentar"],
                  ["Tamanho", "tamanho_camisa"],
                  ["Cond. físico (1-5)", "cond_fisica_autorelatada"],
                  ["Estado / Cidade", "estado / cidade"],
                  ["Código (Codigo)", "codigo_ingresso"],
                  ["# (ID TICKETGO)", "ticketgo_id"],
                ].map(([orig, dest]) => (
                  <tr key={orig}>
                    <td className="py-1 pr-4 font-mono">{orig}</td>
                    <td className="py-1">{dest}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
