import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0F0E0C',
        cream: '#FAF8F4',
        navy: '#0D1F3C',
        blue: '#1A3FA8',
        critical: '#DC2626',
        high: '#EA580C',
        medium: '#D97706',
        low: '#16A34A',
        steel: '#1E2D45',
        muted: '#6B6860',
        rule: '#E4E0D8',
        'lt-blue': '#EFF6FF',
        'lt-green': '#F0FFF4',
        'lt-red': '#FEF2F2',
      },
      fontFamily: {
        syne: ['var(--font-syne)', 'sans-serif'],
        sans: ['var(--font-instrument-sans)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      animation: {
        'progress': 'progress 90s ease-in forwards',
        'fade-up': 'fadeUp 0.4s cubic-bezier(.22,.68,0,1.2)',
      },
      keyframes: {
        progress: {
          '0%': { width: '0%' },
          '20%': { width: '20%' },
          '40%': { width: '45%' },
          '60%': { width: '65%' },
          '80%': { width: '82%' },
          '100%': { width: '92%' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
