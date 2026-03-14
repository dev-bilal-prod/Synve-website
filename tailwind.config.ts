import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                cormorant: ["var(--font-cormorant)", "serif"],
                outfit: ["var(--font-outfit)", "sans-serif"],
            },
            colors: {
                gold: "#c9a84c",
                "gold-light": "#e2c47a",
                "off-black": "#0f0f0f",
                "card-bg": "#111111",
            },
        },
    },
    plugins: [],
};

export default config;