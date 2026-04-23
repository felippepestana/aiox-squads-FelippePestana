import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatBRLCents(cents: number): string {
  return formatBRL(cents / 100);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("pt-BR").format(value);
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), "dd/MM/yyyy", { locale: ptBR });
}

export function formatDatetime(date: string | Date): string {
  return format(new Date(date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
}

export function formatRelative(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ptBR });
}

export function semaforoStatus(atual: number, meta: number): "verde" | "amarelo" | "vermelho" {
  const pct = meta > 0 ? (atual / meta) * 100 : 0;
  if (pct >= 90) return "verde";
  if (pct >= 70) return "amarelo";
  return "vermelho";
}

export function calcROI(receita: number, custo: number): number {
  if (custo === 0) return 0;
  return ((receita - custo) / custo) * 100;
}

export function calcCPL(gasto: number, leads: number): number {
  if (leads === 0) return 0;
  return gasto / leads;
}

export function calcRAS(gasto: number, receita: number): number {
  if (gasto === 0) return 0;
  return receita / gasto;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function tipoEventoLabel(tipo: string): string {
  const labels: Record<string, string> = {
    TOP: "TOP — Track Outdoor de Potencial",
    REM: "REM — Retiro de Empoderamento Matrimonial",
    LEGADO: "LEGADO — Pais e Filhos",
  };
  return labels[tipo] ?? tipo;
}

export function statusEventoColor(status: string): string {
  const colors: Record<string, string> = {
    planejamento: "bg-muted text-muted-foreground",
    inscricoes_abertas: "semaforo-verde",
    esgotado: "semaforo-amarelo",
    em_andamento: "bg-primary/15 text-primary border border-primary/30",
    encerrado: "bg-muted text-muted-foreground",
    cancelado: "semaforo-vermelho",
  };
  return colors[status] ?? "bg-muted text-muted-foreground";
}
