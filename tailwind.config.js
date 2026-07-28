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
        paper: 'var(--color-paper)',
        charcoal: 'var(--color-charcoal)',
        brass: 'var(--color-brass)',
        mist: 'var(--color-mist)',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}

