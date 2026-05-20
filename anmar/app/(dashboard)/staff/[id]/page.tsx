import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StaffForm } from "@/components/staff/staff-form";
import { DeactivateButton } from "@/components/staff/deactivate-button";
import { formatCPF, formatPhone, rolLabel, roleColor } from "@/lib/utils";
import type { StaffProfile } from "@/types/database";
import Link from "next/link";
import { ArrowLeft, Edit } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: { id: string };
  searchParams: { edit?: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("staff_profiles")
    .select("full_name")
    .eq("id", params.id)
    .single();
  return { title: (data as Pick<StaffProfile, "full_name"> | null)?.full_name ?? "Colaborador" };
}

export default async function StaffDetailPage({ params, searchParams }: Props) {
  const supabase = await createClient();
  const { data: raw } = await supabase
    .from("staff_profiles")
    .select("*")
    .eq("id", params.id)
    .single();

  const member = raw as StaffProfile | null;
  if (!member) notFound();

  const isEditing = searchParams.edit === "1";

  return (
    <div className="flex flex-col overflow-hidden">
      <Header title={member.full_name} subtitle={rolLabel(member.role)} />
      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Button asChild variant="ghost" size="sm">
            <Link href="/staff">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <Button asChild variant="outline" size="sm">
                <Link href={`/staff/${member.id}?edit=1`}>
                  <Edit className="h-4 w-4" />
                  Editar
                </Link>
              </Button>
            )}
            {member.active && !isEditing && <DeactivateButton id={member.id} />}
          </div>
        </div>

        {isEditing ? (
          <StaffForm initialData={member} />
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Informações Pessoais</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 text-sm">
                  {[
                    { label: "Nome completo", value: member.full_name },
                    { label: "CPF", value: formatCPF(member.cpf), mono: true },
                    { label: "Email", value: member.email ?? "—" },
                    { label: "Telefone", value: member.phone ? formatPhone(member.phone) : "—" },
                    {
                      label: "Nascimento",
                      value: member.birth_date
                        ? new Date(member.birth_date).toLocaleDateString("pt-BR")
                        : "—",
                    },
                    {
                      label: "Cadastrado em",
                      value: new Date(member.created_at).toLocaleDateString("pt-BR"),
                    },
                  ].map((f) => (
                    <div key={f.label}>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{f.label}</p>
                      <p className={`mt-0.5 font-medium text-brand-dark ${f.mono ? "font-mono text-xs" : ""}`}>{f.value}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Registro Profissional</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 text-sm">
                  {[
                    { label: "Função", value: rolLabel(member.role) },
                    { label: "Registro", value: member.professional_register ?? "—" },
                    { label: "Custo/hora", value: member.hourly_cost ? `R$ ${member.hourly_cost.toFixed(2)}` : "—" },
                    { label: "Especialidades", value: member.specialties.join(", ") || "—" },
                  ].map((f) => (
                    <div key={f.label}>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{f.label}</p>
                      <p className="mt-0.5 font-medium text-brand-dark">{f.value}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Resumo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary-light text-brand-primary text-xl font-bold">
                    {member.full_name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${roleColor(member.role)}`}>
                    {rolLabel(member.role)}
                  </span>
                  <div>
                    {member.active ? (
                      <Badge variant="success">Ativo</Badge>
                    ) : (
                      <Badge variant="secondary">Inativo</Badge>
                    )}
                  </div>
                  {member.professional_register && (
                    <p className="text-xs font-mono text-muted-foreground">{member.professional_register}</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
