import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { classificarRisco, calcularIMC } from "@/lib/triage";

function normalizeCpf(v: string | null | undefined): string | null {
  if (!v) return null;
  const s = v.replace(/\D/g, "").padStart(11, "0");
  return s.length >= 11 ? s.slice(-11) : null;
}

const schema = z.object({
  nome: z.string().min(3),
  cpf: z.string().optional().nullable(),
  telefone: z.string().min(10),
  data_nascimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data de nascimento inválida"),
  tipo_sanguineo: z.string().optional().nullable(),
  peso_kg: z.number().min(20).max(300),
  altura_cm: z.number().min(100).max(250),
  plano_saude: z.enum(["sim", "nao"]),
  qual_plano: z.string().optional().nullable(),
  comorbidades: z.array(z.string()).default([]),
  restricao_alimentar: z.boolean().default(false),
  // Step 3 — family & contact
  nome_conjuge: z.string().optional().nullable(),
  whatsapp_conjuge: z.string().optional().nullable(),
  igreja: z.string().optional().nullable(),
  vai_acompanhado: z.boolean().default(false),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    const triagem = classificarRisco(data.data_nascimento, data.comorbidades);
    const imc = calcularIMC(data.peso_kg, data.altura_cm);
    const cpf = normalizeCpf(data.cpf);

    const supabase = await createClient();

    // Upsert by CPF when provided to avoid duplicates
    const record = {
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
      cpf,
      restricao_alimentar: data.restricao_alimentar,
      nome_conjuge: data.nome_conjuge ?? null,
      whatsapp_conjuge: data.whatsapp_conjuge ?? null,
      igreja: data.igreja ?? null,
      vai_acompanhado: data.vai_acompanhado,
    };

    let senderista;
    if (cpf) {
      const { data: upserted, error } = await supabase
        .from("senderistas")
        .upsert(record, { onConflict: "cpf", ignoreDuplicates: false })
        .select("id, upload_token, mensagens_token")
        .single();
      if (error) throw error;
      senderista = upserted;
    } else {
      const { data: inserted, error } = await supabase
        .from("senderistas")
        .insert(record)
        .select("id, upload_token, mensagens_token")
        .single();
      if (error) throw error;
      senderista = inserted;
    }

    return NextResponse.json({
      senderista_id: senderista.id,
      uploadToken: senderista.upload_token,
      mensagensToken: senderista.mensagens_token,
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
