"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CalendarDays,
  Megaphone,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bot,
} from "lucide-react";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Eventos", href: "/dashboard/eventos", icon: CalendarDays },
  { name: "Marketing", href: "/dashboard/marketing", icon: Megaphone },
  { name: "Alumni / CRM", href: "/dashboard/alumni", icon: Users },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
];

const bottomItems = [
  { name: "Configurações", href: "/dashboard/config", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  const logoContent = collapsed ? (
    <Link href="/dashboard" className="mx-auto">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 gold-glow">
        <span className="text-base font-bold gold-text">L</span>
      </div>
    </Link>
  ) : (
    <Link href="/dashboard" className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 flex-shrink-0">
        <span className="text-base font-bold gold-text">L</span>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-foreground leading-tight">Legendários</p>
        <p className="text-[10px] text-muted-foreground leading-tight">Platform v1.0</p>
      </div>
    </Link>
  );

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "flex flex-col h-screen border-r border-border bg-card/50 transition-all duration-300 flex-shrink-0 sticky top-0",
          collapsed ? "w-16" : "w-60"
        )}
      >
        {/* Header */}
        <div className="flex h-14 items-center justify-between border-b border-border px-3">
          {logoContent}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "flex items-center justify-center h-6 w-6 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex-shrink-0",
              collapsed && "mx-auto"
            )}
          >
            {collapsed ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronLeft className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            const navLink = (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  collapsed && "justify-center px-2"
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>{navLink}</TooltipTrigger>
                  <TooltipContent side="right">{item.name}</TooltipContent>
                </Tooltip>
              );
            }
            return navLink;
          })}

          {/* AI Agents section */}
          {!collapsed && (
            <div className="pt-4">
              <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Agentes IA
              </p>
              <Link
                href="/dashboard/agentes"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                  pathname.startsWith("/dashboard/agentes")
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Bot className="h-4 w-4 flex-shrink-0" />
                <span>Legendários Chief</span>
              </Link>
            </div>
          )}
          {collapsed && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/dashboard/agentes"
                  className={cn(
                    "flex items-center justify-center rounded-lg px-2 py-2 text-sm font-medium transition-all duration-150",
                    pathname.startsWith("/dashboard/agentes")
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Bot className="h-4 w-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Legendários Chief</TooltipContent>
            </Tooltip>
          )}
        </nav>

        {/* Bottom */}
        <div className="border-t border-border p-2 space-y-0.5">
          <Separator className="mb-2" />
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const link = (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
                  collapsed && "justify-center px-2"
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
            if (collapsed) {
              return (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent side="right">{item.name}</TooltipContent>
                </Tooltip>
              );
            }
            return link;
          })}

          {/* Logout */}
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center rounded-lg px-2 py-2 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Sair</TooltipContent>
            </Tooltip>
          ) : (
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              <span>Sair</span>
            </button>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}
