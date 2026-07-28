/**
 * Bucketick design tokens, mirrored from packages/design-tokens/tokens.css.
 * Kept as plain hex so React Native can consume them directly. The two oklch
 * source colors (orange, blue) are converted to their nearest sRGB hex.
 */

export const colors = {
  // Brand
  yellow: '#ffbb00',
  pink: '#ff006e',
  orange: '#fb5607', // oklch(0.69 0.25 38.09)
  blue: '#3a86ff', // oklch(0.64 0.21 255.09)
  purple: '#8b3dff',

  // Soft brand tints
  yellowSoft: '#fff4d6',
  pinkSoft: '#ffe0ec',
  orangeSoft: '#ffe6d6',
  blueSoft: '#dbe8ff',
  purpleSoft: '#efe2ff',

  // Neutrals
  white: '#ffffff',
  cream: '#fffdf8', // app canvas, warm off-white
  gray50: '#fafafa',
  gray100: '#f4f4f5',
  gray200: '#e9e9ec',
  gray300: '#d6d6db',
  gray500: '#9a9aa3',
  gray700: '#52525b',
  gray900: '#18181b',
  ink: '#0f0f12',
} as const;

/** Gradient stops for expo-linear-gradient. */
export const gradients = {
  brand: {
    colors: ['#ffbb00', '#ff7a00', '#ff006e', '#8b3dff'] as const,
    locations: [0, 0.28, 0.6, 1] as const,
  },
  sunrise: {
    colors: ['#ffbb00', '#ff006e'] as const,
    locations: [0, 1] as const,
  },
  dusk: {
    colors: ['#ff006e', '#8b3dff'] as const,
    locations: [0, 1] as const,
  },
  sky: {
    colors: ['#ffbb00', '#4d8bff'] as const,
    locations: [0, 1] as const,
  },
} as const;

export const radius = {
  input: 12,
  button: 14,
  card: 18,
  dialog: 18,
  pill: 999,
  full: 9999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 56,
} as const;

/** Font family names as registered by expo-font (see App.tsx). */
export const fonts = {
  // Nunito — display / headings
  display: 'Nunito_800ExtraBold',
  displayBlack: 'Nunito_900Black',
  displayBold: 'Nunito_700Bold',
  // Manrope — body / UI
  body: 'Manrope_500Medium',
  bodyRegular: 'Manrope_400Regular',
  bodySemibold: 'Manrope_600SemiBold',
  bodyBold: 'Manrope_700Bold',
} as const;

/** Soft brand shadow presets (iOS + Android elevation). */
export const shadow = {
  sm: {
    shadowColor: '#18181b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: '#18181b',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
  },
  lg: {
    shadowColor: '#18181b',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.12,
    shadowRadius: 40,
    elevation: 12,
  },
  /** Playful hard "sticker" shadow, matches the brand's sticker look. */
  sticker: {
    shadowColor: '#0f0f12',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
} as const;

export type BrandColor = 'yellow' | 'pink' | 'orange' | 'blue' | 'purple';

/** The five brand accents paired with their soft tint, used for chips and category cards. */
export const accentPairs: Record<BrandColor, { solid: string; soft: string }> = {
  yellow: { solid: colors.yellow, soft: colors.yellowSoft },
  pink: { solid: colors.pink, soft: colors.pinkSoft },
  orange: { solid: colors.orange, soft: colors.orangeSoft },
  blue: { solid: colors.blue, soft: colors.blueSoft },
  purple: { solid: colors.purple, soft: colors.purpleSoft },
};
