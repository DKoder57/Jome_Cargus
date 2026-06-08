/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
        colors: {
          red: {
            light: 'var(--color-red-light)',
            DEFAULT: 'var(--color-red)',
          },
          brand: {
            light: 'var(--color-brand-light)',
            DEFAULT: 'var(--color-brand)',
            dark: 'var(--color-brand-dark)',
          },
        },
      },
  },
  plugins: [],
}

