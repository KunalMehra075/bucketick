import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, BadgeCheck, Flame, LogOut, Pencil, UserCheck, UserPlus } from 'lucide-react-native';
import { Avatar } from '../../components';
import { colors, fonts, radius, shadow, type } from '../../theme';
import { flattenPages, useFollow, useLists, useLogout, useMe, useUser, useUserPosts } from '../../hooks';
import { ListCard } from '../home/ListCard';
import { LeaderboardView } from './LeaderboardView';
import type { RootStackParamList } from '../../navigation/types';
import type { Post } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;
type Tab = 'posts' | 'lists' | 'ranks';

const { width } = Dimensions.get('window');
const TILE = (width - 40 - 12) / 3;

export function ProfileScreen({ navigation, route }: Props) {
  const { data: me } = useMe();
  const paramId = route.params?.userId;
  const isOwn = !paramId || paramId === me?.id;
  const targetId = isOwn ? me?.id ?? '' : paramId!;

  const other = useUser(isOwn ? '' : paramId!);
  const header = isOwn ? me : other.data;

  const userPosts = useUserPosts(targetId);
  const posts = flattenPages(userPosts.data);
  const { data: lists } = useLists();
  const logout = useLogout();

  const [tab, setTab] = useState<Tab>('posts');

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
    if (
      tab === 'posts' &&
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 400 &&
      userPosts.hasNextPage &&
      !userPosts.isFetchingNextPage
    ) {
      userPosts.fetchNextPage();
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <SafeAreaView edges={['top']} style={styles.flex}>
        <View style={styles.nav}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.navBtn}>
            <ArrowLeft size={22} color={colors.ink} strokeWidth={2.4} />
          </Pressable>
          <Text style={styles.navTitle} numberOfLines={1}>
            @{header?.username ?? ''}
          </Text>
          {isOwn ? (
            <Pressable onPress={() => logout.mutate()} hitSlop={10} style={styles.navBtn}>
              <LogOut size={20} color={colors.pink} strokeWidth={2.3} />
            </Pressable>
          ) : (
            <View style={{ width: 40 }} />
          )}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} onScroll={onScroll} scrollEventThrottle={200}>
          {/* Header */}
          <View style={styles.headerBlock}>
            <Avatar name={header?.name ?? 'You'} uri={header?.avatarUrl} color={header?.avatarColor ?? 'pink'} size={92} />
            <View style={styles.nameRow}>
              <Text style={styles.name}>{header?.name ?? ''}</Text>
              {header?.verified ? <BadgeCheck size={18} color={colors.blue} strokeWidth={2.5} /> : null}
            </View>
            {header?.bio ? <Text style={styles.bio}>{header.bio}</Text> : null}

            <View style={styles.statsRow}>
              <Stat value={header?.postsCount ?? 0} label="Posts" />
              <StatButton value={header?.followersCount ?? 0} label="Followers" onPress={isOwn ? () => navigation.navigate('Connections', { tab: 'followers' }) : undefined} />
              <StatButton value={header?.followingCount ?? 0} label="Following" onPress={isOwn ? () => navigation.navigate('Connections', { tab: 'following' }) : undefined} />
            </View>

            {isOwn ? (
              <Pressable onPress={() => navigation.navigate('EditProfile')} style={styles.editBtn}>
                <Pencil size={16} color={colors.ink} strokeWidth={2.3} />
                <Text style={styles.editText}>Edit profile</Text>
              </Pressable>
            ) : (
              <FollowButton userId={targetId} initial={other.data?.followedByMe ?? false} />
            )}
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            <TabButton label="Posts" active={tab === 'posts'} onPress={() => setTab('posts')} />
            {isOwn ? <TabButton label="Lists" active={tab === 'lists'} onPress={() => setTab('lists')} /> : null}
            {isOwn ? <TabButton label="Ranks" active={tab === 'ranks'} onPress={() => setTab('ranks')} /> : null}
          </View>

          {/* Content */}
          {tab === 'posts' ? (
            <PostsGrid posts={posts} loading={userPosts.isLoading} onOpen={(id) => navigation.navigate('PostDetail', { postId: id })} />
          ) : tab === 'lists' ? (
            <View style={styles.listsWrap}>
              {(lists ?? []).length === 0 ? (
                <Text style={styles.emptyTab}>No lists yet.</Text>
              ) : (
                (lists ?? []).map((l) => (
                  <ListCard
                    key={l.id}
                    list={l}
                    total={l.itemsCount}
                    done={l.completedCount}
                    ratio={l.itemsCount ? l.completedCount / l.itemsCount : 0}
                    onPress={() => navigation.navigate('ListDetail', { listId: l.id })}
                  />
                ))
              )}
            </View>
          ) : (
            <LeaderboardView />
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function PostsGrid({ posts, loading, onOpen }: { posts: Post[]; loading: boolean; onOpen: (id: string) => void }) {
  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.pink} />
      </View>
    );
  }
  if (posts.length === 0) return <Text style={styles.emptyTab}>No posts yet.</Text>;
  return (
    <View style={styles.grid}>
      {posts.map((p) => (
        <Pressable key={p.id} onPress={() => onOpen(p.id)} style={styles.tile}>
          {p.images.length > 0 ? (
            <Image source={{ uri: p.images[0] }} style={styles.tileImg} contentFit="cover" transition={120} />
          ) : (
            <View style={styles.tileText}>
              <Text style={styles.tileCaption} numberOfLines={4}>
                {p.caption}
              </Text>
            </View>
          )}
          {p.hypesCount > 0 ? (
            <View style={styles.tileHype}>
              <Flame size={11} color={colors.white} strokeWidth={2.6} />
              <Text style={styles.tileHypeText}>{p.hypesCount}</Text>
            </View>
          ) : null}
        </Pressable>
      ))}
    </View>
  );
}

