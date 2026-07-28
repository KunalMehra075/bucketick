import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';

// Brand marks copied from the landing site (apps/landing/public).
const WORDMARK = require('../../assets/bucketick-wordmark.png'); // 747 x 176
const LOGO = require('../../assets/bucketick-logo.png'); // 610 x 542

const WORDMARK_RATIO = 747 / 176;
const LOGO_RATIO = 610 / 542;

/** Horizontal Bucketick text lockup. Pass a tint to recolor for dark backgrounds. */
export function Wordmark({
  height = 24,
  tint,
  style,
}: {
  height?: number;
  tint?: string;
  style?: StyleProp<ImageStyle>;
}) {
  return (
    <Image
      source={WORDMARK}
      style={[{ height, width: height * WORDMARK_RATIO, resizeMode: 'contain', tintColor: tint }, style]}
      accessibilityLabel="Bucketick"
    />
  );
}

/** Square-ish Bucketick logo mark. */
export function LogoMark({ size = 40, style }: { size?: number; style?: StyleProp<ImageStyle> }) {
  return (
    <Image
      source={LOGO}
      style={[{ height: size, width: size * LOGO_RATIO, resizeMode: 'contain' }, style]}
      accessibilityLabel="Bucketick logo"
    />
  );
}
