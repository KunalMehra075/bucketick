import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, UserCheck, UserPlus } from 'lucide-react-native';
import { Avatar } from '../../components';
import { colors, fonts, radius, shadow, type } from '../../theme';
import { useConnections, useFollow } from '../../hooks';
import type { RootStackParamList } from '../../navigation/types';
import type { Connection } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Connections'>;
type Tab = 'followers' | 'following';

export function ConnectionsScreen({ navigation, route }: Props) {
  const [tab, setTab] = useState<Tab>(route.params?.tab ?? 'followers');
  const { data, isLoading } = useConnections(tab);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <SafeAreaView edges={['top']} style={styles.flex}>
        <View style={styles.nav}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.navBtn}>
            <ArrowLeft size={22} color={colors.ink} strokeWidth={2.4} />
          </Pressable>
          <Text style={type.h3}>People</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.tabs}>
          <TabButton label="Followers" active={tab === 'followers'} onPress={() => setTab('followers')} />
          <TabButton label="Following" active={tab === 'following'} onPress={() => setTab('following')} />
        </View>

        <FlatList
          data={data ?? []}
          keyExtractor={(c) => c.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          renderItem={({ item }) => (
            <ConnectionRow connection={item} onPress={() => navigation.navigate('Profile', { userId: item.id })} />
          )}
          ListEmptyComponent={
            isLoading ? (
              <View style={styles.loading}>
                <ActivityIndicator color={colors.pink} />
              </View>
            ) : (
              <Text style={styles.empty}>{tab === 'followers' ? 'No followers yet.' : 'Not following anyone yet.'}</Text>
            )
          }
        />
      </SafeAreaView>
    </View>
  );
}

function ConnectionRow({ connection, onPress }: { connection: Connection; onPress: () => void }) {
  const follow = useFollow();
  const [following, setFollowing] = useState(connection.following);
  const toggle = () => {
    const next = !following;
    setFollowing(next);
    follow.mutate({ userId: connection.id, follow: next }, { onError: () => setFollowing(!next) });
  };
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <Avatar name={connection.name} uri={connection.avatarUrl} color={connection.avatarColor} size={46} />
      <View style={styles.rowBody}>
        <Text style={styles.name}>{connection.name}</Text>
        <Text style={styles.username}>@{connection.username}</Text>
      </View>
      <Pressable onPress={toggle} style={[styles.followBtn, following ? styles.followingBtn : styles.notFollowingBtn]}>
        {following ? <UserCheck size={15} color={colors.gray700} strokeWidth={2.4} /> : <UserPlus size={15} color={colors.white} strokeWidth={2.4} />}
        <Text style={[styles.followText, { color: following ? colors.gray700 : colors.white }]}>{following ? 'Following' : 'Follow'}</Text>
      </Pressable>
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
  tabs: { flexDirection: 'row', backgroundColor: colors.gray100, borderRadius: radius.pill, padding: 4, marginHorizontal: 20, marginTop: 8, marginBottom: 12 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: radius.pill },
  tabActive: { backgroundColor: colors.white, ...shadow.sm },
  tabText: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.gray500 },
  tabTextActive: { color: colors.ink },
  content: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 40 },
  loading: { paddingVertical: 40, alignItems: 'center' },
  empty: { fontFamily: fonts.body, fontSize: 14.5, color: colors.gray500, textAlign: 'center', paddingTop: 20 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  rowBody: { flex: 1 },
  name: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.ink },
  username: { fontFamily: fonts.body, fontSize: 12.5, color: colors.gray500, marginTop: 1 },
  followBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.pill },
  notFollowingBtn: { backgroundColor: colors.pink },
  followingBtn: { backgroundColor: colors.gray100 },
  followText: { fontFamily: fonts.bodyBold, fontSize: 13 },
});
