import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RISK_LABELS, EXAM_LABELS, type RiskLevel, type ExamType } from "@/lib/triage";
import SenderistActions from "@/components/hakuna-dashboard/senderista-actions";
import ExameValidar from "@/components/hakuna-dashboard/exame-validar";
import Link from "next/link";
import { ChevronLeft, Heart } from "lucide-react";
import { getHakunaRole } from "@/lib/hakuna-role";
import { hasPermission } from "@/lib/hakuna-permissions";

interface Props {
  params: Promise<{ id: string }>;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value && value !== 0 && value !== false) return null;
  return (
    <p className="text-sm">
      <strong className="text-muted-foreground font-medium">{label}:</strong>{" "}
      <span>{value}</span>
    </p>
  );
}

export default async function SenderistaDetailPage({ params }: Props) {
  const { id } = await params;
  const [supabase, role] = await Promise.all([createClient(), getHakunaRole()]);

  const [{ data: s }, { data: examesRaw }, { data: prontuariosRaw }] = await Promise.all([
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

  // Generate signed URLs for private storage — 1-hour expiry is enough for a dashboard session
  const examePaths = examesRaw?.map((e) => e.arquivo_url).filter(Boolean) ?? [];
  const { data: signedExames } = examePaths.length
    ? await supabase.storage.from("exames").createSignedUrls(examePaths, 3600)
    : { data: [] };
  const exameUrlMap = Object.fromEntries(
    (signedExames ?? []).map((s) => [s.path, s.signedUrl])
  );

  const allFotoPaths = prontuariosRaw?.flatMap((p) => p.fotos_urls ?? []) ?? [];
  const { data: signedFotos } = allFotoPaths.length
    ? await supabase.storage.from("prontuarios").createSignedUrls(allFotoPaths, 3600)
    : { data: [] };
  const fotoUrlMap = Object.fromEntries(
    (signedFotos ?? []).map((s) => [s.path, s.signedUrl])
  );

  const exames = examesRaw?.map((e) => ({ ...e, signed_url: exameUrlMap[e.arquivo_url] ?? null }));
  const prontuarios = prontuariosRaw?.map((p) => ({
    ...p,
    fotos_urls: (p.fotos_urls ?? []).map((path: string) => fotoUrlMap[path] ?? null).filter(Boolean),
  }));

  if (!s) return notFound();

  const uploadLink = `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/exames/${s.upload_token}`;

  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center gap-2">
        <Link href="/hakuna" className="text-sm text-green-700 flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Voltar
        </Link>
      </div>

      <div className="flex items-start justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold">{s.nome}</h1>
          <p className="text-muted-foreground">{s.telefone}</p>
          {s.email && <p className="text-muted-foreground text-sm">{s.email}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant={s.status as "aprovado" | "reprovado" | "pendente" | "exames_enviados"} className="text-sm">
            {s.status}
          </Badge>
          {s.tipo_participante && s.tipo_participante !== "senderista" && (
            <Badge variant="outline" className="text-sm capitalize">{s.tipo_participante}</Badge>
          )}
          {s.status_presenca && (
            <Badge variant={s.status_presenca === "presente" ? "aprovado" : "outline"} className="text-sm capitalize">
              {s.status_presenca === "presente" ? "✓ Presente" : s.status_presenca}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Dados pessoais */}
        <Card>
          <CardHeader><CardTitle className="text-base">Dados Pessoais</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            <Row label="CPF" value={s.cpf} />
            <Row label="Data nasc." value={s.data_nascimento} />
            <Row label="Profissão" value={s.profissao} />
            <Row label="Estado/Cidade" value={[s.estado, s.cidade].filter(Boolean).join(" / ") || null} />
            <Row label="Instagram" value={s.instagram} />
            <Row label="Tipo sanguíneo" value={s.tipo_sanguineo} />
            <Row label="Plano de saúde" value={s.plano_saude ? `Sim — ${s.qual_plano ?? ""}` : "Não"} />
            <Row label="Peso / Altura / IMC" value={`${s.peso_kg ?? "—"} kg / ${s.altura_cm ?? "—"} cm / ${s.imc ?? "—"}`} />
            <Row label="Comorbidades" value={s.comorbidades?.join(", ") || "Nenhuma"} />
          </CardContent>
        </Card>

        {/* Triagem */}
        <Card>
          <CardHeader><CardTitle className="text-base">Triagem</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-muted-foreground text-sm">Risco</p>
              <Badge variant={s.classificacao_risco as RiskLevel}>
                {RISK_LABELS[s.classificacao_risco as RiskLevel]}
              </Badge>
            </div>
            <div>
              <p className="text-muted-foreground text-sm mb-1">Exames exigidos</p>
              {s.exames_exigidos?.map((e: string) => (
                <p key={e} className="text-sm">• {EXAM_LABELS[e as ExamType] ?? e}</p>
              ))}
            </div>
            {s.cond_fisica_autorelatada && (
              <Row label="Cond. física (1-5)" value={s.cond_fisica_autorelatada} />
            )}
            <Row label="Restrição alimentar" value={s.restricao_alimentar ? "Sim" : null} />
          </CardContent>
        </Card>

        {/* Saúde detalhada */}
        {(s.cond_medica_detalhada || s.uso_medicamento || s.medicamentos) && (
          <Card>
            <CardHeader><CardTitle className="text-base">Saúde Detalhada</CardTitle></CardHeader>
            <CardContent className="space-y-1">
              <Row label="Condição médica" value={s.cond_medica_detalhada} />
              <Row label="Usa medicamento" value={s.uso_medicamento ? "Sim" : null} />
              <Row label="Medicamentos" value={s.medicamentos} />
            </CardContent>
          </Card>
        )}

        {/* Família / Contatos */}
        <Card>
          <CardHeader><CardTitle className="text-base">Família &amp; Contatos</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            <Row label="Igreja" value={s.igreja} />
            <Row label="Família" value={s.familia} />
            <Row label="Vai acompanhado" value={s.vai_acompanhado ? "Sim" : null} />
            <Row label="Nome cônjuge/contato" value={s.nome_conjuge} />
            <Row label="WhatsApp cônjuge" value={s.whatsapp_conjuge} />
            <Row label="E-mail cônjuge" value={s.email_conjuge} />
            <Row label="Nome acompanhante" value={s.nome_acompanhante} />
          </CardContent>
        </Card>

        {/* Evento / Ingresso */}
        {(s.evento_nome || s.codigo_ingresso || s.ticketgo_id) && (
          <Card>
            <CardHeader><CardTitle className="text-base">Evento &amp; Ingresso</CardTitle></CardHeader>
            <CardContent className="space-y-1">
              <Row label="Evento" value={s.evento_nome} />
              <Row label="Data do evento" value={s.evento_data} />
              <Row label="Código ingresso" value={s.codigo_ingresso} />
              <Row label="ID TicketGo" value={s.ticketgo_id} />
              <Row label="Valor bilhete" value={s.valor_bilhete ? `R$ ${Number(s.valor_bilhete).toFixed(2)}` : null} />
              <Row label="Status ingresso" value={s.status_ingresso} />
              <Row label="Tamanho camisa" value={s.tamanho_camisa} />
              {s.data_cadastro_origem && (
                <Row label="Cadastro origem" value={new Date(s.data_cadastro_origem).toLocaleDateString("pt-BR")} />
              )}
              {s.termo_aceito && (
                <Row label="Termo aceito" value={s.termo_aceito_em ? new Date(s.termo_aceito_em).toLocaleString("pt-BR") : "Sim"} />
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Exames enviados — apenas médico e coordenador */}
      {hasPermission(role, "view_exames") && <Card>
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
                <div key={e.id} className="border rounded p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{EXAM_LABELS[e.tipo as ExamType] ?? e.tipo}</p>
                      {e.signed_url && (
                        <a href={e.signed_url} target="_blank" className="text-xs text-blue-600 underline">
                          Ver arquivo
                        </a>
                      )}
                      {e.validado === false && e.motivo_reprovacao && (
                        <p className="text-xs text-red-600 mt-0.5">Reprovado: {e.motivo_reprovacao}</p>
                      )}
                    </div>
                    <Badge variant={e.validado === true ? "aprovado" : e.validado === false ? "reprovado" : "pendente"}>
                      {e.validado === true ? "Aprovado" : e.validado === false ? "Reprovado" : "Pendente"}
                    </Badge>
                  </div>
                  <ExameValidar exameId={e.id} validado={e.validado ?? null} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>}

      {/* Mensagens de apoio */}
      <Link
        href={`/hakuna/senderistas/${id}/mensagens`}
        className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800 hover:bg-green-100 transition-colors"
      >
        <Heart className="w-4 h-4" />
        Ver mensagens de família recebidas
      </Link>

      {/* Ações (validar, reprovar, WhatsApp stubs) */}
      <SenderistActions senderista={s} uploadLink={uploadLink} />

      {/* Prontuários — apenas médico e coordenador */}
      {hasPermission(role, "view_prontuarios") && prontuarios && prontuarios.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Prontuários de Campo</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {prontuarios.map((p) => (
              <div key={p.id} className="border rounded p-3 text-sm space-y-1">
                <p className="text-muted-foreground text-xs">{new Date(p.created_at).toLocaleString("pt-BR")}</p>
                {p.queixas && <p><strong>Queixas:</strong> {p.queixas}</p>}
                {p.condutas && <p><strong>Condutas:</strong> {p.condutas}</p>}
                {p.fotos_urls?.length > 0 && (
                  <div className="flex gap-2 flex-wrap mt-2">
                    {p.fotos_urls.map((url: string, i: number) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <a key={i} href={url} target="_blank" rel="noreferrer">
                        <img
                          src={url}
                          alt={`Foto ${i + 1}`}
                          className="w-20 h-20 object-cover rounded border hover:opacity-80 transition-opacity"
                        />
                      </a>
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

