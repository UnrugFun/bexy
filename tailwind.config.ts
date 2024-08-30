import type { Config } from "tailwindcss";
import theme from "./src/styles/theme";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: theme.colors.background,
        text: theme.colors.text,
        accent: theme.colors.accent,
      },
    },
  },
  plugins: [],
};

export default config;
