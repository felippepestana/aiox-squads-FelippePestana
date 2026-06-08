import { createClient } from "@/lib/supabase/server";
import { HakunaProvider, type HakunaRole } from "@/lib/hakuna-context";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Painel Hakuna — Legendários TOP",
};

const ROLE_LABELS: Record<HakunaRole, string> = {
  médico: "Médico",
  coordenador: "Coordenador",
  apoio: "Apoio",
};

export default async function HakunaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/hakuna/login");

  // Only emails registered in the hakunas table gain access
  const { data: hakuna } = await supabase
    .from("hakunas")
    .select("id, role")
    .eq("email", user.email!)
    .single();

  if (!hakuna) redirect("/hakuna/login");

  const role = (hakuna.role ?? "apoio") as HakunaRole;

  return (
    <HakunaProvider value={{ hakunaId: hakuna.id, role }}>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-green-800 text-white px-4 py-3 flex items-center justify-between">
          <span className="font-bold">Legendários TOP — Painel Hakuna</span>
          <div className="flex items-center gap-3 text-sm">
            <span className="bg-green-700 px-2 py-0.5 rounded text-xs font-medium">
              {ROLE_LABELS[role]}
            </span>
            <span className="opacity-80">{user.email}</span>
          </div>
        </nav>
        <main className="p-4 max-w-6xl mx-auto">{children}</main>
      </div>
    </HakunaProvider>
  );
}
