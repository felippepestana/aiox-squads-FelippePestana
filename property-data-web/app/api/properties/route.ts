import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createServerSupabase } from "@/lib/supabase/server";
import { isDemoMode } from "@/app/api/demo/middleware";
import { demoStore } from "@/lib/demo/data";
import type { PropertyFormData } from "@/types/property";

const prisma = new PrismaClient();

export async function GET() {
  try {
    if (isDemoMode()) {
      return NextResponse.json(demoStore.getProperties());
    }

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const properties = await prisma.property.findMany({
      where: { profileId: user.id },
      include: {
        _count: { select: { documents: true, analyses: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(properties);
  } catch (error) {
    console.error("GET /api/properties error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (isDemoMode()) {
      const body: PropertyFormData = await request.json();
      const property = demoStore.createProperty(body);
      return NextResponse.json(property, { status: 201 });
    }

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body: PropertyFormData = await request.json();

    const property = await prisma.property.create({
      data: {
        address: body.address,
        number: body.number,
        neighborhood: body.neighborhood,
        city: body.city,
        state: body.state,
        cep: body.cep,
        type: body.type,
        area: body.area,
        matricula: body.matricula,
        inscricao: body.inscricao,
        status: "draft",
        profileId: user.id,
      },
    });

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error("POST /api/properties error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
