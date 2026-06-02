import { prisma } from "@/lib/prisma";

/**
 * Until real authentication is wired, analyses are attributed to a single
 * deterministic demo profile. This avoids foreign-key violations from the
 * previous hardcoded `userId: "demo-user"` (which never existed in the DB).
 */
export const DEMO_USER_EMAIL = "demo@analista-processual.local";

export async function getOrCreateDemoUser(): Promise<string> {
  const profile = await prisma.profile.upsert({
    where: { email: DEMO_USER_EMAIL },
    update: {},
    create: {
      email: DEMO_USER_EMAIL,
      fullName: "Usuário Demo",
    },
    select: { id: true },
  });

  return profile.id;
}

/**
 * Resolves the user that owns an analysis. If a concrete userId is provided it
 * is validated against existing profiles; otherwise the demo profile is used.
 */
export async function resolveUserId(userId?: string | null): Promise<string> {
  if (userId) {
    const existing = await prisma.profile.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (existing) return existing.id;
  }
  return getOrCreateDemoUser();
}
