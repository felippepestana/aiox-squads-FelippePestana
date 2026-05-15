import { Header } from "@/components/layout/header";
import { createClient } from "@/lib/supabase/server";
import { StaffTable } from "@/components/staff/staff-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserPlus, Users } from "lucide-react";
import type { StaffProfile } from "@/types/database";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Colaboradores" };

type SearchParams = { role?: string; status?: string };

export default async function StaffPage({ searchParams }: { searchParams: SearchParams }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: rawProfile } = await supabase
    .from("staff_profiles")
    .select("clinic_id")
    .eq("user_id", user?.id ?? "")
    .single();

  const clinicId = (rawProfile as Pick<StaffProfile, "clinic_id"> | null)?.clinic_id ?? "";

  let query = supabase
    .from("staff_profiles")
    .select("*")
    .eq("clinic_id", clinicId)
    .order("full_name");

  if (searchParams.role) query = query.eq("role", searchParams.role);
  if (searchParams.status !== "all") query = query.eq("active", true);

  const { data: rawStaff } = await query;
  const staff = (rawStaff ?? []) as StaffProfile[];

  const { count: total } = await supabase
    .from("staff_profiles")
    .select("*", { count: "exact", head: true })
    .eq("clinic_id", clinicId);

  return (
    <div className="flex flex-col overflow-hidden">
      <Header
        title="Colaboradores"
        subtitle={`${total ?? 0} ${total === 1 ? "colaborador cadastrado" : "colaboradores cadastrados"}`}
      />
      <div className="flex-1 overflow-auto p-6 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 items-center rounded-lg border border-border bg-card px-3 gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{staff.length} resultado(s)</span>
            </div>
            <div className="flex gap-1">
              {[
                { label: "Todos", value: undefined },
                { label: "Médicos", value: "doctor" },
                { label: "Enfermeiros", value: "nurse" },
                { label: "Biomédicos", value: "biomedical" },
                { label: "Recepcionistas", value: "receptionist" },
              ].map((f) => (
                <Link
                  key={f.label}
                  href={f.value ? `/staff?role=${f.value}` : "/staff"}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    searchParams.role === f.value || (!searchParams.role && !f.value)
                      ? "bg-brand-primary text-white"
                      : "bg-card border border-border text-muted-foreground hover:text-brand-primary hover:border-brand-primary"
                  }`}
                >
                  {f.label}
                </Link>
              ))}
            </div>
          </div>
          <Button asChild>
            <Link href="/staff/novo">
              <UserPlus className="h-4 w-4" />
              Novo colaborador
            </Link>
          </Button>
        </div>
        <StaffTable staff={staff} />
      </div>
    </div>
  );
}
