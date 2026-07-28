import React from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Bell, Sparkles } from 'lucide-react-native';
import { Avatar, Button, EmptyState, Wordmark } from '../../components';
import { colors, fonts } from '../../theme';
import { flattenPages, useFeed, useMe } from '../../hooks';
import type { RootStackParamList, TabParamList } from '../../navigation/types';
import { PostCard } from './PostCard';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function FeedScreen({ navigation }: Props) {
  const { data: me } = useMe();
  const feed = useFeed();
  const posts = flattenPages(feed.data);
  const firstLoad = feed.isLoading;

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <SafeAreaView edges={['top']} style={styles.flex}>
        <View style={styles.topBar}>
          <Wordmark height={24} />
          <View style={styles.headerRight}>
            <Pressable style={styles.bell} hitSlop={8}>
              <Bell size={24} color={colors.ink} strokeWidth={2.2} />
              <View style={styles.bellDot} />
            </Pressable>
            <Pressable onPress={() => navigation.navigate('Profile', {})} hitSlop={8}>
              <Avatar name={me?.name ?? 'You'} uri={me?.avatarUrl} color={me?.avatarColor ?? 'pink'} size={38} />
            </Pressable>
          </View>
        </View>

        <FlatList
          data={posts}
          keyExtractor={(p) => p.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl refreshing={feed.isRefetching && !feed.isFetchingNextPage} onRefresh={feed.refetch} tintColor={colors.pink} />
          }
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            if (feed.hasNextPage && !feed.isFetchingNextPage) feed.fetchNextPage();
          }}
          renderItem={({ item }) => (
            <PostCard
              post={item}
              onOpenComments={() => navigation.navigate('PostDetail', { postId: item.id })}
              onOpenAuthor={() => navigation.navigate('Profile', { userId: item.author.id })}
            />
          )}
          ListEmptyComponent={
            firstLoad ? (
              <View style={styles.loading}>
                <ActivityIndicator color={colors.pink} />
              </View>
            ) : (
              <EmptyState
                icon={<Sparkles size={32} color={colors.pink} strokeWidth={2.2} />}
                title="Your feed is quiet"
                message="Follow a few people, or be the one who starts. Share a win and get the good vibes rolling."
                action={<Button label="Share a win" onPress={() => navigation.navigate('CreatePost')} />}
              />
            )
          }
          ListFooterComponent={
            feed.isFetchingNextPage ? (
              <View style={styles.footer}>
                <ActivityIndicator color={colors.gray500} />
              </View>
            ) : null
          }
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cream },
  flex: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  bell: { padding: 2 },
  bellDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.pink,
    borderWidth: 1.5,
    borderColor: colors.cream,
  },
  content: { paddingHorizontal: 16, paddingTop: 6, paddingBottom: 120 },
  loading: { paddingVertical: 80, alignItems: 'center' },
  footer: { paddingVertical: 20 },
});
