"use client";
import { createContext, useContext } from "react";

export type HakunaRole = "médico" | "coordenador" | "apoio";

interface HakunaCtx {
  hakunaId: string;
  role: HakunaRole;
}

const HakunaContext = createContext<HakunaCtx>({ hakunaId: "", role: "apoio" });

export const HakunaProvider = HakunaContext.Provider;

export function useHakuna() {
  return useContext(HakunaContext);
}
