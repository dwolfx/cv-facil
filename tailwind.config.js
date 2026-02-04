/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Mapping Tailwind keys to our CSS Variables
                "primary": "var(--primary)",
                "primary-hover": "var(--primary-hover)",
                "primary-light": "var(--primary-light)",
                "slate-blue": "var(--secondary)",

                // Backgrounds
                "background-light": "var(--bg-body)",
                "background-dark": "#0f172a", // Hardcoded for specificity in classes if needed, or use var(--slate-900)

                // Extend Slate Palette to match our variables if needed (Tailwind has slate by default, but we can override)
            },
            fontFamily: {
                "sans": ["var(--font-sans)", "sans-serif"],
                "display": ["var(--font-sans)", "sans-serif"]
            },
            borderRadius: {
                DEFAULT: "var(--radius-md)",
                lg: "var(--radius-lg)",
                xl: "var(--radius-xl)"
            }
        },
    },
    plugins: [],
}
