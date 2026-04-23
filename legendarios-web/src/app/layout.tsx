import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Legendários Platform — Gestão Full-Service de Eventos",
    template: "%s | Legendários Platform",
  },
  description:
    "Plataforma full-service de IA para o ciclo completo dos eventos do Movimento Legendários — marketing, operação, alumni e analytics.",
  keywords: [
    "Legendários",
    "TOP",
    "REM",
    "LEGADO",
    "eventos",
    "Ticket and GO",
    "Porto Velho",
    "Balneário Camboriú",
    "marketing digital",
    "Meta Ads",
    "WhatsApp",
  ],
  authors: [{ name: "Legendários Platform" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Legendários Platform",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen`}
      >
        <Providers>
          {children}
          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              style: {
                background: "hsl(240 10% 7%)",
                border: "1px solid hsl(240 5% 14%)",
                color: "hsl(210 20% 96%)",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
