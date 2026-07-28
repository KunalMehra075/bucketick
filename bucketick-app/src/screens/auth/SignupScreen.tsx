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
import { ArrowLeft, AtSign, Lock, User } from 'lucide-react-native';
import { Button, Field } from '../../components';
import { colors, fonts, gradients, type } from '../../theme';
import { useSignup } from '../../hooks';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;

export function SignupScreen({ navigation }: Props) {
  const signup = useSignup();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const emailOk = /\S+@\S+\.\S+/.test(email.trim());
  const canSubmit = name.trim().length >= 2 && emailOk && password.length >= 4;

  const submit = async () => {
    if (!canSubmit || signup.isPending) return;
    setError(null);
    try {
      await signup.mutateAsync({ name: name.trim(), email: email.trim(), password });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create your account. Please try again.');
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <LinearGradient colors={gradients.sunrise.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
        <SafeAreaView edges={['top']}>
          <View style={styles.heroInner}>
            <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={styles.back}>
              <ArrowLeft size={22} color={colors.white} strokeWidth={2.4} />
            </Pressable>
            <Text style={styles.heroTitle}>Start your first list</Text>
            <Text style={styles.heroSub}>Two minutes now, a lifetime of "we should do that" finally getting done.</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
          <Field
            label="Your name"
            placeholder="What should we call you?"
            autoCapitalize="words"
            value={name}
            onChangeText={setName}
            icon={<User size={18} color={colors.gray500} strokeWidth={2.2} />}
            containerStyle={{ marginBottom: 16 }}
          />
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
            placeholder="At least 4 characters"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            icon={<Lock size={18} color={colors.gray500} strokeWidth={2.2} />}
            hint="We are the only ones who see this. We promise not to judge it."
            containerStyle={{ marginBottom: 20 }}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button label="Create account" onPress={submit} disabled={!canSubmit} loading={signup.isPending} />

          <Text style={styles.legal}>
            By continuing you agree to our Terms and Privacy Policy. The genuinely readable kind, not the ten-page maze.
          </Text>

          <View style={styles.switchRow}>
            <Text style={type.body}>Already have an account? </Text>
            <Pressable onPress={() => navigation.navigate('Login')} hitSlop={8}>
              <Text style={styles.switchLink}>Log in</Text>
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
  hero: { borderBottomLeftRadius: 32, borderBottomRightRadius: 32, paddingBottom: 32 },
  heroInner: { paddingHorizontal: 24, paddingTop: 12 },
  back: { marginBottom: 20 },
  heroTitle: { fontFamily: fonts.displayBlack, fontSize: 32, color: colors.white, letterSpacing: -0.8, marginBottom: 8 },
  heroSub: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22, color: 'rgba(255,255,255,0.92)', maxWidth: 320 },
  form: { padding: 24, paddingTop: 28 },
  error: { fontFamily: fonts.bodySemibold, fontSize: 13.5, color: colors.pink, textAlign: 'center', marginBottom: 12 },
  legal: { fontFamily: fonts.body, fontSize: 12.5, lineHeight: 18, color: colors.gray500, textAlign: 'center', marginTop: 16, paddingHorizontal: 8 },
  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  switchLink: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.pink },
});
