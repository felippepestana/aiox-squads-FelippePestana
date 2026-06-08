import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import ExameUpload from "@/components/exam-upload";

export const metadata = {
  title: "Envio de Exames — Legendários TOP",
};

interface Props {
  params: Promise<{ token: string }>;
}

export default async function ExamesPage({ params }: Props) {
  const { token } = await params;
  const supabase = createAdminClient();

  const { data: senderista } = await supabase
    .from("senderistas")
    .select("id, nome, exames_exigidos, status, classificacao_risco, motivo_reprovacao, orientacoes, evento_data")
    .eq("upload_token", token)
    .single();

  if (!senderista) return notFound();

  if (senderista.evento_data) {
    const deadline = new Date(senderista.evento_data);
    deadline.setUTCDate(deadline.getUTCDate() - 3);
    deadline.setUTCHours(23, 59, 59, 999);
    if (new Date() > deadline) {
      return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 py-8 px-4">
          <div className="max-w-lg mx-auto text-center space-y-2">
            <h1 className="text-2xl font-bold text-blue-900">Prazo Encerrado</h1>
            <p className="text-blue-600">
              O prazo para envio de exames foi encerrado. Entre em contato com a equipe Hakuna.
            </p>
          </div>
        </main>
      );
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 py-8 px-4">
      <div className="max-w-lg mx-auto mb-6">
        <h1 className="text-2xl font-bold text-blue-900 text-center">Envio de Exames</h1>
        <p className="text-blue-600 text-center text-sm mt-1">Olá, {senderista.nome}</p>
      </div>
      <ExameUpload
        senderista={senderista}
        token={token}
      />
    </main>
  );
}
