export type RiskLevel = "baixo" | "moderado" | "alto";

export type ExamType =
  | "atestado_cg"
  | "atestado_cardio"
  | "teste_esteira";

export interface TriageResult {
  risco: RiskLevel;
  exames: ExamType[];
  descricao: string;
}

export const EXAM_LABELS: Record<ExamType, string> = {
  atestado_cg: "Atestado médico clínico geral (alta intensidade: montanhismo/trekking)",
  atestado_cardio: "Atestado médico cardiologista",
  teste_esteira: "Teste ergométrico (esteira)",
};

export const RISK_LABELS: Record<RiskLevel, string> = {
  baixo: "Baixo Risco",
  moderado: "Risco Moderado",
  alto: "Risco Alto",
};

export function calcularIdade(dataNascimento: string): number {
  // Parse both dates in UTC to avoid timezone-induced day shifts.
  // "YYYY-MM-DD" strings are UTC midnight; using UTC getters keeps them consistent.
  const hoje = new Date();
  const [anoN, mesN, diaN] = dataNascimento.split("-").map(Number);
  let idade = hoje.getUTCFullYear() - anoN;
  const m = hoje.getUTCMonth() + 1 - mesN;
  if (m < 0 || (m === 0 && hoje.getUTCDate() < diaN)) idade--;
  return idade;
}

export function calcularIMC(pesoKg: number, alturaCm: number): number {
  const alturaM = alturaCm / 100;
  return Math.round((pesoKg / (alturaM * alturaM)) * 10) / 10;
}

export function classificarRisco(
  dataNascimento: string,
  comorbidades: string[]
): TriageResult {
  const idade = calcularIdade(dataNascimento);
  const temComorbidade = comorbidades.length > 0;

  if (idade >= 60) {
    return {
      risco: "alto",
      exames: ["teste_esteira", "atestado_cardio"],
      descricao: `${idade} anos — exige acompanhamento cardiológico independente de comorbidades.`,
    };
  }

  if (idade >= 40) {
    if (temComorbidade) {
      return {
        risco: "alto",
        exames: ["teste_esteira", "atestado_cardio"],
        descricao: `${idade} anos com comorbidades (${comorbidades.join(", ")}).`,
      };
    }
    return {
      risco: "moderado",
      exames: ["teste_esteira", "atestado_cg"],
      descricao: `${idade} anos sem comorbidades.`,
    };
  }

  // ≤ 39 anos
  if (temComorbidade) {
    return {
      risco: "moderado",
      exames: ["teste_esteira", "atestado_cg"],
      descricao: `${idade} anos com comorbidades (${comorbidades.join(", ")}).`,
    };
  }

  return {
    risco: "baixo",
    exames: ["atestado_cg"],
    descricao: `${idade} anos sem comorbidades.`,
  };
}

export const COMORBIDADES_OPCOES = [
  { value: "HAS", label: "Hipertensão Arterial Sistêmica (HAS)" },
  { value: "DM", label: "Diabetes Mellitus (DM)" },
  { value: "cardiopatia", label: "Cardiopatia / Doença cardíaca" },
  { value: "asma", label: "Asma / DPOC" },
  { value: "obesidade", label: "Obesidade (IMC ≥ 30)" },
  { value: "renal", label: "Doença renal crônica" },
  { value: "neurologica", label: "Doença neurológica" },
  { value: "ortopedica", label: "Limitação ortopédica severa" },
  { value: "outra", label: "Outra comorbidade" },
];

export const TIPOS_SANGUINEOS = [
  "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-",
];
