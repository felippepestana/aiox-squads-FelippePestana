import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RISK_LABELS, EXAM_LABELS, type RiskLevel, type ExamType } from "@/lib/triage";
import SenderistActions from "@/components/hakuna-dashboard/senderista-actions";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SenderistaDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: s }, { data: exames }, { data: prontuarios }] = await Promise.all([
    supabase
      .from("senderistas")
      .select("*")
      .eq("id", id)
      .single(),
    supabase
      .from("exames")
      .select("*")
      .eq("senderista_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("prontuarios")
      .select("*")
      .eq("senderista_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (!s) return notFound();

  const uploadLink = `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/exames/${s.upload_token}`;

  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center gap-2">
        <Link href="/hakuna" className="text-sm text-green-700 flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Voltar
        </Link>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{s.nome}</h1>
          <p className="text-muted-foreground">{s.telefone}</p>
        </div>
        <Badge variant={s.status as "aprovado" | "reprovado" | "pendente" | "exames_enviados"} className="text-sm">
          {s.status}
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Dados pessoais */}
        <Card>
          <CardHeader><CardTitle className="text-base">Dados Pessoais</CardTitle></CardHeader>
          <CardContent className="text-sm space-y-1">
            <p><strong>Data nasc.:</strong> {s.data_nascimento}</p>
            <p><strong>Tipo sanguíneo:</strong> {s.tipo_sanguineo ?? "Não informado"}</p>
            <p><strong>Plano de saúde:</strong> {s.plano_saude ? `Sim — ${s.qual_plano ?? ""}` : "Não"}</p>
            <p><strong>Peso:</strong> {s.peso_kg} kg | <strong>Altura:</strong> {s.altura_cm} cm | <strong>IMC:</strong> {s.imc}</p>
            <p><strong>Comorbidades:</strong> {s.comorbidades?.join(", ") || "Nenhuma"}</p>
          </CardContent>
        </Card>

        {/* Triagem */}
        <Card>
          <CardHeader><CardTitle className="text-base">Triagem</CardTitle></CardHeader>
          <CardContent className="text-sm space-y-2">
            <div>
              <p className="text-muted-foreground">Risco</p>
              <Badge variant={s.classificacao_risco as RiskLevel}>
                {RISK_LABELS[s.classificacao_risco as RiskLevel]}
              </Badge>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Exames exigidos</p>
              {s.exames_exigidos?.map((e: string) => (
                <p key={e} className="text-sm">• {EXAM_LABELS[e as ExamType] ?? e}</p>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exames enviados */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Exames Enviados</CardTitle>
          <CardDescription>
            Link de upload: <a href={uploadLink} target="_blank" className="text-blue-600 underline text-xs break-all">{uploadLink}</a>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!exames?.length ? (
            <p className="text-sm text-muted-foreground">Nenhum exame enviado ainda.</p>
          ) : (
            <div className="space-y-2">
              {exames.map((e) => (
                <div key={e.id} className="flex items-center justify-between border rounded p-3">
                  <div>
                    <p className="text-sm font-medium">{EXAM_LABELS[e.tipo as ExamType] ?? e.tipo}</p>
                    <a href={e.arquivo_url} target="_blank" className="text-xs text-blue-600 underline">
                      Ver arquivo
                    </a>
                  </div>
                  <Badge variant={e.validado === true ? "aprovado" : e.validado === false ? "reprovado" : "pendente"}>
                    {e.validado === true ? "Aprovado" : e.validado === false ? "Reprovado" : "Pendente"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ações (validar, reprovar, WhatsApp stubs) */}
      <SenderistActions senderista={s} uploadLink={uploadLink} />

      {/* Prontuários */}
      {prontuarios && prontuarios.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Prontuários de Campo</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {prontuarios.map((p) => (
              <div key={p.id} className="border rounded p-3 text-sm space-y-1">
                <p className="text-muted-foreground text-xs">{new Date(p.created_at).toLocaleString("pt-BR")}</p>
                {p.queixas && <p><strong>Queixas:</strong> {p.queixas}</p>}
                {p.condutas && <p><strong>Condutas:</strong> {p.condutas}</p>}
                {p.fotos_urls?.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {p.fotos_urls.map((url: string, i: number) => (
                      <a key={i} href={url} target="_blank" className="text-blue-600 underline text-xs">Foto {i + 1}</a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
