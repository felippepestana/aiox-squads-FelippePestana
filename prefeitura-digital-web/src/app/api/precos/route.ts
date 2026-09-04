import { NextRequest, NextResponse } from "next/server";
import { buscarContratacoes } from "@/lib/gov/pncp";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const termo = req.nextUrl.searchParams.get("q") || "";
  const itens = await buscarContratacoes(termo);
  return NextResponse.json({ termo, total: itens.length, itens });
}
