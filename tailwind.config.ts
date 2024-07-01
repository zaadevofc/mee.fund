import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {},
  daisyui: {
    themes: ["dark", "winter"],
  },
  plugins: [require("daisyui"), require('@tailwindcss/aspect-ratio')],
};
export default config;
