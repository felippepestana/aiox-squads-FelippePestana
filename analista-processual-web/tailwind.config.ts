import type { Config } from "tailwindcss";
import { colors as brandColors, typography } from "./src/lib/design/tokens";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: brandColors.navy.DEFAULT,
          light: brandColors.navy.light,
          dark: brandColors.navy.dark,
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: brandColors.slate.DEFAULT,
          light: brandColors.slate.light,
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: brandColors.amber.DEFAULT,
          light: brandColors.amber.light,
          foreground: "#0F172A",
        },
        brand: {
          navy: brandColors.navy.DEFAULT,
          "navy-deep": brandColors.navy.deep,
          silver: brandColors.silver.DEFAULT,
          "silver-light": brandColors.silver.light,
          "silver-dark": brandColors.silver.dark,
          gold: brandColors.gold.DEFAULT,
          "gold-light": brandColors.gold.light,
          "gold-dark": brandColors.gold.dark,
        },
        success: {
          DEFAULT: "#10B981",
          foreground: "#ffffff",
        },
        warning: {
          DEFAULT: "#F59E0B",
          foreground: "#0F172A",
        },
        danger: {
          DEFAULT: "#EF4444",
          foreground: "#ffffff",
        },
        info: {
          DEFAULT: "#3B82F6",
          foreground: "#ffffff",
        },
        background: "#FAFBFC",
        foreground: "#1E293B",
        card: {
          DEFAULT: "#ffffff",
          foreground: "#1E293B",
        },
        muted: {
          DEFAULT: "#F1F5F9",
          foreground: "#64748B",
        },
        border: "#E2E8F0",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: [...typography.fontSans],
        mono: [...typography.fontMono],
        serif: [...typography.fontSerif],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        shimmer: "shimmer 2s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
