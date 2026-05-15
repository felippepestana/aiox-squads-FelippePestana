import { PROCEDURES } from '@/lib/data'
import { SlidePlayer } from '@/components/display/SlidePlayer'

export const metadata = {
  title: 'Display TV — Recepção',
  description: 'Loop de 90 segundos para TV de recepção de clínica estética',
}

interface Props {
  searchParams: Promise<{ procedure?: string }>
}

export default async function DisplayPage({ searchParams }: Props) {
  const params = await searchParams
  const filtered = params.procedure
    ? PROCEDURES.filter((p) => p.slug === params.procedure)
    : PROCEDURES

  const procedures = filtered.length > 0 ? filtered : PROCEDURES

  return <SlidePlayer procedures={procedures} autoPlay />
}
