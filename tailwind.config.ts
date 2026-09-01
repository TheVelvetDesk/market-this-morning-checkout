import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#f8f2e8",
        ink: "#171717",
        crimson: "#b91c1c",
        teal: "#0f8c86",
        amber: "#d97706",
      },
      boxShadow: {
        card: "0 18px 50px rgba(90, 53, 26, 0.08)",
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "\"Times New Roman\"", "Times", "serif"],
        sans: ["\"Helvetica Neue\"", "Helvetica", "Arial", "sans-serif"],
      },
      backgroundImage: {
        grain:
          "radial-gradient(circle at top, rgba(185,28,28,0.06), transparent 32%), radial-gradient(circle at bottom right, rgba(217,119,6,0.08), transparent 28%)",
      },
    },
  },
  plugins: [],
};

export default config;
