import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FCF5F6',
          100: '#F9E5E8',
          200: '#F0C9D0',
          300: '#E5A3AF',
          400: '#D67384',
          500: '#C4495F',  // Warna utama
          600: '#A63750',
          700: '#882941',
          800: '#6A1F33',
          900: '#4C1725',
        },
        secondary: {
          50: '#F6F7F7',
          100: '#E7EAEA',
          200: '#CFD5D5',
          300: '#AEB8B8',
          400: '#889595',
          500: '#687575',  // Warna sekunder
          600: '#515C5C',
          700: '#3E4747',
          800: '#2D3434',
          900: '#1F2424',
        },
        accent: {
          50: '#F7F8F2',
          100: '#EFF1E3',
          200: '#DFE3C6',
          300: '#CCD2A3',
          400: '#B7BF7B',
          500: '#A2AC54',  // Warna aksen
          600: '#828A43',
          700: '#656B34',
          800: '#4B4F26',
          900: '#33361B',
        },
      },
    },
  },
  plugins: [],
};
export default config;
