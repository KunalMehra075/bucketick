import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AtSign, Lock } from 'lucide-react-native';
import { Button, Field, Wordmark } from '../../components';
import { colors, fonts, gradients, type } from '../../theme';
import { useLogin } from '../../hooks';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const login = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const emailOk = /\S+@\S+\.\S+/.test(email.trim());
  const canSubmit = emailOk && password.length >= 4;

  const submit = async () => {
    if (!canSubmit || login.isPending) return;
    setError(null);
    try {
      await login.mutateAsync({ email: email.trim(), password });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not log in. Please try again.');
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <LinearGradient colors={gradients.dusk.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
        <SafeAreaView edges={['top']}>
          <View style={styles.heroInner}>
            <Wordmark height={22} tint={colors.white} style={{ marginBottom: 28 }} />
            <Text style={styles.heroTitle}>Welcome back</Text>
            <Text style={styles.heroSub}>Your dreams have been waiting. Let us pick up where you left off.</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
          <Field
            label="Email"
            placeholder="you@bucketick.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            icon={<AtSign size={18} color={colors.gray500} strokeWidth={2.2} />}
            containerStyle={{ marginBottom: 16 }}
          />
          <Field
            label="Password"
            placeholder="Your secret handshake"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            icon={<Lock size={18} color={colors.gray500} strokeWidth={2.2} />}
            containerStyle={{ marginBottom: 8 }}
          />
          <Pressable hitSlop={8} style={styles.forgot}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </Pressable>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button label="Log in" onPress={submit} disabled={!canSubmit} loading={login.isPending} style={{ marginTop: 8 }} />

          <View style={styles.switchRow}>
            <Text style={type.body}>New here? </Text>
            <Pressable onPress={() => navigation.navigate('Signup')} hitSlop={8}>
              <Text style={styles.switchLink}>Create an account</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cream },
  flex: { flex: 1 },
  hero: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingBottom: 32,
  },
  heroInner: { paddingHorizontal: 24, paddingTop: 12 },
  wordmark: { fontFamily: fonts.displayBlack, fontSize: 20, color: colors.white, letterSpacing: -0.4, marginBottom: 28 },
  heroTitle: { fontFamily: fonts.displayBlack, fontSize: 32, color: colors.white, letterSpacing: -0.8, marginBottom: 8 },
  heroSub: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22, color: 'rgba(255,255,255,0.9)', maxWidth: 300 },
  form: { padding: 24, paddingTop: 28 },
  forgot: { alignSelf: 'flex-end', paddingVertical: 8 },
  forgotText: { fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.pink },
  error: { fontFamily: fonts.bodySemibold, fontSize: 13.5, color: colors.pink, textAlign: 'center', marginBottom: 8 },
  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  switchLink: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.pink },
});
