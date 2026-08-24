import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        bg: '#F8F7F5',
        ink: {
          DEFAULT: '#0C0C0B',
          muted: '#6B6B68',
          subtle: '#A8A8A5',
        },
        border: '#E4E3DF',
        surface: {
          DEFAULT: '#FFFFFF',
          raised: '#F1F0EC',
        },
        accent: '#1B4ED8',
        severity: {
          critical: '#DC2626',
          high: '#EA580C',
          medium: '#D97706',
          low: '#16A34A',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.4s ease-out forwards',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.25' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
