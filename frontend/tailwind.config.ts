import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'viewport-1': 'clamp(0.75rem, 0.5vw, 1.5rem)',
        'viewport-2': 'clamp(1rem, 1vw, 2rem)',
        'viewport-3': 'clamp(1.25rem, 1.5vw, 2.5rem)',
        'viewport-4': 'clamp(1.5rem, 2vw, 3rem)',
        'viewport-5': 'clamp(1.75rem, 2.5vw, 3.5rem)',
        'viewport-6': 'clamp(2rem, 3vw, 4rem)',
        'viewport-7': 'clamp(2.25rem, 3.5vw, 4.5rem)',
        'viewport-8': 'clamp(2.25rem, 4vw, 5rem)',
        'viewport-9': 'clamp(2.4rem, 4.5vw, 5.5rem)',
        'viewport-10': 'clamp(2.5rem, 5vw, 6rem)',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;
