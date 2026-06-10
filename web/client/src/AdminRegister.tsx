// Admin registration (cadastro do administrador) — Pessoa Física ou Jurídica.
// Client-side validation mirrors the server (authoritative) for fast feedback.
import { useEffect, useState } from "react";
import {
  registerAdmin,
  adminRegisterStatus,
  AdminValidationError,
  type AdminRegistrationInput,
} from "./api";

function onlyDigits(v: string): string {
  return (v ?? "").replace(/\D/g, "");
}
function isValidCPF(raw: string): boolean {
  const cpf = onlyDigits(raw);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cpf[i], 10) * (10 - i);
  let d1 = (sum * 10) % 11;
  if (d1 === 10) d1 = 0;
  if (d1 !== parseInt(cpf[9], 10)) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf[i], 10) * (11 - i);
  let d2 = (sum * 10) % 11;
  if (d2 === 10) d2 = 0;
  return d2 === parseInt(cpf[10], 10);
}
function isValidCNPJ(raw: string): boolean {
  const cnpj = onlyDigits(raw);
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;
  const digit = (len: number): number => {
    const w =
      len === 12
        ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < len; i++) sum += parseInt(cnpj[i], 10) * w[i];
    const r = sum % 11;
    return r < 2 ? 0 : 11 - r;
  };
  if (digit(12) !== parseInt(cnpj[12], 10)) return false;
  return digit(13) === parseInt(cnpj[13], 10);
}
function isValidEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v ?? "").trim());
}
function maskCPF(v: string): string {
  const d = onlyDigits(v).slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}
function maskCNPJ(v: string): string {
  const d = onlyDigits(v).slice(0, 14);
  return d
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

type Tipo = "PF" | "PJ";

export function AdminRegister({ onClose }: { onClose: () => void }) {
  const [tipo, setTipo] = useState<Tipo>("PF");
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [razao, setRazao] = useState("");
  const [fantasia, setFantasia] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [banner, setBanner] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [dbEnabled, setDbEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    adminRegisterStatus()
      .then((s) => setDbEnabled(s.dbEnabled))
      .catch(() => setDbEnabled(null));
  }, []);

  function validate(): Record<string, string> {
    const e: Record<string, string> = {};
    if (!isValidEmail(email)) e.email = "E-mail inválido";
    if (tipo === "PF") {
      if (nome.trim().length < 3) e.nome_completo = "Informe o nome completo";
      if (!isValidCPF(cpf)) e.cpf = "CPF inválido";
    } else {
      if (razao.trim().length < 2) e.razao_social = "Informe a razão social";
      if (!isValidCNPJ(cnpj)) e.cnpj = "CNPJ inválido";
      if (responsavel.trim().length < 3)
        e.responsavel_nome = "Informe o nome do responsável";
    }
    return e;
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    setBanner(null);
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    const payload: AdminRegistrationInput =
      tipo === "PF"
        ? { tipo_pessoa: "PF", nome_completo: nome.trim(), cpf: onlyDigits(cpf), email: email.trim(), telefone: telefone.trim() || undefined }
        : {
            tipo_pessoa: "PJ",
            razao_social: razao.trim(),
            nome_fantasia: fantasia.trim() || undefined,
            cnpj: onlyDigits(cnpj),
            responsavel_nome: responsavel.trim(),
            email: email.trim(),
            telefone: telefone.trim() || undefined,
          };

    setBusy(true);
    try {
      const r = await registerAdmin(payload);
      setBanner({
        kind: "ok",
        text: r.persisted
          ? "Administrador cadastrado com sucesso."
          : "Cadastro validado. Persistência (Supabase) não configurada neste ambiente — configure SUPABASE_* para gravar.",
      });
      if (r.persisted) {
        setNome(""); setCpf(""); setRazao(""); setFantasia(""); setCnpj(""); setResponsavel(""); setEmail(""); setTelefone("");
      }
    } catch (err) {
      if (err instanceof AdminValidationError) {
        setErrors(err.fields);
        setBanner({ kind: "err", text: err.message });
      } else {
        setBanner({ kind: "err", text: String(err instanceof Error ? err.message : err) });
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-reg" role="region" aria-label="Cadastro de administrador">
      <div className="admin-reg__head">
        <div>
          <h2 className="admin-reg__title">Cadastro de administrador</h2>
          <p className="admin-reg__sub">
            Registre o administrador da conta — pessoa física (CPF) ou jurídica (CNPJ).
          </p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={onClose}>Fechar</button>
      </div>

      {dbEnabled === false ? (
        <div className="admin-reg__note">
          ⚠️ Persistência não configurada (sem <code>SUPABASE_*</code>). O formulário valida os dados, mas o cadastro não será gravado até configurar o Supabase.
        </div>
      ) : null}

      <div className="admin-reg__toggle" role="tablist" aria-label="Tipo de pessoa">
        <button type="button" role="tab" aria-selected={tipo === "PF"} className={`admin-reg__seg${tipo === "PF" ? " is-active" : ""}`} onClick={() => setTipo("PF")}>Pessoa Física</button>
        <button type="button" role="tab" aria-selected={tipo === "PJ"} className={`admin-reg__seg${tipo === "PJ" ? " is-active" : ""}`} onClick={() => setTipo("PJ")}>Pessoa Jurídica</button>
      </div>

      {banner ? (
        <div className={banner.kind === "ok" ? "admin-reg__ok" : "error-banner"}>{banner.text}</div>
      ) : null}

      <form className="admin-reg__form" onSubmit={submit} noValidate>
        {tipo === "PF" ? (
          <>
            <Field label="Nome completo" error={errors.nome_completo}>
              <input className="portal-input" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Maria da Silva" autoComplete="name" />
            </Field>
            <Field label="CPF" error={errors.cpf}>
              <input className="portal-input" value={maskCPF(cpf)} onChange={(e) => setCpf(e.target.value)} placeholder="000.000.000-00" inputMode="numeric" />
            </Field>
          </>
        ) : (
          <>
            <Field label="Razão social" error={errors.razao_social}>
              <input className="portal-input" value={razao} onChange={(e) => setRazao(e.target.value)} placeholder="Empresa Exemplo Ltda" autoComplete="organization" />
            </Field>
            <Field label="Nome fantasia (opcional)">
              <input className="portal-input" value={fantasia} onChange={(e) => setFantasia(e.target.value)} placeholder="Exemplo" />
            </Field>
            <Field label="CNPJ" error={errors.cnpj}>
              <input className="portal-input" value={maskCNPJ(cnpj)} onChange={(e) => setCnpj(e.target.value)} placeholder="00.000.000/0000-00" inputMode="numeric" />
            </Field>
            <Field label="Nome do responsável" error={errors.responsavel_nome}>
              <input className="portal-input" value={responsavel} onChange={(e) => setResponsavel(e.target.value)} placeholder="Responsável legal" />
            </Field>
          </>
        )}
        <Field label="E-mail" error={errors.email}>
          <input className="portal-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@empresa.com" autoComplete="email" />
        </Field>
        <Field label="Telefone (opcional)">
          <input className="portal-input" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(11) 99999-9999" inputMode="tel" />
        </Field>

        <div className="admin-reg__actions">
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? "A registar…" : "Cadastrar administrador"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="admin-reg__field">
      <span className="admin-reg__label">{label}</span>
      {children}
      {error ? <span className="admin-reg__err">{error}</span> : null}
    </label>
  );
}
