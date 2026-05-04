import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Transmissão Multicam — Operator",
  description: "Painel do operador para o squad transmissao-multicam (F5).",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
