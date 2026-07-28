import { TextStyle } from 'react-native';
import { colors, fonts } from './tokens';

/**
 * Type scale for Bucketick. Nunito carries the personality on headings,
 * Manrope keeps body text calm and readable. Tight tracking on big display
 * text mirrors the web landing page.
 */
export const type: Record<string, TextStyle> = {
  hero: {
    fontFamily: fonts.displayBlack,
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -1,
    color: colors.ink,
  },
  h1: {
    fontFamily: fonts.display,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.6,
    color: colors.ink,
  },
  h2: {
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.4,
    color: colors.ink,
  },
  h3: {
    fontFamily: fonts.displayBold,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.2,
    color: colors.ink,
  },
  bodyLg: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
    color: colors.gray700,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: colors.gray700,
  },
  bodySemibold: {
    fontFamily: fonts.bodySemibold,
    fontSize: 15,
    lineHeight: 22,
    color: colors.ink,
  },
  label: {
    fontFamily: fonts.bodySemibold,
    fontSize: 13,
    lineHeight: 18,
    color: colors.gray700,
  },
  caption: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: colors.gray500,
  },
  overline: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.gray500,
  },
  button: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    letterSpacing: 0.2,
  },
};
