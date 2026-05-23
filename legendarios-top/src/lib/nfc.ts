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

export async function readNFCTag(): Promise<NFCTagData> {
  if (!isNFCSupported()) throw new Error("NFC não suportado neste dispositivo.");

  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ndef = new (window as any).NDEFReader();

    ndef.scan().then(() => {
      ndef.onreadingerror = () => reject(new Error("Erro ao ler a TAG NFC."));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ndef.onreading = (event: any) => {
        try {
          const record = event.message.records[0];
          const decoder = new TextDecoder(record.lang ?? "utf-8");
          const text = decoder.decode(record.data);
          resolve(JSON.parse(text) as NFCTagData);
        } catch {
          reject(new Error("Formato de dados inválido na TAG."));
        }
      };
    }).catch(reject);
  });
}
