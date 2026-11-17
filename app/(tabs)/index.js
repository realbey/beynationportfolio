import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Screen from '../../components/Screen';
import Hero3DScene from '../../components/Hero3DScene';
import TypewriterText from '../../components/TypewriterText';
import Marquee from '../../components/Marquee';
import GlassCard from '../../components/GlassCard';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import Reveal from '../../components/Reveal';
import SectionHeader from '../../components/SectionHeader';
import ProjectCard from '../../components/ProjectCard';
import ResponsiveGrid from '../../components/ResponsiveGrid';
import { colors, fonts, textGlow, type } from '../../constants/theme';
import { useContent } from '../../context/ContentContext';
import { useBreakpoint } from '../../lib/responsive';

const QUICK = [
  { icon: 'person', title: 'About me', text: 'My journey, goals and what I care about.', href: '/about' },
  { icon: 'flash', title: 'Skills', text: 'The tools and technologies I work with.', href: '/skills' },
  { icon: 'briefcase', title: 'Services', text: 'Websites, apps and database-backed systems.', href: '/services' },
  { icon: 'mail', title: 'Contact', text: 'Start a conversation about your project.', href: '/contact' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { settings, projects, skills, services, featuredProjects } = useContent();
  const { isWide, isMedium, contentWidth } = useBreakpoint();
  const sceneSize = Math.min(isWide ? 400 : 320, contentWidth);

  const scene = (
    <Reveal delay={150} style={isWide ? styles.sceneWide : styles.scene}>
      <Hero3DScene size={sceneSize} />
    </Reveal>
  );

  const text = (
    <Reveal delay={0} style={isWide ? styles.textWide : styles.text}>
      <View style={styles.pill}>
        <View style={styles.pillDot} />
        <Text style={styles.pillText}>{settings.availability}</Text>
      </View>
      <Text style={styles.hello}>Hi, I'm</Text>
      <Text style={[styles.name, isWide && styles.nameWide, textGlow('rgba(0,240,255,0.55)', 18)]}>
        {settings.owner_name}
      </Text>
      <Text style={styles.role}>{settings.role}</Text>
      <View style={styles.typeRow}>
        <Text style={styles.build}>I build&nbsp;</Text>
        <View style={{ flexShrink: 1 }}>
          <TypewriterText phrases={settings.hero_phrases} style={styles.typed} minHeight={30} />
        </View>
      </View>
      <Text style={styles.intro}>{settings.hero_intro}</Text>
      <View style={styles.ctas}>
        <Button title="View projects" icon="layers" onPress={() => router.push('/projects')} />
        <Button title="Contact me" variant="ghost" icon="mail" onPress={() => router.push('/contact')} />
      </View>
    </Reveal>
  );

  return (
    <Screen>
      <View style={[styles.hero, isWide && styles.heroWide]}>{isWide ? [<View key="t" style={{ flex: 1 }}>{text}</View>, <View key="s">{scene}</View>] : [<View key="s">{scene}</View>, <View key="t">{text}</View>]}</View>

      <Marquee items={settings.marquee} style={{ marginTop: 30 }} />

      <Reveal delay={100} style={styles.section}>
        <ResponsiveGrid
          columns={3}
          gap={isMedium ? 14 : 8}
          items={[
            { id: 'p', value: projects.length, label: 'Projects' },
            { id: 's', value: skills.length, label: 'Technologies' },
            { id: 'v', value: services.length, label: 'Services' },
          ]}
          renderItem={(s) => (
            <GlassCard innerStyle={styles.stat} padded={false}>
              <Text style={[styles.statValue, textGlow(colors.cyan, 12)]}>{String(s.value).padStart(2, '0')}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </GlassCard>
          )}
        />
      </Reveal>

      <View style={styles.section}>
        <SectionHeader eyebrow="Selected work" title="Featured projects" subtitle="A few systems I have built, from school management to gaming communities." />
        <ResponsiveGrid
          items={featuredProjects}
          renderItem={(p) => <ProjectCard project={p} onPress={() => router.push(`/project/${p.id}`)} />}
        />
        <Button
          title="See all projects"
          variant="ghost"
          iconRight="arrow-forward"
          onPress={() => router.push('/projects')}
          style={{ marginTop: 20 }}
        />
      </View>

      <View style={styles.section}>
        <SectionHeader eyebrow="Explore" title="Where to next?" />
        <ResponsiveGrid
          columns={isWide ? 4 : isMedium ? 2 : 1}
          items={QUICK.map((q) => ({ ...q, id: q.href }))}
          renderItem={(q) => (
            <GlassCard onPress={() => router.push(q.href)} accessibilityLabel={q.title} style={{ flex: 1 }} innerStyle={{ gap: 8 }}>
              <View style={styles.quickIcon}>
                <Icon name={q.icon} size={22} color={colors.cyan} />
              </View>
              <Text style={styles.quickTitle}>{q.title}</Text>
              <Text style={type.small}>{q.text}</Text>
            </GlassCard>
          )}
        />
      </View>

      <View style={styles.section}>
        <GlassCard glow innerStyle={styles.cta}>
          <Text style={type.eyebrow}>Let's build</Text>
          <Text style={styles.ctaTitle}>Have a project in mind?</Text>
          <Text style={[type.body, { maxWidth: 520 }]}>{settings.contact_blurb}</Text>
          <Button title="Start a conversation" icon="chatbubbles" onPress={() => router.push('/contact')} style={{ marginTop: 6 }} />
        </GlassCard>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { paddingTop: 8, gap: 12 },
  heroWide: { flexDirection: 'row', alignItems: 'center', gap: 24, paddingTop: 24 },
  scene: { alignItems: 'center', paddingVertical: 8 },
  sceneWide: { alignItems: 'center' },
  text: { gap: 8, paddingTop: 8 },
  textWide: { gap: 10 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(52,211,153,0.4)',
    backgroundColor: 'rgba(52,211,153,0.08)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  pillDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.success },
  pillText: { color: colors.text, fontSize: 12.5, fontFamily: fonts.mono, letterSpacing: 0.4, flexShrink: 1 },
  hello: { color: colors.textMuted, fontSize: 18, fontWeight: '600' },
  name: { color: colors.text, fontSize: 44, lineHeight: 50, fontWeight: '800', letterSpacing: -1 },
  nameWide: { fontSize: 60, lineHeight: 66 },
  role: { ...type.eyebrow, marginTop: 2 },
  typeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  build: { color: colors.text, fontSize: 22, fontWeight: '700' },
  typed: { fontSize: 22 },
  intro: { ...type.body, marginTop: 6, maxWidth: 560 },
  ctas: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 16 },
  section: { marginTop: 56 },
  stat: { alignItems: 'center', paddingVertical: 18, gap: 2 },
  statValue: { color: colors.cyan, fontSize: 32, fontWeight: '800', fontFamily: fonts.mono },
  statLabel: { color: colors.textMuted, fontSize: 12.5, letterSpacing: 1.4, textTransform: 'uppercase' },
  quickIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,240,255,0.08)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickTitle: { ...type.h3 },
  cta: { gap: 10, paddingVertical: 10 },
  ctaTitle: { ...type.h1, fontSize: 30, lineHeight: 36 },
});
