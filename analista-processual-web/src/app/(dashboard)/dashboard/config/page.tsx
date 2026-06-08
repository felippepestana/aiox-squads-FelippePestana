import { Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const providers = [
  { name: "OpenAI", env: "OPENAI_API_KEY", note: "Provedor padrão (GPT-4o / GPT-4o-mini)" },
  { name: "DeepSeek", env: "DEEPSEEK_API_KEY + DEEPSEEK_BASE_URL", note: "Compatível com OpenAI" },
  { name: "Qwen", env: "QWEN_API_KEY + QWEN_BASE_URL", note: "Compatível com OpenAI" },
  { name: "Kimi", env: "KIMI_API_KEY + KIMI_BASE_URL", note: "Compatível com OpenAI" },
  { name: "MiniMax", env: "MINIMAX_API_KEY + MINIMAX_BASE_URL", note: "Compatível com OpenAI" },
];

export default function ConfigPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Provedores de IA e preferências da plataforma
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Gateway LLM
          </CardTitle>
          <CardDescription>
            Os provedores são configurados por variáveis de ambiente. Defina ao
            menos um para habilitar a análise multiagente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {providers.map((p) => (
              <div
                key={p.name}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.note}</p>
                </div>
                <code className="rounded bg-muted px-2 py-1 text-xs">{p.env}</code>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
