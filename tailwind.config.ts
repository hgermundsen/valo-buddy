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
        "marquee-rtol": "marqueeRtol 15s linear infinite",
        "marquee-rtol-two": "marqueeRtolTwo 15s linear infinite",
        "marquee-ltor": "marqueeLtor 15s linear infinite",
        "marquee-ltor-two": "marqueeLtorTwo 15s linear infinite",
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
        marqueeRtol: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        marqueeRtolTwo: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0%)" },
        },
        marqueeLtor: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0%)" },
        },
        marqueeLtorTwo: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
