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
import { Globe, Lock, X } from 'lucide-react-native';
import { Button, Chip, Field, SampleImagePicker } from '../../components';
import { colors, fonts, radius, type } from '../../theme';
import { aspectFor } from '../../data/sampleImages';
import { useCreatePost, useLists } from '../../hooks';
import type { RootStackParamList } from '../../navigation/types';
import type { Visibility } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'CreatePost'>;

export function CreatePostScreen({ navigation }: Props) {
  const createPost = useCreatePost();
  const { data: lists } = useLists();

  const [caption, setCaption] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [listId, setListId] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<Visibility>('public');

  const canPost = caption.trim().length > 0 && !createPost.isPending;

  const submit = () => {
    if (!canPost) return;
    const linked = lists?.find((l) => l.id === listId);
    createPost.mutate(
      {
        caption: caption.trim(),
        images,
        coverAspect: images.length ? aspectFor(images[0]) : 1,
        achievement: linked ? { kind: 'list', refId: linked.id, title: linked.title } : null,
        visibility,
      },
      {
        onSuccess: () => navigation.goBack(),
        onError: (e) => Alert.alert('Could not post', e instanceof Error ? e.message : 'Please try again.'),
      }
    );
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.flex}>
        <View style={styles.header}>
          <Text style={type.h2}>Share a win</Text>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.close}>
            <X size={20} color={colors.gray700} strokeWidth={2.4} />
          </Pressable>
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
          <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <Field
              placeholder="What did you pull off? Brag a little, you earned it."
              value={caption}
              onChangeText={setCaption}
              multiline
              autoFocus
              style={{ minHeight: 80 }}
              containerStyle={{ marginBottom: 20 }}
            />

            <Text style={[type.label, styles.groupLabel]}>Photos</Text>
            <SampleImagePicker selected={images} onChange={setImages} max={4} />

            {lists && lists.length > 0 ? (
              <>
                <Text style={[type.label, styles.groupLabel]}>Link a bucket list (optional)</Text>
                <View style={styles.chipWrap}>
                  {lists.map((l) => (
                    <Chip
                      key={l.id}
                      label={l.title.length > 22 ? `${l.title.slice(0, 22)}...` : l.title}
                      color={l.accent}
                      selected={listId === l.id}
                      onPress={() => setListId(listId === l.id ? null : l.id)}
                    />
                  ))}
                </View>
              </>
            ) : null}

            <Text style={[type.label, styles.groupLabel]}>Who can see it</Text>
            <View style={styles.visRow}>
              <VisOption
                active={visibility === 'public'}
                icon={<Globe size={20} color={visibility === 'public' ? colors.pink : colors.gray500} strokeWidth={2.3} />}
                title="Public"
                sub="Show it on the feed"
                onPress={() => setVisibility('public')}
              />
              <VisOption
                active={visibility === 'private'}
                icon={<Lock size={20} color={visibility === 'private' ? colors.pink : colors.gray500} strokeWidth={2.3} />}
                title="Private"
                sub="Only on your profile"
                onPress={() => setVisibility('private')}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={styles.footer}>
          <Button label="Post it" onPress={submit} disabled={!canPost} loading={createPost.isPending} />
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 8, paddingBottom: 8 },
  close: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.gray100, alignItems: 'center', justifyContent: 'center' },
  body: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 24 },
  groupLabel: { marginTop: 22, marginBottom: 12, marginLeft: 2 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  visRow: { flexDirection: 'row', gap: 12 },
  visOption: { flex: 1, backgroundColor: colors.white, borderRadius: radius.card, borderWidth: 1.5, borderColor: colors.gray200, padding: 16, gap: 4 },
  visOptionActive: { borderColor: colors.pink, backgroundColor: colors.pinkSoft },
  visTitle: { fontFamily: fonts.displayBold, fontSize: 16, color: colors.gray700, marginTop: 6 },
  visSub: { fontFamily: fonts.body, fontSize: 12.5, color: colors.gray500 },
  footer: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 20, borderTopWidth: 1, borderTopColor: colors.gray100, backgroundColor: colors.cream },
});
