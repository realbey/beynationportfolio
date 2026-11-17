import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import GlassCard from './GlassCard';
import Tag from './Tag';
import Icon from './Icon';
import { MediaSlide } from './Gallery';
import { colors, fonts, type } from '../constants/theme';

const CATEGORY_ICON = { Education: 'school', Business: 'storefront', Gaming: 'game-controller' };

export default function ProjectCard({ project, onPress }) {
  const cover =
    project.images && project.images.length
      ? project.images[0]
      : { gradient: ['#0B5FFF', '#00F0FF'], icon: CATEGORY_ICON[project.category] || 'cube' };

  return (
    <GlassCard
      onPress={onPress}
      padded={false}
      accessibilityLabel={`Open project ${project.title}`}
      style={styles.card}
      innerStyle={styles.inner}
    >
      <MediaSlide item={cover} height={150} rounded={false} compact />
      <View style={styles.body}>
        <Text style={styles.category}>{project.category}</Text>
        <Text style={styles.title}>{project.title}</Text>
        <Text style={styles.tagline} numberOfLines={3}>
          {project.tagline}
        </Text>
        <View style={styles.tags}>
          {(project.tags || []).slice(0, 3).map((t) => (
            <Tag key={t} label={t} />
          ))}
        </View>
        <View style={styles.cta}>
          <Text style={styles.ctaText}>View details</Text>
          <Icon name="arrow-forward" size={16} color={colors.cyan} />
        </View>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1 },
  inner: { flex: 1 },
  body: { padding: 16, gap: 8, flex: 1 },
  category: { ...type.eyebrow, fontSize: 11 },
  title: { ...type.h3 },
  tagline: { ...type.small, flexGrow: 1 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  cta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  ctaText: { color: colors.cyan, fontSize: 13.5, fontWeight: '700', fontFamily: fonts.mono, letterSpacing: 0.5 },
});
