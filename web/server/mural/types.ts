export type ImageRole =
  | "identity"
  | "environment"
  | "activity"
  | "body_pose"
  | "style"
  | "location";

export interface MuralReferenceInput {
  id: string;
  role: ImageRole;
  mimeType: string;
  dataBase64: string;
}

export interface MuralComposeOptions {
  variants?: number;
  aspectRatio?: string;
}

export interface MuralComposeRequest {
  prompt: string;
  references: MuralReferenceInput[];
  options?: MuralComposeOptions;
}

export interface ReferenceAnalysis {
  refId: string;
  role: ImageRole;
  traits: string[];
  visualTokens: Record<string, string>;
  summary: string;
}

export interface MuralBrief {
  userPrompt: string;
  identityLock: string[];
  sceneSpec: string;
  generationPrompt: string;
  negativeConstraints: string[];
  qualityChecks: string[];
  referenceAnalyses: ReferenceAnalysis[];
}

export type MuralJobStatus =
  | "pending"
  | "analyzing"
  | "briefing"
  | "generating"
  | "curating"
  | "completed"
  | "failed";

export interface MuralGeneratedAsset {
  filename: string;
  url: string;
  variantIndex: number;
}

export interface MuralJob {
  id: string;
  status: MuralJobStatus;
  createdAt: string;
  updatedAt: string;
  error?: string;
  brief?: MuralBrief;
  assets: MuralGeneratedAsset[];
  manifestPath?: string;
}

export const IMAGE_ROLES: ImageRole[] = [
  "identity",
  "environment",
  "activity",
  "body_pose",
  "style",
  "location",
];

export function isImageRole(v: string): v is ImageRole {
  return (IMAGE_ROLES as string[]).includes(v);
}
