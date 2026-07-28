import React from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ListChecks, Plus, Sparkles } from 'lucide-react-native';
import { Avatar, Button, EmptyState } from '../../components';
import { colors, fonts, radius, shadow, type } from '../../theme';
import { overallStats, useLists, useMe } from '../../hooks';
import type { RootStackParamList, TabParamList } from '../../navigation/types';
import { ListCard } from '../home/ListCard';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Lists'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function ListsScreen({ navigation }: Props) {
  const { data: me } = useMe();
  const { data: lists, isLoading, isRefetching, refetch } = useLists();
  const stats = overallStats(lists);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <SafeAreaView edges={['top']} style={styles.flex}>
        <FlatList
          data={lists ?? []}
          keyExtractor={(l) => l.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.pink} />}
          ListHeaderComponent={
            <View>
              <View style={styles.headerRow}>
                <View style={styles.flex}>
                  <Text style={styles.greeting}>Your dream board</Text>
                  <Text style={styles.name}>Bucket lists</Text>
                </View>
                <Pressable onPress={() => navigation.navigate('Profile', {})} hitSlop={8}>
                  <Avatar name={me?.name ?? 'You'} uri={me?.avatarUrl} color={me?.avatarColor ?? 'pink'} size={44} />
                </Pressable>
              </View>

              <LinearGradient
                colors={['#ffbb00', '#ff7a00', '#ff006e', '#8b3dff']}
                locations={[0, 0.28, 0.6, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroCard}
              >
                <View style={styles.heroTop}>
                  <Sparkles size={20} color={colors.white} strokeWidth={2.4} />
                  <Text style={styles.heroLabel}>Progress so far</Text>
                </View>
                <View style={styles.statRow}>
                  <Stat value={stats.total} label="Dreams" />
                  <View style={styles.divider} />
                  <Stat value={stats.active} label="Chasing" />
                  <View style={styles.divider} />
                  <Stat value={stats.done} label="Done" />
                </View>
              </LinearGradient>

              <View style={styles.sectionRow}>
                <Text style={type.h2}>My lists</Text>
                <Text style={styles.sectionCount}>{lists?.length ?? 0}</Text>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <ListCard
              list={item}
              total={item.itemsCount}
              done={item.completedCount}
              ratio={item.itemsCount ? item.completedCount / item.itemsCount : 0}
              onPress={() => navigation.navigate('ListDetail', { listId: item.id })}
            />
          )}
          ListEmptyComponent={
            isLoading ? (
              <View style={styles.loading}>
                <ActivityIndicator color={colors.pink} />
              </View>
            ) : (
              <EmptyState
                icon={<ListChecks size={34} color={colors.orange} strokeWidth={2.2} />}
                title="No lists yet"
                message="Every great adventure starts with someone writing it down. Might as well be you."
                action={
                  <Button
                    label="Create your first list"
                    icon={<Plus size={20} color={colors.white} strokeWidth={2.6} />}
                    onPress={() => navigation.navigate('ListForm', {})}
                  />
                }
              />
            )
          }
        />

        {(lists?.length ?? 0) > 0 ? (
          <Pressable
            onPress={() => navigation.navigate('ListForm', {})}
            style={({ pressed }) => [styles.fab, { transform: [{ scale: pressed ? 0.95 : 1 }] }]}
          >
            <LinearGradient colors={['#ffbb00', '#ff006e']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.fabInner}>
              <Plus size={26} color={colors.white} strokeWidth={2.8} />
            </LinearGradient>
          </Pressable>
        ) : null}
      </SafeAreaView>
    </View>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cream },
  flex: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 120 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  greeting: { fontFamily: fonts.body, fontSize: 14, color: colors.gray500 },
  name: { fontFamily: fonts.displayBlack, fontSize: 26, color: colors.ink, letterSpacing: -0.6 },
  heroCard: { borderRadius: radius.card, padding: 22, ...shadow.md },
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 18 },
  heroLabel: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.white, letterSpacing: 0.3 },
  statRow: { flexDirection: 'row', alignItems: 'center' },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontFamily: fonts.displayBlack, fontSize: 30, color: colors.white, letterSpacing: -0.5 },
  statLabel: { fontFamily: fonts.bodySemibold, fontSize: 12.5, color: 'rgba(255,255,255,0.9)', marginTop: 2 },
  divider: { width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.3)' },
  sectionRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 28, marginBottom: 16 },
  sectionCount: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    color: colors.gray500,
    backgroundColor: colors.gray100,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    overflow: 'hidden',
  },
  loading: { paddingVertical: 60, alignItems: 'center' },
  fab: { position: 'absolute', right: 20, bottom: 90 },
  fabInner: { width: 60, height: 60, borderRadius: 20, alignItems: 'center', justifyContent: 'center', ...shadow.lg },
});
