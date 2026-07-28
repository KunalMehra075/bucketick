import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import type { ItemStatus } from '../types';

export const STATUS_META: Record<ItemStatus, { label: string; fg: string; bg: string }> = {
  dreaming: { label: 'Dreaming', fg: colors.purple, bg: colors.purpleSoft },
  in_progress: { label: 'In progress', fg: colors.orange, bg: colors.orangeSoft },
  completed: { label: 'Done', fg: '#1f9d55', bg: '#dff5e7' },
};

export function StatusPill({ status }: { status: ItemStatus }) {
  const meta = STATUS_META[status];
  return (
    <View style={[styles.pill, { backgroundColor: meta.bg }]}>
      <View style={[styles.dot, { backgroundColor: meta.fg }]} />
      <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11.5, color: meta.fg }}>{meta.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
});
