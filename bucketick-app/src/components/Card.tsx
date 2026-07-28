import React from 'react';
import { StyleSheet, View, ViewProps, ViewStyle } from 'react-native';
import { colors, radius, shadow } from '../theme';

interface CardProps extends ViewProps {
  padded?: boolean;
  style?: ViewStyle;
}

export function Card({ padded = true, style, children, ...rest }: CardProps) {
  return (
    <View style={[styles.card, padded && styles.padded, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.gray100,
    ...shadow.sm,
  },
  padded: {
    padding: 18,
  },
});
