"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";
import { formatNumber } from "@/lib/utils";

interface DataPoint {
  semana: string;
  inscritos: number;
  meta: number;
  benchmark?: number;
}

interface VendasChartProps {
  data: DataPoint[];
  title?: string;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-card border border-border rounded-xl p-3 shadow-xl min-w-[160px]">
      <p className="text-xs font-semibold text-foreground mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block h-2 w-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground capitalize">{entry.name}</span>
          </div>
          <span className="font-semibold text-foreground">{formatNumber(entry.value)}</span>
        </div>
      ))}
    </div>
  );
}

export function VendasChart({ data, title = "Progresso de Vendas" }: VendasChartProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Inscrições por semana vs. meta acumulada
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gradInscritos" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(43 55% 55%)" stopOpacity={0.25} />
              <stop offset="95%" stopColor="hsl(43 55% 55%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradMeta" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(215 15% 55%)" stopOpacity={0.15} />
              <stop offset="95%" stopColor="hsl(215 15% 55%)" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(240 5% 14%)"
            vertical={false}
          />

          <XAxis
            dataKey="semana"
            tick={{ fill: "hsl(215 15% 55%)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fill: "hsl(215 15% 55%)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={formatNumber}
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend
            wrapperStyle={{ fontSize: "11px", color: "hsl(215 15% 55%)" }}
            iconType="circle"
            iconSize={8}
          />

          <Area
            type="monotone"
            dataKey="meta"
            name="Meta"
            stroke="hsl(215 15% 55%)"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            fill="url(#gradMeta)"
            dot={false}
          />

          {data[0]?.benchmark !== undefined && (
            <Area
              type="monotone"
              dataKey="benchmark"
              name="Benchmark BC"
              stroke="hsl(142 76% 36%)"
              strokeWidth={1}
              strokeDasharray="2 4"
              fill="none"
              dot={false}
            />
          )}

          <Area
            type="monotone"
            dataKey="inscritos"
            name="Inscritos"
            stroke="hsl(43 55% 55%)"
            strokeWidth={2}
            fill="url(#gradInscritos)"
            dot={{ fill: "hsl(43 55% 55%)", strokeWidth: 0, r: 3 }}
            activeDot={{ r: 5, fill: "hsl(43 55% 55%)" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
