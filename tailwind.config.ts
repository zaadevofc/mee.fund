import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      colors:{
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
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config