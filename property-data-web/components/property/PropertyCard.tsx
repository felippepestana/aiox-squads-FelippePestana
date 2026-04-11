"use client";

import Link from "next/link";
import { FileText, BarChart3, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PropertyCardProps {
  property: {
    id: string;
    address: string;
    number: string | null;
    city: string;
    state: string;
    type: string;
    status: string;
    documentsCount: number;
    analysesCount: number;
    createdAt: string;
  };
}

const TYPE_LABELS: Record<string, string> = {
  residencial: "Residencial",
  comercial: "Comercial",
  rural: "Rural",
  misto: "Misto",
};

export function PropertyCard({ property }: PropertyCardProps) {
  const relativeDate = formatDistanceToNow(new Date(property.createdAt), {
    addSuffix: true,
    locale: ptBR,
  });

  return (
    <Link href={`/properties/${property.id}`}>
      <Card className="transition-all hover:shadow-md hover:border-primary/50 cursor-pointer focus-within:ring-2 focus-within:ring-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-base">
                {property.address}
                {property.number ? `, ${property.number}` : ""}
              </CardTitle>
              <CardDescription>
                {property.city} - {property.state}
              </CardDescription>
            </div>
            <Badge variant={property.status === "ready" ? "default" : "secondary"}>
              {TYPE_LABELS[property.type] || property.type}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>
                {property.documentsCount}{" "}
                {property.documentsCount === 1 ? "documento" : "documentos"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <BarChart3 className="h-4 w-4" />
              <span>
                {property.analysesCount}{" "}
                {property.analysesCount === 1 ? "analise" : "analises"}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{relativeDate}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
