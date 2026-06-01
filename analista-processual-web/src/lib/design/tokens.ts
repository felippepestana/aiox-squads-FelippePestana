/**
 * Legal Performance Design Tokens — single source of truth.
 *
 * Brand: Felippe Pestana — "Soluções Jurídicas Especializadas - Legal Performance".
 * Visual identity derived from the brand logo (institutional navy base, metallic
 * silver lettering, blue "P", thin gold rules) and from SPEC.md §2.
 *
 * These tokens are consumed by tailwind.config.ts and mirrored as CSS variables in
 * globals.css, so every surface (Next.js app, future packages) shares one palette.
 */

export const brand = {
  name: "Felippe Pestana",
  product: "Legal Performance",
  tagline: "Soluções Jurídicas Especializadas — Legal Performance",
} as const;

/** Core color palette. Hex values are the canonical reference. */
export const colors = {
  /** Institutional navy — primary brand color. */
  navy: {
    DEFAULT: "#1E3A5F",
    light: "#2D5A8B",
    dark: "#0F1F33",
    deep: "#0A1628",
  },
  /** Metallic silver/platinum — secondary brand accent from the logo lettering. */
  silver: {
    DEFAULT: "#9AA3B2",
    light: "#C7CDD8",
    dark: "#6B7383",
  },
  /** Gold — premium accent from the logo rules and divider. */
  gold: {
    DEFAULT: "#C9A84C",
    light: "#E0C570",
    dark: "#A8862F",
  },
  /** Amber — functional accent for highlights/warnings (kept from SPEC). */
  amber: {
    DEFAULT: "#F59E0B",
    light: "#FBBF24",
  },
  slate: {
    DEFAULT: "#64748B",
    light: "#94A3B8",
  },
  semantic: {
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    info: "#3B82F6",
  },
  surface: {
    background: "#FAFBFC",
    backgroundDark: "#0A1628",
    card: "#FFFFFF",
    cardDark: "#101A2C",
    muted: "#F1F5F9",
  },
  text: {
    primary: "#1E293B",
    secondary: "#64748B",
    muted: "#94A3B8",
    inverse: "#F8FAFC",
  },
  border: {
    DEFAULT: "#E2E8F0",
    dark: "#1F2C44",
  },
} as const;

export const typography = {
  fontSans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
  fontMono: ["JetBrains Mono", "Consolas", "monospace"],
  fontSerif: ["Playfair Display", "Georgia", "serif"],
} as const;

export const spacing = {
  baseUnit: 4,
  scale: [4, 8, 12, 16, 24, 32, 48, 64, 96],
  cardPadding: 24,
  sectionGap: 32,
} as const;

export const radius = {
  sm: "6px",
  md: "8px",
  lg: "12px",
  xl: "16px",
} as const;

export const motion = {
  micro: "150ms ease-out",
  standard: "300ms ease-out",
  hoverScale: 1.02,
} as const;

/** Convenience export used by config consumers. */
export const designTokens = {
  brand,
  colors,
  typography,
  spacing,
  radius,
  motion,
} as const;

export type DesignTokens = typeof designTokens;
