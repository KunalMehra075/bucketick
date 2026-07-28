import React from 'react';
import {
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Flame } from 'lucide-react-native';
import { Avatar } from '../../components';
import { colors, fonts, radius, shadow, type } from '../../theme';
import { compact } from '../../utils/format';
import { flattenPages, useExplore } from '../../hooks';
import type { RootStackParamList, TabParamList } from '../../navigation/types';
import type { ExploreItem } from '../../types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Explore'>,
  NativeStackScreenProps<RootStackParamList>
>;

function isNearBottom(e: NativeSyntheticEvent<NativeScrollEvent>): boolean {
  const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
  return layoutMeasurement.height + contentOffset.y >= contentSize.height - 600;
}

export function ExploreScreen({ navigation }: Props) {
  const explore = useExplore();
  const items = flattenPages(explore.data);

  // Balanced two-column masonry by running height (aspect = height/width).
  const cols: ExploreItem[][] = [[], []];
  const heights = [0, 0];
  items.forEach((it) => {
    const c = heights[0] <= heights[1] ? 0 : 1;
    cols[c].push(it);
    heights[c] += it.aspect || 1;
  });

  const openPost = (id: string) => navigation.navigate('PostDetail', { postId: id });

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <SafeAreaView edges={['top']} style={styles.flex}>
        <View style={styles.header}>
          <Text style={type.h1}>Explore</Text>
          <Text style={styles.sub}>Wins worth stealing for your own list</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={explore.isRefetching && !explore.isFetchingNextPage} onRefresh={explore.refetch} tintColor={colors.pink} />}
          scrollEventThrottle={200}
          onScroll={(e) => {
            if (isNearBottom(e) && explore.hasNextPage && !explore.isFetchingNextPage) explore.fetchNextPage();
          }}
        >
          {explore.isLoading ? (
            <View style={styles.loading}>
              <ActivityIndicator color={colors.pink} />
            </View>
          ) : (
            <View style={styles.masonry}>
              {cols.map((col, ci) => (
                <View key={ci} style={styles.col}>
                  {col.map((item) => (
                    <MasonryCell key={item.id} item={item} onPress={() => openPost(item.id)} />
                  ))}
                </View>
              ))}
            </View>
          )}
          {explore.isFetchingNextPage ? <ActivityIndicator color={colors.gray500} style={{ marginVertical: 20 }} /> : null}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function MasonryCell({ item, onPress }: { item: ExploreItem; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.cell}>
      <Image
        source={{ uri: item.thumbnailUrl }}
        style={[styles.cellImg, { aspectRatio: 1 / (item.aspect || 1) }]}
        contentFit="cover"
        transition={150}
      />
      <View style={styles.cellFooter}>
        <Avatar name={item.author.name} uri={item.author.avatarUrl} color={item.author.avatarColor} size={22} />
        <Text style={styles.cellAuthor} numberOfLines={1}>
          {item.author.username}
        </Text>
        <View style={styles.cellHypes}>
          <Flame size={12} color={colors.orange} strokeWidth={2.6} />
          <Text style={styles.cellHypeText}>{compact(item.hypesCount)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cream },
  flex: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  sub: { fontFamily: fonts.body, fontSize: 14, color: colors.gray500, marginTop: 2 },
  content: { paddingHorizontal: 14, paddingBottom: 120 },
  loading: { paddingVertical: 80, alignItems: 'center' },
  masonry: { flexDirection: 'row', gap: 10 },
  col: { flex: 1, gap: 10 },
  cell: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.gray100,
    ...shadow.sm,
  },
  cellImg: { width: '100%', backgroundColor: colors.gray100 },
  cellFooter: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 8 },
  cellAuthor: { flex: 1, fontFamily: fonts.bodySemibold, fontSize: 12, color: colors.gray700 },
  cellHypes: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  cellHypeText: { fontFamily: fonts.bodyBold, fontSize: 11.5, color: colors.gray500 },
});
