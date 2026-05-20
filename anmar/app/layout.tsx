import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Clínica Anmar", template: "%s | Clínica Anmar" },
  description: "Sistema de Gestão Inteligente — Estética, Emagrecimento e Qualidade de Vida",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
