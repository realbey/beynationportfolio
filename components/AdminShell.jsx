import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Screen from './Screen';
import Icon from './Icon';
import Button from './Button';
import { colors, fonts, type } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { label: 'Overview', href: '/admin', icon: 'grid' },
  { label: 'Projects', href: '/admin/projects', icon: 'layers' },
  { label: 'Skills', href: '/admin/skills', icon: 'flash' },
  { label: 'Services', href: '/admin/services', icon: 'briefcase' },
  { label: 'Settings', href: '/admin/settings', icon: 'settings' },
  { label: 'Messages', href: '/admin/messages', icon: 'mail' },
];

// Wrapper for every admin screen: title, section nav, sign-out.
export default function AdminShell({ title, subtitle, active, children, actions }) {
  const router = useRouter();
  const { signOut, user } = useAuth();

  return (
    <Screen header={false} footer={false}>
      <View style={styles.top}>
        <Pressable accessibilityRole="link" onPress={() => router.replace('/')} style={styles.site}>
          <Icon name="arrow-back" size={16} color={colors.cyan} />
          <Text style={styles.siteText}>View site</Text>
        </Pressable>
        <View style={styles.right}>
          <Text style={styles.email} numberOfLines={1}>
            {user ? user.email : ''}
          </Text>
          <Button
            title="Sign out"
            size="sm"
            variant="ghost"
            icon="log-out-outline"
            onPress={async () => {
              await signOut();
              router.replace('/');
            }}
          />
        </View>
      </View>

      <View style={styles.nav}>
        {NAV.map((n) => {
          const on = n.href === active;
          return (
            <Pressable
              key={n.href}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              onPress={() => router.replace(n.href)}
              style={[styles.navItem, on && styles.navItemOn]}
            >
              <Icon name={n.icon} size={15} color={on ? colors.cyan : colors.textMuted} />
              <Text style={[styles.navText, on && styles.navTextOn]}>{n.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.titleRow}>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={type.eyebrow}>Admin</Text>
          <Text style={type.h2}>{title}</Text>
          {subtitle ? <Text style={type.small}>{subtitle}</Text> : null}
        </View>
        {actions}
      </View>

      {children}
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingVertical: 10 },
  site: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  siteText: { color: colors.cyan, fontWeight: '700', fontSize: 14 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 10, flexShrink: 1 },
  email: { color: colors.textDim, fontFamily: fonts.mono, fontSize: 11.5, flexShrink: 1, maxWidth: 160 },
  nav: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8, marginBottom: 22 },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  navItemOn: { borderColor: colors.borderStrong, backgroundColor: 'rgba(0,240,255,0.12)' },
  navText: { color: colors.textMuted, fontSize: 13, fontWeight: '700' },
  navTextOn: { color: colors.cyan },
  titleRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 12, marginBottom: 20, flexWrap: 'wrap' },
});
