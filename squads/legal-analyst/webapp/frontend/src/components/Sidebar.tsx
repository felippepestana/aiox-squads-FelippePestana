import {
  MessageSquare,
  FileText,
  Users,
  PenTool,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
import type { PanelView, SessionSummary } from "../types";

interface SidebarProps {
  activeView: PanelView;
  onViewChange: (view: PanelView) => void;
  sessions: SessionSummary[];
  onNewSession: () => void;
  onLoadSession: (id: string) => void;
  activeSessionId?: string;
  collapsed: boolean;
  onToggleCollapse: () => void;
  documentCount: number;
  agentCount: number;
}

const NAV_ITEMS: Array<{
  view: PanelView;
  icon: typeof MessageSquare;
  label: string;
  shortLabel: string;
}> = [
  { view: "chat", icon: MessageSquare, label: "Chat", shortLabel: "Chat" },
  { view: "documents", icon: FileText, label: "Documentos", shortLabel: "Docs" },
  { view: "agents", icon: Users, label: "Agentes", shortLabel: "Agt" },
  { view: "editor", icon: PenTool, label: "Editor", shortLabel: "Edit" },
];

export default function Sidebar({
  activeView,
  onViewChange,
  sessions,
  onNewSession,
  onLoadSession,
  activeSessionId,
  collapsed,
  onToggleCollapse,
  documentCount,
  agentCount,
}: SidebarProps) {
  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-64"
      } h-full border-r border-white/5 bg-legal-navy/50 flex flex-col transition-all duration-300`}
    >
      {/* Navigation */}
      <nav className="p-2 space-y-1">
        {NAV_ITEMS.map(({ view, icon: Icon, label, shortLabel }) => (
          <button
            key={view}
            onClick={() => onViewChange(view)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeView === view
                ? "bg-brand-600/20 text-brand-300 border border-brand-500/20"
                : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {!collapsed && (
              <span>{label}</span>
            )}
            {!collapsed && view === "documents" && documentCount > 0 && (
              <span className="ml-auto badge-blue text-[10px]">{documentCount}</span>
            )}
            {!collapsed && view === "agents" && (
              <span className="ml-auto badge-gray text-[10px]">{agentCount}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Sessions */}
      {!collapsed && (
        <div className="flex-1 px-2 mt-4 overflow-y-auto">
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-[11px] uppercase tracking-wider text-gray-500 font-medium">
              Sessoes
            </span>
            <button
              onClick={onNewSession}
              className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title="Nova sessao"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-0.5">
            {sessions.map((s) => (
              <button
                key={s.session_id}
                onClick={() => onLoadSession(s.session_id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${
                  s.session_id === activeSessionId
                    ? "bg-white/10 text-white"
                    : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                }`}
              >
                <div className="truncate font-medium">{s.title}</div>
                <div className="flex items-center gap-1 mt-0.5 text-[10px] text-gray-600">
                  <Clock className="w-3 h-3" />
                  {new Date(s.created_at).toLocaleDateString("pt-BR")}
                  <span className="ml-auto">{s.message_count} msgs</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <div className="p-2 border-t border-white/5">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-white/5 text-gray-500 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>
    </aside>
  );
}
