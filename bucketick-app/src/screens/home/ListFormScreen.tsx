import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Check, Globe, Lock, X } from 'lucide-react-native';
import { Button, Chip, Field, SampleImagePicker } from '../../components';
import { accentPairs, BrandColor, colors, fonts, radius, type } from '../../theme';
import { CATEGORIES } from '../../data/seed';
import { useCreateList, useLists, useUpdateList } from '../../hooks';
import type { RootStackParamList } from '../../navigation/types';
import type { Visibility } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'ListForm'>;

const ACCENTS: BrandColor[] = ['pink', 'blue', 'orange', 'purple', 'yellow'];

export function ListFormScreen({ navigation, route }: Props) {
  const listId = route.params?.listId;
  const { data: lists } = useLists();
  const existing = listId ? lists?.find((l) => l.id === listId) : undefined;
  const createList = useCreateList();
  const updateList = useUpdateList();

  const isEdit = Boolean(existing);
  const [title, setTitle] = useState(existing?.title ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [category, setCategory] = useState<string>(existing?.category ?? CATEGORIES[0]);
  const [accent, setAccent] = useState<BrandColor>(existing?.accent ?? 'pink');
  const [visibility, setVisibility] = useState<Visibility>(existing?.visibility ?? 'public');
  const [cover, setCover] = useState<string[]>(existing?.coverUrl ? [existing.coverUrl] : []);

  const [saving, setSaving] = useState(false);
  const canSave = title.trim().length >= 2 && !saving;

  const save = async () => {
    if (!canSave) return;
    const payload = { title, description, category, accent, visibility, coverUrl: cover[0] ?? null };
    setSaving(true);
    try {
      if (isEdit && listId) {
        await updateList.mutateAsync({ id: listId, patch: payload });
        navigation.goBack();
      } else {
        const created = await createList.mutateAsync(payload);
        navigation.goBack();
        // Jump straight into the fresh list so they can start adding dreams.
        navigation.navigate('ListDetail', { listId: created.id });
      }
    } catch (e) {
      Alert.alert('Could not save', e instanceof Error ? e.message : 'Please try again.');
      setSaving(false);
    }
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.flex}>
        <View style={styles.header}>
          <Text style={type.h2}>{isEdit ? 'Edit list' : 'New list'}</Text>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.close}>
            <X size={20} color={colors.gray700} strokeWidth={2.4} />
          </Pressable>
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
          <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <Field
              label="Title"
              placeholder="Name your adventure"
              value={title}
              onChangeText={setTitle}
              autoFocus={!isEdit}
              containerStyle={{ marginBottom: 18 }}
            />
            <Field
              label="Description"
              placeholder="What is this list about? (optional)"
              value={description}
              onChangeText={setDescription}
              multiline
              style={{ minHeight: 60 }}
              containerStyle={{ marginBottom: 22 }}
            />

            <Text style={[type.label, styles.groupLabel]}>Cover photo</Text>
            <SampleImagePicker selected={cover} onChange={setCover} max={1} />

            <Text style={[type.label, styles.groupLabel]}>Category</Text>
            <View style={styles.chipWrap}>
              {CATEGORIES.map((c) => (
                <Chip key={c} label={c} color={accent} selected={category === c} onPress={() => setCategory(c)} />
              ))}
            </View>

            <Text style={[type.label, styles.groupLabel]}>Color</Text>
            <View style={styles.colorRow}>
              {ACCENTS.map((a) => {
                const selected = accent === a;
                return (
                  <Pressable key={a} onPress={() => setAccent(a)} style={styles.swatchWrap}>
                    <View style={[styles.swatch, { backgroundColor: accentPairs[a].solid }, selected && styles.swatchSelected]}>
                      {selected ? <Check size={20} color={colors.white} strokeWidth={3} /> : null}
                    </View>
                  </Pressable>
                );
              })}
            </View>

            <Text style={[type.label, styles.groupLabel]}>Who can see it</Text>
            <View style={styles.visRow}>
              <VisOption
                active={visibility === 'public'}
                icon={<Globe size={20} color={visibility === 'public' ? colors.pink : colors.gray500} strokeWidth={2.3} />}
                title="Public"
                sub="Anyone can find it"
                onPress={() => setVisibility('public')}
              />
              <VisOption
                active={visibility === 'private'}
                icon={<Lock size={20} color={visibility === 'private' ? colors.pink : colors.gray500} strokeWidth={2.3} />}
                title="Private"
                sub="Just for you"
                onPress={() => setVisibility('private')}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={styles.footer}>
          <Button label={isEdit ? 'Save changes' : 'Create list'} onPress={save} disabled={!canSave} loading={saving} />
        </View>
      </SafeAreaView>
    </View>
  );
}

function VisOption({
  active,
  icon,
  title,
  sub,
  onPress,
}: {
  active: boolean;
  icon: React.ReactNode;
  title: string;
  sub: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.visOption, active && styles.visOptionActive]}>
      {icon}
      <Text style={[styles.visTitle, active && { color: colors.ink }]}>{title}</Text>
      <Text style={styles.visSub}>{sub}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cream },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 8,
  },
  close: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.gray100, alignItems: 'center', justifyContent: 'center' },
  body: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 24 },
  groupLabel: { marginBottom: 12, marginLeft: 2 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  colorRow: { flexDirection: 'row', gap: 14, marginBottom: 24 },
  swatchWrap: {},
  swatch: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  swatchSelected: { borderColor: colors.ink },
  visRow: { flexDirection: 'row', gap: 12 },
  visOption: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.card,
    borderWidth: 1.5,
    borderColor: colors.gray200,
    padding: 16,
    gap: 4,
  },
  visOptionActive: { borderColor: colors.pink, backgroundColor: colors.pinkSoft },
  visTitle: { fontFamily: fonts.displayBold, fontSize: 16, color: colors.gray700, marginTop: 6 },
  visSub: { fontFamily: fonts.body, fontSize: 12.5, color: colors.gray500 },
  footer: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 20, borderTopWidth: 1, borderTopColor: colors.gray100, backgroundColor: colors.cream },
});
