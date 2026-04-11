import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createServerSupabase } from "@/lib/supabase/server";
import { isDemoMode } from "@/app/api/demo/middleware";
import { demoStore } from "@/lib/demo/data";

const prisma = new PrismaClient();

export async function GET() {
  try {
    if (isDemoMode()) {
      return NextResponse.json(demoStore.getExports());
    }

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const exports = await prisma.export.findMany({
      where: { analysis: { property: { profileId: user.id } } },
      include: { analysis: { include: { property: { select: { address: true, city: true } } } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(exports);
  } catch (error) {
    console.error("GET /api/exports error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
