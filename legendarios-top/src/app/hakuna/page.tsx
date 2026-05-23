import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RISK_LABELS, type RiskLevel } from "@/lib/triage";

const STATUS_LABELS: Record<string, string> = {
  pendente: "Pendente",
  exames_enviados: "Exames enviados",
  aprovado: "Aprovado",
  reprovado: "Reprovado",
};

export default async function HakunaDashboard({
  searchParams,
}: {
  searchParams: Promise<{ risco?: string; status?: string; q?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("senderistas")
    .select("id, nome, telefone, classificacao_risco, status, created_at")
    .order("created_at", { ascending: false });

  if (params.risco) query = query.eq("classificacao_risco", params.risco);
  if (params.status) query = query.eq("status", params.status);
  if (params.q) query = query.ilike("nome", `%${params.q}%`);

  const { data: senderistas } = await query;

  const counts = {
    total: senderistas?.length ?? 0,
    pendente: senderistas?.filter((s) => s.status === "pendente").length ?? 0,
    exames_enviados: senderistas?.filter((s) => s.status === "exames_enviados").length ?? 0,
    aprovado: senderistas?.filter((s) => s.status === "aprovado").length ?? 0,
    reprovado: senderistas?.filter((s) => s.status === "reprovado").length ?? 0,
  };

  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Senderistas</h1>
        <div className="flex gap-2">
          <Link href="/hakuna/nfc" className="text-sm text-green-700 underline">Gravar TAGs NFC</Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total", value: counts.total, color: "bg-gray-100" },
          { label: "Aguardando exames", value: counts.pendente, color: "bg-yellow-50" },
          { label: "Exames enviados", value: counts.exames_enviados, color: "bg-blue-50" },
          { label: "Aprovados", value: counts.aprovado, color: "bg-green-50" },
        ].map((stat) => (
          <Card key={stat.label} className={stat.color}>
            <CardContent className="p-4">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <form className="flex flex-wrap gap-2">
        <input
          name="q"
          defaultValue={params.q}
          placeholder="Buscar por nome..."
          className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm flex-1 min-w-40"
        />
        <select name="risco" defaultValue={params.risco ?? ""} className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm">
          <option value="">Todos os riscos</option>
          <option value="baixo">Baixo Risco</option>
          <option value="moderado">Risco Moderado</option>
          <option value="alto">Risco Alto</option>
        </select>
        <select name="status" defaultValue={params.status ?? ""} className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm">
          <option value="">Todos os status</option>
          <option value="pendente">Pendente</option>
          <option value="exames_enviados">Exames enviados</option>
          <option value="aprovado">Aprovado</option>
          <option value="reprovado">Reprovado</option>
        </select>
        <button type="submit" className="h-9 px-4 rounded-md bg-green-700 text-white text-sm">Filtrar</button>
      </form>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{counts.total} participante(s)</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-3 font-medium">Nome</th>
                  <th className="text-left p-3 font-medium">WhatsApp</th>
                  <th className="text-left p-3 font-medium">Risco</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {senderistas?.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="p-3 font-medium">{s.nome}</td>
                    <td className="p-3 text-muted-foreground">{s.telefone}</td>
                    <td className="p-3">
                      <Badge variant={s.classificacao_risco as RiskLevel}>
                        {RISK_LABELS[s.classificacao_risco as RiskLevel] ?? s.classificacao_risco}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge variant={s.status as "aprovado" | "reprovado" | "pendente" | "exames_enviados"}>
                        {STATUS_LABELS[s.status] ?? s.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Link href={`/hakuna/senderistas/${s.id}`} className="text-green-700 underline text-sm">
                        Ver detalhes
                      </Link>
                    </td>
                  </tr>
                ))}
                {!senderistas?.length && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      Nenhum senderista encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
