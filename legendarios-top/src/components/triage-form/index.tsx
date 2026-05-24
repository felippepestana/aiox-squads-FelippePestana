"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  classificarRisco,
  calcularIMC,
  calcularIdade,
  COMORBIDADES_OPCOES,
  TIPOS_SANGUINEOS,
  EXAM_LABELS,
  RISK_LABELS,
  type RiskLevel,
} from "@/lib/triage";
import { CheckCircle, AlertCircle, AlertTriangle, ChevronRight, ChevronLeft } from "lucide-react";

const step1Schema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  telefone: z.string().min(10, "Telefone inválido").max(15),
  data_nascimento: z.string().min(1, "Data de nascimento obrigatória"),
});

const step2Schema = z.object({
  tipo_sanguineo: z.string().optional(),
  peso_kg: z.number({ coerce: true }).min(20).max(300),
  altura_cm: z.number({ coerce: true }).min(100).max(250),
  plano_saude: z.enum(["sim", "nao"]),
  qual_plano: z.string().optional(),
  comorbidades: z.array(z.string()).default([]),
});

const fullSchema = step1Schema.merge(step2Schema);
type FormData = z.infer<typeof fullSchema>;

const RISK_ICONS: Record<RiskLevel, React.ReactNode> = {
  baixo: <CheckCircle className="w-8 h-8 text-green-600" />,
  moderado: <AlertTriangle className="w-8 h-8 text-amber-600" />,
  alto: <AlertCircle className="w-8 h-8 text-red-600" />,
};

const RISK_COLORS: Record<RiskLevel, string> = {
  baixo: "border-green-200 bg-green-50",
  moderado: "border-amber-200 bg-amber-50",
  alto: "border-red-200 bg-red-50",
};

interface SubmitResult {
  uploadToken: string;
  senderista_id: string;
}

