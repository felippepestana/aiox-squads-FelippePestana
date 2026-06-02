import { NextResponse } from "next/server";

// Proxy the F6 engine's Prometheus endpoint and return parsed metrics as JSON.
// Engine exposes /metrics at http://localhost:9099 by default.
const ENGINE_URL = process.env.PROMETHEUS_ENDPOINT ?? "http://localhost:9099/metrics";

interface ParsedMetrics {
  switch_count:         number | null;
  override_count:       number | null;
  dropout_count:        number | null;
  motion_trigger_count: number | null;
  failover_count:       number | null;
  pingpong_count:       number | null;
  switches_by_target:   Record<string, number>;
  // CPU / drops are not (yet) exported by the engine; keep field for future
  // wiring when the F6 process surfaces resource metrics.
  cpu_pct:              number | null;
  drops_pct:            number | null;
}

// Match either:
//   metric_name 42
//   metric_name{label="value",label2="x"} 42
// while skipping the "# HELP/TYPE" header lines.
const METRIC_RE = /^([a-zA-Z_][a-zA-Z0-9_]*)(\{[^}]*\})?\s+([\d.eE+\-]+)\s*$/;

function parsePrometheusText(text: string): ParsedMetrics {
  const result: ParsedMetrics = {
    switch_count:         null,
    override_count:       null,
    dropout_count:        null,
    motion_trigger_count: null,
    failover_count:       null,
    pingpong_count:       null,
    switches_by_target:   {},
    cpu_pct:              null,
    drops_pct:            null,
  };

  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const m = line.match(METRIC_RE);
    if (!m) continue;
    const [, name, labelBlock, val] = m;
    const value = parseFloat(val);
    if (!Number.isFinite(value)) continue;

    switch (name) {
      case "tx_multicam_switches_total":          result.switch_count         = value; break;
      case "tx_multicam_overrides_total":         result.override_count       = value; break;
      case "tx_multicam_camera_dropouts_total":   result.dropout_count        = value; break;
      case "tx_multicam_motion_triggers_total":   result.motion_trigger_count = value; break;
      case "tx_multicam_failovers_total":         result.failover_count       = value; break;
      case "tx_multicam_pingpong_total":          result.pingpong_count       = value; break;
      case "tx_multicam_switches_by_target": {
        // Parse target="CAMx" out of the label block
        const targetMatch = labelBlock?.match(/target="([^"]+)"/);
        if (targetMatch) result.switches_by_target[targetMatch[1]] = value;
        break;
      }
    }
  }

  return result;
}

export async function GET() {
  try {
    const res = await fetch(ENGINE_URL, {
      signal: AbortSignal.timeout(3_000),
      next:   { revalidate: 0 },
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
