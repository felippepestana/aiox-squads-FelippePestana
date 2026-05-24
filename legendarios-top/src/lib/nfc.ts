import { z } from "zod";

export interface NFCTagData {
  id: string;
  nome: string;
  sanguineo: string | null;
  plano: string | null;
  risco: "baixo" | "moderado" | "alto";
  imc: number | null;
  peso: number | null;
  altura: number | null;
  comorbidades: string[];
  status: string;
  telefone?: string;
}

// Validates data read from NFC tags before trusting it
const NFCTagSchema = z.object({
  id: z.string().uuid(),
  nome: z.string().min(1),
  sanguineo: z.string().nullable(),
  plano: z.string().nullable(),
  risco: z.enum(["baixo", "moderado", "alto"]),
  imc: z.number().nullable(),
  peso: z.number().nullable(),
  altura: z.number().nullable(),
  comorbidades: z.array(z.string()),
  status: z.string(),
  telefone: z.string().optional(),
});

export function isNFCSupported(): boolean {
  return typeof window !== "undefined" && "NDEFReader" in window;
}

export async function writeNFCTag(data: NFCTagData): Promise<void> {
  if (!isNFCSupported()) throw new Error("NFC não suportado neste dispositivo.");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ndef = new (window as any).NDEFReader();
  await ndef.write({
    records: [
      {
        recordType: "text",
        data: JSON.stringify(data),
        lang: "pt-BR",
      },
    ],
  });
}

export async function readNFCTag(signal?: AbortSignal): Promise<NFCTagData> {
  if (!isNFCSupported()) throw new Error("NFC não suportado neste dispositivo.");

  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new Error("Cancelado"));
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ndef = new (window as any).NDEFReader();

    signal?.addEventListener("abort", () => reject(new Error("Cancelado")));

    // Pass signal so Chrome cancels the scan when aborted
    ndef.scan({ signal }).then(() => {
      ndef.onreadingerror = () => reject(new Error("Erro ao ler a TAG NFC."));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ndef.onreading = (event: any) => {
        try {
          const record = event.message.records[0];
          // record.lang is a BCP-47 tag (e.g. "pt-BR"), not a charset — always decode as UTF-8
          const text = new TextDecoder("utf-8").decode(record.data);
          const parsed = NFCTagSchema.parse(JSON.parse(text));
          resolve(parsed);
        } catch {
          reject(new Error("Formato de dados inválido na TAG."));
        }
      };
    }).catch(reject);
  });
}
