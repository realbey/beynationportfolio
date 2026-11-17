import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Slot, useRouter } from 'expo-router';
import Screen from '../../components/Screen';
import GlassCard from '../../components/GlassCard';
import FormField from '../../components/FormField';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import { colors, type } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';

// Route guard for everything under /admin.
// The real protection is Row Level Security in Supabase (see supabase/schema.sql).
// This guard only decides which screen to show.
export default function AdminLayout() {
  const router = useRouter();
  const { configured, session, isAdmin, loading, signIn, signOut } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const leave = () => router.replace('/');

  const login = async () => {
    setError('');
    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }
    setBusy(true);
    const { error: err } = await signIn(email, password);
    setBusy(false);
    if (err) setError('Sign in failed. Check your email and password.');
  };

  if (!configured) {
    return (
      <Screen footer={false}>
        <GlassCard glow innerStyle={styles.center}>
          <Icon name="cloud-offline-outline" size={34} color={colors.warning} />
          <Text style={type.h2}>Supabase is not set up yet</Text>
          <Text style={[type.body, styles.text]}>
            The admin dashboard needs a database. Create a Supabase project, run supabase/schema.sql, then add your
            URL and anon key to the .env file. The README explains each step.
          </Text>
          <Button title="Back to site" variant="ghost" onPress={leave} />
        </GlassCard>
      </Screen>
    );
  }

  if (loading) {
    return (
      <Screen footer={false}>
        <GlassCard innerStyle={styles.center}>
          <Text style={type.body}>Checking access...</Text>
        </GlassCard>
      </Screen>
    );
  }

  if (!session) {
    return (
      <Screen footer={false}>
        <View style={styles.login}>
          <GlassCard glow>
            <Text style={type.eyebrow}>Admin</Text>
            <Text style={[type.h2, { marginVertical: 8 }]}>Sign in</Text>
            <Text style={[type.small, { marginBottom: 18 }]}>For the site owner only.</Text>
            <FormField
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
            />
            <FormField
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
              onSubmitEditing={login}
              error={error}
            />
            <View style={styles.row}>
              <Button title="Sign in" icon="log-in-outline" loading={busy} onPress={login} />
              <Button title="Back" variant="ghost" onPress={leave} />
            </View>
          </GlassCard>
        </View>
      </Screen>
    );
  }

  if (!isAdmin) {
    return (
      <Screen footer={false}>
        <GlassCard innerStyle={styles.center}>
          <Icon name="lock-closed" size={34} color={colors.danger} />
          <Text style={type.h2}>No admin access</Text>
          <Text style={[type.body, styles.text]}>
            You are signed in, but this account is not in the admin_users table. Add your user id there using the SQL
            editor (see the README), then sign in again.
          </Text>
          <View style={styles.row}>
            <Button
              title="Sign out"
              variant="ghost"
              onPress={async () => {
                await signOut();
                leave();
              }}
            />
            <Button title="Back to site" variant="ghost" onPress={leave} />
          </View>
        </GlassCard>
      </Screen>
    );
  }

  return <Slot />;
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', gap: 12, paddingVertical: 26 },
  text: { textAlign: 'center', maxWidth: 520 },
  login: { width: '100%', maxWidth: 440, alignSelf: 'center', marginTop: 24 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
});
