/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg-app)',
        surface: {
          DEFAULT: 'var(--bg-surface)',
          hover: 'var(--bg-surface-hover)',
          subtle: 'var(--bg-subtle)',
        },
        border: {
          DEFAULT: 'var(--border-color)',
          subtle: 'var(--border-subtle)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
          light: 'var(--primary-light)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        status: {
          success: 'var(--success)',
          successBg: 'var(--success-bg)',
          successBorder: 'var(--success-border)',
          warning: 'var(--warning)',
          warningBg: 'var(--warning-bg)',
          warningBorder: 'var(--warning-border)',
          danger: 'var(--danger)',
          dangerBg: 'var(--danger-bg)',
          dangerBorder: 'var(--danger-border)',
        },
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '8px',
        md: '10px',
        lg: '12px',
        xl: '16px',
        full: '9999px',
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        dropdown: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',
        drawer: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
