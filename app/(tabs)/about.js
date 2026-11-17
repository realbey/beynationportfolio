import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Screen from '../../components/Screen';
import GlassCard from '../../components/GlassCard';
import SectionHeader from '../../components/SectionHeader';
import Reveal from '../../components/Reveal';
import ResponsiveGrid from '../../components/ResponsiveGrid';
import Tag from '../../components/Tag';
import Icon from '../../components/Icon';
import Button from '../../components/Button';
import { colors, fonts, glowShadow, type } from '../../constants/theme';
import { useContent } from '../../context/ContentContext';
import { useBreakpoint } from '../../lib/responsive';

// Everything on this screen comes from `settings` (site_settings table or constants/data.js),
// so you can edit it from the admin dashboard without touching code.
export default function AboutScreen() {
  const router = useRouter();
  const { settings } = useContent();
  const { isMedium } = useBreakpoint();
  const bio = Array.isArray(settings.about_bio) ? settings.about_bio : [String(settings.about_bio || '')];
  const journey = Array.isArray(settings.journey) ? settings.journey : [];
  const goals = Array.isArray(settings.goals) ? settings.goals : [];
  const interests = Array.isArray(settings.interests) ? settings.interests : [];
  const values = Array.isArray(settings.values) ? settings.values : [];

  return (
    <Screen>
      <Reveal>
        <SectionHeader eyebrow="About me" title={`Hello, I'm ${settings.owner_name}`} subtitle={settings.role} />
      </Reveal>

      <Reveal delay={80}>
        <GlassCard glow innerStyle={{ gap: 14 }}>
          {bio.map((p, i) => (
            <Text key={i} style={type.body}>
              {p}
            </Text>
          ))}
        </GlassCard>
      </Reveal>

      <View style={styles.section}>
        <Reveal delay={120}>
          <SectionHeader eyebrow="Developer journey" title="How I got here" />
        </Reveal>
        <View style={styles.timeline}>
          <View style={styles.rail} />
          {journey.map((j, i) => (
            <Reveal key={`${j.year}-${i}`} delay={140 + i * 90} style={styles.step}>
              <View style={styles.node} />
              <View style={styles.stepBody}>
                <Text style={styles.year}>{j.year}</Text>
                <Text style={styles.stepTitle}>{j.title}</Text>
                <Text style={type.body}>{j.text}</Text>
              </View>
            </Reveal>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Reveal delay={100}>
          <SectionHeader eyebrow="Learning goals" title="What I'm working towards" />
        </Reveal>
        <ResponsiveGrid
          columns={isMedium ? 3 : 1}
          items={goals.map((g, i) => ({ ...g, id: `g${i}` }))}
          renderItem={(g, i) => (
            <Reveal delay={120 + i * 90} style={{ flex: 1 }}>
              <GlassCard style={{ flex: 1 }} innerStyle={{ gap: 10 }}>
                <View style={styles.iconBox}>
                  <Icon name={g.icon} size={22} color={colors.cyan} />
                </View>
                <Text style={type.h3}>{g.title}</Text>
                <Text style={type.small}>{g.text}</Text>
              </GlassCard>
            </Reveal>
          )}
        />
      </View>

      <View style={styles.section}>
        <Reveal delay={100}>
          <SectionHeader eyebrow="Technical interests" title="What I like to explore" />
        </Reveal>
        <Reveal delay={160}>
          <View style={styles.chips}>
            {interests.map((t) => (
              <Tag key={t} label={t} active />
            ))}
          </View>
        </Reveal>
      </View>

      <View style={styles.section}>
        <Reveal delay={100}>
          <SectionHeader eyebrow="Professional values" title="How I work" />
        </Reveal>
        <ResponsiveGrid
          columns={isMedium ? 2 : 1}
          items={values.map((v, i) => ({ ...v, id: `v${i}` }))}
          renderItem={(v, i) => (
            <Reveal delay={120 + i * 80} style={{ flex: 1 }}>
              <GlassCard style={{ flex: 1 }} innerStyle={styles.valueRow}>
                <View style={styles.iconBox}>
                  <Icon name={v.icon} size={22} color={colors.cyan} />
                </View>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={type.h3}>{v.title}</Text>
                  <Text style={type.small}>{v.text}</Text>
                </View>
              </GlassCard>
            </Reveal>
          )}
        />
      </View>

      <Reveal delay={100} style={styles.section}>
        <Button title="Work with me" icon="mail" onPress={() => router.push('/contact')} />
      </Reveal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: 52 },
  timeline: { paddingLeft: 6 },
  rail: {
    position: 'absolute',
    left: 11,
    top: 8,
    bottom: 8,
    width: 2,
    backgroundColor: 'rgba(0,240,255,0.22)',
  },
  step: { flexDirection: 'row', gap: 18, marginBottom: 22 },
  node: {
    width: 12,
    height: 12,
    marginTop: 6,
    borderRadius: 6,
    backgroundColor: colors.cyan,
    borderWidth: 2,
    borderColor: colors.bg,
    ...glowShadow(colors.cyan, 10, 0.8),
  },
  stepBody: { flex: 1, gap: 4 },
  year: { fontFamily: fonts.mono, color: colors.cyan, fontSize: 13, letterSpacing: 1.5 },
  stepTitle: { ...type.h3 },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,240,255,0.08)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  valueRow: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
});
