import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: "Legal Performance | Felippe Pestana — Soluções Jurídicas Especializadas",
    template: "%s | Legal Performance",
  },
  description:
    "Plataforma jurídica Felippe Pestana — Legal Performance: análise processual, estratégia, recursos, pesquisa jurisprudencial e perícia técnica orquestradas por multiagentes IA.",
  keywords: [
    "Legal Performance",
    "Felippe Pestana",
    "análise processual",
    "jurídico",
    "advocacia",
    "inteligência artificial",
    "IA jurídica",
    "processo judicial",
    "prazos",
    "jurisprudência",
    "perícia judicial",
  ],
  authors: [{ name: "Felippe Pestana" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Legal Performance",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
