import { NextRequest, NextResponse } from "next/server";
import { generate } from "@/lib/ai";
import { SYSTEM_RH, promptAtoRH } from "@/lib/prompts";
import { ATOS_RH, TipoAtoRH } from "@/lib/catalogos";
import { consultarPessoalLRFRecente } from "@/lib/gov/siconfi";
import { avaliarLRF, ChecagemLRF } from "@/lib/lrf";
import { MUNICIPIO_IBGE } from "@/lib/municipio";

export const runtime = "nodejs";

function fallbackAtoRH(tipo: TipoAtoRH, servidor: string) {
  const meta = ATOS_RH.find((a) => a.id === tipo);
  return `# ${meta?.rotulo || "Ato de pessoal"} — rascunho

> ⚠️ Modo rascunho (sem IA): configure ANTHROPIC_API_KEY para geração assistida.

**Caderno:** Pessoal
**Fundamento:** ${meta?.fundamento || "[PREENCHER]"}
**Servidor(a):** ${servidor || "[PREENCHER: nome]"}

[PREENCHER: preâmbulo com fundamento legal]

[PREENCHER: corpo articulado do ato]

[PREENCHER: local, data, autoridade signatária e cargo]

---
**Metadados sugeridos** — tipo: ${meta?.rotulo || "[PREENCHER]"}; caderno: Pessoal; impacto na folha: ${meta?.impactaFolha ? "sim" : "não"}.`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tipo = body.tipo as TipoAtoRH;
    const servidor = String(body.servidor || "");
    const cargo = String(body.cargo || "");
    const detalhes = String(body.detalhes || "");

    const meta = ATOS_RH.find((a) => a.id === tipo);
    if (!meta) {
      return NextResponse.json({ error: "Tipo de ato inválido." }, { status: 400 });
    }
    if (!servidor && !detalhes) {
      return NextResponse.json(
        { error: "Informe ao menos o servidor e/ou os detalhes do ato." },
        { status: 400 }
      );
    }

    // Checagem fiscal (LRF) apenas para atos que aumentam a despesa com pessoal.
    let lrf: ChecagemLRF | null = null;
    if (meta.impactaFolha) {
      lrf = avaliarLRF(await consultarPessoalLRFRecente(MUNICIPIO_IBGE));
    }

    const result = await generate({
      system: SYSTEM_RH,
      prompt: promptAtoRH({
        tipo,
        servidor,
        cargo,
        detalhes,
        autoridade: body.autoridade,
        alertaLRF: lrf?.mensagem,
      }),
      fallback: fallbackAtoRH(tipo, servidor),
      maxTokens: 2560,
    });

    return NextResponse.json({ ...result, lrf, impactaFolha: meta.impactaFolha });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Falha na geração." },
      { status: 500 }
    );
  }
}
