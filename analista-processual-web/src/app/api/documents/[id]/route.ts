import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Documento não encontrado" },
        { status: 404 }
      );
    }

    await prisma.document.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Documento deletado com sucesso",
    });
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { error: "Erro ao deletar documento" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const allowedFields = {
      filename: body.filename,
      metadata: body.metadata,
    };

    const updateData = Object.fromEntries(
      Object.entries(allowedFields).filter(([, value]) => value !== undefined)
    );

    const document = await prisma.document.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ data: document });
  } catch (error) {
    console.error("Error updating document:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar documento" },
      { status: 500 }
    );
  }
}
