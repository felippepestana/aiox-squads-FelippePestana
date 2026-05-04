import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const schema = z.object({
  account_email:           z.string().email().or(z.literal("")).transform((v) => v || null),
  default_room_url:        z.string().url().or(z.literal("")).transform((v) => v || null),
  auto_record:             z.boolean(),
  studio_effects_disabled: z.boolean(),
  live_streaming_enabled:  z.boolean(),
  workspace_admin_email:   z.string().email().or(z.literal("")).transform((v) => v || null),
  max_participants:        z.number().int().min(1).max(10000),
  notes:                   z.string().transform((v) => v || null),
});

export async function GET() {
  const sb = createSupabaseServerClient();
  if (!sb) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const { data, error } = await sb.from("meet_settings").select("*").limit(1).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const sb = createSupabaseServerClient();
  if (!sb) return NextResponse.json({ saved: true, mode: "local" });

  const { data, error } = await sb
    .from("meet_settings")
    .upsert({ ...parsed.data, updated_at: new Date().toISOString() })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
