import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AIOX Marketing — Plataforma para Clínicas Estéticas',
  description:
    'Materiais de marketing prontos para TV de recepção: loop de 90 segundos com roteiros profissionais para Foto Terapia, Botox e Harmonização Íntima.',
  openGraph: {
    title: 'AIOX Marketing Platform',
    description: 'Display TV para recepção de clínicas estéticas',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geist.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  )
}
