import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Check, MapPin } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, gradients, radius, type } from '../../theme';
import { StatusPill } from '../../components';
import type { BucketItem } from '../../types';

interface ItemRowProps {
  item: BucketItem;
  onToggle: () => void;
  onEdit: () => void;
}

export function ItemRow({ item, onToggle, onEdit }: ItemRowProps) {
  const done = item.status === 'completed';

  return (
    <View style={styles.row}>
      <Pressable onPress={onToggle} hitSlop={8} style={styles.checkWrap}>
        {done ? (
          <LinearGradient
            colors={gradients.sunrise.colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.checkOn}
          >
            <Check size={16} color={colors.white} strokeWidth={3.2} />
          </LinearGradient>
        ) : (
          <View style={styles.checkOff} />
        )}
      </Pressable>

      <Pressable onPress={onEdit} style={styles.body}>
        <Text style={[type.bodySemibold, styles.title, done && styles.titleDone]}>{item.title}</Text>
        {item.note ? (
          <Text style={[type.caption, styles.note]} numberOfLines={2}>
            {item.note}
          </Text>
        ) : null}
        <View style={styles.metaRow}>
          <StatusPill status={item.status} />
          {item.location ? (
            <View style={styles.location}>
              <MapPin size={12} color={colors.gray500} strokeWidth={2.4} />
              <Text style={styles.locationText}>{item.location}</Text>
            </View>
          ) : null}
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.gray100,
    padding: 16,
    marginBottom: 10,
  },
  checkWrap: { paddingTop: 1 },
  checkOn: {
    width: 26,
    height: 26,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOff: {
    width: 26,
    height: 26,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.gray300,
  },
  body: { flex: 1 },
  title: { fontSize: 15.5 },
  titleDone: { color: colors.gray500, textDecorationLine: 'line-through' },
  note: { marginTop: 3 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },
  location: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  locationText: { fontFamily: fonts.bodySemibold, fontSize: 12, color: colors.gray500 },
});
