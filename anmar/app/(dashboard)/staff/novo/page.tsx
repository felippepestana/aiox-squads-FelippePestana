import { Header } from "@/components/layout/header";
import { StaffForm } from "@/components/staff/staff-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Novo Colaborador" };

export default function NewStaffPage() {
  return (
    <div className="flex flex-col overflow-hidden">
      <Header
        title="Novo Colaborador"
        subtitle="Cadastre um novo membro da equipe"
      />
      <div className="flex-1 overflow-auto p-6">
        <StaffForm />
      </div>
    </div>
  );
}
