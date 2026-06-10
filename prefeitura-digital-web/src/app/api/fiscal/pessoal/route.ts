import { NextRequest, NextResponse } from "next/server";
import { consultarPessoalLRF } from "@/lib/gov/siconfi";
import { MUNICIPIO_IBGE } from "@/lib/municipio";

export const runtime = "nodejs";

// GET /api/fiscal/pessoal — indicador da Despesa com Pessoal (LRF) via RGF.
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const ente = sp.get("ente") || MUNICIPIO_IBGE;
  const exercicio = Number(sp.get("exercicio") || new Date().getFullYear());
  const periodo = Number(sp.get("periodo") || 1);

  const dados = await consultarPessoalLRF({ ente, exercicio, periodo });
  return NextResponse.json(dados);
}
