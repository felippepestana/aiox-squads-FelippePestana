import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { chiefAgent } from "@/lib/agents";

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
    const { 
      processNumber, 
      court, 
      processClass, 
      processType,
      analysisGoal,
      userId,
      documents 
    } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId é obrigatório" },
        { status: 400 }
      );
    }

    const analysis = await prisma.analysis.create({
      data: {
        userId,
        processNumber,
        court,
        processClass,
        status: "PROCESSING",
        result: {},
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

    if (documents && documents.length > 0) {
      chiefAgent.execute(
        { 
          documents, 
          processType: processType || processClass,
          analysisGoal 
        },
        (step, progress) => {
          console.log(`[Analysis ${analysis.id}] ${step} (${progress}%)`);
        }
      ).then(async (result) => {
        try {
          await prisma.analysis.update({
            where: { id: analysis.id },
            data: {
              status: result.status === "completed" ? "COMPLETED" : "FAILED",
              result: JSON.parse(JSON.stringify(result)),
            },
          });

          await prisma.analysisEvent.create({
            data: {
              analysisId: analysis.id,
              event: result.status === "completed" ? "ANALYSIS_COMPLETED" : "ANALYSIS_FAILED",
              metadata: { 
                duration: result.completedAt 
                  ? new Date(result.completedAt).getTime() - new Date(result.createdAt).getTime()
                  : null,
                error: result.error,
              },
            },
          });

          if (result.deadlines?.deadlines) {
            for (const deadline of result.deadlines.deadlines) {
              await prisma.deadline.create({
                data: {
                  analysisId: analysis.id,
                  description: deadline.description,
                  legalBasis: deadline.legalBasis,
                  dueDate: new Date(deadline.dueDate),
                  status: "PENDING",
                  urgency: deadline.urgency.toUpperCase() as any,
                },
              });
            }
          }
        } catch (dbError) {
          console.error("Error saving analysis result:", dbError);
        }
      }).catch(async (error) => {
        console.error("ChiefAgent error:", error);
        await prisma.analysis.update({
          where: { id: analysis.id },
          data: {
            status: "FAILED",
            result: { error: error instanceof Error ? error.message : "Unknown error" },
          },
        });
      });
    }

    return NextResponse.json({ 
      data: { ...analysis, status: "PROCESSING" },
      analysisId: analysis.id 
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating analysis:", error);
    return NextResponse.json(
      { error: "Erro ao criar análise" },
      { status: 500 }
    );
  }
}
