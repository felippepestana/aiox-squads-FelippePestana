import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import AuthStatus from "@/components/AuthStatus";
import { MUNICIPIO_NOME, MUNICIPIO_UF } from "@/lib/municipio";

export const metadata: Metadata = {
  title: "Prefeitura Digital",
  description:
    "Gestão pública municipal assistida por IA — contratações, orçamento, processo, Diário Oficial, RH e transparência.",
};

const nav = [
  { href: "/", label: "Início" },
  { href: "/contratacoes", label: "Contratações" },
  { href: "/orcamento", label: "Orçamento" },
  { href: "/diario-oficial", label: "Diário Oficial" },
  { href: "/rh", label: "Recursos Humanos" },
  { href: "/transparencia", label: "Transparência" },
  { href: "/artefatos", label: "Meus artefatos" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const municipio = MUNICIPIO_NOME;
  const uf = MUNICIPIO_UF;
  return (
    <html lang="pt-BR">
      <body>
        <header className="bg-brand text-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="text-lg font-semibold">
              🏛️ Prefeitura Digital
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-sm opacity-90">
                {municipio}/{uf}
              </span>
              <AuthStatus />
            </div>
          </div>
          <nav className="border-t border-white/15">
            <div className="mx-auto flex max-w-6xl gap-4 overflow-x-auto px-4 py-2 text-sm">
              {nav.map((n) => (
                <Link key={n.href} href={n.href} className="whitespace-nowrap hover:underline">
                  {n.label}
                </Link>
              ))}
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <footer className="mx-auto max-w-6xl px-4 py-8 text-xs text-gray-500">
          MVP (Fase 2) do squad <code>prefeitura-digital</code>. Os documentos gerados são minutas de
          apoio e não substituem parecer jurídico (PGM) nem decisão da autoridade competente.
        </footer>
      </body>
    </html>
  );
}
