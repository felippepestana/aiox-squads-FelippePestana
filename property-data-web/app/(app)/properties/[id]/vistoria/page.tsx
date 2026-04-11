"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import InspectionChecklist, {
  INSPECTION_ITEMS,
  type InspectionResponse,
} from "@/components/property/InspectionChecklist";

interface PropertySummary {
  id: string;
  address: string;
  number: string | null;
  city: string;
  state: string;
}

const STORAGE_PREFIX = "vistoria_";

export default function VistoriaPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [property, setProperty] = useState<PropertySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [responses, setResponses] = useState<
    Record<string, InspectionResponse>
  >({});

  const storageKey = `${STORAGE_PREFIX}${params.id}`;

  // Load property data
  useEffect(() => {
    fetch(`/api/properties/${params.id}`)
      .then((res) => res.json())
      .then((data) => setProperty(data))
      .catch(() => setProperty(null))
      .finally(() => setLoading(false));
  }, [params.id]);

  // Restore saved progress from localStorage (answers only, not files)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as Record<
          string,
          { answer?: string; preview?: string }
        >;
        // Restore answers and previews (files cannot be stored in localStorage)
        const restored: Record<string, InspectionResponse> = {};
        for (const [key, val] of Object.entries(parsed)) {
          restored[key] = { answer: val.answer, preview: val.preview };
        }
        setResponses(restored);
      }
    } catch {
      // Ignore corrupted localStorage
    }
  }, [storageKey]);

  // Save progress to localStorage
  const saveProgress = useCallback(() => {
    try {
      // Strip File objects (not serializable)
      const toSave: Record<string, { answer?: string; preview?: string }> = {};
      for (const [key, val] of Object.entries(responses)) {
        toSave[key] = { answer: val.answer, preview: val.preview };
      }
      localStorage.setItem(storageKey, JSON.stringify(toSave));
      toast.success("Progresso salvo localmente");
    } catch {
      toast.error("Erro ao salvar progresso");
    }
  }, [responses, storageKey]);

  function handlePhotoCapture(itemId: string, file: File, preview: string) {
    setResponses((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], photo: file, preview },
    }));
  }

  function handleAnswer(itemId: string, answer: string) {
    setResponses((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], answer },
    }));
  }

  function handlePhotoRemove(itemId: string) {
    setResponses((prev) => {
      const next = { ...prev };
      if (next[itemId]) {
        const { photo, preview, ...rest } = next[itemId];
        next[itemId] = rest;
      }
      return next;
    });
  }

  // Validate required items
  function validateRequired(): string[] {
    const missing: string[] = [];
    for (const item of INSPECTION_ITEMS) {
      if (!item.required) continue;
      const r = responses[item.id];
      if (!r) {
        missing.push(item.label);
        continue;
      }
      if (item.category === "foto" && !r.preview) {
        missing.push(item.label);
      }
      if (item.category === "pergunta" && !r.answer) {
        missing.push(item.label);
      }
    }
    return missing;
  }

  async function handleSubmit() {
    const missing = validateRequired();
    if (missing.length > 0) {
      toast.error(
        `Itens obrigatorios faltando: ${missing.slice(0, 3).join(", ")}${missing.length > 3 ? ` e mais ${missing.length - 3}` : ""}`
      );
      return;
    }

    setSubmitting(true);

    try {
      // 1. Upload each photo as a document
      const photoItems = INSPECTION_ITEMS.filter(
        (i) => i.category === "foto" && responses[i.id]?.photo
      );

      for (const item of photoItems) {
        const r = responses[item.id];
        if (!r?.photo) continue;

        const formData = new FormData();
        formData.append("file", r.photo);
        formData.append("type", "foto");
        formData.append("name", `vistoria-${item.id}.${r.photo.name.split(".").pop() || "jpg"}`);

        const res = await fetch(
          `/api/properties/${params.id}/documents`,
          { method: "POST", body: formData }
        );

        if (!res.ok) {
          throw new Error(`Falha ao enviar foto: ${item.label}`);
        }
      }

      // 2. Save inspection answers as JSON document
      const answers: Record<string, string> = {};
      for (const item of INSPECTION_ITEMS) {
        if (item.category === "pergunta" && responses[item.id]?.answer) {
          answers[item.id] = responses[item.id].answer!;
        }
      }

      const answersBlob = new Blob([JSON.stringify(answers, null, 2)], {
        type: "application/json",
      });
      const answersFile = new File([answersBlob], "vistoria-respostas.json", {
        type: "application/json",
      });

      const answersForm = new FormData();
      answersForm.append("file", answersFile);
      answersForm.append("type", "vistoria");
      answersForm.append("name", "vistoria-respostas.json");

      const answersRes = await fetch(
        `/api/properties/${params.id}/documents`,
        { method: "POST", body: answersForm }
      );

      if (!answersRes.ok) {
        throw new Error("Falha ao salvar respostas da vistoria");
      }

      // 3. Clear localStorage
      localStorage.removeItem(storageKey);

      toast.success("Vistoria concluida com sucesso!");
      router.push(`/properties/${params.id}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao concluir vistoria"
      );
    } finally {
      setSubmitting(false);
    }
  }

  // Compute progress
  const total = INSPECTION_ITEMS.length;
  const completed = INSPECTION_ITEMS.filter((item) => {
    const r = responses[item.id];
    if (!r) return false;
    if (item.category === "foto") return !!r.preview;
    return !!r.answer;
  }).length;

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-destructive">Imovel nao encontrado.</p>
        <Button asChild variant="outline">
          <Link href="/dashboard">Voltar</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="relative pb-24">
      {/* Header */}
      <div className="mb-6 space-y-2">
        <Link
          href={`/properties/${params.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao imovel
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-bold sm:text-2xl">
            {property.address}
            {property.number ? `, ${property.number}` : ""}
          </h1>
          <Badge variant="secondary">Vistoria em campo</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {property.city} - {property.state}
        </p>
      </div>

      {/* Checklist */}
      <InspectionChecklist
        items={INSPECTION_ITEMS}
        responses={responses}
        onPhotoCapture={handlePhotoCapture}
        onAnswer={handleAnswer}
        onPhotoRemove={handlePhotoRemove}
      />

      {/* Sticky bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t bg-background/95 px-4 py-3 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-3xl gap-3">
          <Button
            type="button"
            variant="outline"
            className="min-h-[48px] flex-1 gap-2"
            onClick={saveProgress}
          >
            <Save className="h-4 w-4" />
            Salvar Progresso
          </Button>
          <Button
            type="button"
            className="min-h-[48px] flex-1 gap-2"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            {submitting ? "Enviando..." : "Concluir Vistoria"}
          </Button>
        </div>
        <p className="mx-auto mt-1.5 max-w-3xl text-center text-xs text-muted-foreground">
          {completed} de {total} itens preenchidos
        </p>
      </div>
    </div>
  );
}
