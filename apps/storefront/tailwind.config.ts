import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#181715",
        paper: "#FFFFFF",
        sand: "#F6F3EC",
        stone: "#8C8579",
        "stone-light": "#D8D3C9",
        yedei: {
          green: "#2F6B4F",
          red: "#AD3B3B",
          blue: "#233E6C",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-manrope)", "sans-serif"],
      },
      maxWidth: {
        container: "1440px",
      },
      letterSpacing: {
        widest2: "0.25em",
      },
    },
  },
  plugins: [],
};

export default config;
