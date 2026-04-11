import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createServerSupabase } from "@/lib/supabase/server";
import { executePipeline } from "@/lib/agents/executor";
import { decrypt } from "@/lib/crypto/key-encryption";
import type { LLMGatewayConfig, LLMProvider } from "@/types/llm";
import type { AgentLog } from "@/types/analysis";

const prisma = new PrismaClient();

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const analysis = await prisma.analysis.findUnique({
      where: { id },
      include: { property: { include: { documents: true } } },
    });

    if (!analysis || analysis.property.profileId !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.analysis.update({ where: { id }, data: { status: "running" } });

    // Build LLM gateway config from user's API keys
    const apiKeys = await prisma.apiKey.findMany({
      where: { profileId: user.id, isActive: true },
    });

    const userKeys: Partial<Record<LLMProvider, string>> = {};
    for (const key of apiKeys) {
      userKeys[key.provider as LLMProvider] = decrypt(key.keyEnc);
    }

    const systemKeys: Partial<Record<LLMProvider, string>> = {};
    if (process.env.ANTHROPIC_API_KEY) systemKeys.anthropic = process.env.ANTHROPIC_API_KEY;
    if (process.env.OPENAI_API_KEY) systemKeys.openai = process.env.OPENAI_API_KEY;
    if (process.env.GEMINI_API_KEY) systemKeys.gemini = process.env.GEMINI_API_KEY;
    if (process.env.DEEPSEEK_API_KEY) systemKeys.deepseek = process.env.DEEPSEEK_API_KEY;

    const llmConfig: LLMGatewayConfig = { userKeys, systemKeys };

    const propertyData = {
      address: analysis.property.address,
      number: analysis.property.number ?? "",
      neighborhood: analysis.property.neighborhood ?? "",
      city: analysis.property.city,
      state: analysis.property.state,
      cep: analysis.property.cep ?? "",
      type: analysis.property.type as "residencial" | "comercial" | "rural" | "misto",
      area: analysis.property.area ?? undefined,
      matricula: analysis.property.matricula ?? undefined,
      inscricao: analysis.property.inscricao ?? undefined,
    };

    const documents = analysis.property.documents.map((doc) => ({
      id: doc.id,
      name: doc.filename,
      type: doc.type,
      fileId: doc.fileId ?? undefined,
    }));

    const agentLogs: AgentLog[] = [];
    let finalResult: Record<string, string> = {};

    try {
      const pipeline = executePipeline(propertyData, documents, analysis.useCase, llmConfig);

      for await (const event of pipeline) {
        if (event.type === "agent:start") {
          agentLogs.push({
            agentId: event.agentId!,
            agentName: event.agentName!,
            tier: "standard",
            status: "running",
            startedAt: new Date().toISOString(),
          });
        } else if (event.type === "agent:chunk") {
          const log = agentLogs.find((l) => l.agentId === event.agentId);
          if (log) log.output = (log.output ?? "") + event.text;
        } else if (event.type === "agent:done") {
          const log = agentLogs.find((l) => l.agentId === event.agentId);
          if (log) {
            log.status = "done";
            log.finishedAt = new Date().toISOString();
            log.model = event.model;
            finalResult[event.agentId!] = log.output ?? "";
          }
        } else if (event.type === "agent:error") {
          const log = agentLogs.find((l) => l.agentId === event.agentId);
          if (log) {
            log.status = "error";
            log.error = event.message;
            log.finishedAt = new Date().toISOString();
          }
        }
      }

      const updated = await prisma.analysis.update({
        where: { id },
        data: { status: "done", agentLogs, result: finalResult },
      });

      return NextResponse.json(updated);
    } catch (pipelineError) {
      const errorMessage = pipelineError instanceof Error ? pipelineError.message : "Pipeline execution failed";
      await prisma.analysis.update({
        where: { id },
        data: { status: "error", agentLogs, result: { error: errorMessage } },
      });
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
  } catch (error) {
    console.error("POST /api/analyses/[id]/execute error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
