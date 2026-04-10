"use client";

import { useState } from "react";
import { Plus, Trash2, Eye, EyeOff, Power, PowerOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ExistingKey {
  id: string;
  provider: string;
  label?: string;
  isActive: boolean;
}

interface ApiKeyFormProps {
  existingKeys?: ExistingKey[];
}

const PROVIDERS = [
  { value: "anthropic", label: "Anthropic" },
  { value: "openai", label: "OpenAI" },
  { value: "gemini", label: "Gemini" },
  { value: "deepseek", label: "DeepSeek" },
] as const;

const PROVIDER_COLORS: Record<string, string> = {
  anthropic: "bg-purple-100 text-purple-700 border-purple-200",
  openai: "bg-green-100 text-green-700 border-green-200",
  gemini: "bg-blue-100 text-blue-700 border-blue-200",
  deepseek: "bg-orange-100 text-orange-700 border-orange-200",
};

function maskKey(provider: string): string {
  const prefixes: Record<string, string> = {
    anthropic: "sk-ant-",
    openai: "sk-",
    gemini: "AIza",
    deepseek: "sk-",
  };
  const prefix = prefixes[provider] ?? "***";
  return `${prefix}...xxxx`;
}

export default function ApiKeyForm({ existingKeys = [] }: ApiKeyFormProps) {
  const [provider, setProvider] = useState("anthropic");
  const [apiKey, setApiKey] = useState("");
  const [label, setLabel] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [keys, setKeys] = useState<ExistingKey[]>(existingKeys);

  async function handleAdd() {
    if (!apiKey.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          key: apiKey,
          label: label.trim() || undefined,
        }),
      });

      if (res.ok) {
        const created = (await res.json()) as ExistingKey;
        setKeys((prev) => [...prev, created]);
        setApiKey("");
        setLabel("");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch("/api/api-keys", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setKeys((prev) => prev.filter((k) => k.id !== id));
    }
  }

  async function handleToggle(id: string, currentActive: boolean) {
    const res = await fetch("/api/api-keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isActive: !currentActive }),
    });

    if (res.ok) {
      setKeys((prev) =>
        prev.map((k) =>
          k.id === id ? { ...k, isActive: !currentActive } : k
        )
      );
    }
  }

  return (
    <div className="space-y-6">
      {/* Add new key form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Adicionar Chave de API</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="key-provider">Provedor</Label>
            <Select value={provider} onValueChange={setProvider}>
              <SelectTrigger id="key-provider">
                <SelectValue placeholder="Selecione o provedor" />
              </SelectTrigger>
              <SelectContent>
                {PROVIDERS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="key-value">Chave de API</Label>
            <div className="relative">
              <Input
                id="key-value"
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-ant-..."
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="key-label">Rótulo (opcional)</Label>
            <Input
              id="key-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Ex: Minha chave principal"
            />
          </div>

          <Button
            className="w-full"
            onClick={handleAdd}
            disabled={submitting || !apiKey.trim()}
          >
            <Plus className="mr-2 h-4 w-4" />
            {submitting ? "Salvando..." : "Adicionar Chave"}
          </Button>
        </CardContent>
      </Card>

      {/* Existing keys */}
      {keys.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Chaves Cadastradas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {keys.map((k) => (
                <div
                  key={k.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className={PROVIDER_COLORS[k.provider] ?? ""}
                    >
                      {k.provider}
                    </Badge>
                    <span className="text-sm font-mono text-muted-foreground">
                      {maskKey(k.provider)}
                    </span>
                    {k.label && (
                      <span className="text-xs text-muted-foreground">
                        {k.label}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggle(k.id, k.isActive)}
                      title={k.isActive ? "Desativar" : "Ativar"}
                    >
                      {k.isActive ? (
                        <Power className="h-4 w-4 text-green-500" />
                      ) : (
                        <PowerOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(k.id)}
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
