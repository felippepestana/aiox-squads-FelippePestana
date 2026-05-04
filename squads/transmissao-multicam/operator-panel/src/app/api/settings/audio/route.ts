import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const channelSchema = z.object({
  channel:      z.number().int().min(1),
  label:        z.string().min(1),
  input_name:   z.string().min(1),
  camera_id:    z.string().transform((v) => v || null),
  role:         z.enum(["speaker", "host", "aux"]),
  threshold_db: z.number().min(-80).max(0),
});

const schema = z.array(channelSchema);

export async function GET() {
  const sb = createSupabaseServerClient();
  if (!sb) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const { data, error } = await sb.from("mic_channels").select("*").order("channel");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function PUT(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const sb = createSupabaseServerClient();
  if (!sb) return NextResponse.json({ saved: true, mode: "local" });

  // Replace all channels for simplicity (small table). Channel numbers are
  // always >= 1 per schema, so .gt("channel", 0) selects every existing row.
  const { error: deleteError } = await sb
    .from("mic_channels")
    .delete()
    .gt("channel", 0);
  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  const rows = parsed.data.map((c) => ({ ...c, updated_at: new Date().toISOString() }));
  const { data, error } = await sb.from("mic_channels").insert(rows).select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ saved: true, channels: data });
}
