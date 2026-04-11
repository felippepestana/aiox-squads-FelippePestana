import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createServerSupabase } from "@/lib/supabase/server";

const prisma = new PrismaClient();

export async function POST(
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
      include: { property: true },
    });
    if (!analysis || analysis.property.profileId !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (analysis.status !== "pending") {
      return NextResponse.json({ error: "Analysis already started" }, { status: 400 });
    }

    const updated = await prisma.analysis.update({
      where: { id },
      data: { status: "running" },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("POST /api/analyses/[id]/start error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
