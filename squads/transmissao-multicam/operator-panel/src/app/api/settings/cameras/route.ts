import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const cameraSchema = z.object({
  camera_id:     z.string().min(1),
  display_name:  z.string().min(1),
  usb_port:      z.string().transform((v) => v || null),
  vid:           z.string().default("3564"),
  role:          z.enum(["speaker", "host", "slides", "reserve"]),
  preset_1_name: z.string().default("wide"),
  preset_2_name: z.string().default("medium"),
  preset_3_name: z.string().default("close"),
  auto_track:    z.boolean(),
  notes:         z.string().transform((v) => v || null),
});

const schema = z.array(cameraSchema);

export async function GET() {
  const sb = createSupabaseServerClient();
  if (!sb) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const { data, error } = await sb.from("camera_configs").select("*").order("camera_id");
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

  const rows = parsed.data.map((c) => ({ ...c, updated_at: new Date().toISOString() }));
  const { data, error } = await sb
    .from("camera_configs")
    .upsert(rows, { onConflict: "camera_id" })
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
