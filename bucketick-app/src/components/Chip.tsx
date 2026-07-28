import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { accentPairs, BrandColor, colors, fonts, radius } from '../theme';

interface ChipProps {
  label: string;
  color?: BrandColor;
  selected?: boolean;
  onPress?: () => void;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

/** A soft, tappable pill. Selected state fills with the accent. */
export function Chip({ label, color = 'pink', selected, onPress, icon, style }: ChipProps) {
  const pair = accentPairs[color];
  const content = (
    <View style={styles.row}>
      {icon}
      <Text
        style={{
          fontFamily: fonts.bodyBold,
          fontSize: 13,
          color: selected ? colors.white : pair.solid,
        }}
      >
        {label}
      </Text>
    </View>
  );

  const base: ViewStyle = {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: selected ? pair.solid : pair.soft,
  };

  if (!onPress) return <View style={[base, style]}>{content}</View>;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [base, { opacity: pressed ? 0.85 : 1 }, style]}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
