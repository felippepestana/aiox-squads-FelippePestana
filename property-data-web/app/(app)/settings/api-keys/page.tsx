"use client";

import { useEffect, useState } from "react";
import { Key, Eye, EyeOff, Save, Trash2, Info } from "lucide-react";
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
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ApiKey {
  provider: string;
  maskedKey: string;
  updatedAt: string;
}

const providers = [
  { id: "anthropic", label: "Anthropic", prefix: "sk-ant-" },
  { id: "openai", label: "OpenAI", prefix: "sk-" },
  { id: "gemini", label: "Google Gemini", prefix: "AI" },
  { id: "deepseek", label: "DeepSeek", prefix: "sk-" },
];

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/settings/api-keys")
      .then((res) => res.json())
      .then((data: ApiKey[]) => setKeys(data))
      .catch(() => setKeys([]));
  }, []);

  function getExistingKey(provider: string) {
    return keys.find((k) => k.provider === provider);
  }

  async function handleSave(provider: string) {
    const value = values[provider];
    if (!value?.trim()) return;

    setSaving(provider);
    try {
      const res = await fetch("/api/settings/api-keys", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, key: value }),
      });
      if (!res.ok) throw new Error("Erro ao salvar chave");
      const updated = await res.json();
      setKeys((prev) => {
        const idx = prev.findIndex((k) => k.provider === provider);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = updated;
          return next;
        }
        return [...prev, updated];
      });
      setValues((prev) => ({ ...prev, [provider]: "" }));
      toast.success(`Chave ${provider} salva com sucesso`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro inesperado");
    } finally {
      setSaving(null);
    }
  }

  async function handleDelete(provider: string) {
    try {
      const res = await fetch(`/api/settings/api-keys?provider=${provider}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erro ao remover chave");
      setKeys((prev) => prev.filter((k) => k.provider !== provider));
      toast.success(`Chave ${provider} removida`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro inesperado");
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Chaves de API LLM</h1>

      <p className="text-muted-foreground">
        Suas chaves de API sao usadas para acessar os modelos de linguagem
        durante as analises. As chaves sao criptografadas antes de serem
        armazenadas.
      </p>

      {/* Provider forms */}
      {providers.map((p) => {
        const existing = getExistingKey(p.id);
        return (
          <Card key={p.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <Key className="h-4 w-4 text-muted-foreground" />
                <div>
                  <CardTitle className="text-base">{p.label}</CardTitle>
                  {existing && (
                    <CardDescription>
                      Configurada: {existing.maskedKey}
                    </CardDescription>
                  )}
                </div>
              </div>
              {existing && (
                <Badge variant="default">Ativa</Badge>
              )}
            </CardHeader>
            <CardContent className="flex items-end gap-3">
              <div className="flex-1 space-y-2">
                <Label htmlFor={`key-${p.id}`}>API Key</Label>
                <div className="relative">
                  <Input
                    id={`key-${p.id}`}
                    type={visible[p.id] ? "text" : "password"}
                    placeholder={`${p.prefix}...`}
                    value={values[p.id] ?? ""}
                    onChange={(e) =>
                      setValues((prev) => ({ ...prev, [p.id]: e.target.value }))
                    }
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                    onClick={() =>
                      setVisible((prev) => ({
                        ...prev,
                        [p.id]: !prev[p.id],
                      }))
                    }
                  >
                    {visible[p.id] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <Button
                size="sm"
                disabled={saving === p.id || !values[p.id]?.trim()}
                onClick={() => handleSave(p.id)}
              >
                <Save className="mr-1 h-3 w-3" />
                Salvar
              </Button>
              {existing && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(p.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </CardContent>
          </Card>
        );
      })}

      {/* Info card */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader className="flex flex-row items-center gap-3">
          <Info className="h-5 w-5 text-blue-600" />
          <div>
            <CardTitle className="text-base text-blue-900">
              Provedores suportados
            </CardTitle>
            <CardDescription className="text-blue-700">
              A plataforma utiliza suas proprias chaves de API em vez de chaves
              do sistema. Provedores suportados: Anthropic, OpenAI, Google
              Gemini e DeepSeek.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
