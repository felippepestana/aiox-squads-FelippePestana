"use client";

import { useState } from "react";
import CameraCapture from "@/components/property/CameraCapture";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────────

export interface InspectionItem {
  id: string;
  category: "foto" | "pergunta";
  label: string;
  description: string;
  required: boolean;
  options?: string[]; // for questions
  multiselect?: boolean; // allows multiple options
  photoTip?: string; // guidance for photo
}

export interface InspectionResponse {
  answer?: string;
  photo?: File;
  preview?: string;
}

export interface InspectionChecklistProps {
  items: InspectionItem[];
  responses: Record<string, InspectionResponse>;
  onPhotoCapture: (itemId: string, file: File, preview: string) => void;
  onAnswer: (itemId: string, answer: string) => void;
  onPhotoRemove: (itemId: string) => void;
}

// ── Pre-defined inspection items ───────────────────────────────────

export const INSPECTION_ITEMS: InspectionItem[] = [
  // Fotos Obrigatorias
  {
    id: "fachada-frontal",
    category: "foto",
    label: "Fachada Frontal",
    description: "Fotografe a frente do imovel, incluindo o numero e a rua",
    required: true,
    photoTip: "Posicione-se do outro lado da rua para capturar toda a fachada",
  },
  {
    id: "fachada-lateral",
    category: "foto",
    label: "Fachada Lateral",
    description: "Fotografe a lateral visivel do imovel, mostrando limites",
    required: true,
    photoTip: "Mostre os limites com o terreno vizinho",
  },
  {
    id: "entrada-principal",
    category: "foto",
    label: "Entrada Principal",
    description: "Fotografe a porta/portao de entrada principal",
    required: true,
    photoTip: "Inclua o numero da casa se visivel",
  },
  {
    id: "telhado-cobertura",
    category: "foto",
    label: "Telhado/Cobertura",
    description: "Fotografe o telhado mostrando tipo de cobertura e estado",
    required: true,
    photoTip: "Se possivel, fotografe de um angulo que mostre o tipo de telha",
  },
  {
    id: "rua-entorno",
    category: "foto",
    label: "Rua e Entorno",
    description: "Fotografe a rua em ambas as direcoes mostrando vizinhanca",
    required: true,
    photoTip: "Tire duas fotos: uma em cada direcao da rua",
  },

  // Fotos Opcionais
  {
    id: "area-interna",
    category: "foto",
    label: "Area Interna",
    description: "Se tiver acesso, fotografe o interior",
    required: false,
    photoTip: "Fotografe os comodos principais",
  },
  {
    id: "quintal-fundo",
    category: "foto",
    label: "Quintal/Fundos",
    description: "Fotografe a parte de tras do imovel",
    required: false,
    photoTip: "Mostre o tamanho e condicao do quintal",
  },
  {
    id: "garagem",
    category: "foto",
    label: "Garagem/Vagas",
    description: "Fotografe a area de estacionamento",
    required: false,
    photoTip: "Mostre a quantidade de vagas e cobertura",
  },
  {
    id: "placa-numero",
    category: "foto",
    label: "Placa/Numero",
    description: "Fotografe a placa de identificacao do imovel",
    required: false,
    photoTip: "Garanta que o numero esteja legivel na foto",
  },
  {
    id: "detalhe-estrutural",
    category: "foto",
    label: "Detalhe Estrutural",
    description: "Fotografe trincas, infiltracoes ou danos visiveis",
    required: false,
    photoTip: "Aproxime-se do dano para melhor registro",
  },

  // Perguntas Qualificadoras
  {
    id: "pavimentos",
    category: "pergunta",
    label: "Quantos pavimentos?",
    description: "Numero de andares do imovel",
    required: true,
    options: ["1", "2", "3", "4+"],
  },
  {
    id: "padrao-construtivo",
    category: "pergunta",
    label: "Padrao construtivo?",
    description: "Nivel geral de acabamento e construcao",
    required: true,
    options: ["Baixo", "Normal", "Alto", "Luxo"],
  },
  {
    id: "estado-conservacao",
    category: "pergunta",
    label: "Estado de conservacao?",
    description: "Condicao atual do imovel",
    required: true,
    options: ["Novo", "Bom", "Regular", "Ruim", "Demolicao"],
  },
  {
    id: "tipo-cobertura",
    category: "pergunta",
    label: "Tipo de cobertura?",
    description: "Material do telhado/cobertura",
    required: true,
    options: [
      "Telha ceramica",
      "Telha fibrocimento",
      "Laje",
      "Metalica",
      "Outro",
    ],
  },
  {
    id: "material-fachada",
    category: "pergunta",
    label: "Material da fachada?",
    description: "Revestimento externo principal",
    required: true,
    options: [
      "Alvenaria rebocada",
      "Alvenaria aparente",
      "Madeira",
      "Vidro/ACM",
      "Misto",
    ],
  },
  {
    id: "ocupacao",
    category: "pergunta",
    label: "Imovel esta ocupado?",
    description: "Situacao de ocupacao atual",
    required: true,
    options: [
      "Sim, pelo proprietario",
      "Sim, por inquilino",
      "Desocupado",
      "Em construcao",
    ],
  },
  {
    id: "infraestrutura-rua",
    category: "pergunta",
    label: "Infraestrutura da rua?",
    description: "Selecione todos que se aplicam",
    required: true,
    multiselect: true,
    options: [
      "Asfalto",
      "Calcada",
      "Iluminacao",
      "Rede de esgoto",
      "Agua encanada",
    ],
  },
  {
    id: "acesso",
    category: "pergunta",
    label: "Conseguiu acesso ao interior?",
    description: "Acesso para vistoria interna",
    required: true,
    options: ["Sim", "Nao", "Parcial"],
  },
];

