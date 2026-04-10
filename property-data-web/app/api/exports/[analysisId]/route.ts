import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createServerSupabase } from "@/lib/supabase/server";
import { generateMarkdownReport } from "@/lib/export/pdf";

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ analysisId: string }> }
) {
  try {
    const { analysisId } = await params;
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const analysis = await prisma.analysis.findUnique({
      where: { id: analysisId },
      include: { property: true },
    });

    if (!analysis || analysis.property.profileId !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const { mode, format } = await request.json();

    if (!mode || !format) {
      return NextResponse.json({ error: "mode and format are required" }, { status: 400 });
    }

    const reportContent = await generateMarkdownReport(analysis.result, mode);

    const exportRecord = await prisma.export.create({
      data: {
        mode,
        format,
        fileUrl: null,
        analysisId,
      },
    });

    return NextResponse.json({ ...exportRecord, content: reportContent }, { status: 201 });
  } catch (error) {
    console.error("POST /api/exports/[analysisId] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ analysisId: string }> }
) {
  try {
    const { analysisId } = await params;
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const analysis = await prisma.analysis.findUnique({
      where: { id: analysisId },
      include: { property: true },
    });

    if (!analysis || analysis.property.profileId !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const exports = await prisma.export.findMany({
      where: { analysisId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(exports);
  } catch (error) {
    console.error("GET /api/exports/[analysisId] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
