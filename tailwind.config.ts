import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        basil: "#2D5A27",
        dough: "#F5E6CA",
        tomato: "#C41E3A",
        coal: "#1A1A1A"
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
