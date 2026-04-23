/**
 * Ticket and GO API Client
 * Plataforma oficial do Movimento Legendários para gestão de ingressos.
 * App customizado: "Legendários - Check-in" (Android + iOS)
 * Funcionalidades: QR code check-in, impressão de crachá Bluetooth, lista offline
 */

const BASE_URL = process.env.TICKET_AND_GO_API_URL ?? "https://api.ticketandgo.com.br/v1";
const API_KEY = process.env.TICKET_AND_GO_API_KEY ?? "";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function request<T>(
  method: HttpMethod,
  path: string,
  body?: unknown
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
      "X-Platform": "legendarios-platform",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Ticket and GO API error ${res.status}: ${error}`);
  }

  return res.json() as T;
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TnGEvento {
  id: string;
  nome: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  local: string;
  status: "rascunho" | "publicado" | "encerrado" | "cancelado";
  url_ingresso: string;
  url_qr: string;
  ingressos_disponiveis: number;
  ingressos_vendidos: number;
  imagem_url?: string;
}

export interface TnGLote {
  id: string;
  evento_id: string;
  nome: string;
  descricao?: string;
  preco: number;
  preco_taxa: number;
  quantidade: number;
  quantidade_vendida: number;
  data_inicio_venda: string;
  data_fim_venda: string;
  gatilho_quantidade?: number;
  status: "pendente" | "ativo" | "encerrado" | "esgotado";
  visivel: boolean;
}

export interface TnGInscricao {
  id: string;
  evento_id: string;
  lote_id: string;
  participante: {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    cpf?: string;
    campos_extras: Record<string, string>;
  };
  status: "pendente" | "confirmado" | "cancelado" | "estornado";
  qr_code: string;
  metodo_pagamento: string;
  valor_pago: number;
  pago_em?: string;
  checkin_em?: string;
  created_at: string;
}

export interface TnGFormularioField {
  id: string;
  tipo: "texto" | "select" | "checkbox" | "radio" | "telefone" | "cpf";
  label: string;
  obrigatorio: boolean;
  opcoes?: string[];
  ordem: number;
}

export interface TnGCheckinResult {
  sucesso: boolean;
  mensagem: string;
  inscricao?: TnGInscricao;
  ja_fez_checkin: boolean;
}

export interface TnGRelatorioPagamento {
  evento_id: string;
  total_receita: number;
  receita_por_metodo: Record<string, number>;
  receita_por_lote: Record<string, number>;
  ingressos_confirmados: number;
  ingressos_cancelados: number;
  taxa_plataforma: number;
}

// ─── Evento ──────────────────────────────────────────────────────────────────

export async function criarEvento(data: {
  nome: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  local: string;
  capacidade: number;
  imagem_url?: string;
}): Promise<TnGEvento> {
  return request<TnGEvento>("POST", "/eventos", data);
}

export async function buscarEvento(eventoId: string): Promise<TnGEvento> {
  return request<TnGEvento>("GET", `/eventos/${eventoId}`);
}

export async function atualizarStatusEvento(
  eventoId: string,
  status: "publicado" | "encerrado" | "cancelado"
): Promise<TnGEvento> {
  return request<TnGEvento>("PATCH", `/eventos/${eventoId}/status`, { status });
}

export async function listarEventos(): Promise<TnGEvento[]> {
  return request<TnGEvento[]>("GET", "/eventos");
}

// ─── Lotes ───────────────────────────────────────────────────────────────────

export async function criarLote(
  eventoId: string,
  data: {
    nome: string;
    descricao?: string;
    preco: number;
    quantidade: number;
    data_inicio_venda: string;
    data_fim_venda: string;
    gatilho_quantidade?: number;
    campos_formulario?: TnGFormularioField[];
  }
): Promise<TnGLote> {
  return request<TnGLote>("POST", `/eventos/${eventoId}/lotes`, data);
}

export async function listarLotes(eventoId: string): Promise<TnGLote[]> {
  return request<TnGLote[]>("GET", `/eventos/${eventoId}/lotes`);
}

export async function atualizarLote(
  eventoId: string,
  loteId: string,
  data: Partial<TnGLote>
): Promise<TnGLote> {
  return request<TnGLote>("PATCH", `/eventos/${eventoId}/lotes/${loteId}`, data);
}

/**
 * Configura dual trigger: encerrar lote pela PRIMEIRA condição atingida
 * (quantidade vendida OU data). Nunca gate manual.
 */
export async function configurarDualTrigger(
  eventoId: string,
  loteId: string,
  opts: { quantidade: number; data: string }
): Promise<TnGLote> {
  return request<TnGLote>(
    "PATCH",
    `/eventos/${eventoId}/lotes/${loteId}/triggers`,
    {
      gatilho_quantidade: opts.quantidade,
      data_fim_venda: opts.data,
      trigger_mode: "first_reached",
    }
  );
}

// ─── Inscrições ───────────────────────────────────────────────────────────────

export async function listarInscricoes(
  eventoId: string,
  opts?: { status?: string; page?: number; limit?: number }
): Promise<{ inscricoes: TnGInscricao[]; total: number; pagina: number }> {
  const params = new URLSearchParams();
  if (opts?.status) params.set("status", opts.status);
  if (opts?.page) params.set("page", String(opts.page));
  if (opts?.limit) params.set("limit", String(opts.limit ?? 100));

  return request<{ inscricoes: TnGInscricao[]; total: number; pagina: number }>(
    "GET",
    `/eventos/${eventoId}/inscricoes?${params}`
  );
}

export async function buscarInscricaoPorQR(
  eventoId: string,
  qrCode: string
): Promise<TnGInscricao> {
  return request<TnGInscricao>(
    "GET",
    `/eventos/${eventoId}/inscricoes/qr/${encodeURIComponent(qrCode)}`
  );
}

export async function realizarCheckin(
  eventoId: string,
  qrCode: string,
  operadorId: string
): Promise<TnGCheckinResult> {
  return request<TnGCheckinResult>("POST", `/eventos/${eventoId}/checkin`, {
    qr_code: qrCode,
    operador_id: operadorId,
    plataforma: "legendarios-check-in",
  });
}

// ─── Formulário LGPD ─────────────────────────────────────────────────────────

/**
 * Configura o formulário de inscrição com campos LGPD obrigatórios.
 * LGPD exige: consentimento de comunicação + uso de imagem (opt-in ativo).
 */
export async function configurarFormularioLGPD(eventoId: string): Promise<void> {
  const campos: TnGFormularioField[] = [
    {
      id: "status_conjugal",
      tipo: "select",
      label: "Estado civil",
      obrigatorio: true,
      opcoes: ["Casado", "Solteiro", "Divorciado", "Viúvo"],
      ordem: 1,
    },
    {
      id: "tem_filhos",
      tipo: "radio",
      label: "Tem filhos?",
      obrigatorio: true,
      opcoes: ["Sim", "Não"],
      ordem: 2,
    },
    {
      id: "faixa_etaria",
      tipo: "select",
      label: "Faixa etária",
      obrigatorio: true,
      opcoes: ["18-24", "25-34", "35-44", "45-54", "55+"],
      ordem: 3,
    },
    {
      id: "como_conheceu",
      tipo: "select",
      label: "Como conheceu o Legendários?",
      obrigatorio: false,
      opcoes: [
        "Instagram",
        "WhatsApp",
        "Indicação de amigo",
        "Igreja",
        "YouTube",
        "Outro",
      ],
      ordem: 4,
    },
    {
      id: "lgpd_comunicacao",
      tipo: "checkbox",
      label:
        "Autorizo o Movimento Legendários a entrar em contato por WhatsApp e email com informações sobre o evento e conteúdos relacionados (opt-in LGPD obrigatório para receber comunicações).",
      obrigatorio: true,
      ordem: 5,
    },
    {
      id: "lgpd_imagem",
      tipo: "checkbox",
      label:
        "Autorizo o uso da minha imagem em fotos e vídeos do evento para divulgação nas redes sociais do Movimento Legendários.",
      obrigatorio: false,
      ordem: 6,
    },
  ];

  await request("POST", `/eventos/${eventoId}/formulario/campos`, { campos });
}

// ─── Relatórios ───────────────────────────────────────────────────────────────

export async function relatorioPagamentos(
  eventoId: string
): Promise<TnGRelatorioPagamento> {
  return request<TnGRelatorioPagamento>(
    "GET",
    `/eventos/${eventoId}/relatorios/pagamentos`
  );
}

export async function relatorioVendasPorDia(
  eventoId: string
): Promise<{ data: string; vendas: number; receita: number }[]> {
  return request<{ data: string; vendas: number; receita: number }[]>(
    "GET",
    `/eventos/${eventoId}/relatorios/vendas-diarias`
  );
}

// ─── Webhook validation ───────────────────────────────────────────────────────

import { createHmac } from "crypto";

export function validateWebhookSignature(
  payload: string,
  signature: string,
  secret: string = process.env.TICKET_AND_GO_WEBHOOK_SECRET ?? ""
): boolean {
  const expected = createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return `sha256=${expected}` === signature;
}

export type TnGWebhookEvent =
  | { type: "inscricao.confirmada"; data: TnGInscricao }
  | { type: "inscricao.cancelada"; data: TnGInscricao }
  | { type: "lote.esgotado"; data: TnGLote }
  | { type: "lote.encerrado"; data: TnGLote }
  | { type: "checkin.realizado"; data: TnGCheckinResult & { evento_id: string } }
  | { type: "evento.publicado"; data: TnGEvento }
  | { type: "pagamento.aprovado"; data: { inscricao_id: string; valor: number; metodo: string } }
  | { type: "pagamento.estornado"; data: { inscricao_id: string; valor: number } };
