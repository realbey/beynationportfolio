import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import SocialLinks from './SocialLinks';
import { colors, fonts, gradients, textGlow } from '../constants/theme';
import { useContent } from '../context/ContentContext';
import { useBreakpoint } from '../lib/responsive';

const NAV = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Skills', href: '/skills' },
  { label: 'Services', href: '/services' },
  { label: 'Contact', href: '/contact' },
];

export default function Footer() {
  const router = useRouter();
  const { settings } = useContent();
  const { isMedium } = useBreakpoint();
  const year = new Date().getFullYear();

  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={[...gradients.accent, 'rgba(56,189,248,0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.line}
      />
      <View style={[styles.top, isMedium && styles.topWide]}>
        <View style={styles.brandCol}>
          <Text style={[styles.brand, textGlow(colors.cyan, 10)]}>{settings.brand}</Text>
          <Text style={styles.tag}>{settings.role}</Text>
          <SocialLinks compact style={{ marginTop: 14 }} />
        </View>
        <View style={styles.navCol}>
          {NAV.map((n) => (
            <Pressable key={n.href} accessibilityRole="link" onPress={() => router.push(n.href)}>
              <Text style={styles.navItem}>{n.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={styles.bottom}>
        <Text style={styles.copy}>
          © {year} {settings.owner_name}. All rights reserved.
        </Text>
        <Pressable accessibilityRole="link" onPress={() => router.push('/admin')}>
          <Text style={styles.admin}>Admin</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 56, paddingBottom: 12 },
  line: { height: 2, borderRadius: 2, marginBottom: 28 },
  top: { gap: 28 },
  topWide: { flexDirection: 'row', justifyContent: 'space-between' },
  brandCol: { gap: 4 },
  brand: { color: colors.text, fontSize: 22, fontWeight: '800', letterSpacing: 4 },
  tag: { color: colors.textMuted, fontSize: 14 },
  navCol: { flexDirection: 'row', flexWrap: 'wrap', gap: 18, maxWidth: 460, alignItems: 'flex-start' },
  navItem: { color: colors.textMuted, fontSize: 14.5, fontWeight: '600' },
  bottom: {
    marginTop: 28,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  copy: { color: colors.textDim, fontSize: 12.5, fontFamily: fonts.mono },
  admin: { color: colors.textDim, fontSize: 12.5, fontFamily: fonts.mono },
});
