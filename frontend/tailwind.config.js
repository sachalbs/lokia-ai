/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Mode Local (Dark) - tons bleus profonds
        local: {
          bg: '#0a0f1a',
          sidebar: '#0d1424',
          card: '#111827',
          accent: '#3b82f6',
          'accent-hover': '#2563eb',
          text: '#e2e8f0',
          'text-muted': '#94a3b8',
          border: '#1e293b',
        },
        // Mode API (Light) - tons bleus clairs
        api: {
          bg: '#f0f9ff',
          sidebar: '#e0f2fe',
          card: '#ffffff',
          accent: '#0ea5e9',
          'accent-hover': '#0284c7',
          text: '#0f172a',
          'text-muted': '#64748b',
          border: '#bae6fd',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-out',
        'slide-in': 'slideIn 200ms ease-out',
        'slide-up': 'slideUp 300ms ease-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'cursor-blink': 'cursorBlink 1s step-end infinite',
        'typing': 'typing 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        cursorBlink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        typing: {
          '0%': { opacity: '0', transform: 'translateY(5px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'soft': '0 2px 8px -2px rgba(0, 0, 0, 0.1), 0 4px 16px -4px rgba(0, 0, 0, 0.1)',
        'soft-lg': '0 4px 16px -4px rgba(0, 0, 0, 0.15), 0 8px 32px -8px rgba(0, 0, 0, 0.15)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-light': '0 0 20px rgba(14, 165, 233, 0.2)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      transitionDuration: {
        '200': '200ms',
      },
    },
  },
  plugins: [],
}
