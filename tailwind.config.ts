import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        valored: {
          500: "#eb565a", // True Valorant red color.
          400: "#f57679", // My custom, lightened version (probably needs tweaking).
        },
      },
      animation: {
        "rise-and-fade-in": "riseAndFadeIn 0.5s ease forwards",
      },
      keyframes: {
        riseAndFadeIn: {
          from: {
            opacity: "0",
            transform: "translateY(1rem)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        shimmer: {
          "100%": { maskPosition: "left" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
