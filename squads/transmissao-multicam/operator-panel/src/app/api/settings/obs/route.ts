import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const schema = z.object({
  host:    z.string().min(1),
  port:    z.number().int().min(1024).max(65535),
  use_tls: z.boolean(),
});

export async function GET() {
  const sb = createSupabaseServerClient();
  if (!sb) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const { data, error } = await sb.from("obs_settings").select("*").limit(1).single();
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
    .from("obs_settings")
    .upsert({ ...parsed.data, updated_at: new Date().toISOString() })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
