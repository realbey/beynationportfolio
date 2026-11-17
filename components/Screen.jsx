import React, { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Footer from './Footer';
import { colors, fonts, glowShadow, gradients, textGlow } from '../constants/theme';
import { MAX_WIDTH, useBreakpoint } from '../lib/responsive';
import { useContent } from '../context/ContentContext';
import { isSupabaseConfigured } from '../lib/supabase';

// Shared page shell: cinematic background, brand bar, centred responsive column, footer.
export default function Screen({ children, header = true, footer = true, bottomPad = 40, scrollRef }) {
  const insets = useSafeAreaInsets();
  const { pad } = useBreakpoint();
  const { settings, source, reload } = useContent();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await reload();
    setRefreshing(false);
  }, [reload]);

  return (
    <View style={styles.root}>
      <LinearGradient colors={gradients.page} style={StyleSheet.absoluteFill} pointerEvents="none" />
      <LinearGradient
        colors={['rgba(0,240,255,0.16)', 'rgba(0,240,255,0)']}
        style={[styles.orb, { top: -160, right: -140 }]}
        pointerEvents="none"
      />
      <LinearGradient
        colors={['rgba(11,95,255,0.14)', 'rgba(11,95,255,0)']}
        style={[styles.orb, { top: 520, left: -220 }]}
        pointerEvents="none"
      />
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingTop: insets.top + 10, paddingBottom: bottomPad, alignItems: 'center' }}
        refreshControl={
          isSupabaseConfigured ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.cyan} colors={[colors.cyan]} />
          ) : undefined
        }
      >
        <View style={{ width: '100%', maxWidth: MAX_WIDTH, paddingHorizontal: pad }}>
          {header ? (
            <View style={styles.topBar}>
              <View style={styles.brandRow}>
                <View style={styles.mark} />
                <Text style={[styles.brand, textGlow(colors.cyan, 8)]}>{settings.brand}</Text>
              </View>
              <View style={[styles.badge, source === 'supabase' && styles.badgeLive]}>
                <View style={[styles.badgeDot, source === 'supabase' && styles.badgeDotLive]} />
                <Text style={styles.badgeText}>{source === 'supabase' ? 'LIVE DATA' : 'DEMO DATA'}</Text>
              </View>
            </View>
          ) : null}
          {children}
          {footer ? <Footer /> : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, overflow: 'hidden' },
  orb: { position: 'absolute', width: 460, height: 460, borderRadius: 230 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 12,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  mark: {
    width: 14,
    height: 14,
    borderWidth: 2,
    borderColor: colors.cyan,
    transform: [{ rotate: '45deg' }],
    ...glowShadow(colors.cyan, 10, 0.7),
  },
  brand: { color: colors.text, fontSize: 16, fontWeight: '800', letterSpacing: 4 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  badgeLive: { borderColor: 'rgba(52,211,153,0.4)' },
  badgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.warning },
  badgeDotLive: { backgroundColor: colors.success },
  badgeText: { fontFamily: fonts.mono, fontSize: 10.5, letterSpacing: 1.6, color: colors.textMuted },
});
