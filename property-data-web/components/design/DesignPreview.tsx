"use client";

import Image from "next/image";
import { FileText, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DesignPreviewProps {
  thumbUrl?: string;
  fileUrl?: string;
  mode: string;
  format: string;
  createdAt: string;
}

const MODE_LABELS: Record<string, string> = {
  RELATORIO: "Relatório",
  LAUDO_ABNT: "Laudo ABNT",
  CARD: "Card",
  SUMMARY: "Sumário",
};

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function DesignPreview({
  thumbUrl,
  fileUrl,
  mode,
  format,
  createdAt,
}: DesignPreviewProps) {
  return (
    <Card className="overflow-hidden">
      {/* Thumbnail area */}
      <div className="relative aspect-[4/3] bg-muted flex items-center justify-center">
        {thumbUrl ? (
          <Image
            src={thumbUrl}
            alt={`Preview ${MODE_LABELS[mode] ?? mode}`}
            fill
            className="object-cover"
          />
        ) : (
          <FileText className="h-12 w-12 text-muted-foreground/40" />
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {MODE_LABELS[mode] ?? mode}
          </Badge>
          <Badge variant="outline" className="text-xs uppercase">
            {format}
          </Badge>
        </div>

        <p className="text-xs text-muted-foreground">{formatDate(createdAt)}</p>

        {fileUrl && (
          <Button variant="outline" size="sm" className="w-full" asChild>
            <a href={fileUrl} download target="_blank" rel="noopener noreferrer">
              <Download className="mr-2 h-3 w-3" />
              Download
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
