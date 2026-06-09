import { NextRequest, NextResponse } from "next/server";
import { consultarDespesaFuncao } from "@/lib/gov/siconfi";

export const runtime = "nodejs";

// GET /api/fiscal/funcoes — despesa por função (Saúde/Educação) via RREO Anexo 02.
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const ente = sp.get("ente") || process.env.NEXT_PUBLIC_MUNICIPIO_IBGE || "1100205";
  const exercicio = Number(sp.get("exercicio") || new Date().getFullYear());
  const periodo = Number(sp.get("periodo") || 6);

  const dados = await consultarDespesaFuncao({ ente, exercicio, periodo });
  return NextResponse.json(dados);
}
