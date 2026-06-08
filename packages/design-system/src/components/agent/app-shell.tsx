import * as React from "react";

import { cn } from "../../lib/cn";

interface AppShellProps {
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * Layout base do app: sidebar à esquerda, header fixo no topo e conteúdo
 * rolável. Presentational — a navegação/branding é injetada via props.
 */
export function AppShell({ sidebar, header, children, className }: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {sidebar}
      <div className="flex flex-1 flex-col overflow-hidden">
        {header}
        <main className={cn("flex-1 overflow-y-auto p-6", className)}>
          {children}
        </main>
      </div>
    </div>
  );
}
