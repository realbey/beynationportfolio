import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Screen from '../../components/Screen';
import SectionHeader from '../../components/SectionHeader';
import GlassCard from '../../components/GlassCard';
import SkillBar from '../../components/SkillBar';
import ResponsiveGrid from '../../components/ResponsiveGrid';
import Reveal from '../../components/Reveal';
import Button from '../../components/Button';
import { colors, type } from '../../constants/theme';
import { useContent } from '../../context/ContentContext';
import { useBreakpoint } from '../../lib/responsive';

export default function SkillsScreen() {
  const router = useRouter();
  const { skills } = useContent();
  const { isMedium } = useBreakpoint();

  // Group by category while keeping the order the categories first appear in.
  const groups = useMemo(() => {
    const map = new Map();
    skills.forEach((s) => {
      if (!map.has(s.category)) map.set(s.category, []);
      map.get(s.category).push(s);
    });
    return Array.from(map.entries()).map(([category, items]) => ({ id: category, category, items }));
  }, [skills]);

  return (
    <Screen>
      <Reveal>
        <SectionHeader
          eyebrow="Toolbox"
          title="Skills"
          subtitle="The bars show how comfortable I am today. They are honest, and they keep moving."
        />
      </Reveal>

      <ResponsiveGrid
        columns={isMedium ? 2 : 1}
        items={groups}
        renderItem={(g, gi) => (
          <Reveal delay={gi * 90} style={{ flex: 1 }}>
            <GlassCard style={{ flex: 1 }}>
              <Text style={styles.cat}>{g.category}</Text>
              {g.items.map((s, i) => (
                <SkillBar key={s.id} skill={s} delay={300 + gi * 120 + i * 90} />
              ))}
            </GlassCard>
          </Reveal>
        )}
      />

      <Reveal delay={200} style={styles.more}>
        <GlassCard glow innerStyle={{ gap: 10 }}>
          <Text style={type.eyebrow}>What I offer</Text>
          <Text style={type.h2}>Need these skills on your project?</Text>
          <Text style={type.body}>See the services I offer and how I like to work.</Text>
          <View style={styles.row}>
            <Button title="View services" icon="briefcase" onPress={() => router.push('/services')} />
            <Button title="Contact me" variant="ghost" icon="mail" onPress={() => router.push('/contact')} />
          </View>
        </GlassCard>
      </Reveal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  cat: { ...type.eyebrow, marginBottom: 16, color: colors.cyan },
  more: { marginTop: 40 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 6 },
});
