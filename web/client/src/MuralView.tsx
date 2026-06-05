import { useCallback, useState } from "react";
import {
  muralCompose,
  muralPollJob,
  type ImageRole,
  type MuralJob,
  type MuralReferencePayload,
} from "./api";
import "./mural-styles.css";

const ROLES: { value: ImageRole; label: string }[] = [
  { value: "identity", label: "Identidade" },
  { value: "environment", label: "Ambiente" },
  { value: "activity", label: "Atividade" },
  { value: "body_pose", label: "Corpo / pose" },
  { value: "style", label: "Estilo" },
  { value: "location", label: "Local" },
];

interface RefRow {
  key: string;
  file: File | null;
  preview: string | null;
  role: ImageRole;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Falha ao ler arquivo"));
        return;
      }
      const comma = result.indexOf(",");
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

let refKeySeq = 0;
function nextKey() {
  refKeySeq += 1;
  return `ref-${refKeySeq}`;
}

export function MuralView({ onClose }: { onClose: () => void }) {
  const [prompt, setPrompt] = useState("");
  const [variants, setVariants] = useState(1);
  const [refs, setRefs] = useState<RefRow[]>([
    { key: nextKey(), file: null, preview: null, role: "identity" },
  ]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [job, setJob] = useState<MuralJob | null>(null);
  const [statusText, setStatusText] = useState("");

  const addRef = useCallback(() => {
    setRefs((rows) => [
      ...rows,
      { key: nextKey(), file: null, preview: null, role: "environment" },
    ]);
  }, []);

  const removeRef = useCallback((key: string) => {
    setRefs((rows) => rows.filter((r) => r.key !== key));
  }, []);

  const onFile = useCallback((key: string, file: File | null) => {
    setRefs((rows) =>
      rows.map((r) => {
        if (r.key !== key) return r;
        if (r.preview) URL.revokeObjectURL(r.preview);
        if (!file) return { ...r, file: null, preview: null };
        return { ...r, file, preview: URL.createObjectURL(file) };
      })
    );
  }, []);

  const runCompose = useCallback(async () => {
    setError(null);
    setJob(null);
    if (!prompt.trim()) {
      setError("Descreva a cena no prompt.");
      return;
    }
    const withFiles = refs.filter((r) => r.file);
    if (!withFiles.length) {
      setError("Adicione ao menos uma imagem.");
      return;
    }
    if (!withFiles.some((r) => r.role === "identity")) {
      setError("É obrigatória uma referência com papel Identidade.");
      return;
    }

    setBusy(true);
    setStatusText("Preparando referências…");
    try {
      const references: MuralReferencePayload[] = await Promise.all(
        withFiles.map(async (r, i) => ({
          id: `${r.role}-${i}`,
          role: r.role,
          mimeType: r.file!.type || "image/jpeg",
          dataBase64: await fileToBase64(r.file!),
        }))
      );

      setStatusText("Gerando mural (pode levar alguns minutos)…");
      const started = await muralCompose(
        { prompt: prompt.trim(), references, options: { variants } },
        { async: true }
      );

      if ("jobId" in started && typeof started.jobId === "string") {
        setStatusText(`Job ${started.jobId}: ${started.status}`);
        const final = await muralPollJob(started.jobId, (j) => {
          setStatusText(`Status: ${j.status}`);
        });
        setJob(final);
      } else {
        setJob(started as MuralJob);
      }
      setStatusText("Concluído.");
    } catch (e) {
      setError(String(e));
      setStatusText("");
    } finally {
      setBusy(false);
    }
  }, [prompt, refs, variants]);

  return (
    <div className="mural-panel">
      <div className="mural-header">
        <h2>Mural Da Vida Extraordinária</h2>
        <button type="button" className="btn btn-ghost" onClick={onClose}>
          Voltar ao chat
        </button>
      </div>

      <p className="meta">
        Combine imagens com papéis distintos e um prompt. A identidade da ref
        &quot;Identidade&quot; é preservada; demais refs inspiram cena, atividade e
        estilo.
      </p>

      <label htmlFor="mural-prompt">Prompt da cena</label>
      <textarea
        id="mural-prompt"
        className="mural-prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ex.: Colocar a pessoa da identidade correndo na praia ao amanhecer, corpo atlético…"
        disabled={busy}
      />

      <div className="mural-actions">
        <label>
          Variantes{" "}
          <input
            type="number"
            min={1}
            max={4}
            value={variants}
            onChange={(e) =>
              setVariants(Math.min(4, Math.max(1, Number(e.target.value) || 1)))
            }
            disabled={busy}
          />
        </label>
        <button type="button" className="btn btn-ghost" onClick={addRef} disabled={busy}>
          + Referência
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => void runCompose()}
          disabled={busy}
        >
          {busy ? "Gerando…" : "Gerar mural"}
        </button>
      </div>

      <div className="mural-ref-list">
        {refs.map((r) => (
          <div key={r.key} className="mural-ref-row">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onFile(r.key, e.target.files?.[0] ?? null)}
              disabled={busy}
            />
            {r.preview ? (
              <img src={r.preview} alt="" />
            ) : (
              <span className="meta">Sem preview</span>
            )}
            <select
              value={r.role}
              onChange={(e) =>
                setRefs((rows) =>
                  rows.map((row) =>
                    row.key === r.key
                      ? { ...row, role: e.target.value as ImageRole }
                      : row
                  )
                )
              }
              disabled={busy}
            >
              {ROLES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => removeRef(r.key)}
              disabled={busy || refs.length <= 1}
              aria-label="Remover referência"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {statusText ? <p className="mural-status">{statusText}</p> : null}
      {error ? <p className="mural-error">{error}</p> : null}

      {job?.brief ? (
        <details>
          <summary>Brief de geração</summary>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: "0.85rem" }}>
            {job.brief.generationPrompt}
          </pre>
        </details>
      ) : null}

      {job?.assets?.length ? (
        <div className="mural-gallery">
          {job.assets.map((a) => (
            <figure key={a.filename}>
              <img src={a.url} alt={`Variante ${a.variantIndex + 1}`} />
              <figcaption className="meta">{a.filename}</figcaption>
            </figure>
          ))}
        </div>
      ) : null}
    </div>
  );
}
