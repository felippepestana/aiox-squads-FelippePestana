import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";
import Anthropic from "@anthropic-ai/sdk";
import { createServerSupabase } from "@/lib/supabase/server";
import { uploadFileFromBuffer } from "@/lib/files/upload";
import { isDemoMode } from "@/app/api/demo/middleware";
import { demoStore } from "@/lib/demo/data";

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: propertyId } = await params;

    if (isDemoMode()) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const type = formData.get("type") as string | null;

      if (!file) {
        return NextResponse.json({ error: "File is required" }, { status: 400 });
      }
      if (!type) {
        return NextResponse.json({ error: "Document type is required" }, { status: 400 });
      }

      const document = demoStore.addDocument(propertyId, {
        type,
        filename: file.name,
        mimeType: file.type,
        size: file.size,
        storageKey: `demo/${propertyId}/${file.name}`,
        fileId: null,
        propertyId,
      });
      return NextResponse.json(document, { status: 201 });
    }

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property || property.profileId !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string | null;

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }
    if (!type) {
      return NextResponse.json({ error: "Document type is required" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const storageKey = `${user.id}/${propertyId}/${nanoid()}_${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(storageKey, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase storage upload error:", uploadError);
      return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
    }

    // Upload to Anthropic Files API for direct file referencing in analyses
    let fileId: string | null = null;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (anthropicKey) {
      try {
        const anthropic = new Anthropic({ apiKey: anthropicKey });
        const uploaded = await uploadFileFromBuffer(anthropic, buffer, file.name, file.type);
        fileId = uploaded.fileId;
      } catch (err) {
        console.error("Anthropic Files API upload failed:", err);
      }
    }

    const document = await prisma.document.create({
      data: {
        type,
        filename: file.name,
        mimeType: file.type,
        size: file.size,
        storageKey,
        propertyId,
        fileId,
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("POST /api/properties/[id]/documents error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
