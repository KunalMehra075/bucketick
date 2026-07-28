import React from 'react';
import { Text, View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { accentPairs, BrandColor, colors, fonts, gradients } from '../theme';

interface AvatarProps {
  name: string;
  uri?: string | null;
  color?: BrandColor;
  size?: number;
  /** Use the full brand gradient instead of a flat accent (ignored when uri is set). */
  gradient?: boolean;
  style?: ViewStyle;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({ name, uri, color = 'pink', size = 44, gradient, style }: AvatarProps) {
  const base: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  };

  // Photo avatar.
  if (uri) {
    return (
      <View style={[base, { backgroundColor: colors.gray100 }, style]}>
        <Image
          source={{ uri }}
          style={{ width: size, height: size }}
          contentFit="cover"
          transition={150}
        />
      </View>
    );
  }

  const label = (
    <Text
      style={{
        fontFamily: fonts.display,
        color: colors.white,
        fontSize: size * 0.4,
        letterSpacing: 0.3,
      }}
    >
      {initials(name)}
    </Text>
  );

  if (gradient) {
    return (
      <LinearGradient colors={gradients.dusk.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[base, style]}>
        {label}
      </LinearGradient>
    );
  }

  return <View style={[base, { backgroundColor: accentPairs[color].solid }, style]}>{label}</View>;
}
