import { z } from "zod";
import { validateCPF } from "@/lib/utils";

export const ROLES = ["admin", "doctor", "nurse", "biomedical", "receptionist", "viewer"] as const;
export type Role = typeof ROLES[number];

export const staffSchema = z.object({
  full_name: z.string().min(3, "Nome deve ter ao menos 3 caracteres").max(100),
  cpf: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => v.length === 11, "CPF deve ter 11 dígitos")
    .refine(validateCPF, "CPF inválido"),
  role: z.enum(ROLES, { message: "Selecione uma função" }),
  professional_register: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
  specialties: z.array(z.string()).optional().default([]),
  hourly_cost: z.coerce.number().min(0).optional(),
  birth_date: z.string().optional(),
  branch_id: z.string().uuid().optional(),
}).superRefine((data, ctx) => {
  const clinicalRoles = ["doctor", "nurse", "biomedical"];
  if (clinicalRoles.includes(data.role) && !data.professional_register?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["professional_register"],
      message: `Registro profissional obrigatório para ${data.role}`,
    });
  }
});

export type StaffFormValues = z.input<typeof staffSchema>;
export type StaffData = z.output<typeof staffSchema>;