function FollowButton({ userId, initial }: { userId: string; initial: boolean }) {
  const follow = useFollow();
  const [followed, setFollowed] = useState(initial);
  const toggle = () => {
    const next = !followed;
    setFollowed(next);
    follow.mutate({ userId, follow: next }, { onError: () => setFollowed(!next) });
  };
  return (
    <Pressable onPress={toggle} style={[styles.followBtn, followed ? styles.followingBtn : styles.notFollowingBtn]}>
      {followed ? <UserCheck size={17} color={colors.ink} strokeWidth={2.4} /> : <UserPlus size={17} color={colors.white} strokeWidth={2.4} />}
      <Text style={[styles.followText, { color: followed ? colors.ink : colors.white }]}>{followed ? 'Following' : 'Follow'}</Text>
    </Pressable>
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
function StatButton({ value, label, onPress }: { value: number; label: string; onPress?: () => void }) {
  return (
    <Pressable style={styles.stat} onPress={onPress} disabled={!onPress}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Pressable>
  );
}
function TabButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.tab, active && styles.tabActive]}>
      <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cream },
  flex: { flex: 1 },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 8 },
  navBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  navTitle: { fontFamily: fonts.displayBold, fontSize: 17, color: colors.ink, flex: 1, textAlign: 'center' },
  content: { paddingBottom: 40 },
  headerBlock: { alignItems: 'center', paddingHorizontal: 24, paddingTop: 8, paddingBottom: 8 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 12 },
  name: { fontFamily: fonts.displayBlack, fontSize: 22, color: colors.ink, letterSpacing: -0.4 },
  bio: { fontFamily: fonts.body, fontSize: 14.5, lineHeight: 21, color: colors.gray700, textAlign: 'center', marginTop: 8, maxWidth: 300 },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 18, gap: 8 },
  stat: { alignItems: 'center', paddingHorizontal: 18 },
  statValue: { fontFamily: fonts.displayBlack, fontSize: 20, color: colors.ink },
  statLabel: { fontFamily: fonts.bodySemibold, fontSize: 12.5, color: colors.gray500, marginTop: 1 },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 18,
    paddingHorizontal: 22,
    height: 44,
    borderRadius: radius.button,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.gray200,
    ...shadow.sm,
  },
  editText: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.ink },
  followBtn: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 18, paddingHorizontal: 40, height: 44, borderRadius: radius.button },
  notFollowingBtn: { backgroundColor: colors.pink },
  followingBtn: { backgroundColor: colors.gray100 },
  followText: { fontFamily: fonts.bodyBold, fontSize: 15 },
  tabs: { flexDirection: 'row', backgroundColor: colors.gray100, borderRadius: radius.pill, padding: 4, marginHorizontal: 20, marginTop: 22, marginBottom: 16 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: radius.pill },
  tabActive: { backgroundColor: colors.white, ...shadow.sm },
  tabText: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.gray500 },
  tabTextActive: { color: colors.ink },
  loading: { paddingVertical: 40, alignItems: 'center' },
  emptyTab: { fontFamily: fonts.body, fontSize: 14.5, color: colors.gray500, textAlign: 'center', paddingVertical: 30 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: 20 },
  tile: { width: TILE, height: TILE, borderRadius: radius.input, overflow: 'hidden', backgroundColor: colors.gray100 },
  tileImg: { width: '100%', height: '100%' },
  tileText: { flex: 1, backgroundColor: colors.purpleSoft, padding: 8, justifyContent: 'center' },
  tileCaption: { fontFamily: fonts.bodySemibold, fontSize: 11.5, color: colors.purple, lineHeight: 15 },
  tileHype: { position: 'absolute', bottom: 6, left: 6, flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: 'rgba(15,15,18,0.5)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 999 },
  tileHypeText: { fontFamily: fonts.bodyBold, fontSize: 10.5, color: colors.white },
  listsWrap: { paddingHorizontal: 20 },
});
