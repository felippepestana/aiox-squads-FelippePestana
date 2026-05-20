"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Stethoscope,
  Heart,
  DollarSign,
  Camera,
  Package,
  MessageSquare,
  BookOpen,
  Settings,
  LogOut,
} from "lucide-react";
import { logoutAction } from "@/actions/staff";

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard", group: "main" },
  { href: "/staff", icon: Users, label: "Colaboradores", group: "main" },
  { href: "/patients", icon: Heart, label: "Pacientes", group: "main" },
  { href: "/agenda", icon: Calendar, label: "Agenda", group: "main" },
  { href: "/consultas", icon: Stethoscope, label: "Atendimento Médico", group: "clinica" },
  { href: "/visual", icon: Camera, label: "Evolução Visual", group: "clinica" },
  { href: "/followup", icon: MessageSquare, label: "Follow-up", group: "clinica" },
  { href: "/protocolos", icon: BookOpen, label: "Protocolos", group: "clinica" },
  { href: "/estoque", icon: Package, label: "Estoque", group: "operacional" },
  { href: "/financeiro", icon: DollarSign, label: "Financeiro", group: "operacional" },
  { href: "/configuracoes", icon: Settings, label: "Configurações", group: "sistema" },
];

const groups = [
  { id: "main", label: "Principal" },
  { id: "clinica", label: "Clínica" },
  { id: "operacional", label: "Operacional" },
  { id: "sistema", label: "Sistema" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 border-b border-border px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary text-white text-sm font-bold">
          A
        </div>
        <div>
          <p className="text-sm font-semibold text-brand-dark">Clínica Anmar</p>
          <p className="text-xs text-muted-foreground">Gestão Inteligente</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-4">
        {groups.map((group) => {
          const items = navItems.filter((i) => i.group === group.id);
          if (!items.length) return null;
          return (
            <div key={group.id}>
              <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {items.map((item) => {
                  const isActive =
                    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "sidebar-item",
                        isActive ? "sidebar-item-active" : "sidebar-item-inactive"
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-3">
        <form action={logoutAction}>
          <button
            type="submit"
            className="sidebar-item sidebar-item-inactive w-full text-destructive hover:bg-red-50 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            <span>Sair</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
