import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, Send } from 'lucide-react-native';
import { Avatar } from '../../components';
import { colors, fonts, radius, type } from '../../theme';
import { timeAgo } from '../../utils/format';
import { flattenPages, useAddComment, useComments, usePost } from '../../hooks';
import type { RootStackParamList } from '../../navigation/types';
import type { Comment } from '../../types';
import { PostCard } from './PostCard';

type Props = NativeStackScreenProps<RootStackParamList, 'PostDetail'>;

export function PostDetailScreen({ navigation, route }: Props) {
  const { postId } = route.params;
  const { data: post, isLoading } = usePost(postId);
  const comments = useComments(postId);
  const addComment = useAddComment(postId);
  const [text, setText] = useState('');

  const list = flattenPages(comments.data);

  const send = () => {
    const body = text.trim();
    if (!body || addComment.isPending) return;
    setText('');
    addComment.mutate(body);
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.flex}>
        <View style={styles.nav}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.navBtn}>
            <ArrowLeft size={22} color={colors.ink} strokeWidth={2.4} />
          </Pressable>
          <Text style={type.h3}>Post</Text>
          <View style={{ width: 40 }} />
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex} keyboardVerticalOffset={8}>
          <FlatList
            data={list}
            keyExtractor={(c) => c.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
            onEndReachedThreshold={0.5}
            onEndReached={() => {
              if (comments.hasNextPage && !comments.isFetchingNextPage) comments.fetchNextPage();
            }}
            ListHeaderComponent={
              isLoading || !post ? (
                <View style={styles.loading}>
                  <ActivityIndicator color={colors.pink} />
                </View>
              ) : (
                <View>
                  <PostCard
                    post={post}
                    onOpenComments={() => {}}
                    onOpenAuthor={() => navigation.navigate('Profile', { userId: post.author.id })}
                  />
                  <Text style={[type.label, styles.commentsLabel]}>
                    {post.commentsCount > 0 ? `Comments (${post.commentsCount})` : 'Be the first to comment'}
                  </Text>
                </View>
              )
            }
            renderItem={({ item }) => <CommentRow comment={item} onAuthor={() => navigation.navigate('Profile', { userId: item.author.id })} />}
          />

          <View style={styles.composer}>
            <TextInputComposer value={text} onChange={setText} onSend={send} sending={addComment.isPending} />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

function CommentRow({ comment, onAuthor }: { comment: Comment; onAuthor: () => void }) {
  return (
    <View style={styles.commentRow}>
      <Pressable onPress={onAuthor} hitSlop={4}>
        <Avatar name={comment.author.name} uri={comment.author.avatarUrl} color={comment.author.avatarColor} size={36} />
      </Pressable>
      <View style={styles.commentBody}>
        <View style={styles.commentHead}>
          <Text style={styles.commentName}>{comment.author.name}</Text>
          <Text style={styles.commentTime}>{timeAgo(comment.createdAt)}</Text>
        </View>
        <Text style={styles.commentText}>{comment.body}</Text>
      </View>
    </View>
  );
}

// Small wrapper to keep the composer tidy.
function TextInputComposer({
  value,
  onChange,
  onSend,
  sending,
}: {
  value: string;
  onChange: (t: string) => void;
  onSend: () => void;
  sending: boolean;
}) {
  const canSend = value.trim().length > 0 && !sending;
  return (
    <View style={styles.composerInner}>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Add a supportive comment"
        placeholderTextColor={colors.gray500}
        style={styles.input}
        multiline
      />
      <Pressable onPress={onSend} disabled={!canSend} style={[styles.sendBtn, { opacity: canSend ? 1 : 0.4 }]}>
        <Send size={18} color={colors.white} strokeWidth={2.5} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cream },
  flex: { flex: 1 },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 8 },
  navBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: 16, paddingBottom: 20 },
  loading: { paddingVertical: 60, alignItems: 'center' },
  commentsLabel: { marginTop: 6, marginBottom: 12, marginLeft: 2 },
  commentRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  commentBody: { flex: 1 },
  commentHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  commentName: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.ink },
  commentTime: { fontFamily: fonts.body, fontSize: 12, color: colors.gray500 },
  commentText: { fontFamily: fonts.body, fontSize: 14.5, lineHeight: 21, color: colors.gray700, marginTop: 2 },
  composer: { borderTopWidth: 1, borderTopColor: colors.gray100, backgroundColor: colors.white, padding: 10, paddingBottom: 20 },
  composerInner: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  input: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.ink,
    backgroundColor: colors.gray100,
    borderRadius: radius.input,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxHeight: 100,
  },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.pink, alignItems: 'center', justifyContent: 'center' },
});
