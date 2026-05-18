"use client";

import { Scale, Banknote } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Claim {
  type: string;
  description: string;
  value?: number;
  status: "pending" | "granted" | "denied" | "partial";
}

interface ClaimsSectionProps {
  claims: Claim[];
}

function getStatusBadge(status: Claim["status"]) {
  const config = {
    pending: { label: "Pendente", color: "bg-yellow-100 text-yellow-900" },
    granted: { label: "Concedido", color: "bg-green-100 text-green-900" },
    denied: { label: "Negado", color: "bg-red-100 text-red-900" },
    partial: { label: "Parcial", color: "bg-blue-100 text-blue-900" },
  };
  const cfg = config[status];
  return <Badge className={cfg.color}>{cfg.label}</Badge>;
}

function formatCurrency(value?: number) {
  if (!value) return "N/A";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function ClaimsSection({ claims }: ClaimsSectionProps) {
  if (!claims || claims.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Pedidos
          </CardTitle>
          <CardDescription>Nenhum pedido identificado</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const totalValue = claims.reduce((sum, claim) => sum + (claim.value || 0), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="h-5 w-5" />
          Pedidos
        </CardTitle>
        <CardDescription>{claims.length} pedido(s) identificado(s)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {totalValue > 0 && (
          <div className="bg-muted p-3 rounded-lg flex items-center justify-between">
            <span className="text-sm font-medium">Valor Total Reclamado</span>
            <span className="text-lg font-bold flex items-center gap-1">
              <Banknote className="h-4 w-4" />
              {formatCurrency(totalValue)}
            </span>
          </div>
        )}

        <div className="space-y-3">
          {claims.map((claim, idx) => (
            <div key={idx} className="border rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-sm">{claim.type}</p>
                  <p className="text-sm text-muted-foreground">{claim.description}</p>
                </div>
                {getStatusBadge(claim.status)}
              </div>
              {claim.value && claim.value > 0 && (
                <p className="text-sm font-medium text-primary flex items-center gap-1">
                  <Banknote className="h-3 w-3" />
                  {formatCurrency(claim.value)}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
