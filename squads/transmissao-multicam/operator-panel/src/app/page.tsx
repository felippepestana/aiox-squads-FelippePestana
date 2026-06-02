import { ConnectionStatus } from "@/components/ConnectionStatus";
import { SceneSwitcher } from "@/components/SceneSwitcher";
import { LayoutControls } from "@/components/LayoutControls";
import { PipControls } from "@/components/PipControls";
import { ModeToggle } from "@/components/ModeToggle";
import { ShowFlowControls } from "@/components/ShowFlowControls";
import { AudioMixer } from "@/components/AudioMixer";
import { loadOperationConfig } from "@/lib/mic-loader";

export default function OperatorPage() {
  const op = loadOperationConfig();

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-title">Console do Operador</div>
        <div className="top-bar-actions">
          <ConnectionStatus />
        </div>
      </div>

      <div className="page-content">
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--sp-4)" }}>

          {/* Full-width: Scene switcher */}
          <div style={{ gridColumn: "1 / -1" }}>
            <SceneSwitcher />
          </div>

          {/* Col 1 & 2: Layout + PiP */}
          <div>
            <LayoutControls />
          </div>
          <div>
            <PipControls pip={op.pip} />
          </div>

          {/* Col 3: Mode + Show flow */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <ModeToggle />
            <ShowFlowControls />
          </div>

          {/* Full-width: Audio mixer */}
          <div style={{ gridColumn: "1 / -1" }}>
            <AudioMixer channels={op.channels} />
          </div>

        </div>

        <footer style={{ marginTop: "var(--sp-6)", fontSize: "11px", color: "var(--fg-faint)" }}>
          Atalhos: Ctrl+1..4 câmeras · Ctrl+5 GRID · Ctrl+6 SLIDES · Ctrl+7 SLIDES_PIP · Ctrl+8 TELA_PIP · Ctrl+0 STANDBY
        </footer>
      </div>
    </>
  );
}
