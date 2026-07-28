import React, { useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, MoreHorizontal, Plus, Sparkles } from 'lucide-react-native';
import { EmptyState, ProgressBar } from '../../components';
import { accentPairs, colors, fonts, gradients, radius, shadow, type } from '../../theme';
import {
  useAddItem,
  useDeleteItem,
  useDeleteList,
  useListItems,
  useLists,
  useSetItemStatus,
  useUpdateItem,
} from '../../hooks';
import type { RootStackParamList } from '../../navigation/types';
import type { BucketItem } from '../../types';
import { ItemRow } from './ItemRow';
import { ItemEditorModal } from './ItemEditorModal';

type Props = NativeStackScreenProps<RootStackParamList, 'ListDetail'>;

export function ListDetailScreen({ navigation, route }: Props) {
  const { listId } = route.params;
  const { data: lists } = useLists();
  const list = lists?.find((l) => l.id === listId);
  const { data: items, isLoading: loading } = useListItems(listId);

  const addItem = useAddItem(listId);
  const updateItem = useUpdateItem(listId);
  const setItemStatus = useSetItemStatus(listId);
  const deleteItem = useDeleteItem(listId);
  const deleteList = useDeleteList();

  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<BucketItem | null>(null);

  const scoped = items ?? [];
  const done = scoped.filter((i) => i.status === 'completed').length;
  const ratio = scoped.length ? done / scoped.length : 0;

  if (!list) {
    return (
      <SafeAreaView style={styles.root}>
        <Text style={[type.body, { textAlign: 'center', marginTop: 40 }]}>This list is gone.</Text>
      </SafeAreaView>
    );
  }

  const pair = accentPairs[list.accent];
  const gradientForAccent =
    list.accent === 'purple' || list.accent === 'pink' ? gradients.dusk : gradients.sunrise;

  const openCreate = () => {
    setEditing(null);
    setEditorOpen(true);
  };
  const openEdit = (item: BucketItem) => {
    setEditing(item);
    setEditorOpen(true);
  };

  const onSave = async (data: { title: string; note?: string; location?: string }) => {
    if (editing) {
      await updateItem.mutateAsync({ id: editing.id, patch: data });
    } else {
      await addItem.mutateAsync(data);
    }
  };

  const onToggle = async (item: BucketItem) => {
    const next = item.status === 'completed' ? 'dreaming' : 'completed';
    try {
      await setItemStatus.mutateAsync({ id: item.id, status: next });
    } catch (e) {
      Alert.alert('Could not update', e instanceof Error ? e.message : 'Please try again.');
    }
  };

  const onDeleteItem = async () => {
    if (!editing) return;
    try {
      await deleteItem.mutateAsync(editing.id);
    } catch (e) {
      Alert.alert('Could not delete', e instanceof Error ? e.message : 'Please try again.');
    }
  };

  const openMenu = () => {
    Alert.alert(list.title, undefined, [
      { text: 'Edit list', onPress: () => navigation.navigate('ListForm', { listId }) },
      {
        text: 'Delete list',
        style: 'destructive',
        onPress: () =>
          Alert.alert('Delete this list?', 'This removes the list and every dream inside it. There is no undo.', [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: async () => {
                try {
                  await deleteList.mutateAsync(listId);
                  navigation.goBack();
                } catch (e) {
                  Alert.alert('Could not delete', e instanceof Error ? e.message : 'Please try again.');
                }
              },
            },
          ]),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <LinearGradient
        colors={gradientForAccent.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <SafeAreaView edges={['top']}>
          <View style={styles.navRow}>
            <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.navBtn}>
              <ArrowLeft size={22} color={colors.white} strokeWidth={2.4} />
            </Pressable>
            <Pressable onPress={openMenu} hitSlop={10} style={styles.navBtn}>
              <MoreHorizontal size={22} color={colors.white} strokeWidth={2.4} />
            </Pressable>
          </View>

          <View style={styles.heroBody}>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryText}>{list.category}</Text>
            </View>
            <Text style={styles.heroTitle}>{list.title}</Text>
            {list.description ? <Text style={styles.heroDesc}>{list.description}</Text> : null}

            <View style={styles.progressCard}>
              <View style={styles.progressTop}>
                <Text style={styles.progressCount}>
                  {done} of {scoped.length} done
                </Text>
                <Text style={styles.progressPct}>{Math.round(ratio * 100)}%</Text>
              </View>
              <ProgressBar ratio={ratio} height={10} track="rgba(255,255,255,0.35)" />
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <FlatList
        data={scoped}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Pressable onPress={openCreate} style={styles.addRow}>
            <View style={[styles.addIcon, { backgroundColor: pair.soft }]}>
              <Plus size={20} color={pair.solid} strokeWidth={2.8} />
            </View>
            <Text style={styles.addText}>Add a dream</Text>
          </Pressable>
        }
        renderItem={({ item }) => (
          <ItemRow item={item} onToggle={() => onToggle(item)} onEdit={() => openEdit(item)} />
        )}
        ListEmptyComponent={
          loading ? (
            <View style={styles.loading}>
              <ActivityIndicator color={pair.solid} />
            </View>
          ) : (
            <EmptyState
              icon={<Sparkles size={32} color={pair.solid} strokeWidth={2.2} />}
              title="An empty canvas"
              message="Add the first dream to this list. Big, small, or gloriously unrealistic. All welcome."
            />
          )
        }
      />

      <ItemEditorModal
        visible={editorOpen}
        item={editing}
        onClose={() => setEditorOpen(false)}
        onSave={onSave}
        onDelete={editing ? onDeleteItem : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cream },
  hero: { borderBottomLeftRadius: 30, borderBottomRightRadius: 30, ...shadow.md },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8 },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBody: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 24 },
  categoryTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.24)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: 14,
  },
  categoryText: { fontFamily: fonts.bodyBold, fontSize: 12.5, color: colors.white, letterSpacing: 0.3 },
  heroTitle: { fontFamily: fonts.displayBlack, fontSize: 28, lineHeight: 34, color: colors.white, letterSpacing: -0.6 },
  heroDesc: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22, color: 'rgba(255,255,255,0.92)', marginTop: 8 },
  progressCard: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: radius.card,
    padding: 16,
    marginTop: 20,
  },
  progressTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  progressCount: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.white },
  progressPct: { fontFamily: fonts.displayBlack, fontSize: 18, color: colors.white },
  list: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 130 },
  loading: { paddingVertical: 50, alignItems: 'center' },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: radius.card,
    borderWidth: 1.5,
    borderColor: colors.gray100,
    borderStyle: 'dashed',
    padding: 14,
    marginBottom: 14,
  },
  addIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  addText: { fontFamily: fonts.bodyBold, fontSize: 15.5, color: colors.ink },
});
