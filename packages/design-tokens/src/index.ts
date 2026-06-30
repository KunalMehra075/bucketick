/**
 * Bucketick design tokens — the single source of truth for the visual language.
 *
 * This TS object is canonical. Two sibling files mirror it for runtimes that
 * cannot import TypeScript:
 *   - `tokens.css`        → CSS custom properties (consumed by the vanilla landing)
 *   - `tailwind-preset.js` → Tailwind theme preset (consumed by dashboard / admin)
 *
 * Mobile (NativeWind) imports this object directly. Keep all three in lockstep.
 */

export const colors = {
  // Brand
  yellow: '#ffbb00',
  pink: '#ff006e',
  orange: 'oklch(0.69 0.25 38.09)',
  blue: 'oklch(0.64 0.21 255.09)',
  purple: '#8b3dff',

  // Soft brand tints (for backgrounds / glass washes)
  yellowSoft: '#fff4d6',
  pinkSoft: '#ffe0ec',
  orangeSoft: '#ffe6d6',
  blueSoft: '#dbe8ff',
  purpleSoft: '#efe2ff',

  // Neutrals
  white: '#ffffff',
  gray50: '#fafafa',
  gray100: '#f4f4f5',
  gray200: '#e9e9ec',
  gray300: '#d6d6db',
  gray500: '#9a9aa3',
  gray700: '#52525b',
  gray900: '#18181b',
  ink: '#0f0f12',
} as const;

/** Signature multi-color brand gradient (used on hero headlines, CTAs). */
export const gradients = {
  brand: 'linear-gradient(100deg, #ffbb00 0%, #ff7a00 28%, #ff006e 60%, #8b3dff 100%)',
  sunrise: 'linear-gradient(120deg, #ffbb00 0%, #ff006e 100%)',
  dusk: 'linear-gradient(120deg, #ff006e 0%, #8b3dff 100%)',
  sky: 'linear-gradient(120deg, #ffbb00 0%, #4d8bff 100%)',
} as const;

export const radii = {
  input: '14px',
  button: '16px',
  card: '24px',
  dialog: '24px',
  pill: '999px',
  full: '9999px',
} as const;

export const shadows = {
  // Soft, layered, slightly elevated. Avoid heavy material shadows.
  sm: '0 1px 2px rgba(24, 24, 27, 0.04), 0 2px 6px rgba(24, 24, 27, 0.05)',
  md: '0 4px 10px rgba(24, 24, 27, 0.05), 0 12px 28px rgba(24, 24, 27, 0.07)',
  lg: '0 10px 24px rgba(24, 24, 27, 0.06), 0 30px 60px rgba(24, 24, 27, 0.10)',
  // Playful "sticker" shadow (hard offset) — for landing CTAs.
  sticker: '4px 4px 0 rgba(15, 15, 18, 1)',
  stickerLg: '6px 6px 0 rgba(15, 15, 18, 1)',
} as const;

export const typography = {
  fontFamily: "'Nunito', system-ui, -apple-system, sans-serif",
  fontFamilySecondary: "'Manrope', system-ui, -apple-system, sans-serif",
  weights: { regular: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 },
  sizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.375rem',
    '2xl': '1.75rem',
    '3xl': '2.25rem',
    '4xl': '3rem',
    '5xl': '4rem',
    hero: 'clamp(2.75rem, 8vw, 6.5rem)',
  },
  tracking: { tight: '-0.03em', normal: '0', wide: '0.04em' },
} as const;

/** 4px base spacing scale. */
export const spacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  32: '8rem',
} as const;

export const motion = {
  duration: { fast: '160ms', base: '280ms', slow: '480ms', cinematic: '900ms' },
  // Spring-ish / smooth easings. Delight over decoration.
  easing: {
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
    inOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
  },
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const tokens = {
  colors,
  gradients,
  radii,
  shadows,
  typography,
  spacing,
  motion,
  breakpoints,
} as const;

export type Tokens = typeof tokens;
export default tokens;
