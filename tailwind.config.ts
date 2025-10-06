import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./content/**/*.{md,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: { 50:"#f5f8fa", 500:"#186687", 600:"#2e6573", accent:"#e87517" }
      }
    }
  },
  plugins: []
};
export default config;
