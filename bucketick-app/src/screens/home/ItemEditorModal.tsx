import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MapPin, Trash2, X } from 'lucide-react-native';
import { Button, Field } from '../../components';
import { colors, fonts, radius, type } from '../../theme';
import type { BucketItem } from '../../types';

interface ItemEditorModalProps {
  visible: boolean;
  /** When set, the modal is in edit mode. */
  item?: BucketItem | null;
  onClose: () => void;
  onSave: (data: { title: string; note?: string; location?: string }) => Promise<void>;
  onDelete?: () => void | Promise<void>;
}

export function ItemEditorModal({ visible, item, onClose, onSave, onDelete }: ItemEditorModalProps) {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [location, setLocation] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setTitle(item?.title ?? '');
      setNote(item?.note ?? '');
      setLocation(item?.location ?? '');
      setSaving(false);
    }
  }, [visible, item]);

  const canSave = title.trim().length > 0 && !saving;
  const isEdit = Boolean(item);

  const save = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      await onSave({ title: title.trim(), note: note.trim(), location: location.trim() });
      onClose();
    } catch (e) {
      Alert.alert('Could not save', e instanceof Error ? e.message : 'Please try again.');
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.sheetWrap}>
        <View style={styles.sheet}>
          <View style={styles.grabber} />
          <View style={styles.headerRow}>
            <Text style={type.h2}>{isEdit ? 'Edit dream' : 'Add a dream'}</Text>
            <Pressable onPress={onClose} hitSlop={10} style={styles.close}>
              <X size={20} color={colors.gray700} strokeWidth={2.4} />
            </Pressable>
          </View>

          <Field
            placeholder="What do you want to do?"
            value={title}
            onChangeText={setTitle}
            autoFocus
            containerStyle={{ marginBottom: 12 }}
          />
          <Field
            placeholder="A note to future you (optional)"
            value={note}
            onChangeText={setNote}
            multiline
            containerStyle={{ marginBottom: 12 }}
            style={{ minHeight: 44 }}
          />
          <Field
            placeholder="Where? (optional)"
            value={location}
            onChangeText={setLocation}
            icon={<MapPin size={18} color={colors.gray500} strokeWidth={2.2} />}
            containerStyle={{ marginBottom: 20 }}
          />

          <Button label={isEdit ? 'Save changes' : 'Add to list'} onPress={save} disabled={!canSave} loading={saving} />

          {isEdit && onDelete ? (
            <Pressable
              onPress={async () => {
                await onDelete();
                onClose();
              }}
              style={styles.deleteRow}
              hitSlop={8}
            >
              <Trash2 size={17} color={colors.pink} strokeWidth={2.2} />
              <Text style={styles.deleteText}>Delete this dream</Text>
            </Pressable>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,15,18,0.45)' },
  sheetWrap: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 22,
    paddingBottom: 34,
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.gray200,
    marginBottom: 16,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  close: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 16, paddingVertical: 8 },
  deleteText: { fontFamily: fonts.bodyBold, fontSize: 14.5, color: colors.pink },
});
