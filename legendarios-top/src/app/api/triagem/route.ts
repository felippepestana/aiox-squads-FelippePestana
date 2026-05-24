import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { classificarRisco, calcularIMC } from "@/lib/triage";

const schema = z.object({
  nome: z.string().min(3),
  telefone: z.string().min(10),
  data_nascimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data de nascimento inválida"),
  tipo_sanguineo: z.string().optional().nullable(),
  peso_kg: z.number().min(20).max(300),
  altura_cm: z.number().min(100).max(250),
  plano_saude: z.enum(["sim", "nao"]),
  qual_plano: z.string().optional().nullable(),
  comorbidades: z.array(z.string()).default([]),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    const triagem = classificarRisco(data.data_nascimento, data.comorbidades);
    const imc = calcularIMC(data.peso_kg, data.altura_cm);

    const supabase = await createClient();

    const { data: senderista, error } = await supabase
      .from("senderistas")
      .insert({
        nome: data.nome,
        telefone: data.telefone,
        data_nascimento: data.data_nascimento,
        tipo_sanguineo: data.tipo_sanguineo ?? null,
        peso_kg: data.peso_kg,
        altura_cm: data.altura_cm,
        plano_saude: data.plano_saude === "sim",
        qual_plano: data.plano_saude === "sim" ? (data.qual_plano ?? null) : null,
        comorbidades: data.comorbidades,
        classificacao_risco: triagem.risco,
        exames_exigidos: triagem.exames,
        status: "pendente",
      })
      .select("id, upload_token")
      .single();

    if (error) throw error;

    return NextResponse.json({
      senderista_id: senderista.id,
      uploadToken: senderista.upload_token,
      risco: triagem.risco,
      exames: triagem.exames,
      imc,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos", details: err.errors }, { status: 400 });
    }
    console.error("Triagem error:", err);
    return NextResponse.json({ error: "Erro interno ao processar triagem" }, { status: 500 });
  }
}
