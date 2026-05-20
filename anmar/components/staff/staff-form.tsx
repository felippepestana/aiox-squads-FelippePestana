"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { staffSchema, ROLES, type StaffFormValues } from "@/lib/validations/staff";
import { createStaff, updateStaff } from "@/actions/staff";
import {
  formatCPF,
  formatPhone,
  rolLabel,
  requiresClinicalRegister,
  clinicalRegisterLabel,
} from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Loader2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { StaffProfile } from "@/types/database";

interface StaffFormProps {
  initialData?: StaffProfile;
}

export function StaffForm({ initialData }: StaffFormProps) {
  const isEditing = !!initialData;
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: initialData
      ? {
          full_name: initialData.full_name,
          cpf: formatCPF(initialData.cpf),
          role: initialData.role,
          professional_register: initialData.professional_register ?? "",
          email: initialData.email ?? "",
          phone: initialData.phone ?? "",
          hourly_cost: initialData.hourly_cost ?? undefined,
          birth_date: initialData.birth_date ?? "",
        }
      : { role: "receptionist", specialties: [] },
  });

  const selectedRole = watch("role");
  const needsRegister = requiresClinicalRegister(selectedRole);

  function onSubmit(values: StaffFormValues) {
    setServerError(null);
    startTransition(async () => {
      const result = isEditing
        ? await updateStaff(initialData.id, values)
        : await createStaff(values);
      if (result?.error) {
        const firstError = Object.values(result.error)[0]?.[0];
        setServerError(firstError ?? "Erro ao salvar colaborador");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      {/* Dados Pessoais */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dados Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Full name */}
          <div className="sm:col-span-2 space-y-1.5">
            <Label htmlFor="full_name">Nome Completo *</Label>
            <Input id="full_name" placeholder="Nome completo" {...register("full_name")} />
            {errors.full_name && (
              <p className="text-xs text-destructive">{errors.full_name.message}</p>
            )}
          </div>

          {/* CPF */}
          <div className="space-y-1.5">
            <Label htmlFor="cpf">CPF *</Label>
            <Input
              id="cpf"
              placeholder="000.000.000-00"
              {...register("cpf")}
              onChange={(e) => setValue("cpf", formatCPF(e.target.value))}
              maxLength={14}
            />
            {errors.cpf && (
              <p className="text-xs text-destructive">{errors.cpf.message}</p>
            )}
          </div>

          {/* Birth date */}
          <div className="space-y-1.5">
            <Label htmlFor="birth_date">Data de Nascimento</Label>
            <Input id="birth_date" type="date" {...register("birth_date")} />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="email@exemplo.com" {...register("email")} />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              placeholder="(00) 00000-0000"
              {...register("phone")}
              onChange={(e) => setValue("phone", formatPhone(e.target.value))}
              maxLength={15}
            />
          </div>
        </CardContent>
      </Card>

      {/* Função e Registro */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Função e Registro Profissional</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Role */}
          <div className="space-y-1.5">
            <Label>Função *</Label>
            <Select
              defaultValue={selectedRole}
              onValueChange={(v) => setValue("role", v as typeof ROLES[number])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a função" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {rolLabel(role)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-xs text-destructive">{errors.role.message}</p>
            )}
          </div>

          {/* Professional register */}
          <div className="space-y-1.5">
            <Label htmlFor="professional_register">
              {clinicalRegisterLabel(selectedRole)}
              {needsRegister && " *"}
            </Label>
            <Input
              id="professional_register"
              placeholder={needsRegister ? `Ex: ${clinicalRegisterLabel(selectedRole)}-SP 123456` : "Opcional"}
              disabled={!needsRegister && !["admin"].includes(selectedRole)}
              {...register("professional_register")}
            />
            {errors.professional_register && (
              <p className="text-xs text-destructive">{errors.professional_register.message}</p>
            )}
          </div>

          {/* Hourly cost */}
          <div className="space-y-1.5">
            <Label htmlFor="hourly_cost">
              Custo/hora (R$){" "}
              <span className="text-xs text-muted-foreground">(para DRE)</span>
            </Label>
            <Input
              id="hourly_cost"
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              {...register("hourly_cost")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {serverError && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {serverError}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isPending ? "Salvando..." : isEditing ? "Salvar alterações" : "Cadastrar colaborador"}
        </Button>
        <Button asChild variant="outline" type="button">
          <Link href="/staff">
            <ArrowLeft className="h-4 w-4" />
            Cancelar
          </Link>
        </Button>
      </div>
    </form>
  );
}
