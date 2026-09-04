import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0f5132",
          fg: "#0a3d24",
        },
      },
    },
  },
  plugins: [],
};

export default config;