export default function TriageForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(fullSchema),
    defaultValues: {
      comorbidades: [],
      plano_saude: "nao",
    },
  });

  const watchedValues = form.watch();

  const preview = (() => {
    if (!watchedValues.data_nascimento || !watchedValues.peso_kg || !watchedValues.altura_cm) return null;
    try {
      return classificarRisco(watchedValues.data_nascimento, watchedValues.comorbidades ?? []);
    } catch {
      return null;
    }
  })();

  const imc = watchedValues.peso_kg && watchedValues.altura_cm
    ? calcularIMC(Number(watchedValues.peso_kg), Number(watchedValues.altura_cm))
    : null;

  const idade = watchedValues.data_nascimento
    ? calcularIdade(watchedValues.data_nascimento)
    : null;

  async function validateStep1() {
    const ok = await form.trigger(["nome", "telefone", "data_nascimento"]);
    if (ok) setStep(2);
  }

  async function onSubmit(data: FormData) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/triagem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Erro ao enviar triagem");
      }
      const body = await res.json();
      setResult(body);
      setStep(4);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  if (step === 4 && result) {
    return <SuccessScreen result={result} preview={preview} />;
  }

  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step > s ? "bg-green-600 text-white" : step === s ? "bg-green-700 text-white" : "bg-gray-200 text-gray-500"
            }`}>
              {step > s ? "✓" : s}
            </div>
            {s < 3 && <div className={`flex-1 h-1 ${step > s ? "bg-green-600" : "bg-gray-200"}`} />}
          </div>
        ))}
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Step 1 — Dados pessoais */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Dados Pessoais</CardTitle>
              <CardDescription>Informações básicas do participante</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome completo *</Label>
                <Input id="nome" placeholder="Seu nome completo" {...form.register("nome")} />
                {form.formState.errors.nome && (
                  <p className="text-sm text-destructive">{form.formState.errors.nome.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">WhatsApp *</Label>
                <Input id="telefone" placeholder="(11) 99999-9999" {...form.register("telefone")} />
                {form.formState.errors.telefone && (
                  <p className="text-sm text-destructive">{form.formState.errors.telefone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_nascimento">Data de nascimento *</Label>
                <Input id="data_nascimento" type="date" {...form.register("data_nascimento")} />
                {form.formState.errors.data_nascimento && (
                  <p className="text-sm text-destructive">{form.formState.errors.data_nascimento.message}</p>
                )}
                {idade !== null && (
                  <p className="text-sm text-muted-foreground">{idade} anos</p>
                )}
              </div>

              <Button type="button" onClick={validateStep1} className="w-full">
                Próximo <ChevronRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2 — Dados de saúde */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Dados de Saúde</CardTitle>
              <CardDescription>Informações para avaliação de risco</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="peso_kg">Peso (kg) *</Label>
                  <Input id="peso_kg" type="number" step="0.1" placeholder="70" {...form.register("peso_kg", { valueAsNumber: true })} />
                  {form.formState.errors.peso_kg && (
                    <p className="text-sm text-destructive">{form.formState.errors.peso_kg.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="altura_cm">Altura (cm) *</Label>
                  <Input id="altura_cm" type="number" placeholder="170" {...form.register("altura_cm", { valueAsNumber: true })} />
                  {form.formState.errors.altura_cm && (
                    <p className="text-sm text-destructive">{form.formState.errors.altura_cm.message}</p>
                  )}
                </div>
              </div>

              {imc && (
                <p className="text-sm text-muted-foreground">IMC calculado: <strong>{imc}</strong></p>
              )}

              <div className="space-y-2">
                <Label htmlFor="tipo_sanguineo">Tipo sanguíneo</Label>
                <select
                  id="tipo_sanguineo"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  {...form.register("tipo_sanguineo")}
                >
                  <option value="">Não sei / prefiro não informar</option>
                  {TIPOS_SANGUINEOS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Plano de saúde? *</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="sim" {...form.register("plano_saude")} />
                    Sim
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="nao" {...form.register("plano_saude")} />
                    Não
                  </label>
                </div>
              </div>

              {form.watch("plano_saude") === "sim" && (
                <div className="space-y-2">
                  <Label htmlFor="qual_plano">Qual plano?</Label>
                  <Input id="qual_plano" placeholder="Ex: Unimed, Bradesco, etc." {...form.register("qual_plano")} />
                </div>
              )}

              <div className="space-y-2">
                <Label>Comorbidades (marque todas que se aplicam)</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto p-2 border rounded-md">
                  {COMORBIDADES_OPCOES.map((c) => (
                    <label key={c.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value={c.value}
                        {...form.register("comorbidades")}
                      />
                      <span className="text-sm">{c.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                  <ChevronLeft className="w-4 h-4" /> Voltar
                </Button>
                <Button
                  type="button"
                  onClick={async () => {
                    const ok = await form.trigger(["peso_kg", "altura_cm", "plano_saude", "comorbidades"]);
                    if (ok) setStep(3);
                  }}
                  className="flex-1"
                >
                  Revisar <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3 — Revisão */}
        {step === 3 && preview && (
          <Card>
            <CardHeader>
              <CardTitle>Revisão da Triagem</CardTitle>
              <CardDescription>Confirme seus dados antes de enviar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1 text-sm">
                <p><strong>Nome:</strong> {watchedValues.nome}</p>
                <p><strong>WhatsApp:</strong> {watchedValues.telefone}</p>
                <p><strong>Data nasc.:</strong> {watchedValues.data_nascimento} ({idade} anos)</p>
                <p><strong>Peso:</strong> {watchedValues.peso_kg} kg | <strong>Altura:</strong> {watchedValues.altura_cm} cm | <strong>IMC:</strong> {imc}</p>
                {watchedValues.tipo_sanguineo && <p><strong>Tipo sanguíneo:</strong> {watchedValues.tipo_sanguineo}</p>}
                <p><strong>Plano de saúde:</strong> {watchedValues.plano_saude === "sim" ? `Sim — ${watchedValues.qual_plano ?? ""}` : "Não"}</p>
                {watchedValues.comorbidades?.length > 0 && (
                  <p><strong>Comorbidades:</strong> {watchedValues.comorbidades.join(", ")}</p>
                )}
              </div>

              <div className={`rounded-lg border p-4 ${RISK_COLORS[preview.risco]}`}>
                <div className="flex items-center gap-3 mb-3">
                  {RISK_ICONS[preview.risco]}
                  <div>
                    <p className="font-bold text-lg">{RISK_LABELS[preview.risco]}</p>
                    <p className="text-sm text-muted-foreground">{preview.descricao}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Exames exigidos:</p>
                  {preview.exames.map((e) => (
                    <p key={e} className="text-sm">• {EXAM_LABELS[e]}</p>
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1">
                  <ChevronLeft className="w-4 h-4" /> Voltar
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Enviando..." : "Confirmar Triagem"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  );
}

function SuccessScreen({ result, preview }: { result: SubmitResult; preview: ReturnType<typeof classificarRisco> | null }) {
  const uploadLink = `${typeof window !== "undefined" ? window.location.origin : ""}/exames/${result.uploadToken}`;

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <CheckCircle className="w-8 h-8 text-green-600" />
          <CardTitle>Triagem Realizada!</CardTitle>
        </div>
        <CardDescription>Sua triagem foi registrada com sucesso.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {preview && (
          <div className={`rounded-lg border p-4 ${RISK_COLORS[preview.risco]}`}>
            <p className="font-bold">{RISK_LABELS[preview.risco]}</p>
            <div className="mt-2 space-y-1">
              <p className="text-sm font-medium">Exames necessários:</p>
              {preview.exames.map((e) => (
                <p key={e} className="text-sm">• {EXAM_LABELS[e]}</p>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-lg border bg-blue-50 border-blue-200 p-4 space-y-2">
          <p className="text-sm font-medium text-blue-900">Próximo passo: enviar seus exames</p>
          <p className="text-sm text-blue-700">
            Use o link abaixo para fazer upload dos seus exames. Guarde este link!
          </p>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={uploadLink}
              className="flex-1 text-xs border rounded px-2 py-1 bg-white"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigator.clipboard.writeText(uploadLink)}
            >
              Copiar
            </Button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          A equipe Hakuna entrará em contato pelo WhatsApp após a validação dos seus exames.
        </p>
      </CardContent>
    </Card>
  );
}
