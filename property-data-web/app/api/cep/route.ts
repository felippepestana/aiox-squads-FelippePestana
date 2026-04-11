import { NextRequest, NextResponse } from "next/server";
import { isDemoMode } from "@/app/api/demo/middleware";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cep = searchParams.get("cep");

    if (!cep) {
      return NextResponse.json({ error: "cep query param is required" }, { status: 400 });
    }

    const cleaned = cep.replace(/\D/g, "");

    if (cleaned.length !== 8) {
      return NextResponse.json({ error: "CEP must be 8 digits" }, { status: 400 });
    }

    if (isDemoMode()) {
      return NextResponse.json({
        cep: "69010-120",
        logradouro: "Rua Ramos Ferreira",
        complemento: "",
        bairro: "Centro",
        localidade: "Manaus",
        uf: "AM",
      });
    }

    const response = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch CEP data" }, { status: 502 });
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/cep error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
