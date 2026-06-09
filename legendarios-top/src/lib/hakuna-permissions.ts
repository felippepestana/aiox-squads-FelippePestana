// Permission matrix for Hakuna roles — no React directive, usable in both
// server and client components.

export type HakunaRole = "médico" | "coordenador" | "apoio";

export type Permission =
  | "view_exames"
  | "validate_exames"
  | "view_prontuarios"
  | "create_prontuarios"
  | "import_ticketgo"
  | "send_whatsapp_batch";

const PERMISSIONS: Record<Permission, HakunaRole[]> = {
  view_exames:         ["médico", "coordenador"],
  validate_exames:     ["médico", "coordenador"],
  view_prontuarios:    ["médico", "coordenador"],
  create_prontuarios:  ["médico", "apoio"],
  import_ticketgo:     ["coordenador"],
  send_whatsapp_batch: ["coordenador"],
};

export function hasPermission(role: HakunaRole, perm: Permission): boolean {
  return PERMISSIONS[perm].includes(role);
}
