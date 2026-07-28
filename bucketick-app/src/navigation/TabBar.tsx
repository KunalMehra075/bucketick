import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Compass, Home, ListChecks, Plus, Search, Sparkles, X } from 'lucide-react-native';
import { colors, fonts, gradients, radius, shadow } from '../theme';

const ICONS: Record<string, React.ComponentType<{ size: number; color: string; strokeWidth: number }>> = {
  Home,
  Explore: Compass,
  Search,
  Lists: ListChecks,
};

/** Floating tab bar with a center create button that opens an action sheet. */
export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const [sheetOpen, setSheetOpen] = useState(false);

  const go = (screen: string) => {
    setSheetOpen(false);
    // Create screens live on the parent stack.
    (navigation as unknown as { navigate: (s: string, p?: object) => void }).navigate(screen);
  };

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={[styles.bar, shadow.lg]}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;

          if (route.name === 'Create') {
            return (
              <Pressable key={route.key} onPress={() => setSheetOpen(true)} style={styles.centerTab} hitSlop={8}>
                <LinearGradient
                  colors={gradients.sunrise.colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.centerBtn}
                >
                  <Plus size={26} color={colors.white} strokeWidth={2.8} />
                </LinearGradient>
              </Pressable>
            );
          }

          const Icon = ICONS[route.name] ?? Home;
          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
          };
          return (
            <Pressable key={route.key} onPress={onPress} style={styles.tab} hitSlop={8}>
              <Icon size={24} color={focused ? colors.pink : colors.gray500} strokeWidth={focused ? 2.6 : 2.2} />
              <View style={[styles.dot, focused && styles.dotActive]} />
            </Pressable>
          );
        })}
      </View>

      <Modal visible={sheetOpen} transparent animationType="slide" onRequestClose={() => setSheetOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setSheetOpen(false)} />
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          <View style={styles.grabber} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Create</Text>
            <Pressable onPress={() => setSheetOpen(false)} hitSlop={10} style={styles.close}>
              <X size={20} color={colors.gray700} strokeWidth={2.4} />
            </Pressable>
          </View>

          <Pressable style={styles.option} onPress={() => go('CreatePost')}>
            <View style={[styles.optionIcon, { backgroundColor: colors.pinkSoft }]}>
              <Sparkles size={22} color={colors.pink} strokeWidth={2.4} />
            </View>
            <View style={styles.flex}>
              <Text style={styles.optionTitle}>Share a win</Text>
              <Text style={styles.optionSub}>Post an achievement to your feed</Text>
            </View>
          </Pressable>

          <Pressable style={styles.option} onPress={() => go('ListForm')}>
            <View style={[styles.optionIcon, { backgroundColor: colors.blueSoft }]}>
              <ListChecks size={22} color={colors.blue} strokeWidth={2.4} />
            </View>
            <View style={styles.flex}>
              <Text style={styles.optionTitle}>New bucket list</Text>
              <Text style={styles.optionSub}>Start a fresh list of dreams</Text>
            </View>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: colors.gray100,
    width: '100%',
    maxWidth: 420,
  },
  tab: { alignItems: 'center', justifyContent: 'center', gap: 5, flex: 1 },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: 'transparent' },
  dotActive: { backgroundColor: colors.pink },
  centerTab: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  centerBtn: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28,
    ...shadow.md,
  },
  backdrop: { flex: 1, backgroundColor: 'rgba(15,15,18,0.45)' },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  grabber: { alignSelf: 'center', width: 40, height: 5, borderRadius: 3, backgroundColor: colors.gray200, marginBottom: 14 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  sheetTitle: { fontFamily: fonts.displayBlack, fontSize: 22, color: colors.ink, letterSpacing: -0.4 },
  close: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.gray100, alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: radius.card,
  },
  optionIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  optionTitle: { fontFamily: fonts.displayBold, fontSize: 17, color: colors.ink },
  optionSub: { fontFamily: fonts.body, fontSize: 13.5, color: colors.gray500, marginTop: 1 },
});
