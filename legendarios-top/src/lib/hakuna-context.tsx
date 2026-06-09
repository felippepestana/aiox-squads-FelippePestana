"use client";
import { createContext, useContext } from "react";
import type { HakunaRole } from "@/lib/hakuna-permissions";

export type { HakunaRole } from "@/lib/hakuna-permissions";
export { hasPermission } from "@/lib/hakuna-permissions";

interface HakunaCtx {
  hakunaId: string;
  role: HakunaRole;
}

const HakunaContext = createContext<HakunaCtx>({ hakunaId: "", role: "apoio" });

export const HakunaProvider = HakunaContext.Provider;

export function useHakuna() {
  return useContext(HakunaContext);
}
