import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, radius } from '../theme';

interface ProgressBarProps {
  ratio: number; // 0..1
  height?: number;
  track?: string;
  style?: ViewStyle;
}

export function ProgressBar({ ratio, height = 8, track = colors.gray100, style }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(1, ratio));
  return (
    <View style={[styles.track, { height, backgroundColor: track, borderRadius: height }, style]}>
      <LinearGradient
        colors={gradients.sunrise.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          width: `${pct * 100}%`,
          height: '100%',
          borderRadius: height,
          minWidth: pct > 0 ? height : 0,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
});
