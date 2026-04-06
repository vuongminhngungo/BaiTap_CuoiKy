import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
    "./src/store/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#EE4D2D",
        secondary: "#FF7337",
        bg: "#F5F5F5",
        text: {
          primary: "#333333",
          secondary: "#757575",
        },
      },
      boxShadow: {
        shopee: "0 2px 10px rgba(0, 0, 0, 0.08)",
      },
      backgroundImage: {
        "shopee-gradient": "linear-gradient(90deg, #EE4D2D 0%, #FF7337 100%)",
      },
      screens: {
        sm: "375px",
        md: "768px",
        lg: "1280px",
      },
    },
  },
  plugins: [],
};

export default config;
