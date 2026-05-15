export type Audience = 'feminino' | 'masculino' | 'misto'

export type SlideType = 'gancho' | 'definicao' | 'procedimentos' | 'beneficios' | 'cta'

export interface Slide {
  id: string
  order: number
  duration: number
  title: string
  subtitle?: string
  body?: string[]
  cta?: string
  type: SlideType
  image_url?: string
}

export interface Procedure {
  id: string
  slug: string
  name: string
  shortName: string
  audience: Audience
  description: string
  color_primary: string
  color_accent: string
  icon: string
  slides: Slide[]
}

export interface Clinic {
  id: string
  name: string
  contact: string
  tagline: string
  logo_url?: string
  color_primary: string
  color_accent: string
}

export interface LoopState {
  procedureIndex: number
  slideIndex: number
  progress: number
}
