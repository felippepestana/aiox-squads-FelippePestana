const BASE = "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Erro na requisicao");
  }
  return res.json();
}

// Sessions
export const createSession = (title = "Nova Analise") =>
  request<any>("/sessions", { method: "POST", body: JSON.stringify({}), headers: { "Content-Type": "application/json" } })
    .catch(() => request<any>(`/sessions?title=${encodeURIComponent(title)}`, { method: "POST" }));

export const listSessions = () => request<any[]>("/sessions");

export const getSession = (id: string) => request<any>(`/sessions/${id}`);

// Chat
export const sendMessage = (data: {
  session_id: string;
  content: string;
  considerations?: string;
  references?: any[];
  target_agent?: string;
}) => request<any>("/chat", { method: "POST", body: JSON.stringify(data) });

// Documents
export const uploadDocument = async (file: File, sessionId: string) => {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${BASE}/documents/upload?session_id=${sessionId}`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error("Upload falhou");
  return res.json();
};

export const listDocuments = () => request<any[]>("/documents");

export const getDocument = (id: string) => request<any>(`/documents/${id}`);

export const getPage = (docId: string, page: number) =>
  request<any>(`/documents/${docId}/pages/${page}`);

export const getPageThumbnail = (docId: string, page: number) =>
  request<any>(`/documents/${docId}/pages/${page}/thumbnail`);

export const searchDocument = (docId: string, query: string) =>
  request<any>(`/documents/${docId}/search?q=${encodeURIComponent(query)}`);

// Clips
export const createClip = (data: {
  doc_id: string;
  page_start: number;
  page_end?: number;
  x0?: number;
  y0?: number;
  x1?: number;
  y1?: number;
  clip_type?: string;
  label?: string;
}) => request<any>("/clips", { method: "POST", body: JSON.stringify(data) });

export const listClips = (docId?: string) =>
  request<any[]>(`/clips${docId ? `?doc_id=${docId}` : ""}`);

export const getClip = (id: string) => request<any>(`/clips/${id}`);

// Agents
export const listAgents = () => request<any[]>("/agents");

export const getAgent = (id: string) => request<any>(`/agents/${id}`);

export const searchAgents = (query: string) =>
  request<any[]>("/agents/search", {
    method: "POST",
    body: JSON.stringify({ query }),
  });

export const createAgent = (data: {
  name: string;
  role: string;
  expertise: string;
  tier?: string;
  style?: string;
  commands?: string[];
}) => request<any>("/agents/create", { method: "POST", body: JSON.stringify(data) });

// Drafting & Reports
export const draftPiece = (data: {
  session_id: string;
  piece_type: string;
  considerations?: string;
  references?: any[];
  clips?: string[];
  instructions?: string;
}) => request<any>("/draft", { method: "POST", body: JSON.stringify(data) });

export const strategicReport = (data: {
  session_id: string;
  focus_areas?: string[];
}) => request<any>("/report", { method: "POST", body: JSON.stringify(data) });
