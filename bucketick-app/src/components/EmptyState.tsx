import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, type } from '../theme';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  message: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconWrap}>{icon}</View>
      <Text style={[type.h3, styles.title]}>{title}</Text>
      <Text style={[type.body, styles.message]}>{message}</Text>
      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  iconWrap: {
    width: 76,
    height: 76,
    borderRadius: radius.card,
    backgroundColor: colors.yellowSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  title: { textAlign: 'center', marginBottom: 6 },
  message: { textAlign: 'center', maxWidth: 280 },
  action: { marginTop: 20, alignSelf: 'stretch' },
});
