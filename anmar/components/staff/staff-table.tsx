import Link from "next/link";
import { cn, formatCPF, rolLabel, roleColor } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { StaffProfile } from "@/types/database";
import { Eye, UserCheck, UserX } from "lucide-react";

interface StaffTableProps {
  staff: StaffProfile[];
}

export function StaffTable({ staff }: StaffTableProps) {
  if (staff.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary-light">
          <UserCheck className="h-8 w-8 text-brand-primary" />
        </div>
        <h3 className="text-base font-semibold text-brand-dark">Nenhum colaborador cadastrado</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Cadastre o primeiro colaborador para começar.
        </p>
        <Button asChild className="mt-4">
          <Link href="/staff/novo">Cadastrar colaborador</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nome</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">CPF</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Função</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Registro</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-card">
          {staff.map((member) => (
            <tr key={member.id} className="hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-primary-light text-brand-primary text-xs font-semibold">
                    {member.full_name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-brand-dark">{member.full_name}</p>
                    {member.email && (
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                {formatCPF(member.cpf)}
              </td>
              <td className="px-4 py-3">
                <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", roleColor(member.role))}>
                  {rolLabel(member.role)}
                </span>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {member.professional_register ?? "—"}
              </td>
              <td className="px-4 py-3">
                {member.active ? (
                  <Badge variant="success">Ativo</Badge>
                ) : (
                  <Badge variant="secondary">
                    <UserX className="mr-1 h-3 w-3" />
                    Inativo
                  </Badge>
                )}
              </td>
              <td className="px-4 py-3 text-right">
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/staff/${member.id}`}>
                    <Eye className="h-3.5 w-3.5" />
                    Ver
                  </Link>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
