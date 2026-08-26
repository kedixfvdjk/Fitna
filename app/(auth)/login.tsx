import { Link } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Colors } from '@/constants/colors';
import { FontSize, FontWeight, Spacing } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';

export default function LoginScreen() {
  const signIn = useAuthStore((state) => state.signIn);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setFieldError(null);
    setSubmitError(null);

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setFieldError('Enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setFieldError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await signIn(email.trim(), password);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Unable to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Real Life RPG</Text>
        <Text style={styles.subtitle}>Level up your real life.</Text>

        <View style={styles.form}>
          <TextField
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            textContentType="emailAddress"
          />
          <TextField
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            textContentType="password"
            error={fieldError ?? undefined}
          />
          {submitError ? <Text style={styles.submitError}>{submitError}</Text> : null}

          <Button label="Log In" onPress={handleLogin} loading={loading} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don&apos;t have an account?</Text>
          <Link href="/(auth)/register" replace>
            <Text style={styles.footerLink}>Sign up</Text>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xl,
  },
  title: {
    color: Colors.text,
    fontSize: FontSize.display,
    fontWeight: FontWeight.extrabold,
    textAlign: 'center',
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    textAlign: 'center',
    marginTop: -Spacing.lg,
  },
  form: {
    gap: Spacing.md,
  },
  submitError: {
    color: Colors.danger,
    fontSize: FontSize.sm,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  footerText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
  },
  footerLink: {
    color: Colors.primary,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
});