// ── Component ──────────────────────────────────────────────────────

export default function InspectionChecklist({
  items,
  responses,
  onPhotoCapture,
  onAnswer,
  onPhotoRemove,
}: InspectionChecklistProps) {
  const requiredPhotos = items.filter(
    (i) => i.category === "foto" && i.required
  );
  const optionalPhotos = items.filter(
    (i) => i.category === "foto" && !i.required
  );
  const questions = items.filter((i) => i.category === "pergunta");

  // Progress calculation
  const total = items.length;
  const completed = items.filter((item) => {
    const r = responses[item.id];
    if (!r) return false;
    if (item.category === "foto") return !!r.preview;
    return !!r.answer;
  }).length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="sticky top-0 z-10 -mx-1 rounded-lg bg-background/95 px-1 py-3 backdrop-blur">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium">
            {completed} de {total} itens preenchidos
          </span>
          <span className="text-muted-foreground">{pct}%</span>
        </div>
        <Progress value={pct} className="h-2" />
      </div>

      {/* Required photos */}
      <section>
        <h3 className="mb-3 flex items-center gap-2 text-base font-semibold">
          <span>📷</span> Fotos Obrigatorias
        </h3>
        <div className="space-y-3">
          {requiredPhotos.map((item) => (
            <CameraCapture
              key={item.id}
              label={item.label}
              description={item.photoTip || item.description}
              required
              captured={responses[item.id]?.preview}
              onCapture={(file, preview) =>
                onPhotoCapture(item.id, file, preview)
              }
              onRemove={() => onPhotoRemove(item.id)}
            />
          ))}
        </div>
      </section>

      {/* Optional photos */}
      <section>
        <h3 className="mb-3 flex items-center gap-2 text-base font-semibold">
          <span>📷</span> Fotos Opcionais
        </h3>
        <div className="space-y-3">
          {optionalPhotos.map((item) => (
            <CameraCapture
              key={item.id}
              label={item.label}
              description={item.photoTip || item.description}
              captured={responses[item.id]?.preview}
              onCapture={(file, preview) =>
                onPhotoCapture(item.id, file, preview)
              }
              onRemove={() => onPhotoRemove(item.id)}
            />
          ))}
        </div>
      </section>

      {/* Questions */}
      <section>
        <h3 className="mb-3 flex items-center gap-2 text-base font-semibold">
          <span>📋</span> Perguntas Qualificadoras
        </h3>
        <div className="space-y-4">
          {questions.map((item) => (
            <QuestionItem
              key={item.id}
              item={item}
              value={responses[item.id]?.answer}
              onAnswer={(ans) => onAnswer(item.id, ans)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

// ── Question sub-component ─────────────────────────────────────────

function QuestionItem({
  item,
  value,
  onAnswer,
}: {
  item: InspectionItem;
  value?: string;
  onAnswer: (answer: string) => void;
}) {
  // For multiselect, store as comma-separated
  const [selected, setSelected] = useState<string[]>(() => {
    if (!value) return [];
    return value.split(",").map((s) => s.trim());
  });

  function toggleMulti(opt: string) {
    const next = selected.includes(opt)
      ? selected.filter((s) => s !== opt)
      : [...selected, opt];
    setSelected(next);
    onAnswer(next.join(", "));
  }

  if (!item.options) return null;

  return (
    <div className="rounded-lg border bg-card p-3">
      <p className="mb-1 text-sm font-medium">
        {item.label}
        {item.required && <span className="ml-1 text-destructive">*</span>}
      </p>
      <p className="mb-3 text-xs text-muted-foreground">{item.description}</p>
      <div className="flex flex-wrap gap-2">
        {item.options.map((opt) => {
          const isSelected = item.multiselect
            ? selected.includes(opt)
            : value === opt;

          return (
            <button
              key={opt}
              type="button"
              onClick={() => {
                if (item.multiselect) {
                  toggleMulti(opt);
                } else {
                  onAnswer(opt);
                }
              }}
              className={cn(
                "min-h-[44px] rounded-md border px-4 py-2 text-sm font-medium transition-colors",
                isSelected
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-input bg-background text-foreground hover:bg-muted"
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
