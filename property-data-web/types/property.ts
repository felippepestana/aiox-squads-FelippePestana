export type PropertyType = "residencial" | "comercial" | "rural" | "misto";
export type PropertyStatus = "draft" | "ready";
export type DocumentType = "matricula" | "iptu" | "habite_se" | "foto" | "planta" | "outro";

export interface PropertyFormData {
  address: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
  type: PropertyType;
  area?: number;
  matricula?: string;
  inscricao?: string;
}

export interface PropertySummary {
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
}

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}
