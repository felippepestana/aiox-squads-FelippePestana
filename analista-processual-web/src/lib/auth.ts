import { prisma } from "@/lib/prisma";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  DEMO_USER_EMAIL,
  getOrCreateDemoUser,
  resolveUserId,
} from "@/lib/demo-user";

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
}

/** True when authentication is enforced (Supabase configured). */
export function authRequired(): boolean {
  return isSupabaseConfigured();
}

/**
 * Returns the authenticated user (and its synced Profile id) or null. Always
 * null in demo mode. The Profile is upserted by email so the app DB stays the
 * single source of ownership; for new users the Profile id is set to the
 * Supabase user id to keep a 1:1 mapping.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  if (!isSupabaseConfigured()) return null;

  // Imported lazily so demo mode never pulls in the Supabase server client
  // (which requires `next/headers` cookies and env).
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  let user = null;
  try {
    const result = await supabase.auth.getUser();
    user = result.data.user;
  } catch {
    return null;
  }

  if (!user) return null;

  const email = user.email ?? `${user.id}@users.noreply.local`;
  const fullName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    null;

  const profile = await prisma.profile.upsert({
    where: { email },
    update: {},
    create: { id: user.id, email, fullName },
    select: { id: true, email: true, fullName: true },
  });

  return { id: profile.id, email: profile.email, name: profile.fullName };
}

/**
 * Resolves the owner id for a new analysis.
 * - Auth mode: the authenticated user, or null when there is no session
 *   (callers must respond 401).
 * - Demo mode: the demo profile (optionally honoring a provided id).
 */
export async function resolveOwnerId(
  fallbackUserId?: string | null
): Promise<string | null> {
  if (authRequired()) {
    const user = await getSessionUser();
    return user ? user.id : null;
  }
  return resolveUserId(fallbackUserId);
}

/**
 * Ownership guard for a specific analysis owner id. In demo mode every request
 * is allowed; in auth mode the resource must belong to the current user.
 */
export async function canAccessAnalysisOwner(
  ownerUserId: string
): Promise<boolean> {
  if (!authRequired()) return true;
  const user = await getSessionUser();
  return Boolean(user && user.id === ownerUserId);
}

/**
 * Loads an analysis and enforces ownership in auth mode. Returns a discriminated
 * result so route handlers can map it to the right HTTP status.
 */
export async function loadAnalysisForRequest(
  analysisId: string
): Promise<
  | { ok: true; ownerId: string }
  | { ok: false; status: 401 | 403 | 404 }
> {
  const analysis = await prisma.analysis.findUnique({
    where: { id: analysisId },
    select: { userId: true },
  });
  if (!analysis) return { ok: false, status: 404 };

  if (authRequired()) {
    const user = await getSessionUser();
    if (!user) return { ok: false, status: 401 };
    if (user.id !== analysis.userId) return { ok: false, status: 403 };
  }

  return { ok: true, ownerId: analysis.userId };
}

/** User shown in the dashboard header (real user, or a demo placeholder). */
export async function getDisplayUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (user) return user;
  if (!authRequired()) {
    const id = await getOrCreateDemoUser();
    return { id, email: DEMO_USER_EMAIL, name: "Usuário Demo" };
  }
  return { id: "", email: "", name: null };
}
