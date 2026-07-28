import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import {
  BadgeCheck,
  Bookmark,
  Flame,
  MessageCircle,
  MoreHorizontal,
  Share2,
  Trophy,
} from 'lucide-react-native';
import { Avatar } from '../../components';
import { colors, fonts, radius, shadow, type } from '../../theme';
import { compact, timeAgo } from '../../utils/format';
import { useBookmark, useDeletePost, useHype } from '../../hooks';
import { useMe } from '../../hooks';
import type { Post } from '../../types';

const CARD_WIDTH = Dimensions.get('window').width - 32;

interface PostCardProps {
  post: Post;
  onOpenComments: () => void;
  onOpenAuthor: () => void;
}

export function PostCard({ post, onOpenComments, onOpenAuthor }: PostCardProps) {
  const { data: me } = useMe();
  const hypeMut = useHype(post.id);
  const bookmarkMut = useBookmark(post.id);
  const deleteMut = useDeletePost();

  // Optimistic local state, reset when the cell is recycled for another post.
  const [hyped, setHyped] = useState(post.hypedByMe);
  const [hypes, setHypes] = useState(post.hypesCount);
  const [bookmarked, setBookmarked] = useState(post.bookmarkedByMe);
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    setHyped(post.hypedByMe);
    setHypes(post.hypesCount);
    setBookmarked(post.bookmarkedByMe);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.id]);

  const toggleHype = () => {
    const next = !hyped;
    setHyped(next);
    setHypes((c) => c + (next ? 1 : -1));
    hypeMut.mutate(next, {
      onError: () => {
        setHyped(!next);
        setHypes((c) => c + (next ? -1 : 1));
      },
    });
  };

  const toggleBookmark = () => {
    const next = !bookmarked;
    setBookmarked(next);
    bookmarkMut.mutate(next, { onError: () => setBookmarked(!next) });
  };

  const share = () => {
    Share.share({ message: `${post.author.name} on Bucketick: ${post.caption}` }).catch(() => {});
  };

  const openMenu = () => {
    if (me?.id !== post.author.id) return;
    Alert.alert('Post options', undefined, [
      {
        text: 'Delete post',
        style: 'destructive',
        onPress: () =>
          Alert.alert('Delete this post?', 'This cannot be undone.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => deleteMut.mutate(post.id) },
          ]),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const onScrollImages = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setImgIndex(Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH));
  };

  const imageHeight = Math.min(CARD_WIDTH * post.coverAspect, CARD_WIDTH * 1.4);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Pressable onPress={onOpenAuthor} style={styles.authorRow} hitSlop={6}>
          <Avatar name={post.author.name} uri={post.author.avatarUrl} color={post.author.avatarColor} size={42} />
          <View>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{post.author.name}</Text>
              {post.author.verified ? <BadgeCheck size={15} color={colors.blue} strokeWidth={2.5} /> : null}
            </View>
            <Text style={styles.meta}>
              @{post.author.username} · {timeAgo(post.createdAt)}
            </Text>
          </View>
        </Pressable>
        {me?.id === post.author.id ? (
          <Pressable onPress={openMenu} hitSlop={10}>
            <MoreHorizontal size={20} color={colors.gray500} strokeWidth={2.2} />
          </Pressable>
        ) : null}
      </View>

      {post.achievement ? (
        <View style={styles.achievement}>
          <Trophy size={14} color={colors.orange} strokeWidth={2.6} />
          <Text style={styles.achievementText} numberOfLines={1}>
            {post.achievement.title}
          </Text>
        </View>
      ) : null}

      {post.caption ? <Text style={styles.caption}>{post.caption}</Text> : null}

      {post.images.length > 0 ? (
        <View style={styles.media}>
          {post.images.length === 1 ? (
            <Image source={{ uri: post.images[0] }} style={{ width: '100%', height: imageHeight }} contentFit="cover" transition={150} />
          ) : (
            <>
              <FlatList
                data={post.images}
                keyExtractor={(u, i) => `${u}-${i}`}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onScrollImages}
                scrollEventThrottle={16}
                renderItem={({ item }) => (
                  <Image source={{ uri: item }} style={{ width: CARD_WIDTH, height: imageHeight }} contentFit="cover" transition={150} />
                )}
              />
              <View style={styles.dots}>
                {post.images.map((u, i) => (
                  <View key={u} style={[styles.dot, i === imgIndex && styles.dotActive]} />
                ))}
              </View>
            </>
          )}
        </View>
      ) : null}

      <View style={styles.actions}>
        <Pressable onPress={toggleHype} style={styles.action} hitSlop={8}>
          <Flame size={23} color={hyped ? colors.orange : colors.gray700} strokeWidth={2.3} fill={hyped ? colors.orange : 'transparent'} />
          {hypes > 0 ? <Text style={[styles.actionCount, hyped && { color: colors.orange }]}>{compact(hypes)}</Text> : null}
        </Pressable>
        <Pressable onPress={onOpenComments} style={styles.action} hitSlop={8}>
          <MessageCircle size={22} color={colors.gray700} strokeWidth={2.3} />
          {post.commentsCount > 0 ? <Text style={styles.actionCount}>{compact(post.commentsCount)}</Text> : null}
        </Pressable>
        <Pressable onPress={share} style={styles.action} hitSlop={8}>
          <Share2 size={21} color={colors.gray700} strokeWidth={2.3} />
        </Pressable>
        <View style={styles.flex} />
        <Pressable onPress={toggleBookmark} hitSlop={8}>
          <Bookmark size={22} color={bookmarked ? colors.pink : colors.gray700} strokeWidth={2.3} fill={bookmarked ? colors.pink : 'transparent'} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.gray100,
    marginBottom: 14,
    overflow: 'hidden',
    ...shadow.sm,
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  name: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.ink },
  meta: { fontFamily: fonts.body, fontSize: 12.5, color: colors.gray500, marginTop: 1 },
  achievement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    marginHorizontal: 14,
    marginBottom: 10,
    backgroundColor: colors.orangeSoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  achievementText: { fontFamily: fonts.bodyBold, fontSize: 12.5, color: colors.orange, maxWidth: 240 },
  caption: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: colors.ink,
    paddingHorizontal: 14,
    paddingBottom: 12,
  },
  media: { backgroundColor: colors.gray100 },
  dots: { position: 'absolute', bottom: 10, alignSelf: 'center', flexDirection: 'row', gap: 5 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.6)' },
  dotActive: { backgroundColor: colors.white, width: 16 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 18, padding: 14 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionCount: { fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.gray700 },
  flex: { flex: 1 },
});
