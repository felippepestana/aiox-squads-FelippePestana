import { NextResponse } from "next/server";
import { getBridgeStatus } from "@/server/osc-bridge";

// Server-only: exposes the OSC bridge status (listening port, last messages,
// error counter) so the panel UI can render an indicator next to the OBS
// connection pill.
export async function GET() {
  return NextResponse.json(getBridgeStatus());
}
