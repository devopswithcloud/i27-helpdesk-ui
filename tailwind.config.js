/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#F15E22', // Official i27 Orange
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        sidebar: {
          DEFAULT: '#051C36', // Official i27 Navy
          hover: '#0a2a4d',
          active: '#0f3863',
          text: '#cbd5e1',
        },
        surface: {
          primary: '#ffffff',
          secondary: '#f8fafc',
          tertiary: '#f1f5f9',
        },
        status: {
          open: '#f59e0b',
          'open-bg': '#fffbeb',
          progress: '#2563eb',
          'progress-bg': '#eff6ff',
          resolved: '#10b981',
          'resolved-bg': '#ecfdf5',
          closed: '#6b7280',
          'closed-bg': '#f3f4f6',
        },
        priority: {
          high: '#ef4444',
          'high-bg': '#fef2f2',
          medium: '#f59e0b',
          'medium-bg': '#fffbeb',
          low: '#10b981',
          'low-bg': '#ecfdf5',
        },
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'sidebar': '4px 0 6px -1px rgb(0 0 0 / 0.1)',
        'modal': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      },
      borderRadius: {
        'xl2': '16px',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        toastIn: {
          '0%': { opacity: '0', transform: 'translateY(-100%) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        toastOut: {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(-100%) scale(0.95)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
        'toast-in': 'toastIn 0.3s ease-out',
        'toast-out': 'toastOut 0.3s ease-in forwards',
      },
    },
  },
  plugins: [],
};
