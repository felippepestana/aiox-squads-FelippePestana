import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Painel Hakuna — Legendários TOP",
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
    .select("id")
    .eq("email", user.email!)
    .single();

  if (!hakuna) redirect("/hakuna/login");

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-green-800 text-white px-4 py-3 flex items-center justify-between">
        <span className="font-bold">Legendários TOP — Painel Hakuna</span>
        <span className="text-sm opacity-80">{user.email}</span>
      </nav>
      <main className="p-4 max-w-6xl mx-auto">{children}</main>
    </div>
  );
}
