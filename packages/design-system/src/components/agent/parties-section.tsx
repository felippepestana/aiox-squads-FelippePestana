"use client";

import { User, Shield } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";

export interface Party {
  name: string;
  role: "author" | "defendant" | "third_party" | "witness" | "expert";
  document?: string;
  attorney?: string;
}

function getRoleBadge(role: Party["role"]) {
  const config: Record<Party["role"], { label: string; color: string }> = {
    author: { label: "Autor", color: "bg-blue-100 text-blue-900" },
    defendant: { label: "Réu", color: "bg-red-100 text-red-900" },
    third_party: { label: "Terceiro", color: "bg-purple-100 text-purple-900" },
    witness: { label: "Testemunha", color: "bg-green-100 text-green-900" },
    expert: { label: "Perito", color: "bg-yellow-100 text-yellow-900" },
  };
  const cfg = config[role];
  return <Badge className={cfg.color}>{cfg.label}</Badge>;
}

export function PartiesSection({ parties }: { parties: Party[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Partes Processuais
        </CardTitle>
        <CardDescription>
          {parties?.length
            ? `${parties.length} parte(s) identificada(s)`
            : "Nenhuma parte identificada"}
        </CardDescription>
      </CardHeader>
      {parties?.length > 0 && (
        <CardContent>
          <div className="space-y-4">
            {parties.map((party, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between border-b pb-4 last:border-0"
              >
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <p className="text-sm font-semibold">{party.name}</p>
                    {getRoleBadge(party.role)}
                  </div>
                  {party.document && (
                    <p className="text-xs text-muted-foreground">
                      <Shield className="mr-1 inline h-3 w-3" />
                      {party.document}
                    </p>
                  )}
                  {party.attorney && (
                    <p className="text-xs text-muted-foreground">
                      Advogado: {party.attorney}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
