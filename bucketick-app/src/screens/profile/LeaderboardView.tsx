import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Crown, Flame } from 'lucide-react-native';
import { Avatar } from '../../components';
import { colors, fonts, radius, shadow } from '../../theme';
import { useLeaderboard } from '../../hooks';
import type { RankedUser } from '../../types';

export function LeaderboardView() {
  const { data, isLoading } = useLeaderboard();

  if (isLoading || !data) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.pink} />
      </View>
    );
  }

  const podium = data.items.slice(0, 3);
  const rest = data.items.slice(3);

  return (
    <View>
      <LinearGradient
        colors={['#ffbb00', '#ff7a00', '#ff006e', '#8b3dff']}
        locations={[0, 0.28, 0.6, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.banner}
      >
        <View style={styles.podium}>
          <PodiumSpot rank={2} user={podium[1]} />
          <PodiumSpot rank={1} user={podium[0]} />
          <PodiumSpot rank={3} user={podium[2]} />
        </View>
      </LinearGradient>

      <View style={styles.myCard}>
        <View style={styles.myRankBadge}>
          <Text style={styles.myRankText}>{data.me.rank}</Text>
        </View>
        <View style={styles.flex}>
          <Text style={styles.myLabel}>Your rank this season</Text>
          <Text style={styles.myName}>{data.me.name}</Text>
        </View>
        <View style={styles.myPoints}>
          <Flame size={16} color={colors.orange} strokeWidth={2.6} />
          <Text style={styles.myPointsText}>{data.me.points}</Text>
        </View>
      </View>

      {rest.map((u, i) => (
        <RankRow key={u.id} user={u} rank={i + 4} />
      ))}
    </View>
  );
}

function PodiumSpot({ rank, user }: { rank: number; user?: RankedUser }) {
  if (!user) return <View style={styles.podiumSpot} />;
  const isFirst = rank === 1;
  return (
    <View style={[styles.podiumSpot, isFirst && { marginBottom: 12 }]}>
      {isFirst ? <Crown size={22} color={colors.white} strokeWidth={2.4} style={{ marginBottom: 4 }} /> : null}
      <View style={[styles.ring, user.isMe && { borderColor: colors.white }]}>
        <Avatar name={user.name} color={user.avatarColor} size={isFirst ? 64 : 50} />
      </View>
      <View style={styles.rankChip}>
        <Text style={styles.rankChipText}>{rank}</Text>
      </View>
      <Text style={styles.podiumName} numberOfLines={1}>
        {user.isMe ? 'You' : user.name.split(' ')[0]}
      </Text>
      <Text style={styles.podiumPts}>{user.points} pts</Text>
    </View>
  );
}

function RankRow({ user, rank }: { user: RankedUser; rank: number }) {
  return (
    <View style={[styles.row, user.isMe && styles.rowMe]}>
      <Text style={[styles.rowRank, user.isMe && { color: colors.pink }]}>{rank}</Text>
      <Avatar name={user.name} color={user.avatarColor} size={40} />
      <View style={styles.flex}>
        <Text style={styles.rowName}>{user.isMe ? 'You' : user.name}</Text>
        <Text style={styles.rowMeta}>{user.completedCount} dreams done</Text>
      </View>
      <Text style={styles.rowPts}>{user.points}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: { paddingVertical: 40, alignItems: 'center' },
  flex: { flex: 1 },
  banner: { borderRadius: radius.card, paddingVertical: 20, marginBottom: 14, ...shadow.md },
  podium: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 14 },
  podiumSpot: { flex: 1, alignItems: 'center' },
  ring: { borderRadius: 999, borderWidth: 3, borderColor: 'rgba(255,255,255,0.7)', padding: 3 },
  rankChip: { marginTop: -12, width: 22, height: 22, borderRadius: 11, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', ...shadow.sm },
  rankChipText: { fontFamily: fonts.displayBlack, fontSize: 11, color: colors.ink },
  podiumName: { fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.white, marginTop: 8 },
  podiumPts: { fontFamily: fonts.bodySemibold, fontSize: 12, color: 'rgba(255,255,255,0.9)' },
  myCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.white,
    borderRadius: radius.card,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.gray100,
    ...shadow.sm,
  },
  myRankBadge: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.pinkSoft, alignItems: 'center', justifyContent: 'center' },
  myRankText: { fontFamily: fonts.displayBlack, fontSize: 17, color: colors.pink },
  myLabel: { fontFamily: fonts.bodySemibold, fontSize: 12, color: colors.gray500 },
  myName: { fontFamily: fonts.displayBold, fontSize: 16, color: colors.ink },
  myPoints: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  myPointsText: { fontFamily: fonts.displayBlack, fontSize: 19, color: colors.ink },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.gray100,
    padding: 12,
    marginBottom: 10,
  },
  rowMe: { borderColor: colors.pink, backgroundColor: colors.pinkSoft },
  rowRank: { fontFamily: fonts.displayBlack, fontSize: 15, color: colors.gray500, width: 24, textAlign: 'center' },
  rowName: { fontFamily: fonts.bodyBold, fontSize: 14.5, color: colors.ink },
  rowMeta: { fontFamily: fonts.body, fontSize: 12, color: colors.gray500, marginTop: 1 },
  rowPts: { fontFamily: fonts.displayBlack, fontSize: 16, color: colors.ink },
});
