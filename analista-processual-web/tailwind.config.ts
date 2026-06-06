import type { Config } from "tailwindcss";
import aioxPreset from "@aiox/design-system/preset";

const config: Config = {
  presets: [aioxPreset as Partial<Config>],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "../packages/design-system/src/**/*.{js,ts,jsx,tsx}",
  ],
};

export default config;
