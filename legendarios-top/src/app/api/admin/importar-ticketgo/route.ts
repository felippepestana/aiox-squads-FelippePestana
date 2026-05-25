import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { createClient } from "@/lib/supabase/server";
import { classificarRisco, calcularIdade } from "@/lib/triage";

// TICKETGO column index map (1-based, matches the export format)
const COL = {
  ID: 0,         // #
  ORIGEM: 1,
  STATUS_TICKET: 2,
  DATA_CREDENC: 3,
  DATA_CADASTRO: 4,
  CPF: 5,
  DOC_ESTRANG: 6,
  NOME: 7,
  EMAIL: 8,
  TELEFONE: 9,
  CODIGO: 10,
  STATUS_PRESENCA: 11,
  OPERADOR: 12,
  PARA_QUEM: 13,
  FAMILIA: 14,
  IDADE: 15,
  EVENTO: 16,
  PRODUTO: 17,
  TIPO_VENDA: 18,
  INFO_ADD: 19,
  VALOR: 20,
  ESTADO: 21,
  CIDADE: 22,
  UN_PESO: 23,
  UN_ALTURA: 24,
  PROFISSAO: 25,
  DDD_ESPOSA: 26,
  NASCIMENTO: 27,
  PESO: 28,
  ALTURA: 29,
  TAMANHO: 30,
  COND_FISICA: 31,
  COND_MEDICA: 32,
  USO_MED: 33,
  REST_ALIM: 34,
  VAI_COM: 35,
  IGREJA: 36,
  INSTAGRAM: 37,
  NOME_ESPOSA: 38,
  WHATS_ESPOSA: 39,
  EMAIL_ESPOSA: 40,
  NOME_ACOMP: 41,
  COND_DETALHADA: 42,
  MEDICAMENTO: 43,
} as const;

function normalizeCpf(raw: unknown): string | null {
  if (raw == null) return null;
  const s = String(raw).replace(/\D/g, "").padStart(11, "0");
  return s.length >= 11 ? s.slice(-11) : null;
}

function normalizeTelefone(raw: unknown): string {
  if (raw == null) return "";
  return String(raw).replace(/\D/g, "");
}

