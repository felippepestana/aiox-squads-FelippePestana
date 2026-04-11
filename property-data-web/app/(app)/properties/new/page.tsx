"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PropertyWizard } from "@/components/property/PropertyWizard";
import type { PropertyFormData } from "@/types/property";
import type { UseCase } from "@/types/analysis";

function guessDocType(file: File): string {
  const name = file.name.toLowerCase();
  if (name.includes("matricula")) return "matricula";
  if (name.includes("iptu")) return "iptu";
  if (name.includes("habite")) return "habite_se";
  if (name.includes("planta")) return "planta";
  if (file.type.startsWith("image/")) return "foto";
  return "outro";
}

export default function NewPropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleComplete(data: {
    property: PropertyFormData;
    files: File[];
    useCase: UseCase;
  }) {
    setLoading(true);

    try {
      // 1. Create the property
      const propertyRes = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data.property),
      });

      if (!propertyRes.ok) throw new Error("Erro ao criar imovel");
      const property = await propertyRes.json();
      const propertyId: string = property.id;

      // 2. Upload each document
      for (const file of data.files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", guessDocType(file));

        const docRes = await fetch(
          `/api/properties/${propertyId}/documents`,
          { method: "POST", body: formData }
        );

        if (!docRes.ok) {
          console.error(`Failed to upload ${file.name}`);
          toast.error(`Erro ao enviar documento: ${file.name}`);
        }
      }

      // 3. Create analysis with the selected use case
      const analysisRes = await fetch("/api/analyses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId,
          useCase: data.useCase,
        }),
      });

      if (analysisRes.ok) {
        const analysis = await analysisRes.json();
        // 4. Redirect to analysis page
        router.push(
          `/properties/${propertyId}/analysis/${analysis.id}`
        );
      } else {
        toast.error("Erro ao criar analise, redirecionando ao imovel...");
        router.push(`/properties/${propertyId}`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro inesperado");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Novo Imovel</h1>
      <PropertyWizard onComplete={handleComplete} loading={loading} />
    </div>
  );
}
