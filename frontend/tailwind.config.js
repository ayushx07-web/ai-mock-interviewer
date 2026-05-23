/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        surface: '#111111',
        'surface-2': '#1a1a1a',
        border: '#262626',
        'border-subtle': '#1c1c1c',
        muted: '#737373',
        'muted-foreground': '#a3a3a3',
        foreground: '#fafafa',
        primary: '#6366f1',
        'primary-hover': '#4f46e5',
        success: '#22c55e',
        warning: '#f59e0b',
        destructive: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '8px',
        sm: '6px',
        lg: '12px',
        xl: '16px',
      },
    },
  },
};
