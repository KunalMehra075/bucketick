import preset from '@bucketick/design-tokens/tailwind-preset';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [preset],
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    // Include shared UI package so its Tailwind classes are generated.
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Dashboard uses Nunito as its primary face.
        sans: ['Nunito', 'system-ui', '-apple-system', 'sans-serif'],
        secondary: ['Manrope', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
};
