import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  return digits;
}

export function validateCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  const calcDigit = (slice: string, factor: number) => {
    const sum = slice.split("").reduce((acc, d, i) => acc + parseInt(d) * (factor - i), 0);
    const rem = sum % 11;
    return rem < 2 ? 0 : 11 - rem;
  };

  const d1 = calcDigit(digits.slice(0, 9), 10);
  const d2 = calcDigit(digits.slice(0, 10), 11);

  return parseInt(digits[9]) === d1 && parseInt(digits[10]) === d2;
}

export function rolLabel(role: string): string {
  const labels: Record<string, string> = {
    admin: "Administrador",
    doctor: "Médico(a)",
    nurse: "Enfermeiro(a)",
    biomedical: "Biomédico(a)",
    receptionist: "Recepcionista",
    viewer: "Visualizador",
  };
  return labels[role] ?? role;
}

export function roleColor(role: string): string {
  const colors: Record<string, string> = {
    admin: "bg-purple-100 text-purple-800",
    doctor: "bg-brand-primary-light text-brand-primary",
    nurse: "bg-green-100 text-green-800",
    biomedical: "bg-blue-100 text-blue-800",
    receptionist: "bg-amber-100 text-amber-800",
    viewer: "bg-slate-100 text-slate-600",
  };
  return colors[role] ?? "bg-slate-100 text-slate-600";
}

export function requiresClinicalRegister(role: string): boolean {
  return ["doctor", "nurse", "biomedical"].includes(role);
}

export function clinicalRegisterLabel(role: string): string {
  if (role === "doctor") return "CRM";
  if (role === "nurse") return "COREN";
  if (role === "biomedical") return "CFBM";
  return "Registro Profissional";
}
