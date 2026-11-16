/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        paper: 'rgb(var(--color-paper-rgb) / <alpha-value>)',
        surface: 'rgb(var(--color-surface-rgb) / <alpha-value>)',
        mist: 'rgb(var(--color-mist-rgb) / <alpha-value>)',
        ink: 'rgb(var(--color-ink-rgb) / <alpha-value>)',
        'ink-muted': 'rgb(var(--color-ink-muted-rgb) / <alpha-value>)',
        brass: 'rgb(var(--color-accent-rgb) / <alpha-value>)',
        'brass-hover': 'rgb(var(--color-accent-hover-rgb) / <alpha-value>)',
        'on-brass': 'rgb(var(--color-on-accent-rgb) / <alpha-value>)',
        accent: 'rgb(var(--color-accent-rgb) / <alpha-value>)',
        'accent-solid': 'rgb(var(--color-accent-solid-rgb) / <alpha-value>)',
        'accent-hover': 'rgb(var(--color-accent-hover-rgb) / <alpha-value>)',
        'on-accent': 'rgb(var(--color-on-accent-rgb) / <alpha-value>)',
        gold: 'rgb(var(--color-gold-rgb) / <alpha-value>)',
        'on-ink': 'rgb(var(--color-on-ink-rgb) / <alpha-value>)',
        line: 'var(--color-border)',
        obsidian: '#0B0C10',
        'obsidian-surface': '#14161D',
        charcoal: 'rgb(var(--color-ink-rgb) / <alpha-value>)'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace']
      }
    }
  },
  plugins: []
};