function normalizeDate(raw: unknown): string | null {
  if (!raw) return null;
  if (raw instanceof Date) {
    const y = raw.getUTCFullYear();
    const m = String(raw.getUTCMonth() + 1).padStart(2, "0");
    const d = String(raw.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  const s = String(raw);
  // accept YYYY-MM-DD or DD/MM/YYYY
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const match = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (match) return `${match[3]}-${match[2]}-${match[1]}`;
  return null;
}

function str(raw: unknown): string | null {
  if (raw == null) return null;
  const s = String(raw).trim();
  return s || null;
}

function bool(raw: unknown): boolean {
  return String(raw).trim().toLowerCase() === "sim";
}

function presencaStatus(raw: unknown): string {
  const s = String(raw ?? "").trim().toUpperCase();
  if (s === "PRESENTE") return "presente";
  if (s === "COMPRA CANCELADA") return "compra_cancelada";
  return "ausente";
}

// Validate that a value looks like a name (not a phone number)
function isName(raw: unknown): boolean {
  if (!raw) return false;
  const s = String(raw).trim();
  return !/^\d{8,}$/.test(s) && s.length > 2;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { data: hakuna } = await supabase
    .from("hakunas")
    .select("id")
    .eq("email", user.email!)
    .single();
  if (!hakuna) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "Arquivo não enviado" }, { status: 400 });
  }

  const allowedTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
  ];
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (!allowedTypes.includes(file.type) && ext !== "xlsx" && ext !== "xls") {
    return NextResponse.json({ error: "Somente arquivos .xlsx / .xls são aceitos" }, { status: 400 });
  }

  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: "array", cellDates: true });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows: unknown[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });

  if (rows.length < 2) {
    return NextResponse.json({ error: "Planilha vazia" }, { status: 400 });
  }

  const results = { imported: 0, updated: 0, skipped: 0, errors: [] as string[] };

  // Skip header row (index 0)
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i] as unknown[];
    if (!row || row.every(v => v == null)) continue;

    const statusTicket = str(row[COL.STATUS_TICKET]) ?? "";
    const nomeRaw = str(row[COL.NOME]);
    if (!nomeRaw) {
      results.skipped++;
      continue;
    }

    const cpf = normalizeCpf(row[COL.CPF]);
    const dataNascimento = normalizeDate(row[COL.NASCIMENTO]);
    if (!dataNascimento) {
      results.errors.push(`Linha ${i + 1} (${nomeRaw}): data de nascimento inválida`);
      results.skipped++;
      continue;
    }

    const condMedica = bool(row[COL.COND_MEDICA]);
    const condDetalhada = str(row[COL.COND_DETALHADA]);
    const comorbidades: string[] = condMedica && condDetalhada
      ? condDetalhada.split(/[,;\/\n]+/).map(s => s.trim()).filter(Boolean)
      : [];

    let triagem;
    try {
      triagem = classificarRisco(dataNascimento, comorbidades);
    } catch {
      const idade = calcularIdade(dataNascimento);
      triagem = classificarRisco(dataNascimento, []);
      results.errors.push(`Linha ${i + 1} (${nomeRaw}): triagem calculada com idade ${idade} sem comorbidades`);
    }

    const nomeEsposa = isName(row[COL.NOME_ESPOSA]) ? str(row[COL.NOME_ESPOSA]) : null;
    const whatsEsposa = normalizeTelefone(row[COL.WHATS_ESPOSA]) || null;
    const emailEsposa = str(row[COL.EMAIL_ESPOSA]);

    const record = {
      nome: nomeRaw,
      telefone: normalizeTelefone(row[COL.TELEFONE]) || normalizeTelefone(row[COL.WHATS_ESPOSA]),
      data_nascimento: dataNascimento,
      peso_kg: row[COL.PESO] ? Number(row[COL.PESO]) : null,
      altura_cm: row[COL.ALTURA] ? Number(row[COL.ALTURA]) : null,
      plano_saude: false,
      comorbidades,
      classificacao_risco: triagem.risco,
      exames_exigidos: triagem.exames,
      // TICKETGO enrichment
      cpf,
      email: str(row[COL.EMAIL])?.toLowerCase() ?? null,
      estado: str(row[COL.ESTADO]),
      cidade: str(row[COL.CIDADE]),
      profissao: str(row[COL.PROFISSAO]),
      tamanho_camisa: str(row[COL.TAMANHO]),
      cond_fisica_autorelatada: row[COL.COND_FISICA] ? Number(row[COL.COND_FISICA]) : null,
      restricao_alimentar: bool(row[COL.REST_ALIM]),
      instagram: str(row[COL.INSTAGRAM]),
      nome_conjuge: nomeEsposa,
      whatsapp_conjuge: whatsEsposa,
      email_conjuge: emailEsposa,
      nome_acompanhante: str(row[COL.NOME_ACOMP]),
      cond_medica_detalhada: condDetalhada,
      uso_medicamento: bool(row[COL.USO_MED]),
      medicamentos: str(row[COL.MEDICAMENTO]),
      vai_acompanhado: bool(row[COL.VAI_COM]),
      tipo_participante: String(row[COL.PARA_QUEM] ?? "SENDERISTA").toLowerCase() === "legendario" ? "legendario" : "senderista",
      familia: str(row[COL.FAMILIA]),
      igreja: str(row[COL.IGREJA]),
      codigo_ingresso: str(row[COL.CODIGO]),
      ticketgo_id: row[COL.ID] ? Number(row[COL.ID]) : null,
      evento_nome: str(row[COL.EVENTO]),
      valor_bilhete: row[COL.VALOR] ? Number(row[COL.VALOR]) : null,
      status_ingresso: statusTicket.toLowerCase() === "cancelado" ? "cancelado" : "ativo",
      status_presenca: presencaStatus(row[COL.STATUS_PRESENCA]),
      data_cadastro_origem: row[COL.DATA_CADASTRO] instanceof Date
        ? (row[COL.DATA_CADASTRO] as Date).toISOString()
        : null,
      status: statusTicket.toLowerCase() === "cancelado" ? "cancelado" : "pendente",
    };

    // Upsert: conflict on cpf (if available) or ticketgo_id
    if (cpf) {
      const { error, data } = await supabase
        .from("senderistas")
        .upsert(record, { onConflict: "cpf", ignoreDuplicates: false })
        .select("id")
        .single();

      if (error) {
        results.errors.push(`Linha ${i + 1} (${nomeRaw}): ${error.message}`);
        results.skipped++;
      } else if (data) {
        results.imported++;
      }
    } else if (record.ticketgo_id) {
      const { error } = await supabase
        .from("senderistas")
        .upsert(record, { onConflict: "ticketgo_id", ignoreDuplicates: false });

      if (error) {
        results.errors.push(`Linha ${i + 1} (${nomeRaw}): ${error.message}`);
        results.skipped++;
      } else {
        results.imported++;
      }
    } else {
      // No dedup key — plain insert
      const { error } = await supabase.from("senderistas").insert(record);
      if (error) {
        results.errors.push(`Linha ${i + 1} (${nomeRaw}): ${error.message}`);
        results.skipped++;
      } else {
        results.imported++;
      }
    }
  }

  return NextResponse.json(results);
}
