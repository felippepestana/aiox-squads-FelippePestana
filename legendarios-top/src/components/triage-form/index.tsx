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
  cpf: z.string().optional(),
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
  restricao_alimentar: z.boolean().default(false),
});

const step3Schema = z.object({
  nome_conjuge: z.string().optional(),
  whatsapp_conjuge: z.string().optional(),
  igreja: z.string().optional(),
  vai_acompanhado: z.boolean().default(false),
});

const fullSchema = step1Schema.merge(step2Schema).merge(step3Schema);
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

const STEP_LABELS = ["Dados Pessoais", "Saúde", "Família", "Revisão"];

interface SubmitResult {
  uploadToken: string;
  mensagensToken?: string;
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
      restricao_alimentar: false,
      vai_acompanhado: false,
    },
  });

  const watchedValues = form.watch();

  const preview = (() => {
    if (!watchedValues.data_nascimento) return null;
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

  async function validateStep(fields: Parameters<typeof form.trigger>[0]) {
    return form.trigger(fields);
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
      setStep(5);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  if (step === 5 && result) {
    return <SuccessScreen result={result} preview={preview} />;
  }

  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-1 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
              step > s ? "bg-green-600 text-white" : step === s ? "bg-green-700 text-white" : "bg-gray-200 text-gray-500"
            }`}>
              {step > s ? "✓" : s}
            </div>
            {s < 4 && <div className={`flex-1 h-1 ${step > s ? "bg-green-600" : "bg-gray-200"}`} />}
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground text-center">{STEP_LABELS[step - 1]}</p>

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
                <Label htmlFor="cpf">CPF</Label>
                <Input id="cpf" placeholder="000.000.000-00" {...form.register("cpf")} />
                <p className="text-xs text-muted-foreground">Opcional — facilita identificação no evento</p>
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

              <Button
                type="button"
                onClick={async () => {
                  const ok = await validateStep(["nome", "telefone", "data_nascimento"]);
                  if (ok) setStep(2);
                }}
                className="w-full"
              >
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
                    <input type="radio" value="sim" {...form.register("plano_saude")} /> Sim
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="nao" {...form.register("plano_saude")} /> Não
                  </label>
                </div>
              </div>

              {form.watch("plano_saude") === "sim" && (
                <div className="space-y-2">
                  <Label htmlFor="qual_plano">Qual plano?</Label>
                  <Input id="qual_plano" placeholder="Ex: Unimed, Bradesco..." {...form.register("qual_plano")} />
                </div>
              )}

              <div className="space-y-2">
                <Label>Comorbidades (marque todas que se aplicam)</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto p-2 border rounded-md">
                  {COMORBIDADES_OPCOES.map((c) => (
                    <label key={c.value} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" value={c.value} {...form.register("comorbidades")} />
                      <span className="text-sm">{c.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...form.register("restricao_alimentar")}
                  />
                  <span className="text-sm font-medium">Tenho restrição alimentar</span>
                </label>
                <p className="text-xs text-muted-foreground pl-5">Diabetes, alergia, dieta especial, etc.</p>
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                  <ChevronLeft className="w-4 h-4" /> Voltar
                </Button>
                <Button
                  type="button"
                  onClick={async () => {
                    const ok = await validateStep(["peso_kg", "altura_cm", "plano_saude"]);
                    if (ok) setStep(3);
                  }}
                  className="flex-1"
                >
                  Próximo <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3 — Família & Contato */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Família & Contato</CardTitle>
              <CardDescription>Contato de emergência e informações da sua comunidade</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome_conjuge">Nome do cônjuge / responsável</Label>
                <Input id="nome_conjuge" placeholder="Nome completo" {...form.register("nome_conjuge")} />
                <p className="text-xs text-muted-foreground">Usado como contato de emergência</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp_conjuge">WhatsApp do cônjuge / responsável</Label>
                <Input id="whatsapp_conjuge" placeholder="(11) 99999-9999" {...form.register("whatsapp_conjuge")} />
                <p className="text-xs text-muted-foreground">
                  Receberá o link para enviar mensagens de apoio durante o TOP
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="igreja">Igreja / Comunidade</Label>
                <Input id="igreja" placeholder="Nome da sua igreja" {...form.register("igreja")} />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" {...form.register("vai_acompanhado")} />
                  <span className="text-sm font-medium">Vou acompanhado de alguém</span>
                </label>
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1">
                  <ChevronLeft className="w-4 h-4" /> Voltar
                </Button>
                <Button type="button" onClick={() => setStep(4)} className="flex-1">
                  Revisar <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4 — Revisão */}
        {step === 4 && preview && (
          <Card>
            <CardHeader>
              <CardTitle>Revisão da Triagem</CardTitle>
              <CardDescription>Confirme seus dados antes de enviar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1 text-sm">
                <p><strong>Nome:</strong> {watchedValues.nome}</p>
                {watchedValues.cpf && <p><strong>CPF:</strong> {watchedValues.cpf}</p>}
                <p><strong>WhatsApp:</strong> {watchedValues.telefone}</p>
                <p><strong>Data nasc.:</strong> {watchedValues.data_nascimento} ({idade} anos)</p>
                <p><strong>Peso:</strong> {watchedValues.peso_kg} kg | <strong>Altura:</strong> {watchedValues.altura_cm} cm | <strong>IMC:</strong> {imc}</p>
                {watchedValues.tipo_sanguineo && <p><strong>Tipo sanguíneo:</strong> {watchedValues.tipo_sanguineo}</p>}
                <p><strong>Plano de saúde:</strong> {watchedValues.plano_saude === "sim" ? `Sim — ${watchedValues.qual_plano ?? ""}` : "Não"}</p>
                {watchedValues.comorbidades?.length > 0 && (
                  <p><strong>Comorbidades:</strong> {watchedValues.comorbidades.join(", ")}</p>
                )}
                {watchedValues.restricao_alimentar && <p><strong>Restrição alimentar:</strong> Sim</p>}
                {watchedValues.nome_conjuge && <p><strong>Cônjuge:</strong> {watchedValues.nome_conjuge}</p>}
                {watchedValues.whatsapp_conjuge && <p><strong>WhatsApp cônjuge:</strong> {watchedValues.whatsapp_conjuge}</p>}
                {watchedValues.igreja && <p><strong>Igreja:</strong> {watchedValues.igreja}</p>}
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

              {error && <p className="text-sm text-destructive">{error}</p>}

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setStep(3)} className="flex-1">
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
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const uploadLink = `${origin}/exames/${result.uploadToken}`;
  const mensagensLink = result.mensagensToken ? `${origin}/mensagens/${result.mensagensToken}` : null;

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <CheckCircle className="w-8 h-8 text-green-600" />
          <div>
            <CardTitle>Triagem Realizada!</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {preview && (
          <div className={`rounded-lg border p-4 ${
            preview.risco === "baixo" ? "border-green-200 bg-green-50"
            : preview.risco === "moderado" ? "border-amber-200 bg-amber-50"
            : "border-red-200 bg-red-50"
          }`}>
            <p className="font-bold">{RISK_LABELS[preview.risco]}</p>
            <div className="mt-2 space-y-1">
              <p className="text-sm font-medium">Exames necessários:</p>
              {preview.exames.map((e) => (
                <p key={e} className="text-sm">• {EXAM_LABELS[e]}</p>
              ))}
            </div>
          </div>
        )}

        {/* Upload link */}
        <div className="rounded-lg border bg-blue-50 border-blue-200 p-4 space-y-2">
          <p className="text-sm font-medium text-blue-900">Próximo passo: enviar seus exames</p>
          <p className="text-sm text-blue-700">Use o link abaixo para fazer upload dos seus exames. Guarde este link!</p>
          <div className="flex items-center gap-2">
            <input readOnly value={uploadLink} className="flex-1 text-xs border rounded px-2 py-1 bg-white" />
            <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(uploadLink)}>
              Copiar
            </Button>
          </div>
        </div>

        {/* Messages link for spouse */}
        {mensagensLink && (
          <div className="rounded-lg border bg-green-50 border-green-200 p-4 space-y-2">
            <p className="text-sm font-medium text-green-900">Link de mensagens para sua família</p>
            <p className="text-sm text-green-700">
              Compartilhe com seu cônjuge ou familiares para que possam enviar mensagens de apoio durante o TOP.
            </p>
            <div className="flex items-center gap-2">
              <input readOnly value={mensagensLink} className="flex-1 text-xs border rounded px-2 py-1 bg-white" />
              <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(mensagensLink)}>
                Copiar
              </Button>
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center">
          A equipe Hakuna entrará em contato pelo WhatsApp após a validação dos seus exames.
        </p>
      </CardContent>
    </Card>
  );
}
