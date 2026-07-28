import { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import { queryClient } from './src/api/queryClient';
import {
  useFonts,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
} from '@expo-google-fonts/nunito';
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
} from '@expo-google-fonts/manrope';
import { colors } from './src/theme';
import { useAuthStore } from './src/store/authStore';
import { RootNavigator } from './src/navigation/RootNavigator';

// Hold the native splash until fonts and persisted state are both ready.
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });
  const hydrated = useAuthStore((s) => s.hydrated);

  // Restore the session (validate stored tokens) once on launch.
  useEffect(() => {
    useAuthStore.getState().bootstrap();
  }, []);

  const ready = (fontsLoaded || Boolean(fontError)) && hydrated;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  const onLayout = useCallback(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: colors.cream }} onLayout={onLayout}>
          <RootNavigator />
        </View>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
