import { ConnectionStatus } from "@/components/ConnectionStatus";
import { SceneSwitcher } from "@/components/SceneSwitcher";
import { LayoutControls } from "@/components/LayoutControls";
import { PipControls } from "@/components/PipControls";
import { ModeToggle } from "@/components/ModeToggle";
import { ShowFlowControls } from "@/components/ShowFlowControls";
import { AudioMixer } from "@/components/AudioMixer";

export default function OperatorPage() {
  return (
    <main className="app">
      <header className="panel col-12" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ margin: 0, fontSize: 18 }}>📡 Transmissão Multicam — Operator</h1>
        <ConnectionStatus />
      </header>

      <SceneSwitcher />
      <LayoutControls />

      <PipControls />
      <ModeToggle />
      <ShowFlowControls />

      <AudioMixer />

      <footer className="muted col-12" style={{ fontSize: 12 }}>
        Atalhos: Ctrl+1..4 câmeras · Ctrl+5 GRID · Ctrl+6 SLIDES · Ctrl+7 SLIDES_PIP · Ctrl+8 TELA_PIP · Ctrl+0 STANDBY
      </footer>
    </main>
  );
}
