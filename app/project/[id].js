import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Screen from '../../components/Screen';
import Gallery from '../../components/Gallery';
import GlassCard from '../../components/GlassCard';
import Button from '../../components/Button';
import Tag from '../../components/Tag';
import Icon from '../../components/Icon';
import Reveal from '../../components/Reveal';
import { colors, type } from '../../constants/theme';
import { useContent } from '../../context/ContentContext';
import { useBreakpoint } from '../../lib/responsive';
import { openLink } from '../../lib/links';

export default function ProjectDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { projects } = useContent();
  const { isWide } = useBreakpoint();
  const project = projects.find((p) => p.id === id || p.dbId === id);

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/projects'));

  const back = (
    <Pressable accessibilityRole="button" accessibilityLabel="Back to projects" onPress={goBack} style={styles.back}>
      <Icon name="arrow-back" size={18} color={colors.cyan} />
      <Text style={styles.backText}>Back</Text>
    </Pressable>
  );

  if (!project) {
    return (
      <Screen>
        {back}
        <GlassCard innerStyle={styles.missing}>
          <Icon name="alert-circle-outline" size={34} color={colors.textDim} />
          <Text style={type.h3}>Project not found</Text>
          <Text style={type.small}>It may have been moved or unpublished.</Text>
          <Button title="All projects" onPress={() => router.replace('/projects')} />
        </GlassCard>
      </Screen>
    );
  }

  const paragraphs = (project.description || '').split(/\n\s*\n/).filter(Boolean);

  return (
    <Screen>
      {back}
      <Reveal>
        <Text style={type.eyebrow}>{project.category}</Text>
        <Text style={styles.title}>{project.title}</Text>
        <Text style={styles.tagline}>{project.tagline}</Text>
      </Reveal>

      <Reveal delay={100} style={{ marginTop: 22 }}>
        <Gallery items={project.images} height={isWide ? 420 : 240} />
      </Reveal>

      <View style={[styles.cols, isWide && styles.colsWide]}>
        <Reveal delay={160} style={{ flex: 1, gap: 14 }}>
          <Text style={type.h2}>About this project</Text>
          {paragraphs.map((p, i) => (
            <Text key={i} style={type.body}>
              {p}
            </Text>
          ))}
          <View style={styles.tags}>
            {(project.tags || []).map((t) => (
              <Tag key={t} label={t} active />
            ))}
          </View>
        </Reveal>

        <Reveal delay={220} style={isWide ? styles.sideWide : styles.side}>
          {project.highlights && project.highlights.length ? (
            <GlassCard glow innerStyle={{ gap: 12 }}>
              <Text style={type.eyebrow}>Key features</Text>
              {project.highlights.map((h) => (
                <View key={h} style={styles.feature}>
                  <Icon name="checkmark-circle" size={18} color={colors.cyan} />
                  <Text style={styles.featureText}>{h}</Text>
                </View>
              ))}
            </GlassCard>
          ) : null}

          <View style={styles.links}>
            {project.github_url ? (
              <Button title="Source code" icon="logo-github" onPress={() => openLink(project.github_url)} />
            ) : null}
            {project.demo_url ? (
              <Button title="Live demo" variant="ghost" icon="open-outline" onPress={() => openLink(project.demo_url)} />
            ) : null}
            {!project.github_url && !project.demo_url ? (
              <Text style={type.small}>Links for this project are not public yet. Ask me for a walkthrough.</Text>
            ) : null}
          </View>
        </Reveal>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingVertical: 8, marginBottom: 8 },
  backText: { color: colors.cyan, fontSize: 14, fontWeight: '700' },
  title: { ...type.h1, fontSize: 34, marginTop: 6 },
  tagline: { ...type.body, fontSize: 17, marginTop: 8 },
  cols: { marginTop: 32, gap: 24 },
  colsWide: { flexDirection: 'row', alignItems: 'flex-start', gap: 32 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  side: { gap: 18 },
  sideWide: { width: 340, gap: 18 },
  feature: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  featureText: { color: colors.text, fontSize: 14.5, lineHeight: 21, flex: 1 },
  links: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, alignItems: 'center' },
  missing: { alignItems: 'center', gap: 10, paddingVertical: 30 },
});
