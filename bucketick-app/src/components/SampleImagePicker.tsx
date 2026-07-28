import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Check } from 'lucide-react-native';
import { colors, fonts, radius } from '../theme';
import { SAMPLE_IMAGES } from '../data/sampleImages';

interface SampleImagePickerProps {
  selected: string[];
  onChange: (urls: string[]) => void;
  /** Max images the caller allows (1 for a list cover, more for a post). */
  max?: number;
}

/** A grid of sample photos to attach. Dummy stand-in for real gallery upload. */
export function SampleImagePicker({ selected, onChange, max = 4 }: SampleImagePickerProps) {
  const toggle = (url: string) => {
    if (selected.includes(url)) {
      onChange(selected.filter((u) => u !== url));
    } else if (max === 1) {
      onChange([url]);
    } else if (selected.length < max) {
      onChange([...selected, url]);
    }
  };

  return (
    <View>
      <Text style={styles.hint}>
        {max === 1 ? 'Pick a cover photo' : `Pick up to ${max} photos`} (sample library for now)
      </Text>
      <View style={styles.grid}>
        {SAMPLE_IMAGES.map((img) => {
          const isSelected = selected.includes(img.url);
          const order = selected.indexOf(img.url) + 1;
          return (
            <Pressable key={img.url} onPress={() => toggle(img.url)} style={styles.cell}>
              <Image source={{ uri: img.url }} style={styles.img} contentFit="cover" transition={120} />
              {isSelected ? (
                <View style={styles.selOverlay}>
                  <View style={styles.badge}>
                    {max === 1 ? (
                      <Check size={16} color={colors.white} strokeWidth={3} />
                    ) : (
                      <Text style={styles.badgeText}>{order}</Text>
                    )}
                  </View>
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const GAP = 8;

const styles = StyleSheet.create({
  hint: { fontFamily: fonts.body, fontSize: 13, color: colors.gray500, marginBottom: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: GAP },
  cell: {
    width: `${100 / 4 - 2}%`,
    aspectRatio: 1,
    borderRadius: radius.input,
    overflow: 'hidden',
    backgroundColor: colors.gray100,
  },
  img: { width: '100%', height: '100%' },
  selOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,0,110,0.28)',
    borderWidth: 2.5,
    borderColor: colors.pink,
    borderRadius: radius.input,
    alignItems: 'flex-end',
    padding: 4,
  },
  badge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.pink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontFamily: fonts.bodyBold, fontSize: 12, color: colors.white },
});
