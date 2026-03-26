import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  chatStream,
  clearPortalKey,
  createSession,
  fetchAuthStatus,
  fetchSessionExists,
  fetchSquads,
  getPortalKey,
  resetSession,
  setPortalKey,
  switchAgent,
  uploadFile,
  type AgentRef,
  type SquadSummary,
  type UploadedFileMeta,
} from "./api";
import {
  type ChatLine,
  formatLatencyMs,
  loadChatLines,
  loadRecentSessions,
  removeChatLines,
  removeRecentSession,
  saveChatLines,
  upsertRecentSession,
  type RecentSessionMeta,
} from "./recentSessions";
const MarkdownMessage = lazy(() => import("./MarkdownMessage"));

function isAbortError(e: unknown): boolean {
  if (e instanceof DOMException && e.name === "AbortError") return true;
  if (
    e &&
    typeof e === "object" &&
    "name" in e &&
    (e as { name: string }).name === "AbortError"
  )
    return true;
  return false;
}

export function App() {
  const [portalPhase, setPortalPhase] = useState<
    "checking" | "key" | "ready"
  >("checking");
  const [portalAuthRequired, setPortalAuthRequired] = useState(false);
  const [keyDraft, setKeyDraft] = useState("");
  const [keyError, setKeyError] = useState<string | null>(null);
  const [keyBusy, setKeyBusy] = useState(false);

  const [squads, setSquads] = useState<SquadSummary[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [squadId, setSquadId] = useState("");
  const [agentId, setAgentId] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentAgent, setCurrentAgent] = useState<AgentRef | null>(null);
  const [lines, setLines] = useState<ChatLine[]>([]);
  const [input, setInput] = useState("");
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedLineIdx, setCopiedLineIdx] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const streamAbortRef = useRef<AbortController | null>(null);
  const busyRef = useRef(false);
  const sessionIdRef = useRef<string | null>(null);
  const [recentRev, setRecentRev] = useState(0);
  const refreshRecent = useCallback(() => setRecentRev((n) => n + 1), []);
  const recentList = useMemo(() => loadRecentSessions(), [recentRev]);

  busyRef.current = busy;
  sessionIdRef.current = sessionId;

  const applySquadsData = useCallback((s: SquadSummary[]) => {
    setSquads(s);
    setLoadError(null);
    setPortalPhase("ready");
    if (s.length) {
      setSquadId((cur) => cur || s[0].id);
      const first = s[0].agents[0];
      if (first) setAgentId((cur) => cur || first.id);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const st = await fetchAuthStatus();
        if (cancelled) return;
        setPortalAuthRequired(st.portalAuthRequired);
        if (st.portalAuthRequired && !getPortalKey()) {
          setPortalPhase("key");
          return;
        }
        const s = await fetchSquads();
        if (cancelled) return;
        applySquadsData(s);
      } catch (e) {
        if (!cancelled) {
          setLoadError(String(e));
          setPortalPhase("ready");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [applySquadsData]);

  const submitPortalKey = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setKeyError(null);
      setKeyBusy(true);
      setPortalKey(keyDraft);
      try {
        const s = await fetchSquads();
        applySquadsData(s);
        setKeyDraft("");
      } catch (err) {
        clearPortalKey();
        setKeyError(String(err));
      } finally {
        setKeyBusy(false);
      }
    },
    [keyDraft, applySquadsData]
  );

  const onChangePortalKey = useCallback(() => {
    clearPortalKey();
    setSessionId(null);
    setCurrentAgent(null);
    setLines([]);
    setSquads([]);
    setPortalPhase("key");
    setLoadError(null);
  }, []);

  const agentsInSquad = useMemo(() => {
    const s = squads.find((x) => x.id === squadId);
    return s?.agents ?? [];
  }, [squads, squadId]);

  useEffect(() => {
    if (!agentsInSquad.length) {
      setAgentId("");
      return;
    }
    if (!agentsInSquad.some((a) => a.id === agentId)) {
      setAgentId(agentsInSquad[0].id);
    }
  }, [agentsInSquad, agentId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines, busy]);

  useEffect(() => {
    if (!sessionId) return;
    void import("./MarkdownMessage");
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId || typeof localStorage === "undefined") return;
    const id = window.setTimeout(() => {
      saveChatLines(sessionId, lines);
    }, 500);
    return () => clearTimeout(id);
  }, [lines, sessionId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === "m") {
        if (!sessionIdRef.current) return;
        e.preventDefault();
        composerRef.current?.focus();
        return;
      }
      if (e.key !== "Escape") return;
      if (!busyRef.current) return;
      e.preventDefault();
      streamAbortRef.current?.abort();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!sessionId || typeof sessionStorage === "undefined") return;
    const id = window.setTimeout(() => {
      if (input.trim()) {
        sessionStorage.setItem(`aiox-draft:${sessionId}`, input);
      } else {
        sessionStorage.removeItem(`aiox-draft:${sessionId}`);
      }
    }, 400);
    return () => clearTimeout(id);
  }, [input, sessionId]);

  const stopStreaming = useCallback(() => {
    streamAbortRef.current?.abort();
  }, []);

  const resumeRecent = useCallback(
    async (meta: RecentSessionMeta) => {
      setError(null);
      try {
        if (!(await fetchSessionExists(meta.sessionId))) {
          removeRecentSession(meta.sessionId);
          removeChatLines(meta.sessionId);
          refreshRecent();
          setError("Esta sessão já não existe no servidor.");
          return;
        }
        setSessionId(meta.sessionId);
        setSquadId(meta.squadId);
        setAgentId(meta.agentId);
        setCurrentAgent({
          id: meta.agentId,
          name: meta.agentName,
          squad: meta.squadName,
        });
        setLines(loadChatLines(meta.sessionId) ?? []);
        setPendingFiles([]);
        if (typeof sessionStorage !== "undefined") {
          setInput(
            sessionStorage.getItem(`aiox-draft:${meta.sessionId}`) ?? ""
          );
        } else {
          setInput("");
        }
        void import("./MarkdownMessage");
      } catch (e) {
        setError(String(e));
      }
    },
    [refreshRecent]
  );

  const dismissRecent = useCallback(
    (meta: RecentSessionMeta, e: React.MouseEvent) => {
      e.stopPropagation();
      removeRecentSession(meta.sessionId);
      removeChatLines(meta.sessionId);
      refreshRecent();
    },
    [refreshRecent]
  );

  const exportConversation = useCallback(() => {
    if (!lines.length) return;
    const agentLabel = currentAgent
      ? `${currentAgent.name} (${currentAgent.squad})`
      : "—";
    const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    let md = `# Conversa — AIOX Squads\n\n`;
    md += `**Agente:** ${agentLabel}\n`;
    md += `**Exportado:** ${new Date().toLocaleString("pt-PT")}\n\n---\n\n`;
    for (const line of lines) {
      if (line.role === "user") {
        md += `### Você\n\n`;
        if (line.files?.length) {
          md += `*Anexos: ${line.files.join(", ")}*\n\n`;
        }
        md += `${line.text}\n\n`;
      } else {
        md += `### Assistente\n\n${line.text}\n\n`;
      }
    }
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aiox-chat-${ts}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [lines, currentAgent]);

  const copyAssistantText = useCallback(async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLineIdx(idx);
      window.setTimeout(() => {
        setCopiedLineIdx((c) => (c === idx ? null : c));
      }, 2000);
    } catch {
      setError("Não foi possível copiar para a área de transferência.");
    }
  }, []);

  const startSession = useCallback(async () => {
    setError(null);
    setBusy(true);
    try {
      const { sessionId: sid, agent } = await createSession(squadId, agentId);
      setSessionId(sid);
      setCurrentAgent(agent);
      setLines([]);
      setPendingFiles([]);
      upsertRecentSession({
        sessionId: sid,
        squadId,
        agentId,
        agentName: agent.name,
        squadName: agent.squad,
        preview: "",
      });
      refreshRecent();
      if (typeof sessionStorage !== "undefined") {
        setInput(sessionStorage.getItem(`aiox-draft:${sid}`) ?? "");
      } else {
        setInput("");
      }
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
    }
  }, [squadId, agentId, refreshRecent]);

  const onSwitchAgent = useCallback(async () => {
    if (!sessionId) return;
    setError(null);
    setBusy(true);
    try {
      const { agent } = await switchAgent(sessionId, squadId, agentId);
      setCurrentAgent(agent);
      const prev = loadRecentSessions().find((x) => x.sessionId === sessionId);
      upsertRecentSession({
        sessionId,
        squadId,
        agentId: agent.id,
        agentName: agent.name,
        squadName: agent.squad,
        preview: prev?.preview ?? "",
      });
      refreshRecent();
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
    }
  }, [sessionId, squadId, agentId, refreshRecent]);

  const onReset = useCallback(async () => {
    if (!sessionId) return;
    setError(null);
    setBusy(true);
    try {
      await resetSession(sessionId);
      removeChatLines(sessionId);
      if (typeof sessionStorage !== "undefined") {
        sessionStorage.removeItem(`aiox-draft:${sessionId}`);
      }
      setLines([]);
      setPendingFiles([]);
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
    }
  }, [sessionId]);

  const send = useCallback(async () => {
    if (!sessionId || busy) return;
    const text = input.trim();
    if (!text && pendingFiles.length === 0) return;

    setError(null);
    setBusy(true);
    setInput("");

    const fileMeta: UploadedFileMeta[] = [];
    try {
      for (const f of pendingFiles) {
        fileMeta.push(await uploadFile(sessionId, f));
      }
    } catch (e) {
      setError(String(e));
      setBusy(false);
      return;
    }

    const userLine: ChatLine = {
      role: "user",
      text: text || "(anexo)",
      files: fileMeta.map((f) => f.filename),
    };
    setLines((prev) => [...prev, userLine]);
    setPendingFiles([]);

    const previewForRecent = userLine.text.slice(0, 120);

    let assistant = "";
    setLines((prev) => [...prev, { role: "assistant", text: "" }]);

    const ac = new AbortController();
    streamAbortRef.current = ac;

    const t0 = performance.now();
    let firstChunkAt: number | null = null;

    try {
      await chatStream(
        sessionId,
        text,
        fileMeta,
        (chunk) => {
          if (firstChunkAt === null) firstChunkAt = performance.now();
          assistant += chunk;
          setLines((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            if (last?.role === "assistant") {
              next[next.length - 1] = { role: "assistant", text: assistant };
            }
            return next;
          });
        },
        { signal: ac.signal }
      );
      const tEnd = performance.now();
      const msTotal = Math.round(tEnd - t0);
      const msToFirst =
        firstChunkAt !== null ? Math.round(firstChunkAt - t0) : msTotal;
      setLines((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (last?.role === "assistant") {
          next[next.length - 1] = {
            role: "assistant",
            text: assistant,
            latency: { msToFirst, msTotal },
          };
        }
        return next;
      });
      if (currentAgent) {
        upsertRecentSession({
          sessionId,
          squadId,
          agentId,
          agentName: currentAgent.name,
          squadName: currentAgent.squad,
          preview: previewForRecent,
        });
        refreshRecent();
      }
    } catch (e) {
      if (isAbortError(e)) {
        setError(null);
        setLines((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last?.role === "assistant") {
            const t = last.text.trim();
            next[next.length - 1] = {
              role: "assistant",
              text: t ? `${last.text}\n\n_(interrompido)_` : "_(interrompido)_",
            };
          }
          return next;
        });
      } else {
        setError(String(e));
        setLines((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last?.role === "assistant" && !last.text) next.pop();
          return next;
        });
      }
    } finally {
      streamAbortRef.current = null;
      setBusy(false);
    }
  }, [
    sessionId,
    busy,
    input,
    pendingFiles,
    currentAgent,
    squadId,
    agentId,
    refreshRecent,
  ]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  };

  if (portalPhase === "checking") {
    return (
      <div className="loading">
        <p>A carregar…</p>
      </div>
    );
  }

  if (portalPhase === "key") {
    return (
      <div className="portal-overlay">
        <form className="portal-card" onSubmit={(e) => void submitPortalKey(e)}>
          <h2 className="portal-title">Chave do portal</h2>
          <p className="meta portal-desc">
            O servidor exige <code>WEB_PORTAL_API_KEY</code>. Introduza a mesma
            chave configurada no ambiente.
          </p>
          {keyError ? <div className="error-banner">{keyError}</div> : null}
          <label className="portal-label" htmlFor="portal-key">
            Chave
          </label>
          <input
            id="portal-key"
            className="portal-input"
            type="password"
            autoComplete="current-password"
            value={keyDraft}
            onChange={(e) => setKeyDraft(e.target.value)}
            disabled={keyBusy}
            placeholder="Cole a chave secreta"
          />
          <button
            type="submit"
            className="btn btn-primary portal-submit"
            disabled={keyBusy || !keyDraft.trim()}
          >
            Continuar
          </button>
        </form>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="loading">
        <p>Não foi possível carregar os squads.</p>
        <p className="meta">{loadError}</p>
      </div>
    );
  }

  if (!squads.length) {
    return (
      <div className="loading">
        Nenhum squad encontrado em <code>squads/</code>.
      </div>
    );
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <h1>AIOX Squads</h1>
        <div>
          <label htmlFor="squad">Squad</label>
          <select
            id="squad"
            value={squadId}
            onChange={(e) => setSquadId(e.target.value)}
          >
            {squads.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="agent">Agente</label>
          <select
            id="agent"
            value={agentId}
            onChange={(e) => setAgentId(e.target.value)}
          >
            {agentsInSquad.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        {!sessionId ? (
          <button
            type="button"
            className="btn btn-primary"
            disabled={busy || !agentId}
            onClick={() => void startSession()}
          >
            Iniciar sessão
          </button>
        ) : (
          <>
            <button
              type="button"
              className="btn btn-primary"
              disabled={busy}
              onClick={() => void onSwitchAgent()}
            >
              Trocar agente
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              disabled={busy}
              onClick={() => void onReset()}
            >
              Nova conversa
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              disabled={busy || lines.length === 0}
              onClick={() => exportConversation()}
            >
              Exportar Markdown
            </button>
          </>
        )}
        {recentList.length > 0 ? (
          <div className="recent-block">
            <div className="recent-label">Sessões recentes</div>
            <ul className="recent-list">
              {recentList.map((r) => (
                <li key={r.sessionId}>
                  <div className="recent-row">
                    <button
                      type="button"
                      className={`btn recent-open${
                        sessionId === r.sessionId ? " recent-open-active" : ""
                      }`}
                      onClick={() => void resumeRecent(r)}
                    >
                      <span className="recent-title">
                        {r.agentName} · {r.squadName}
                      </span>
                      {r.preview ? (
                        <span className="recent-preview">{r.preview}</span>
                      ) : null}
                      <span className="recent-time">
                        {new Date(r.updatedAt).toLocaleString("pt-PT", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </span>
                    </button>
                    <button
                      type="button"
                      className="btn recent-dismiss"
                      aria-label="Remover da lista"
                      title="Remover da lista"
                      onClick={(e) => dismissRecent(r, e)}
                    >
                      ×
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {currentAgent && (
          <p className="meta">
            Ativo: <strong>{currentAgent.name}</strong>
            <br />
            Squad: {currentAgent.squad}
          </p>
        )}
        <p className="meta shortcuts-hint">
          Atalhos: <kbd>Esc</kbd> parar · <kbd>Alt</kbd>+<kbd>M</kbd> focar
          mensagem
        </p>
        <p className="meta">
          API Anthropic só no servidor. Defina{" "}
          <code>ANTHROPIC_API_KEY</code> ao subir o backend.
        </p>
        {portalAuthRequired ? (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => onChangePortalKey()}
          >
            Trocar chave do portal
          </button>
        ) : null}
      </aside>

      <main className="main">
        <div className="messages">
          {!sessionId && (
            <p className="loading">
              Escolha squad e agente e clique em <strong>Iniciar sessão</strong>
              .
            </p>
          )}
          {lines.map((line, i) => {
            const isLast = i === lines.length - 1;
            const streamingEmpty =
              line.role === "assistant" &&
              busy &&
              isLast &&
              !line.text.trim();
            const streamingThis =
              line.role === "assistant" && busy && isLast && line.text.trim();
            return (
              <div
                key={i}
                className={`bubble ${line.role === "user" ? "user" : "assistant"}`}
              >
                <div className="bubble-head">
                  <div className="role">
                    {line.role === "user" ? "Você" : "Assistente"}
                  </div>
                  {line.role === "assistant" && line.text.trim() ? (
                    <button
                      type="button"
                      className="btn-copy"
                      aria-label="Copiar resposta"
                      onClick={() => void copyAssistantText(line.text, i)}
                    >
                      {copiedLineIdx === i ? "Copiado" : "Copiar"}
                    </button>
                  ) : null}
                </div>
                {line.role === "assistant" &&
                line.latency &&
                !streamingThis ? (
                  <div className="lat-meta">
                    {formatLatencyMs(line.latency.msToFirst)} até 1.º token ·{" "}
                    {formatLatencyMs(line.latency.msTotal)} total
                  </div>
                ) : null}
                {line.role === "user" && line.files?.length ? (
                  <div className="meta" style={{ marginBottom: "0.5rem" }}>
                    Anexos: {line.files.join(", ")}
                  </div>
                ) : null}
                <div className="bubble-body">
                  {streamingEmpty ? (
                    <span className="stream-placeholder">A gerar resposta…</span>
                  ) : line.role === "assistant" ? (
                    streamingThis ? (
                      <div className="stream-plain">{line.text}</div>
                    ) : (
                      <Suspense
                        fallback={
                          <div className="stream-plain">{line.text}</div>
                        }
                      >
                        <MarkdownMessage text={line.text} />
                      </Suspense>
                    )
                  ) : (
                    line.text
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} aria-hidden />
        </div>

        <div className="composer">
          {error ? <div className="error-banner">{error}</div> : null}
          {sessionId ? (
            <>
              <div className="attachments">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.txt,.md,.json,.csv,.png,.jpg,.jpeg,.webp,.gif"
                  onChange={(e) =>
                    setPendingFiles(Array.from(e.target.files ?? []))
                  }
                />
                {pendingFiles.length > 0 ? (
                  <span>
                    {" "}
                    {pendingFiles.length} arquivo(s) para a próxima mensagem
                  </span>
                ) : null}
              </div>
              <div className="composer-row">
                <textarea
                  ref={composerRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Mensagem… (Enter envia, Shift+Enter nova linha)"
                  rows={3}
                  disabled={busy}
                />
                <div className="composer-actions">
                  {busy ? (
                    <button
                      type="button"
                      className="btn btn-stop"
                      onClick={stopStreaming}
                    >
                      Parar
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={busy}
                    onClick={() => void send()}
                  >
                    Enviar
                  </button>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </main>
    </div>
  );
}
