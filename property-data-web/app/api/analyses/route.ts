import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createServerSupabase } from "@/lib/supabase/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { propertyId, useCase } = await request.json();

    if (!propertyId || !useCase) {
      return NextResponse.json({ error: "propertyId and useCase are required" }, { status: 400 });
    }

    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property || property.profileId !== user.id) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    const analysis = await prisma.analysis.create({
      data: {
        propertyId,
        useCase,
        status: "pending",
        agentLogs: [],
      },
    });

    return NextResponse.json(analysis, { status: 201 });
  } catch (error) {
    console.error("POST /api/analyses error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
