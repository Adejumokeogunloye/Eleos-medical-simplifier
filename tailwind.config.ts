import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
    extend: {
      colors: {
        healthcare: {
          purple: "#7C3AED",
          pink: "#EC4899",
          lavender: "#F5F3FF",
          lilac: "#EDE9FE",
          surface: "#FFFFFF",
          "surface-muted": "#FAFAFF",
          ink: "#251B3F",
          "soft-ink": "#6B6380",
          success: "#059669",
        },
        border: "hsl(var(--border))", input: "hsl(var(--input))", ring: "hsl(var(--ring))", background: "hsl(var(--background))", foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" }, secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" }, muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" }, accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" }, card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" }
      },
      backgroundImage: {
        "healthcare-gradient": "linear-gradient(135deg, #7C3AED 0%, #A855F7 45%, #EC4899 100%)",
        "healthcare-soft": "linear-gradient(135deg, #F5F3FF 0%, #FDF2F8 100%)",
      },
      boxShadow: { "healthcare": "0 12px 30px rgba(124, 58, 237, 0.12)" },
      borderRadius: { lg: "var(--radius)", md: "calc(var(--radius) - 2px)", sm: "calc(var(--radius) - 4px)" }
    }
  }, plugins: [require("tailwindcss-animate")]
};
export default config;
