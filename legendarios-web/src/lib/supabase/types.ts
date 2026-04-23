export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type EventoTipo = "TOP" | "REM" | "LEGADO";
export type EventoStatus = "planejamento" | "inscricoes_abertas" | "esgotado" | "em_andamento" | "encerrado" | "cancelado";
export type LoteStatus = "pendente" | "ativo" | "encerrado";
export type InscricaoStatus = "pendente" | "confirmada" | "cancelada" | "estornada" | "presente";
export type CanalMensagem = "whatsapp" | "email";
export type TipoCampanha = "meta_ads" | "instagram" | "whatsapp" | "email" | "influenciador";
export type TipoRelatorio = "semanal" | "final" | "marketing" | "financeiro";
export type InfluenciadorTier = "nano" | "micro" | "mid" | "macro" | "mega";

export interface Database {
  public: {
    Tables: {
      cidades: {
        Row: {
          id: string;
          nome: string;
          estado: string;
          regiao: string;
          score_maturidade: number;
          score_potencial: number;
          ativa: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["cidades"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["cidades"]["Insert"]>;
      };

      eventos: {
        Row: {
          id: string;
          nome: string;
          tipo: EventoTipo;
          cidade_id: string;
          data_inicio: string | null;
          data_fim: string | null;
          capacidade_meta: number;
          capacidade_minima: number;
          status: EventoStatus;
          budget_marketing: number | null;
          local: string | null;
          plataforma_inscricao: string;
          ticket_and_go_event_id: string | null;
          sympla_event_id: string | null;
          configuracoes: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["eventos"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["eventos"]["Insert"]>;
      };

      lotes: {
        Row: {
          id: string;
          evento_id: string;
          numero: number;
          nome: string;
          preco: number;
          vagas: number;
          vendidas: number;
          data_inicio_venda: string | null;
          data_fim_venda: string | null;
          gatilho_quantidade: number | null;
          status: LoteStatus;
          ticket_and_go_lote_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["lotes"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["lotes"]["Insert"]>;
      };

      participantes: {
        Row: {
          id: string;
          nome: string;
          email: string | null;
          telefone: string | null;
          whatsapp: string | null;
          status_conjugal: "casado" | "solteiro" | "divorciado" | "viuvo" | null;
          tem_filhos: boolean | null;
          faixa_etaria: string | null;
          cidade: string | null;
          estado: string | null;
          como_conheceu: string | null;
          instagram: string | null;
          profissao: string | null;
          score_engajamento: number;
          lgpd_comunicacao: boolean;
          lgpd_imagem: boolean;
          lgpd_data_consentimento: string | null;
          lgpd_data_expiracao: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["participantes"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["participantes"]["Insert"]>;
      };

      inscricoes: {
        Row: {
          id: string;
          participante_id: string;
          evento_id: string;
          lote_id: string;
          status: InscricaoStatus;
          valor_pago: number | null;
          metodo_pagamento: "pix" | "cartao_credito" | "cartao_debito" | "boleto" | null;
          ticket_and_go_ticket_id: string | null;
          checkin_realizado_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["inscricoes"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["inscricoes"]["Insert"]>;
      };

      campanhas: {
        Row: {
          id: string;
          evento_id: string;
          nome: string;
          tipo: TipoCampanha;
          status: "rascunho" | "ativo" | "pausado" | "concluido";
          budget_alocado: number | null;
          gasto_atual: number;
          impressoes: number;
          cliques: number;
          leads: number;
          conversoes: number;
          configuracoes: Json;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["campanhas"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["campanhas"]["Insert"]>;
      };

      influenciadores: {
        Row: {
          id: string;
          nome: string;
          instagram: string | null;
          youtube: string | null;
          seguidores_instagram: number | null;
          seguidores_youtube: number | null;
          nicho: string[];
          cidade: string | null;
          estado: string | null;
          tier: InfluenciadorTier | null;
          valor_story: number | null;
          valor_feed: number | null;
          score_fit: number | null;
          contratado_eventos: string[];
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["influenciadores"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["influenciadores"]["Insert"]>;
      };

      relatorios: {
        Row: {
          id: string;
          evento_id: string;
          tipo: TipoRelatorio;
          semana_numero: number | null;
          dados: Json;
          arquivo_path: string | null;
          gerado_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["relatorios"]["Row"], "id" | "gerado_at">;
        Update: Partial<Database["public"]["Tables"]["relatorios"]["Insert"]>;
      };

      conversas_ia: {
        Row: {
          id: string;
          evento_id: string | null;
          agente: string;
          use_case: string | null;
          mensagens: Json;
          tokens_usados: number;
          custo_estimado: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["conversas_ia"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["conversas_ia"]["Insert"]>;
      };

      webhooks_log: {
        Row: {
          id: string;
          fonte: string;
          evento: string;
          payload: Json | null;
          processado: boolean;
          erro: string | null;
          received_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["webhooks_log"]["Row"], "id" | "received_at">;
        Update: Partial<Database["public"]["Tables"]["webhooks_log"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

export type Cidade = Database["public"]["Tables"]["cidades"]["Row"];
export type Evento = Database["public"]["Tables"]["eventos"]["Row"];
export type Lote = Database["public"]["Tables"]["lotes"]["Row"];
export type Participante = Database["public"]["Tables"]["participantes"]["Row"];
export type Inscricao = Database["public"]["Tables"]["inscricoes"]["Row"];
export type Campanha = Database["public"]["Tables"]["campanhas"]["Row"];
export type Influenciador = Database["public"]["Tables"]["influenciadores"]["Row"];
export type Relatorio = Database["public"]["Tables"]["relatorios"]["Row"];
export type ConversaIA = Database["public"]["Tables"]["conversas_ia"]["Row"];
