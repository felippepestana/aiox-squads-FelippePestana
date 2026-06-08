import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authRequired, getSessionUser, loadAnalysisForRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const analysisId = searchParams.get("analysisId");
    const status = searchParams.get("status");
    const upcoming = searchParams.get("upcoming") === "true";

    const where: Record<string, unknown> = {};

    if (analysisId) {
      where.analysisId = analysisId;
    }

    if (status) {
      where.status = status;
    }

    // In auth mode, only return deadlines from the current user's analyses.
    if (authRequired()) {
      const user = await getSessionUser();
      if (!user) {
        return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
      }
      where.analysis = { userId: user.id };
    }

    if (upcoming) {
      where.dueDate = {
        gte: new Date(),
      };
      where.status = "PENDING";
    }

    const deadlines = await prisma.deadline.findMany({
      where,
      include: {
        analysis: {
          select: {
            id: true,
            processNumber: true,
            court: true,
          },
        },
      },
      orderBy: {
        dueDate: "asc",
      },
      take: upcoming ? 10 : 100,
    });

    return NextResponse.json({ data: deadlines });
  } catch (error) {
    console.error("Error fetching deadlines:", error);
    return NextResponse.json(
      { error: "Erro ao buscar prazos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { analysisId, description, dueDate, priority } = body;

    if (!analysisId || !description || !dueDate) {
      return NextResponse.json(
        { error: "analysisId, description e dueDate são obrigatórios" },
        { status: 400 }
      );
    }

    const access = await loadAnalysisForRequest(analysisId);
    if (!access.ok) {
      const messages = { 401: "Não autenticado", 403: "Acesso negado", 404: "Análise não encontrada" } as const;
      return NextResponse.json(
        { error: messages[access.status] },
        { status: access.status }
      );
    }

    const deadline = await prisma.deadline.create({
      data: {
        analysisId,
        description,
        dueDate: new Date(dueDate),
        priority: priority || "NORMAL",
      },
    });

    return NextResponse.json({ data: deadline }, { status: 201 });
  } catch (error) {
    console.error("Error creating deadline:", error);
    return NextResponse.json(
      { error: "Erro ao criar prazo" },
      { status: 500 }
    );
  }
}
