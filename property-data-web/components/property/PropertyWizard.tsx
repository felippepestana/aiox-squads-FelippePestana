"use client";

import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Check } from "lucide-react";

import type { PropertyFormData } from "@/types/property";
import type { UseCase } from "@/types/analysis";
import { USE_CASE_LABELS } from "@/types/analysis";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { AddressForm } from "@/components/property/AddressForm";
import { DocumentUpload } from "@/components/property/DocumentUpload";

const STEPS = [
  { title: "Dados do Imovel", description: "Informe o endereco e detalhes" },
  { title: "Documentos", description: "Envie os documentos do imovel" },
  { title: "Analise", description: "Selecione o tipo de analise" },
];

interface PropertyWizardProps {
  onComplete?: (data: {
    property: PropertyFormData;
    files: File[];
    useCase: UseCase;
  }) => void | Promise<void>;
  loading?: boolean;
}

export function PropertyWizard({ onComplete, loading = false }: PropertyWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase | null>(null);

  const form = useForm<PropertyFormData>({
    defaultValues: {
      cep: "",
      address: "",
      number: "",
      neighborhood: "",
      city: "",
      state: "",
      type: "residencial",
      area: undefined,
      matricula: "",
    },
  });

  const handleNext = useCallback(() => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const handleUpload = useCallback((files: File[]) => {
    setUploadedFiles((prev) => [...prev, ...files]);
  }, []);

  const handleStartAnalysis = useCallback(async () => {
    if (!selectedUseCase) return;

    const formData = form.getValues();
    if (onComplete) {
      await onComplete({
        property: formData,
        files: uploadedFiles,
        useCase: selectedUseCase,
      });
    }
  }, [selectedUseCase, form, uploadedFiles, onComplete]);

  const useCaseEntries = Object.entries(USE_CASE_LABELS) as [UseCase, string][];

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <nav aria-label="Progress">
        <ol className="flex items-center gap-2">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
                  index < currentStep
                    ? "border-primary bg-primary text-primary-foreground"
                    : index === currentStep
                      ? "border-primary text-primary"
                      : "border-muted-foreground/25 text-muted-foreground"
                )}
              >
                {index < currentStep ? (
                  <Check className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={cn(
                  "hidden text-sm sm:inline",
                  index === currentStep
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {step.title}
              </span>
              {index < STEPS.length - 1 && (
                <div className="mx-2 h-px w-8 bg-muted-foreground/25" />
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Step content */}
      <Card>
        <CardHeader>
          <CardTitle>{STEPS[currentStep].title}</CardTitle>
          <CardDescription>{STEPS[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Step 1: Address form */}
          {currentStep === 0 && <AddressForm form={form} />}

          {/* Step 2: Document upload */}
          {currentStep === 1 && (
            <DocumentUpload
              propertyId="new"
              onUpload={handleUpload}
            />
          )}

          {/* Step 3: Select use case */}
          {currentStep === 2 && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Selecione o tipo de analise que deseja realizar:
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {useCaseEntries.map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedUseCase(key)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border p-3 text-left text-sm transition-colors hover:bg-accent",
                      selectedUseCase === key
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-input"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                        selectedUseCase === key
                          ? "border-primary bg-primary"
                          : "border-muted-foreground/25"
                      )}
                    >
                      {selectedUseCase === key && (
                        <Check className="h-3 w-3 text-primary-foreground" />
                      )}
                    </div>
                    <div>
                      <span className="font-medium">{label}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {key}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            Voltar
          </Button>
          {currentStep < STEPS.length - 1 ? (
            <Button type="button" onClick={handleNext}>
              Proximo
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleStartAnalysis}
              disabled={!selectedUseCase || loading}
            >
              {loading ? "Processando..." : "Iniciar Analise"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
