import { NextResponse } from "next/server";
import { isDemoMode } from "@/app/api/demo/middleware";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "property-data-web",
    timestamp: new Date().toISOString(),
    ...(isDemoMode() ? { demo: true } : {}),
  });
}
