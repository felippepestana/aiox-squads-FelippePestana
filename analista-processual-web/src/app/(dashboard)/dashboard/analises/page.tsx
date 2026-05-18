"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  FileText,
  Clock,
  Loader2,
  MoreHorizontal,
  Eye,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Analysis {
  id: string;
  processNumber: string | null;
  court: string | null;
  processClass: string | null;
  status: string;
  createdAt: string;
  documents: Array<{ id: string; filename: string }>;
  _count: {
    deadlines: number;
  };
}

export default function AnalisesPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    async function fetchAnalyses() {
      try {
        const params = new URLSearchParams();
        if (statusFilter !== "all") {
          params.set("status", statusFilter);
        }
        params.set("limit", "20");

        const response = await fetch(`/api/analyses?${params}`);
        const { data } = await response.json();
        setAnalyses(data);
      } catch (error) {
        console.error("Error fetching analyses:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalyses();
  }, [statusFilter]);

  const filteredAnalyses = analyses.filter((analysis) => {
    const searchLower = search.toLowerCase();
    return (
      analysis.processNumber?.toLowerCase().includes(searchLower) ||
      analysis.court?.toLowerCase().includes(searchLower) ||
      analysis.processClass?.toLowerCase().includes(searchLower)
    );
  });

  function getStatusBadge(status: string) {
    switch (status) {
      case "COMPLETED":
        return <Badge className="bg-success text-success-foreground">Concluída</Badge>;
      case "PROCESSING":
        return (
          <Badge className="bg-warning text-warning-foreground">
            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            Processando
          </Badge>
        );
      case "PENDING":
        return <Badge variant="secondary">Pendente</Badge>;
      case "FAILED":
        return <Badge className="bg-danger text-danger-foreground">Falhou</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Análises</h1>
          <p className="text-muted-foreground">
            Gerencie todas as suas análises processuais
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/nova-analise">
            <Plus className="mr-2 h-4 w-4" />
            Nova Análise
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por número, tribunal ou classe..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="PENDING">Pendente</SelectItem>
                <SelectItem value="PROCESSING">Processando</SelectItem>
                <SelectItem value="COMPLETED">Concluída</SelectItem>
                <SelectItem value="FAILED">Falhou</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-[200px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredAnalyses.length > 0 ? (
            <div className="space-y-2">
              {filteredAnalyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/analises/${analysis.id}`}
                          className="font-medium hover:underline"
                        >
                          {analysis.processNumber || "Sem número"}
                        </Link>
                        {getStatusBadge(analysis.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {analysis.court && <span>{analysis.court}</span>}
                        {analysis.processClass && <span>{analysis.processClass}</span>}
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(analysis.createdAt).toLocaleDateString("pt-BR")}
                        </span>
                        {analysis._count.deadlines > 0 && (
                          <span className="flex items-center gap-1">
                            <span className="font-medium">{analysis._count.deadlines}</span>{" "}
                            prazo(s)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/dashboard/analises/${analysis.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/analises/${analysis.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-danger">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-[200px] flex-col items-center justify-center text-center">
              <FileText className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">Nenhuma análise encontrada</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {search || statusFilter !== "all"
                  ? "Tente ajustar seus filtros de busca."
                  : "Comece criando sua primeira análise."}
              </p>
              {!search && statusFilter === "all" && (
                <Button className="mt-4" asChild>
                  <Link href="/dashboard/nova-analise">
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Análise
                  </Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
