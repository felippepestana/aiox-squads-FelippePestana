// Centralized token validation for the upload/mensagens portals.
//
// Two layers of use:
//   Expiry predicates — isExameUploadOpen / isMensagemPortalOpen
//     For page-level Server Components that already hold the senderista record.
//   Resolution helpers — resolveExameToken / resolveMensagemToken
//     For API route handlers: combines the DB lookup + expiry check into one
//     typed call, eliminating boilerplate and keeping the rules in one place.

import { createAdminClient } from "./supabase/admin";

// ─── Expiry windows ────────────────────────────────────────────────────────────

/** Exam uploads close 3 days before evento_data (deadline = D-3 at 23:59:59 UTC). */
export function isExameUploadOpen(eventoData: string | null | undefined): boolean {
  if (!eventoData) return true;
  const deadline = new Date(eventoData);
  deadline.setUTCDate(deadline.getUTCDate() - 3);
  deadline.setUTCHours(23, 59, 59, 999);
  return new Date() <= deadline;
}

/** Family messages portal closes 1 day after evento_data (deadline = D+1 at 23:59:59 UTC). */
export function isMensagemPortalOpen(eventoData: string | null | undefined): boolean {
  if (!eventoData) return true;
  const deadline = new Date(eventoData);
  deadline.setUTCDate(deadline.getUTCDate() + 1);
  deadline.setUTCHours(23, 59, 59, 999);
  return new Date() <= deadline;
}

// ─── Typed result ──────────────────────────────────────────────────────────────

export type TokenOk<T> = { ok: true; senderista: T };
export type TokenErr = { ok: false; status: 404 | 410; message: string };
export type TokenResult<T> = TokenOk<T> | TokenErr;

// ─── Resolution helpers (API routes) ──────────────────────────────────────────

export type ExameSenderista = { id: string; evento_data: string | null };

/** Resolves an upload token: DB lookup + expiry check in a single typed call. */
export async function resolveExameToken(
  token: string
): Promise<TokenResult<ExameSenderista>> {
  const { data, error } = await createAdminClient()
    .from("senderistas")
    .select("id, evento_data")
    .eq("upload_token", token)
    .single();

  if (error || !data) return { ok: false, status: 404, message: "Token inválido" };
  if (!isExameUploadOpen(data.evento_data)) {
    return { ok: false, status: 410, message: "Prazo de envio de exames encerrado" };
  }
  return { ok: true, senderista: data };
}

export type MensagemSenderista = {
  id: string;
  nome: string;
  evento_nome: string | null;
  evento_data: string | null;
};

/** Resolves a mensagens token: DB lookup + expiry check in a single typed call. */
export async function resolveMensagemToken(
  token: string
): Promise<TokenResult<MensagemSenderista>> {
  const { data, error } = await createAdminClient()
    .from("senderistas")
    .select("id, nome, evento_nome, evento_data")
    .eq("mensagens_token", token)
    .single();

  if (error || !data) return { ok: false, status: 404, message: "Link inválido ou expirado" };
  if (!isMensagemPortalOpen(data.evento_data)) {
    return { ok: false, status: 410, message: "Link expirado" };
  }
  return { ok: true, senderista: data };
}
