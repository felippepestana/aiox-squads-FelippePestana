import { createClient } from "@/lib/supabase/server";
import NFCWriter from "@/components/campo-nfc/nfc-writer";

export const metadata = { title: "Gravar TAGs NFC — Legendários TOP" };

export default async function NFCPage() {
  const supabase = await createClient();

  const { data: senderistas } = await supabase
    .from("senderistas")
    .select("id, nome, tipo_sanguineo, peso_kg, altura_cm, imc, plano_saude, qual_plano, comorbidades, classificacao_risco, status, telefone")
    .in("status", ["aprovado", "exames_enviados"])
    .order("nome");

  return (
    <div className="space-y-6 py-4">
      <h1 className="text-2xl font-bold">Gravar TAGs NFC</h1>
      <p className="text-sm text-muted-foreground">
        Use este painel no Chrome para Android para gravar as TAGs NFC dos senderistas aprovados.
        A TAG armazena os dados do participante para leitura offline no campo.
      </p>
      <NFCWriter senderistas={senderistas ?? []} />
    </div>
  );
}
