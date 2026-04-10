"use client";

import { cn } from "@/lib/utils";

interface ModelBadgeProps {
  model?: string;
  tokensUsed?: number;
}

interface ModelInfo {
  label: string;
  color: string;
}

function getModelInfo(model: string): ModelInfo {
  const lower = model.toLowerCase();

  // Anthropic models
  if (lower.includes("opus"))
    return { label: "opus-4-6", color: "bg-purple-100 text-purple-700 border-purple-200" };
  if (lower.includes("sonnet"))
    return { label: "sonnet-4-6", color: "bg-purple-100 text-purple-700 border-purple-200" };
  if (lower.includes("haiku"))
    return { label: "haiku-4-5", color: "bg-purple-100 text-purple-700 border-purple-200" };

  // OpenAI models
  if (lower.includes("gpt-4o-mini"))
    return { label: "gpt-4o-mini", color: "bg-green-100 text-green-700 border-green-200" };
  if (lower.includes("gpt-4o"))
    return { label: "gpt-4o", color: "bg-green-100 text-green-700 border-green-200" };
  if (lower.includes("gpt"))
    return { label: model, color: "bg-green-100 text-green-700 border-green-200" };

  // Gemini models
  if (lower.includes("gemini"))
    return { label: "gemini", color: "bg-blue-100 text-blue-700 border-blue-200" };

  // DeepSeek models
  if (lower.includes("deepseek"))
    return { label: "deepseek", color: "bg-orange-100 text-orange-700 border-orange-200" };

  return { label: model, color: "bg-gray-100 text-gray-700 border-gray-200" };
}

export default function ModelBadge({ model, tokensUsed }: ModelBadgeProps) {
  if (!model) return null;

  const info = getModelInfo(model);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium",
        info.color
      )}
    >
      <span className="font-mono">{info.label}</span>
      {tokensUsed != null && tokensUsed > 0 && (
        <>
          <span className="text-current/50">|</span>
          <span className="tabular-nums">
            {tokensUsed.toLocaleString("pt-BR")}
          </span>
        </>
      )}
    </span>
  );
}
