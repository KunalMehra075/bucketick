import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Lock } from 'lucide-react-native';
import { accentPairs, colors, fonts, radius, shadow, type } from '../../theme';
import { Chip, ProgressBar } from '../../components';
import type { BucketList } from '../../types';

interface ListCardProps {
  list: BucketList;
  total: number;
  done: number;
  ratio: number;
  onPress: () => void;
}

export function ListCard({ list, total, done, ratio, onPress }: ListCardProps) {
  const pair = accentPairs[list.accent];
  const pct = Math.round(ratio * 100);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, { transform: [{ scale: pressed ? 0.99 : 1 }] }]}>
      {list.coverUrl ? (
        <View style={styles.cover}>
          <Image source={{ uri: list.coverUrl }} style={styles.coverImg} contentFit="cover" transition={150} />
          <View style={styles.coverChip}>
            <Chip label={list.category} color={list.accent} />
          </View>
          {list.visibility === 'private' ? (
            <View style={styles.coverLock}>
              <Lock size={12} color={colors.white} strokeWidth={2.6} />
            </View>
          ) : null}
        </View>
      ) : (
        <View style={[styles.accentStrip, { backgroundColor: pair.solid }]} />
      )}

      <View style={styles.body}>
        {!list.coverUrl ? (
          <View style={styles.topRow}>
            <Chip label={list.category} color={list.accent} />
            {list.visibility === 'private' ? (
              <View style={styles.privateTag}>
                <Lock size={12} color={colors.gray500} strokeWidth={2.4} />
                <Text style={styles.privateText}>Private</Text>
              </View>
            ) : null}
          </View>
        ) : null}

        <Text style={[type.h3, styles.title]} numberOfLines={2}>
          {list.title}
        </Text>
        {list.description ? (
          <Text style={[type.caption, styles.desc]} numberOfLines={2}>
            {list.description}
          </Text>
        ) : null}

        <View style={styles.progressRow}>
          <ProgressBar ratio={ratio} style={{ flex: 1 }} />
          <Text style={[styles.pct, { color: pair.solid }]}>{pct}%</Text>
        </View>
        <Text style={styles.count}>
          {done} of {total} {total === 1 ? 'dream' : 'dreams'} done
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.gray100,
    overflow: 'hidden',
    marginBottom: 14,
    ...shadow.sm,
  },
  cover: { height: 120, backgroundColor: colors.gray100 },
  coverImg: { width: '100%', height: '100%' },
  coverChip: { position: 'absolute', left: 12, top: 12 },
  coverLock: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(15,15,18,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accentStrip: { height: 6 },
  body: { padding: 18 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  privateTag: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  privateText: { fontFamily: fonts.bodySemibold, fontSize: 11.5, color: colors.gray500 },
  title: { marginBottom: 4, marginTop: 2 },
  desc: { marginBottom: 14 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 },
  pct: { fontFamily: fonts.displayBold, fontSize: 15 },
  count: { fontFamily: fonts.bodySemibold, fontSize: 12.5, color: colors.gray500, marginTop: 8 },
});
