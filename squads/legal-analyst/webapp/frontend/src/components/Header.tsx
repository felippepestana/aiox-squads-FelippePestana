import { Scale, Settings, Moon, Sun } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  sessionPhase?: string;
  sessionTitle?: string;
}

const PHASE_LABELS: Record<string, { label: string; color: string }> = {
  intake: { label: "Intake", color: "badge-gray" },
  triagem: { label: "Triagem", color: "badge-blue" },
  pesquisa: { label: "Pesquisa", color: "badge-blue" },
  analise: { label: "Analise", color: "badge-gold" },
  fundamentacao: { label: "Fundamentacao", color: "badge-gold" },
  validacao: { label: "Validacao", color: "badge-green" },
  entrega: { label: "Entrega", color: "badge-green" },
};

export default function Header({ sessionPhase, sessionTitle }: HeaderProps) {
  const [isDark, setIsDark] = useState(true);
  const phase = sessionPhase ? PHASE_LABELS[sessionPhase] : null;

  return (
    <header className="h-14 border-b border-white/5 bg-legal-navy/80 backdrop-blur-xl flex items-center justify-between px-4 z-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-legal-gold to-legal-darkgold flex items-center justify-center">
          <Scale className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-white tracking-tight">
            Legal Analyst Squad
          </h1>
          {sessionTitle && (
            <p className="text-[11px] text-gray-500 truncate max-w-[200px]">
              {sessionTitle}
            </p>
          )}
        </div>
        {phase && (
          <span className={phase.color}>
            {phase.label}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[11px] text-gray-500 mr-2">v1.0.0</span>
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 transition-colors"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <button className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 transition-colors">
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
