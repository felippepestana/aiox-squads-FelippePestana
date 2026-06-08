"use client";

import { useRouter } from "next/navigation";
import { Bell, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
  title?: string;
  description?: string;
  user?: { name: string | null; email: string };
  authEnabled?: boolean;
}

function initialsFrom(name: string | null, email: string): string {
  const source = (name && name.trim()) || email;
  const parts = source.split(/[\s@.]+/).filter(Boolean);
  const letters = (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
  return (letters || source.slice(0, 2)).toUpperCase();
}

export function Header({ title, description, user, authEnabled }: HeaderProps) {
  const router = useRouter();
  const displayName = user?.name || (authEnabled ? "Minha conta" : "Usuário Demo");
  const displayEmail = user?.email || "modo-demo@local";

  async function handleSignOut() {
    if (authEnabled) {
      try {
        await createClient().auth.signOut();
      } catch {
        // ignore — fall through to navigation
      }
    }
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex-1">
        {title && (
          <div>
            <h1 className="text-lg font-semibold text-foreground">{title}</h1>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        )}
      </div>

      <div className="hidden items-center md:flex">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar processos, análises..."
            className="w-64 pl-9 lg:w-80"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-medium text-danger-foreground">
            3
          </span>
        </Button>

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {initialsFrom(user?.name ?? null, displayEmail)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{displayName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {displayEmail}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href="/dashboard/config">Configurações</a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-danger"
                onSelect={(e) => {
                  e.preventDefault();
                  void handleSignOut();
                }}
              >
                {authEnabled ? "Sair" : "Trocar de conta"}
              </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
