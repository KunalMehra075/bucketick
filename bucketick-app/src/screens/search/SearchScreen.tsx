import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BadgeCheck, Search as SearchIcon, UserCheck, UserPlus, X } from 'lucide-react-native';
import { Avatar } from '../../components';
import { colors, fonts, radius, type } from '../../theme';
import { compact } from '../../utils/format';
import { useFollow, useSearchUsers } from '../../hooks';
import type { RootStackParamList, TabParamList } from '../../navigation/types';
import type { SearchUser } from '../../types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Search'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function SearchScreen({ navigation }: Props) {
  const [input, setInput] = useState('');
  const [q, setQ] = useState('');

  // Debounce the query.
  useEffect(() => {
    const t = setTimeout(() => setQ(input.trim()), 300);
    return () => clearTimeout(t);
  }, [input]);

  const { data: users, isLoading } = useSearchUsers(q);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <SafeAreaView edges={['top']} style={styles.flex}>
        <View style={styles.header}>
          <Text style={type.h1}>Search</Text>
        </View>

        <View style={styles.searchBox}>
          <SearchIcon size={19} color={colors.gray500} strokeWidth={2.3} />
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Find people by name or username"
            placeholderTextColor={colors.gray500}
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
          />
          {input.length > 0 ? (
            <Pressable onPress={() => setInput('')} hitSlop={8}>
              <X size={18} color={colors.gray500} strokeWidth={2.4} />
            </Pressable>
          ) : null}
        </View>

        <FlatList
          data={users ?? []}
          keyExtractor={(u) => u.id}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          ListHeaderComponent={
            <Text style={styles.sectionLabel}>{q ? 'Results' : 'Suggested for you'}</Text>
          }
          renderItem={({ item }) => (
            <UserRow user={item} onPress={() => navigation.navigate('Profile', { userId: item.id })} />
          )}
          ListEmptyComponent={
            isLoading ? (
              <View style={styles.loading}>
                <ActivityIndicator color={colors.pink} />
              </View>
            ) : (
              <Text style={styles.empty}>{q ? 'No one matched that. Try another name.' : 'No suggestions right now.'}</Text>
            )
          }
        />
      </SafeAreaView>
    </View>
  );
}

function UserRow({ user, onPress }: { user: SearchUser; onPress: () => void }) {
  const follow = useFollow();
  const [followed, setFollowed] = useState(user.followedByMe);

  const toggle = () => {
    const next = !followed;
    setFollowed(next);
    follow.mutate({ userId: user.id, follow: next }, { onError: () => setFollowed(!next) });
  };

  return (
    <Pressable onPress={onPress} style={styles.row}>
      <Avatar name={user.name} uri={user.avatarUrl} color={user.avatarColor} size={46} />
      <View style={styles.rowBody}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{user.name}</Text>
          {user.verified ? <BadgeCheck size={15} color={colors.blue} strokeWidth={2.5} /> : null}
        </View>
        <Text style={styles.username}>@{user.username} · {compact(user.followersCount)} followers</Text>
      </View>
      <Pressable onPress={toggle} style={[styles.followBtn, followed ? styles.followingBtn : styles.notFollowingBtn]}>
        {followed ? (
          <UserCheck size={15} color={colors.gray700} strokeWidth={2.4} />
        ) : (
          <UserPlus size={15} color={colors.white} strokeWidth={2.4} />
        )}
        <Text style={[styles.followText, { color: followed ? colors.gray700 : colors.white }]}>
          {followed ? 'Following' : 'Follow'}
        </Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cream },
  flex: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 20,
    backgroundColor: colors.white,
    borderRadius: radius.input,
    borderWidth: 1.5,
    borderColor: colors.gray200,
    paddingHorizontal: 14,
    height: 50,
  },
  input: { flex: 1, fontFamily: fonts.body, fontSize: 16, color: colors.ink },
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 120 },
  sectionLabel: { fontFamily: fonts.bodyBold, fontSize: 13, color: colors.gray500, marginBottom: 12 },
  loading: { paddingVertical: 40, alignItems: 'center' },
  empty: { fontFamily: fonts.body, fontSize: 14.5, color: colors.gray500, textAlign: 'center', paddingTop: 20 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  rowBody: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  name: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.ink },
  username: { fontFamily: fonts.body, fontSize: 12.5, color: colors.gray500, marginTop: 1 },
  followBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.pill },
  notFollowingBtn: { backgroundColor: colors.pink },
  followingBtn: { backgroundColor: colors.gray100 },
  followText: { fontFamily: fonts.bodyBold, fontSize: 13 },
});
