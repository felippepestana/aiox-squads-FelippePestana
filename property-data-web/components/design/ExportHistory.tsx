"use client";

import { FileX } from "lucide-react";
import DesignPreview from "@/components/design/DesignPreview";

interface ExportItem {
  id: string;
  mode: string;
  format: string;
  fileUrl?: string;
  thumbUrl?: string;
  createdAt: string;
}

interface ExportHistoryProps {
  exports: ExportItem[];
}

export default function ExportHistory({ exports }: ExportHistoryProps) {
  if (exports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileX className="h-10 w-10 text-muted-foreground/40 mb-3" />
        <p className="text-sm text-muted-foreground">
          Nenhum relatório exportado ainda.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {exports.map((item) => (
        <DesignPreview
          key={item.id}
          thumbUrl={item.thumbUrl}
          fileUrl={item.fileUrl}
          mode={item.mode}
          format={item.format}
          createdAt={item.createdAt}
        />
      ))}
    </div>
  );
}
