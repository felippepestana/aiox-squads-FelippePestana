import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const analysis = await prisma.analysis.findUnique({
      where: { id },
      include: {
        documents: true,
        deadlines: {
          orderBy: {
            dueDate: "asc",
          },
        },
        events: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!analysis) {
      return NextResponse.json(
        { error: "Análise não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: analysis });
  } catch (error) {
    console.error("Error fetching analysis:", error);
    return NextResponse.json(
      { error: "Erro ao buscar análise" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, result, processNumber, court, processClass } = body;

    const existing = await prisma.analysis.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Análise não encontrada" },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (status !== undefined) updateData.status = status;
    if (result !== undefined) updateData.result = result;
    if (processNumber !== undefined) updateData.processNumber = processNumber;
    if (court !== undefined) updateData.court = court;
    if (processClass !== undefined) updateData.processClass = processClass;

    const analysis = await prisma.analysis.update({
      where: { id },
      data: updateData,
      include: {
        documents: true,
        deadlines: true,
      },
    });

    if (status && status !== existing.status) {
      await prisma.analysisEvent.create({
        data: {
          analysisId: id,
          event: `STATUS_CHANGED_TO_${status}`,
          metadata: { previousStatus: existing.status },
        },
      });
    }

    return NextResponse.json({ data: analysis });
  } catch (error) {
    console.error("Error updating analysis:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar análise" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await prisma.analysis.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Análise não encontrada" },
        { status: 404 }
      );
    }

    await prisma.analysis.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting analysis:", error);
    return NextResponse.json(
      { error: "Erro ao deletar análise" },
      { status: 500 }
    );
  }
}
