"use client";

import { Clock, FileText, CheckCircle, AlertCircle, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TimelineEvent {
  date: string;
  description: string;
  type: "filing" | "decision" | "hearing" | "motion" | "other";
}

interface TimelineSectionProps {
  timeline: TimelineEvent[];
}

function getTypeIcon(type: TimelineEvent["type"]) {
  const icons = {
    filing: <FileText className="h-4 w-4" />,
    decision: <CheckCircle className="h-4 w-4" />,
    hearing: <Calendar className="h-4 w-4" />,
    motion: <AlertCircle className="h-4 w-4" />,
    other: <Clock className="h-4 w-4" />,
  };
  return icons[type];
}

function getTypeBadge(type: TimelineEvent["type"]) {
  const config = {
    filing: { label: "Petição", color: "bg-blue-100 text-blue-900" },
    decision: { label: "Decisão", color: "bg-green-100 text-green-900" },
    hearing: { label: "Audiência", color: "bg-purple-100 text-purple-900" },
    motion: { label: "Moção", color: "bg-yellow-100 text-yellow-900" },
    other: { label: "Outro", color: "bg-gray-100 text-gray-900" },
  };
  const cfg = config[type];
  return <Badge className={cfg.color}>{cfg.label}</Badge>;
}

export function TimelineSection({ timeline }: TimelineSectionProps) {
  if (!timeline || timeline.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Cronologia
          </CardTitle>
          <CardDescription>Nenhum evento identificado</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Cronologia
        </CardTitle>
        <CardDescription>{timeline.length} evento(s) identificado(s)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-6">
          {timeline.map((event, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  {getTypeIcon(event.type)}
                </div>
                {idx < timeline.length - 1 && (
                  <div className="h-12 w-0.5 bg-border my-2" />
                )}
              </div>
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-sm">
                    {new Date(event.date).toLocaleDateString("pt-BR")}
                  </p>
                  {getTypeBadge(event.type)}
                </div>
                <p className="text-sm text-muted-foreground">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
