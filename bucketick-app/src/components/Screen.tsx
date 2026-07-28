import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme';

interface ScreenProps {
  children: React.ReactNode;
  /** Which safe-area edges to pad. Defaults to top only (tabs handle the bottom). */
  edges?: Edge[];
  background?: string;
  style?: ViewStyle;
}

export function Screen({ children, edges = ['top'], background = colors.cream, style }: ScreenProps) {
  return (
    <SafeAreaView edges={edges} style={[styles.root, { backgroundColor: background }]}>
      <View style={[styles.body, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  body: { flex: 1 },
});
