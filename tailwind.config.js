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
        paper: 'var(--color-paper)',
        surface: 'var(--color-surface)',
        mist: 'var(--color-mist)',
        ink: 'var(--color-ink)',
        'ink-muted': 'var(--color-ink-muted)',
        brass: 'var(--color-brass)',
        'brass-hover': 'var(--color-brass-hover)',
        'on-brass': 'var(--color-on-brass)',
        'on-ink': 'var(--color-on-ink)',
        line: 'var(--color-border)',
        charcoal: 'var(--color-ink)'
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace']
      }
    }
  },
  plugins: []
};
