"use client";

import { User, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Party {
  name: string;
  role: "author" | "defendant" | "third_party" | "witness" | "expert";
  document?: string;
  attorney?: string;
}

interface PartiesSectionProps {
  parties: Party[];
}

function getRoleBadge(role: Party["role"]) {
  const config = {
    author: { label: "Autor", color: "bg-blue-100 text-blue-900" },
    defendant: { label: "Réu", color: "bg-red-100 text-red-900" },
    third_party: { label: "Terceiro", color: "bg-purple-100 text-purple-900" },
    witness: { label: "Testemunha", color: "bg-green-100 text-green-900" },
    expert: { label: "Perito", color: "bg-yellow-100 text-yellow-900" },
  };
  const cfg = config[role];
  return <Badge className={cfg.color}>{cfg.label}</Badge>;
}

export function PartiesSection({ parties }: PartiesSectionProps) {
  if (!parties || parties.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Partes Processuais
          </CardTitle>
          <CardDescription>Nenhuma parte identificada</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Partes Processuais
        </CardTitle>
        <CardDescription>{parties.length} parte(s) identificada(s)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {parties.map((party, idx) => (
            <div key={idx} className="flex items-start justify-between border-b pb-4 last:border-0">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-semibold text-sm">{party.name}</p>
                  {getRoleBadge(party.role)}
                </div>
                {party.document && (
                  <p className="text-xs text-muted-foreground">
                    <Shield className="inline h-3 w-3 mr-1" />
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
    </Card>
  );
}
