import { NextRequest, NextResponse } from "next/server";
import { consultarRREO } from "@/lib/gov/siconfi";
import { MUNICIPIO_IBGE } from "@/lib/municipio";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const ente = sp.get("ente") || MUNICIPIO_IBGE;
  const exercicio = Number(sp.get("exercicio") || new Date().getFullYear());
  const periodo = Number(sp.get("periodo") || 1);

  const rreo = await consultarRREO({ ente, exercicio, periodo });
  return NextResponse.json(rreo);
}
