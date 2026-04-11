import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createServerSupabase } from "@/lib/supabase/server";
import { isDemoMode } from "@/app/api/demo/middleware";
import { demoStore } from "@/lib/demo/data";

const prisma = new PrismaClient();

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (isDemoMode()) {
      const property = demoStore.getProperty(id);
      if (!property) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(property);
    }

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const property = await prisma.property.findUnique({
      where: { id },
      include: { documents: true, analyses: true },
    });

    if (!property || property.profileId !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error("GET /api/properties/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (isDemoMode()) {
      const property = demoStore.getProperty(id);
      if (!property) return NextResponse.json({ error: "Not found" }, { status: 404 });
      const body = await request.json();
      Object.assign(property, body, { updatedAt: new Date().toISOString() });
      return NextResponse.json(property);
    }

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const existing = await prisma.property.findUnique({ where: { id } });
    if (!existing || existing.profileId !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await request.json();
    const property = await prisma.property.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(property);
  } catch (error) {
    console.error("PUT /api/properties/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (isDemoMode()) {
      return NextResponse.json({ success: true });
    }

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const existing = await prisma.property.findUnique({ where: { id } });
    if (!existing || existing.profileId !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.property.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/properties/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
