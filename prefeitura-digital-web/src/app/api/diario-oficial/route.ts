import { NextRequest, NextResponse } from "next/server";
import { generate } from "@/lib/ai";
import { SYSTEM_DIARIO_OFICIAL, promptAtoDO, ATOS_DO, TipoAtoDO } from "@/lib/prompts";

export const runtime = "nodejs";

function fallbackAto(tipo: TipoAtoDO, ementa: string) {
  const meta = ATOS_DO.find((a) => a.id === tipo);
  return `# ${meta?.rotulo || "Ato oficial"} — rascunho

> ⚠️ Modo rascunho (sem IA): configure ANTHROPIC_API_KEY para geração assistida.

**Caderno:** ${meta?.caderno || "[PREENCHER]"}
**Ementa:** ${ementa || "[PREENCHER]"}

[PREENCHER: preâmbulo com fundamento legal]

[PREENCHER: corpo do ato]

[PREENCHER: local, data, autoridade signatária e cargo]

---
**Metadados sugeridos** — tipo: ${meta?.rotulo || "[PREENCHER]"}; caderno: ${meta?.caderno || "[PREENCHER]"}; publicação no PNCP: ${meta?.pncp ? "sim" : "não"}.`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tipo = body.tipo as TipoAtoDO;
    const ementa = String(body.ementa || "");
    const conteudo = String(body.conteudo || "");

    if (!ATOS_DO.some((a) => a.id === tipo)) {
      return NextResponse.json({ error: "Tipo de ato inválido." }, { status: 400 });
    }
    if (!ementa && !conteudo) {
      return NextResponse.json(
        { error: "Informe a ementa e/ou o conteúdo do ato." },
        { status: 400 }
      );
    }

    const result = await generate({
      system: SYSTEM_DIARIO_OFICIAL,
      prompt: promptAtoDO({
        tipo,
        ementa,
        conteudo,
        autoridade: body.autoridade,
      }),
      fallback: fallbackAto(tipo, ementa),
      maxTokens: 3072,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Falha na geração." },
      { status: 500 }
    );
  }
}
