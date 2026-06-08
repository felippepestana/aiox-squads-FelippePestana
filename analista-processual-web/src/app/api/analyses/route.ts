import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authRequired, getSessionUser, resolveOwnerId } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: Record<string, unknown> = {};

    if (status) {
      where.status = status;
    }

    // In auth mode, scope the list to the current user. In demo mode, list all.
    if (authRequired()) {
      const user = await getSessionUser();
      if (!user) {
        return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
      }
      where.userId = user.id;
    }

    const [analyses, total] = await Promise.all([
      prisma.analysis.findMany({
        where,
        include: {
          documents: {
            select: {
              id: true,
              filename: true,
              fileType: true,
            },
          },
          _count: {
            select: {
              deadlines: {
                where: {
                  status: "PENDING",
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
        skip: offset,
      }),
      prisma.analysis.count({ where }),
    ]);

    return NextResponse.json({
      data: analyses,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error("Error fetching analyses:", error);
    return NextResponse.json(
      { error: "Erro ao buscar análises" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { processNumber, court, processClass, userId } = body;

    // Auth mode: attribute to the authenticated user (401 if none).
    // Demo mode: attribute to the demo profile (honoring a provided id).
    const ownerId = await resolveOwnerId(userId);
    if (!ownerId) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const analysis = await prisma.analysis.create({
      data: {
        userId: ownerId,
        processNumber: processNumber || null,
        court: court || null,
        processClass: processClass || null,
        status: "PENDING",
      },
      include: {
        documents: true,
      },
    });

    await prisma.analysisEvent.create({
      data: {
        analysisId: analysis.id,
        event: "ANALYSIS_CREATED",
        metadata: { source: "api" },
      },
    });

    return NextResponse.json(
      {
        data: analysis,
        analysisId: analysis.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating analysis:", error);
    return NextResponse.json(
      { error: "Erro ao criar análise" },
      { status: 500 }
    );
  }
}
