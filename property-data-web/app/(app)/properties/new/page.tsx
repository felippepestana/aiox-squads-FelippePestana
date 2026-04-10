"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import type { PropertyFormData, PropertyType } from "@/types/property";

const propertyTypes: { value: PropertyType; label: string }[] = [
  { value: "residencial", label: "Residencial" },
  { value: "comercial", label: "Comercial" },
  { value: "rural", label: "Rural" },
  { value: "misto", label: "Misto" },
];

export default function NewPropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<PropertyFormData>({
    address: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    cep: "",
    type: "residencial",
  });

  function update(field: keyof PropertyFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Erro ao criar imovel");
      const property = await res.json();

      // Create initial analysis
      const analysisRes = await fetch("/api/analyses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: property.id,
          useCase: "UC-PD-ALL",
        }),
      });

      if (analysisRes.ok) {
        const analysis = await analysisRes.json();
        router.push(
          `/properties/${property.id}/analysis/${analysis.id}`
        );
      } else {
        router.push(`/properties/${property.id}`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro inesperado");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Novo Imovel</h1>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Dados do Imovel</CardTitle>
            <CardDescription>
              Preencha as informacoes basicas do imovel
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">Endereco</Label>
              <Input
                id="address"
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="number">Numero</Label>
              <Input
                id="number"
                value={form.number}
                onChange={(e) => update("number", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cep">CEP</Label>
              <Input
                id="cep"
                value={form.cep}
                onChange={(e) => update("cep", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input
                id="neighborhood"
                value={form.neighborhood}
                onChange={(e) => update("neighborhood", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                value={form.state}
                onChange={(e) => update("state", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <select
                id="type"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.type}
                onChange={(e) =>
                  update("type", e.target.value as PropertyType)
                }
              >
                {propertyTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="matricula">Matricula</Label>
              <Input
                id="matricula"
                value={form.matricula ?? ""}
                onChange={(e) => update("matricula", e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Criando..." : "Criar Imovel e Iniciar Analise"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
