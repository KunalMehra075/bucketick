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
import { X } from 'lucide-react-native';
import { Avatar, Button, Field } from '../components';
import { colors, fonts, type } from '../theme';
import { useMe, useUpdateProfile } from '../hooks';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

// Dummy avatar options (pravatar). Real photo upload is a follow-up.
const AVATAR_CHOICES = ['bt-a', 'bt-b', 'bt-c', 'bt-d', 'bt-e', 'bt-f'].map(
  (s) => `https://i.pravatar.cc/300?u=${s}`
);

export function EditProfileScreen({ navigation }: Props) {
  const { data: user } = useMe();
  const updateProfile = useUpdateProfile();

  const [name, setName] = useState(user?.name ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.avatarUrl ?? null);

  const canSave = name.trim().length >= 2 && !updateProfile.isPending;

  const save = async () => {
    if (!canSave) return;
    try {
      await updateProfile.mutateAsync({ name: name.trim(), bio: bio.trim() || null, avatarUrl });
      navigation.goBack();
    } catch (e) {
      Alert.alert('Could not save', e instanceof Error ? e.message : 'Please try again.');
    }
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.flex}>
        <View style={styles.header}>
          <Text style={type.h2}>Edit profile</Text>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.close}>
            <X size={20} color={colors.gray700} strokeWidth={2.4} />
          </Pressable>
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
          <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
            <View style={styles.avatarWrap}>
              <Avatar name={name || 'You'} uri={avatarUrl} color={user?.avatarColor ?? 'pink'} size={96} />
            </View>

            <Text style={[type.label, styles.chooseLabel]}>Choose an avatar</Text>
            <View style={styles.avatarChoices}>
              {AVATAR_CHOICES.map((url) => (
                <Pressable key={url} onPress={() => setAvatarUrl(url)} style={[styles.choice, avatarUrl === url && styles.choiceActive]}>
                  <Avatar name="" uri={url} size={54} />
                </Pressable>
              ))}
            </View>

            <Field
              label="Name"
              placeholder="Your name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              containerStyle={{ marginBottom: 18 }}
            />
            <Field
              label="Bio"
              placeholder="A line about the dreams you are chasing"
              value={bio}
              onChangeText={setBio}
              multiline
              style={{ minHeight: 70 }}
              containerStyle={{ marginBottom: 24 }}
            />

            <Button label="Save changes" onPress={save} disabled={!canSave} loading={updateProfile.isPending} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
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
  body: { paddingHorizontal: 24, paddingTop: 16 },
  avatarWrap: { alignItems: 'center', marginBottom: 20 },
  chooseLabel: { marginBottom: 12, marginLeft: 2 },
  avatarChoices: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  choice: { borderRadius: 999, borderWidth: 2.5, borderColor: 'transparent', padding: 2 },
  choiceActive: { borderColor: colors.pink },
});
