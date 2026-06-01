import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { harmonizeLegalRequest } from "@/lib/agents";

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
      demand,
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

    const goal = demand || analysisGoal;
    const hasWork = (documents && documents.length > 0) || Boolean(goal);

    if (hasWork) {
      // Unified Legal Performance pipeline: classifies the demand into a UC-LP
      // use case and runs the matching agent route.
      harmonizeLegalRequest(
        {
          demand: goal || "Análise processual dos documentos anexados.",
          documents: documents || [],
          processType: processType || processClass,
          processNumber,
          court,
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
              event:
                result.status === "completed"
                  ? "ANALYSIS_COMPLETED"
                  : "ANALYSIS_FAILED",
              metadata: {
                useCase: result.useCase.id,
                deliverableType: result.deliverableType,
                duration: result.completedAt
                  ? new Date(result.completedAt).getTime() -
                    new Date(result.createdAt).getTime()
                  : null,
                error: result.error,
              },
            },
          });

          const deadlines = result.context.deadlines?.deadlines ?? [];
          for (const deadline of deadlines) {
            await prisma.deadline.create({
              data: {
                analysisId: analysis.id,
                description: deadline.description,
                legalBasis: deadline.legalBasis,
                dueDate: new Date(deadline.dueDate),
                status: "PENDING",
                urgency: deadline.urgency.toUpperCase() as never,
              },
            });
          }
        } catch (dbError) {
          console.error("Error saving analysis result:", dbError);
        }
      }).catch(async (error) => {
        console.error("harmonizeLegalRequest error:", error);
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
