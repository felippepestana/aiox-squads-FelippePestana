import { NextRequest, NextResponse } from "next/server";
import { generate } from "@/lib/ai";
import { SYSTEM_TRANSPARENCIA, promptTransparencia, ITENS_TRANSPARENCIA } from "@/lib/prompts";

export const runtime = "nodejs";

function fallbackDiagnostico(itensAtendidos: string[]) {
  const pendentes = ITENS_TRANSPARENCIA.filter((i) => !itensAtendidos.includes(i.id));
  return `# Diagnóstico de transparência — rascunho

> ⚠️ Modo rascunho (sem IA): configure ANTHROPIC_API_KEY para diagnóstico assistido.

## Itens pendentes a priorizar
${pendentes.length ? pendentes.map((i) => `- [ ] ${i.rotulo}`).join("\n") : "- Todos os itens do checklist foram declarados como atendidos."}

## Próximos passos sugeridos
- Publicar dados abertos em formato aberto + API documentada (OpenAPI).
- Garantir RREO/RGF com linguagem cidadã (LRF art. 48).
- Auditar acessibilidade (WCAG 2.1 AA).

[PREENCHER: detalhar diagnóstico por norma]`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const portalUrl = String(body.portalUrl || "");
    const situacao = String(body.situacao || "");
    const itensAtendidos: string[] = Array.isArray(body.itensAtendidos) ? body.itensAtendidos : [];

    const result = await generate({
      system: SYSTEM_TRANSPARENCIA,
      prompt: promptTransparencia({ portalUrl, situacao, itensAtendidos }),
      fallback: fallbackDiagnostico(itensAtendidos),
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
