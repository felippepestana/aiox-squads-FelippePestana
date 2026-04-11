import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createServerSupabase } from "@/lib/supabase/server";
import { encrypt } from "@/lib/crypto/key-encryption";
import { isDemoMode } from "@/app/api/demo/middleware";

const prisma = new PrismaClient();

function maskKey(provider: string, keyEnc: string): string {
  // We don't decrypt here — just show a generic mask based on provider
  const prefixes: Record<string, string> = {
    anthropic: "sk-ant-",
    openai: "sk-",
    gemini: "AI",
    deepseek: "sk-",
  };
  const prefix = prefixes[provider] ?? "";
  return `${prefix}...xxxx`;
}

export async function GET() {
  try {
    if (isDemoMode()) {
      return NextResponse.json([]);
    }

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const keys = await prisma.apiKey.findMany({
      where: { profileId: user.id },
      orderBy: { createdAt: "desc" },
    });

    const masked = keys.map((key) => ({
      id: key.id,
      provider: key.provider,
      label: key.label,
      isActive: key.isActive,
      maskedKey: maskKey(key.provider, key.keyEnc),
      createdAt: key.createdAt,
    }));

    return NextResponse.json(masked);
  } catch (error) {
    console.error("GET /api/api-keys error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (isDemoMode()) {
      return NextResponse.json({ id: "demo-key", provider: "demo", label: "demo", isActive: true }, { status: 201 });
    }

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { provider, key, label } = await request.json();

    if (!provider || !key) {
      return NextResponse.json({ error: "provider and key are required" }, { status: 400 });
    }

    const keyEnc = encrypt(key);

    const apiKey = await prisma.apiKey.create({
      data: {
        provider,
        keyEnc,
        label: label ?? null,
        profileId: user.id,
      },
    });

    return NextResponse.json({
      id: apiKey.id,
      provider: apiKey.provider,
      label: apiKey.label,
      isActive: apiKey.isActive,
    }, { status: 201 });
  } catch (error) {
    console.error("POST /api/api-keys error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (isDemoMode()) {
      return NextResponse.json({ success: true });
    }

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const existing = await prisma.apiKey.findUnique({ where: { id } });
    if (!existing || existing.profileId !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.apiKey.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/api-keys error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
