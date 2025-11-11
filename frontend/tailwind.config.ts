import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        ocean: {
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
        },
        slateglass: 'rgba(15, 23, 42, 0.7)',
      },
      boxShadow: {
        glow: '0 20px 45px rgba(14, 165, 233, 0.25)',
      },
      backgroundImage: {
        'radial-grid': 'radial-gradient(circle at top, rgba(56, 189, 248, 0.25), transparent 55%)',
      },
    },
  },
  plugins: [],
} satisfies Config
