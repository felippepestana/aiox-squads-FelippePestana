"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

interface ResultsTabsProps {
  result: Record<string, unknown> | null;
}

const TAB_CONFIG = [
  { id: "registral", label: "Registral", key: "registral" },
  { id: "legislacao", label: "Legislação", key: "legislacao" },
  { id: "urbanistico", label: "Urbanístico", key: "urbanistico" },
  { id: "visual", label: "Visual", key: "visual" },
  { id: "avaliacao", label: "Avaliação", key: "avaliacao" },
  { id: "ambiental", label: "Ambiental", key: "ambiental" },
  { id: "condominial", label: "Condominial", key: "condominial" },
] as const;

function renderValue(value: unknown, depth = 0): React.ReactNode {
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground italic">—</span>;
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return <span>{String(value)}</span>;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span className="text-muted-foreground italic">Lista vazia</span>;
    }

    // If array of objects, render as table
    if (typeof value[0] === "object" && value[0] !== null && !Array.isArray(value[0])) {
      const keys = Object.keys(value[0] as Record<string, unknown>);
      return (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                {keys.map((key) => (
                  <th
                    key={key}
                    className="border border-border bg-muted/50 px-3 py-1.5 text-left font-medium"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {value.map((row, i) => (
                <tr key={i}>
                  {keys.map((key) => (
                    <td key={key} className="border border-border px-3 py-1.5">
                      {renderValue((row as Record<string, unknown>)[key], depth + 1)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // Simple array
    return (
      <ul className="list-disc pl-5 space-y-1">
        {value.map((item, i) => (
          <li key={i} className="text-sm">
            {renderValue(item, depth + 1)}
          </li>
        ))}
      </ul>
    );
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) {
      return <span className="text-muted-foreground italic">—</span>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <tbody>
            {entries.map(([key, val]) => (
              <tr key={key}>
                <td className="border border-border bg-muted/50 px-3 py-1.5 font-medium whitespace-nowrap align-top w-1/4">
                  {key}
                </td>
                <td className="border border-border px-3 py-1.5">
                  {renderValue(val, depth + 1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return <span>{String(value)}</span>;
}

function renderSection(data: unknown): React.ReactNode {
  if (!data) {
    return (
      <p className="text-sm text-muted-foreground italic py-4">
        Dados não disponíveis para esta seção.
      </p>
    );
  }

  if (typeof data === "string") {
    return (
      <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">
        {data}
      </div>
    );
  }

  return renderValue(data);
}

export default function ResultsTabs({ result }: ResultsTabsProps) {
  if (!result) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Nenhum resultado disponível. Execute uma análise primeiro.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="registral" className="w-full">
      <TabsList className="flex flex-wrap h-auto gap-1">
        {TAB_CONFIG.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id} className="text-xs">
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {TAB_CONFIG.map((tab) => (
        <TabsContent key={tab.id} value={tab.id}>
          <Card>
            <CardContent className="p-6">
              {renderSection(result[tab.key])}
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
}
