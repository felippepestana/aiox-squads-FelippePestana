import { Header } from "@/components/layout/header";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StaffProfile } from "@/types/database";
import { Users, UserCheck, UserX, Shield } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: rawProfile } = await supabase
    .from("staff_profiles")
    .select("clinic_id, full_name")
    .eq("user_id", user?.id ?? "")
    .single();

  const profile = rawProfile as Pick<StaffProfile, "clinic_id" | "full_name"> | null;
  const clinicId = profile?.clinic_id ?? "";

  const [{ count: totalStaff }, { count: activeStaff }] = await Promise.all([
    supabase.from("staff_profiles").select("*", { count: "exact", head: true }).eq("clinic_id", clinicId),
    supabase.from("staff_profiles").select("*", { count: "exact", head: true }).eq("clinic_id", clinicId).eq("active", true),
  ]);

  const inactiveStaff = (totalStaff ?? 0) - (activeStaff ?? 0);

  const stats = [
    { title: "Colaboradores", value: totalStaff ?? 0, icon: Users, color: "text-brand-primary", bg: "bg-brand-primary-light" },
    { title: "Ativos", value: activeStaff ?? 0, icon: UserCheck, color: "text-green-600", bg: "bg-green-50" },
    { title: "Inativos", value: inactiveStaff, icon: UserX, color: "text-slate-500", bg: "bg-slate-50" },
    { title: "Compliance LGPD", value: "✓", icon: Shield, color: "text-brand-gold", bg: "bg-brand-gold-light" },
  ];

  return (
    <div className="flex flex-col overflow-hidden">
      <Header
        title={`Olá, ${profile?.full_name?.split(" ")[0] ?? "bem-vindo"}`}
        subtitle="Visão geral da clínica"
      />
      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.title} className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{stat.title}</p>
                  <p className="mt-1.5 text-2xl font-bold text-brand-dark">{stat.value}</p>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Acesso Rápido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { href: "/staff/novo", label: "Novo Colaborador", emoji: "👤" },
                { href: "/patients", label: "Novo Paciente", emoji: "🏥" },
                { href: "/agenda", label: "Agendar Consulta", emoji: "📅" },
                { href: "/protocolos", label: "Criar Protocolo", emoji: "📋" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center gap-2 rounded-xl border border-border p-4 text-center text-sm font-medium transition-colors hover:border-brand-primary hover:bg-brand-primary-light hover:text-brand-primary"
                >
                  <span className="text-2xl">{item.emoji}</span>
                  {item.label}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="rounded-xl border border-brand-gold/30 bg-brand-gold-light p-4">
          <p className="text-sm font-medium text-brand-dark">
            🚀 <strong>Fase 1 — Em desenvolvimento</strong>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Módulo de colaboradores disponível. Próximos: protocolos, atendimento médico, follow-up e financeiro.
          </p>
        </div>
      </div>
    </div>
  );
}
