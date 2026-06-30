/**
 * Tailwind preset derived from the Bucketick design tokens.
 * Consumed by dashboard / admin (Phase 2+). Mirror of src/index.ts.
 */

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Semantic, theme-aware (flip in dark mode). See theme.css.
        bg: 'var(--bt-bg)',
        surface: 'var(--bt-surface)',
        surface2: 'var(--bt-surface-2)',
        sidebar: 'var(--bt-sidebar)',
        line: 'var(--bt-border)',
        content: {
          DEFAULT: 'var(--bt-text)',
          muted: 'var(--bt-text-muted)',
        },
        brand: {
          yellow: '#ffbb00',
          pink: '#ff006e',
          orange: 'oklch(0.69 0.25 38.09)',
          blue: 'oklch(0.64 0.21 255.09)',
          purple: '#8b3dff',
        },
        soft: {
          yellow: '#fff4d6',
          pink: '#ffe0ec',
          orange: '#ffe6d6',
          blue: '#dbe8ff',
          purple: '#efe2ff',
        },
        ink: '#0f0f12',
        gray: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e9e9ec',
          300: '#d6d6db',
          500: '#9a9aa3',
          700: '#52525b',
          900: '#18181b',
        },
      },
      fontFamily: {
        sans: ['Nunito', 'system-ui', '-apple-system', 'sans-serif'],
        secondary: ['Manrope', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        input: '14px',
        button: '16px',
        card: '24px',
        dialog: '24px',
        pill: '999px',
      },
      boxShadow: {
        'soft-sm': '0 1px 2px rgba(24,24,27,0.04), 0 2px 6px rgba(24,24,27,0.05)',
        'soft-md': '0 4px 10px rgba(24,24,27,0.05), 0 12px 28px rgba(24,24,27,0.07)',
        'soft-lg': '0 10px 24px rgba(24,24,27,0.06), 0 30px 60px rgba(24,24,27,0.10)',
        sticker: '4px 4px 0 rgba(15,15,18,1)',
        'sticker-lg': '6px 6px 0 rgba(15,15,18,1)',
      },
      backgroundImage: {
        'gradient-brand':
          'linear-gradient(100deg, #ffbb00 0%, #ff7a00 28%, #ff006e 60%, #8b3dff 100%)',
        'gradient-sunrise': 'linear-gradient(120deg, #ffbb00 0%, #ff006e 100%)',
        'gradient-dusk': 'linear-gradient(120deg, #ff006e 0%, #8b3dff 100%)',
        'gradient-sky': 'linear-gradient(120deg, #ffbb00 0%, #4d8bff 100%)',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
};
