import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Screen from '../components/Screen';
import SectionHeader from '../components/SectionHeader';
import GlassCard from '../components/GlassCard';
import ResponsiveGrid from '../components/ResponsiveGrid';
import Reveal from '../components/Reveal';
import Button from '../components/Button';
import Icon from '../components/Icon';
import { colors, type } from '../constants/theme';
import { useContent } from '../context/ContentContext';
import { useBreakpoint } from '../lib/responsive';

export default function ServicesScreen() {
  const router = useRouter();
  const { services } = useContent();
  const { isMedium } = useBreakpoint();

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));

  return (
    <Screen bottomPad={40}>
      <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={goBack} style={styles.back}>
        <Icon name="arrow-back" size={18} color={colors.cyan} />
        <Text style={styles.backText}>Back</Text>
      </Pressable>

      <Reveal>
        <SectionHeader
          eyebrow="What I do"
          title="Services"
          subtitle="Pick a service to start a conversation. I will reply with questions, a rough plan and a time estimate."
        />
      </Reveal>

      <ResponsiveGrid
        columns={isMedium ? 2 : 1}
        items={services}
        renderItem={(s, i) => (
          <Reveal delay={i * 90} style={{ flex: 1 }}>
            <GlassCard style={{ flex: 1 }} innerStyle={{ gap: 12, flex: 1 }}>
              <View style={styles.iconBox}>
                <Icon name={s.icon} size={24} color={colors.cyan} />
              </View>
              <Text style={type.h3}>{s.title}</Text>
              <Text style={type.small}>{s.description}</Text>
              <View style={styles.list}>
                {(s.features || []).map((f) => (
                  <View key={f} style={styles.feature}>
                    <Icon name="checkmark-circle" size={16} color={colors.cyan} />
                    <Text style={styles.featureText}>{f}</Text>
                  </View>
                ))}
              </View>
              <Button
                title="Request this"
                variant="ghost"
                size="sm"
                iconRight="arrow-forward"
                onPress={() => router.push({ pathname: '/contact', params: { subject: s.title } })}
              />
            </GlassCard>
          </Reveal>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingVertical: 8, marginBottom: 8 },
  backText: { color: colors.cyan, fontSize: 14, fontWeight: '700' },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,240,255,0.08)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  list: { gap: 8, flexGrow: 1 },
  feature: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featureText: { color: colors.textMuted, fontSize: 14, flexShrink: 1 },
});
