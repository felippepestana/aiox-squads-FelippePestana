"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AvaliacaoTabProps {
  data: Record<string, unknown> | null;
}

const currencyFmt = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function formatCurrency(value: unknown): string {
  if (typeof value === "number") return currencyFmt.format(value);
  if (typeof value === "string") {
    const num = parseFloat(value);
    if (!isNaN(num)) return currencyFmt.format(num);
  }
  return "—";
}

function safeString(value: unknown): string {
  if (value === null || value === undefined) return "—";
  return String(value);
}

export default function AvaliacaoTab({ data }: AvaliacaoTabProps) {
  if (!data) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-muted-foreground italic">
          Dados de avaliação não disponíveis para esta seção.
        </p>
      </div>
    );
  }

  const method = data.metodo ?? data.method ?? data.metodologia;
  const fundamentacao =
    data.grauFundamentacao ??
    data.grau_fundamentacao ??
    data.fundamentacao;
  const precisao =
    data.grauPrecisao ?? data.grau_precisao ?? data.precisao;
  const valor =
    data.valorAvaliado ??
    data.valor_avaliado ??
    data.valor ??
    data.value;
  const valorMin =
    data.valorMinimo ??
    data.valor_minimo ??
    data.min ??
    data.intervaloMin;
  const valorMax =
    data.valorMaximo ??
    data.valor_maximo ??
    data.max ??
    data.intervaloMax;
  const comparables = (data.comparaveis ??
    data.comparables ??
    data.amostras) as Array<Record<string, unknown>> | undefined;

  const chartData =
    comparables?.map((comp, i) => ({
      name:
        safeString(comp.endereco ?? comp.address ?? comp.nome ?? `Amostra ${i + 1}`).slice(0, 20),
      valor: typeof comp.valor === "number"
        ? comp.valor
        : typeof comp.value === "number"
        ? comp.value
        : typeof comp.preco === "number"
        ? comp.preco
        : 0,
    })) ?? [];

  return (
    <div className="space-y-6">
      {/* Summary card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Resumo da Avaliação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Método
              </p>
              <p className="text-sm font-medium">{safeString(method)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Grau de Fundamentação
              </p>
              <Badge variant="secondary">{safeString(fundamentacao)}</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Grau de Precisão
              </p>
              <Badge variant="secondary">{safeString(precisao)}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Value display */}
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
            Valor Avaliado
          </p>
          <p className="text-3xl font-bold text-primary tabular-nums">
            {formatCurrency(valor)}
          </p>
          {(valorMin != null || valorMax != null) && (
            <p className="text-sm text-muted-foreground mt-2">
              Intervalo de confiança:{" "}
              <span className="font-medium tabular-nums">
                {formatCurrency(valorMin)}
              </span>
              {" — "}
              <span className="font-medium tabular-nums">
                {formatCurrency(valorMax)}
              </span>
            </p>
          )}
        </CardContent>
      </Card>

      {/* Comparables table */}
      {comparables && comparables.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Amostras Comparáveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr>
                    {Object.keys(comparables[0]).map((key) => (
                      <th
                        key={key}
                        className="border border-border bg-muted/50 px-3 py-1.5 text-left font-medium text-xs"
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparables.map((row, i) => (
                    <tr key={i}>
                      {Object.values(row).map((val, j) => (
                        <td key={j} className="border border-border px-3 py-1.5 text-xs">
                          {typeof val === "number"
                            ? val.toLocaleString("pt-BR")
                            : safeString(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bar chart */}
      {chartData.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              Comparativo de Valores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    angle={-20}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v: number) =>
                      `R$ ${(v / 1000).toFixed(0)}k`
                    }
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      currencyFmt.format(value),
                      "Valor",
                    ]}
                  />
                  <Bar
                    dataKey="valor"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
