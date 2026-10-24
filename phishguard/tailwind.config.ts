import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        cyber: {
          safe: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444',
          dark: '#0f172a',
          surface: '#1e293b',
          accent: '#38bdf8',
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace'
        ]
      },
      boxShadow: {
        'glow-safe': '0 0 20px -3px rgba(16, 185, 129, 0.35)',
        'glow-warning': '0 0 20px -3px rgba(245, 158, 11, 0.35)',
        'glow-danger': '0 0 25px -3px rgba(239, 68, 68, 0.45)',
        'glow-cyan': '0 0 20px -3px rgba(6, 182, 212, 0.35)',
      }
    },
  },
  plugins: [],
} satisfies Config;
