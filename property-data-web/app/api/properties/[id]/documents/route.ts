import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";
import { createServerSupabase } from "@/lib/supabase/server";

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: propertyId } = await params;
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

    const document = await prisma.document.create({
      data: {
        type,
        filename: file.name,
        mimeType: file.type,
        size: file.size,
        storageKey,
        propertyId,
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("POST /api/properties/[id]/documents error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
