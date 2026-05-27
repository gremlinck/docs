/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FAF8F4',
        ink: '#0F0E0C',
        navy: '#0D1F3C',
        blue: '#1A3FA8',
        critical: '#DC2626',
        high: '#EA580C',
        medium: '#D97706',
        low: '#16A34A',
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        sans: ['Instrument Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
