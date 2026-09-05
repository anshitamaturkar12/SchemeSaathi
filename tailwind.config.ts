import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#f0f4fa",
          100: "#dbe4f4",
          200: "#bad0ec",
          300: "#8cb3e0",
          400: "#5790d0",
          500: "#3472be",
          600: "#2459a4",
          700: "#1e4685",
          800: "#1c3d6e",
          900: "#0f2343",
          950: "#0a172e",
        },
        saffron: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
        },
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
        card: "0 4px 20px -2px rgba(15, 35, 67, 0.06), 0 2px 6px -1px rgba(15, 35, 67, 0.03)",
        "card-hover": "0 12px 30px -4px rgba(15, 35, 67, 0.12), 0 4px 10px -2px rgba(15, 35, 67, 0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
