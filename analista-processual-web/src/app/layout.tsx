import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@aiox/design-system/styles/tokens.css";
import "./globals.css";
import { Toaster, themeInitScript } from "@aiox/design-system";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: "Analista Processual | Análise Inteligente de Processos Jurídicos",
    template: "%s | Analista Processual",
  },
  description:
    "Plataforma de análise processual jurídica brasileira potenciada por multiagentes IA. Análise completa de processos, prazos, riscos e jurisprudência.",
  keywords: [
    "análise processual",
    "jurídico",
    "advocacia",
    "inteligência artificial",
    "IA jurídica",
    "processo judicial",
    "prazos",
    "jurisprudência",
  ],
  authors: [{ name: "Analista Processual" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Analista Processual",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
