import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, CircleCheckBig, Sparkles, Users } from 'lucide-react-native';
import { colors, fonts, gradients, radius, shadow, type } from '../theme';
import { useAuthStore } from '../store/authStore';

const { width } = Dimensions.get('window');

interface Slide {
  key: string;
  icon: React.ReactNode;
  title: string;
  body: string;
}

const ICON_SIZE = 40;
const iconProps = { size: ICON_SIZE, color: colors.white, strokeWidth: 2.2 };

const SLIDES: Slide[] = [
  {
    key: 'collect',
    icon: <Sparkles {...iconProps} />,
    title: 'Collect the dreams you keep almost mentioning',
    body: 'That trip, that skill, that slightly reckless idea. Get them out of your head and somewhere you will actually see them.',
  },
  {
    key: 'together',
    icon: <Users {...iconProps} />,
    title: 'Chase them with people who mean it',
    body: 'Shared dreams have a much better survival rate than private ones. Build lists with the friends who refuse to let you forget.',
  },
  {
    key: 'memory',
    icon: <CircleCheckBig {...iconProps} />,
    title: 'Tick them off, keep the memory',
    body: 'A finished goal deserves better than a strikethrough. Watch your list turn into a story worth scrolling back through.',
  },
];

export function OnboardingScreen() {
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding);
  const listRef = useRef<FlatList<Slide>>(null);
  const [index, setIndex] = useState(0);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(e.nativeEvent.contentOffset.x / width);
    if (next !== index) setIndex(next);
  };

  const isLast = index === SLIDES.length - 1;
  const goNext = () => {
    if (isLast) {
      completeOnboarding();
    } else {
      listRef.current?.scrollToOffset({ offset: (index + 1) * width, animated: true });
    }
  };

  return (
    <LinearGradient colors={gradients.brand.colors} locations={gradients.brand.locations} style={styles.root}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.topRow}>
          <Text style={styles.wordmark}>Bucketick</Text>
          {!isLast ? (
            <Pressable onPress={completeOnboarding} hitSlop={12}>
              <Text style={styles.skip}>Skip</Text>
            </Pressable>
          ) : (
            <View style={{ width: 40 }} />
          )}
        </View>

        <FlatList
          ref={listRef}
          data={SLIDES}
          keyExtractor={(s) => s.key}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          renderItem={({ item }) => (
            <View style={[styles.slide, { width }]}>
              <View style={styles.iconBubble}>{item.icon}</View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.body}>{item.body}</Text>
            </View>
          )}
        />

        <View style={styles.footer}>
          <View style={styles.dots}>
            {SLIDES.map((s, i) => (
              <View key={s.key} style={[styles.dot, i === index && styles.dotActive]} />
            ))}
          </View>

          <Pressable onPress={goNext} style={({ pressed }) => [styles.cta, { transform: [{ scale: pressed ? 0.98 : 1 }] }]}>
            <Text style={styles.ctaLabel}>{isLast ? 'Get started' : 'Next'}</Text>
            <ArrowRight size={20} color={colors.ink} strokeWidth={2.6} />
          </Pressable>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  wordmark: { fontFamily: fonts.displayBlack, fontSize: 22, color: colors.white, letterSpacing: -0.5 },
  skip: { fontFamily: fonts.bodyBold, fontSize: 15, color: 'rgba(255,255,255,0.85)' },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconBubble: {
    width: 108,
    height: 108,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 36,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
  },
  title: {
    fontFamily: fonts.displayBlack,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.8,
    color: colors.white,
    textAlign: 'center',
    marginBottom: 16,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(255,255,255,0.92)',
    textAlign: 'center',
    maxWidth: 320,
  },
  footer: { paddingHorizontal: 24, paddingBottom: 8, gap: 22 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dotActive: { width: 24, backgroundColor: colors.white },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 56,
    borderRadius: radius.button,
    backgroundColor: colors.white,
    ...shadow.md,
  },
  ctaLabel: { fontFamily: fonts.bodyBold, fontSize: 17, color: colors.ink },
});
