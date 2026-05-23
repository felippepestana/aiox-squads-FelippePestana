import Dexie, { type Table } from "dexie";

export interface OfflineProntuario {
  id: string;
  senderista_id: string;
  hakuna_email: string;
  queixas: string;
  condutas: string;
  fotos_base64: string[];
  created_at: string;
  synced: boolean;
}

class LegendariosDB extends Dexie {
  prontuarios!: Table<OfflineProntuario>;

  constructor() {
    super("legendarios-top");
    this.version(1).stores({
      prontuarios: "id, senderista_id, synced, created_at",
    });
  }
}

export const db = new LegendariosDB();

export async function saveProntuarioOffline(
  data: Omit<OfflineProntuario, "id" | "created_at" | "synced">
): Promise<string> {
  const id = crypto.randomUUID();
  await db.prontuarios.add({
    ...data,
    id,
    created_at: new Date().toISOString(),
    synced: false,
  });
  return id;
}

export async function getPendingProntuarios(): Promise<OfflineProntuario[]> {
  return db.prontuarios.where("synced").equals(0).toArray();
}

export async function markProntuarioSynced(id: string): Promise<void> {
  await db.prontuarios.update(id, { synced: true });
}
