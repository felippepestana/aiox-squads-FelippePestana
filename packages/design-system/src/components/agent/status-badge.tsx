import { Loader2 } from "lucide-react";

import { Badge } from "../ui/badge";

export type AnalysisStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | string;

/**
 * Badge consistente para o status de uma análise processual.
 */
export function StatusBadge({ status }: { status: AnalysisStatus }) {
  switch (status) {
    case "COMPLETED":
      return <Badge variant="success">Concluída</Badge>;
    case "PROCESSING":
      return (
        <Badge variant="warning">
          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
          Processando
        </Badge>
      );
    case "PENDING":
      return <Badge variant="secondary">Pendente</Badge>;
    case "FAILED":
      return <Badge variant="destructive">Falhou</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}
