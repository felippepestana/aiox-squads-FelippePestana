import { NextRequest, NextResponse } from "next/server";
import { generate } from "@/lib/ai";
import {
  SYSTEM_CONTRATACOES,
  promptETP,
  promptTR,
} from "@/lib/prompts";

export const runtime = "nodejs";

function fallbackETP(objeto: string, secretaria: string, necessidade: string) {
  return `# Estudo Técnico Preliminar (ETP) — rascunho

> ⚠️ Modo rascunho (sem IA): configure ANTHROPIC_API_KEY para geração assistida.

**Objeto:** ${objeto || "[PREENCHER]"}
**Secretaria:** ${secretaria || "[PREENCHER]"}

## I. Descrição da necessidade *(obrigatório)*
${necessidade || "[PREENCHER]"}

## IV. Estimativa das quantidades *(obrigatório)*
[PREENCHER: quantidades + memória de cálculo]

## VI. Estimativa do valor *(obrigatório)*
[PREENCHER: pesquisa de preços]

## VIII. Justificativa de parcelamento *(obrigatório)*
[PREENCHER]

## XIII. Posicionamento conclusivo sobre a viabilidade *(obrigatório)*
[PREENCHER]

## Vínculo orçamentário
[PREENCHER: dotação/fonte e disponibilidade]`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tipo = body.tipo as "ETP" | "TR" | "PB";
    const objeto = String(body.objeto || "");
    const secretaria = String(body.secretaria || "");

    if (!objeto) {
      return NextResponse.json(
        { error: "Informe o objeto da contratação." },
        { status: 400 }
      );
    }

    let prompt: string;
    let fallback: string;
    if (tipo === "ETP") {
      prompt = promptETP({
        objeto,
        secretaria,
        necessidade: String(body.necessidade || ""),
        quantidade: body.quantidade,
        precos: body.precos,
        dotacao: body.dotacao,
      });
      fallback = fallbackETP(objeto, secretaria, String(body.necessidade || ""));
    } else {
      prompt = promptTR({
        objeto,
        secretaria,
        tipo: tipo === "PB" ? "PB" : "TR",
        baseEtp: body.baseEtp,
      });
      fallback = `# ${tipo === "PB" ? "Projeto Básico" : "Termo de Referência"} — rascunho\n\n> ⚠️ Modo rascunho (sem IA).\n\n**Objeto:** ${objeto}\n**Secretaria:** ${secretaria}\n\n[PREENCHER: estrutura conforme Lei 14.133/2021 + adequação orçamentária]`;
    }

    const result = await generate({
      system: SYSTEM_CONTRATACOES,
      prompt,
      fallback,
      maxTokens: 4096,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Falha na geração." },
      { status: 500 }
    );
  }
}
