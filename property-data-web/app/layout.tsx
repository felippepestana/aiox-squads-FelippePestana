import type { Metadata } from "next";
import { Toaster } from "sonner";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Property Data | Levantamento Imobiliario",
  description:
    "Plataforma inteligente de levantamento de dados imobiliarios com agentes de IA especializados.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className="font-sans antialiased">
        <div className="min-h-screen">{children}</div>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
