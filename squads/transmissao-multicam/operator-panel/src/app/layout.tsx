import type { Metadata } from "next";
import { Sidebar } from "@/components/nav/Sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Transmissão Multicam — Operator",
  description: "Painel do operador para o squad transmissao-multicam.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="shell">
          <Sidebar />
          <div className="main-area">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
