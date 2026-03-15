import type { Config } from "tailwindcss";

const config: Config = {
    theme: {
        extend: {
            fontFamily: {
                brand: ["var(--font-bricolage_grotesque)", "sans-serif"],
                body: ["var(--font-lexend)", "sans-serif"],
            },
            colors: {
                olive: {
                    bg: "#E8F5E0",
                    "bg-card": "#D4ECC8",
                    primary: "#3D6B2C",
                    "primary-dark": "#2E5020",
                    heading: "#1A2E12",
                    body: "#5A6B52",
                    accent: "#6AB04C",
                    "accent-yellow": "#D4D44A",
                    "accent-peach": "#E8C87A",
                    shadow: "rgba(61,107,44,0.15)",
                    glow: "rgba(61,107,44,0.18)",
                }
            }
        },
    },
    plugins: [],
};
export default config;