"use client";
import { useEffect } from "react";
import { marcarLidas } from "./actions";

export function MarcaLidaEffect({ ids }: { ids: string[] }) {
  useEffect(() => {
    if (ids.length > 0) marcarLidas(ids);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}
