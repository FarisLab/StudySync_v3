import type { Config } from "tailwindcss";
import { theme } from "./src/lib/config/theme";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme,
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
