import { NextRequest, NextResponse } from "next/server";
import { generate } from "@/lib/ai";
import { SYSTEM_RH, promptAtoRH, ATOS_RH, TipoAtoRH } from "@/lib/prompts";
import { consultarPessoalLRFRecente, PessoalLRF } from "@/lib/gov/siconfi";

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

type NivelLRF = "ok" | "alerta" | "vedado-prudencial" | "vedado-maximo" | "indisponivel";

interface ChecagemLRF {
  nivel: NivelLRF;
  mensagem: string;
  dtpPct?: number;
  limitePrudencialPct?: number;
  limiteMaximoPct?: number;
  exercicio?: number;
  periodo?: number;
}

// Avalia a situação da despesa com pessoal e monta a mensagem de alerta da LRF.
function avaliarLRF(d: PessoalLRF | null): ChecagemLRF {
  if (!d || typeof d.dtpPct !== "number") {
    return {
      nivel: "indisponivel",
      mensagem:
        "Não foi possível obter o RGF mais recente para checagem automática da LRF. Verifique manualmente a disponibilidade orçamentária e os limites de pessoal antes de emitir o ato.",
    };
  }
  const max = d.limiteMaximoPct ?? 54;
  const prud = d.limitePrudencialPct ?? +(max * 0.95).toFixed(2);
  const alerta = d.limiteAlertaPct ?? +(max * 0.9).toFixed(2);
  const ctx = { dtpPct: d.dtpPct, limitePrudencialPct: prud, limiteMaximoPct: max, exercicio: d.exercicio, periodo: d.periodo };

  if (d.dtpPct >= max)
    return {
      ...ctx,
      nivel: "vedado-maximo",
      mensagem: `Despesa com pessoal em ${d.dtpPct}% da RCL — acima do limite máximo (${max}%). A LRF (art. 22 e art. 23) impõe medidas de recondução; em regra, é vedado o provimento de cargo público e a concessão de vantagens. Avalie a juridicidade do ato.`,
    };
  if (d.dtpPct >= prud)
    return {
      ...ctx,
      nivel: "vedado-prudencial",
      mensagem: `Despesa com pessoal em ${d.dtpPct}% da RCL — acima do limite prudencial (${prud}%). O art. 22, parágrafo único, da LRF VEDA atos que aumentem a despesa com pessoal (provimento, criação/majoração de vantagens, horas extras). Este ato pode ser vedado.`,
    };
  if (d.dtpPct >= alerta)
    return {
      ...ctx,
      nivel: "alerta",
      mensagem: `Despesa com pessoal em ${d.dtpPct}% da RCL — em faixa de alerta (≥ ${alerta}%). Documente a adequação orçamentária e a estimativa de impacto antes de aumentar a folha.`,
    };
  return {
    ...ctx,
    nivel: "ok",
    mensagem: `Despesa com pessoal em ${d.dtpPct}% da RCL — dentro do limite (abaixo de ${alerta}%). Mantenha a dotação e a estimativa de impacto no processo.`,
  };
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
      const ente = process.env.NEXT_PUBLIC_MUNICIPIO_IBGE || "1100205";
      lrf = avaliarLRF(await consultarPessoalLRFRecente(ente));
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
