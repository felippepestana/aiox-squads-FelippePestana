import { NextResponse } from "next/server";

// Proxy the F6 engine's Prometheus endpoint and return parsed metrics as JSON.
// The engine exposes /metrics at http://localhost:9099 by default.
const ENGINE_URL = process.env.PROMETHEUS_ENDPOINT ?? "http://localhost:9099/metrics";

interface ParsedMetrics {
  cpu_pct: number | null;
  drops_pct: number | null;
  switch_count: number | null;
  override_count: number | null;
  dropout_count: number | null;
  motion_trigger_count: number | null;
}

function parsePrometheusText(text: string): ParsedMetrics {
  const result: ParsedMetrics = {
    cpu_pct: null,
    drops_pct: null,
    switch_count: null,
    override_count: null,
    dropout_count: null,
    motion_trigger_count: null,
  };

  for (const line of text.split("\n")) {
    if (line.startsWith("#")) continue;
    const match = line.match(/^(\w+)\s+([\d.e+\-]+)/);
    if (!match) continue;
    const [, name, val] = match;
    const value = parseFloat(val);
    switch (name) {
      case "tm_cpu_pct":           result.cpu_pct = value; break;
      case "tm_obs_drops_pct":     result.drops_pct = value; break;
      case "tm_switches_total":    result.switch_count = value; break;
      case "tm_overrides_total":   result.override_count = value; break;
      case "tm_dropouts_total":    result.dropout_count = value; break;
      case "tm_motion_triggers_total": result.motion_trigger_count = value; break;
    }
  }

  return result;
}

export async function GET() {
  try {
    const res = await fetch(ENGINE_URL, {
      signal: AbortSignal.timeout(3_000),
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "engine offline" }, { status: 502 });
    }

    const text = await res.text();
    return NextResponse.json(parsePrometheusText(text));
  } catch {
    return NextResponse.json({ error: "engine unreachable" }, { status: 503 });
  }
}
