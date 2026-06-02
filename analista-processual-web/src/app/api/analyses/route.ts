import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveUserId } from "@/lib/demo-user";

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

    // Until auth is wired, attribute analyses to the demo profile when no
    // valid userId is provided. Avoids foreign-key violations.
    const ownerId = await resolveUserId(userId);

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
