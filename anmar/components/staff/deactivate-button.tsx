"use client";

import { useTransition } from "react";
import { deactivateStaff } from "@/actions/staff";
import { Button } from "@/components/ui/button";
import { Loader2, UserX } from "lucide-react";

export function DeactivateButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm("Deseja desativar este colaborador?")) return;
    startTransition(async () => { await deactivateStaff(id); });
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="text-destructive border-destructive/30 hover:bg-destructive/10"
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserX className="h-4 w-4" />}
      Desativar
    </Button>
  );
}
