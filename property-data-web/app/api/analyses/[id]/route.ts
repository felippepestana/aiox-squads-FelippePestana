import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createServerSupabase } from "@/lib/supabase/server";

const prisma = new PrismaClient();

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const analysis = await prisma.analysis.findUnique({
      where: { id },
      include: { property: true, exports: true },
    });

    if (!analysis || analysis.property.profileId !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("GET /api/analyses/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
