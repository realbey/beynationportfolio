import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import Screen from '../../components/Screen';
import SectionHeader from '../../components/SectionHeader';
import ProjectCard from '../../components/ProjectCard';
import ResponsiveGrid from '../../components/ResponsiveGrid';
import Reveal from '../../components/Reveal';
import Tag from '../../components/Tag';
import Icon from '../../components/Icon';
import GlassCard from '../../components/GlassCard';
import { colors, radii, type } from '../../constants/theme';
import { useContent } from '../../context/ContentContext';

export default function ProjectsScreen() {
  const router = useRouter();
  const { projects } = useContent();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const categories = useMemo(() => ['All', ...Array.from(new Set(projects.map((p) => p.category)))], [projects]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (category !== 'All' && p.category !== category) return false;
      if (!q) return true;
      const haystack = [p.title, p.tagline, p.category, ...(p.tags || [])].join(' ').toLowerCase();
      return haystack.includes(q);
    });
  }, [projects, query, category]);

  return (
    <Screen>
      <Reveal>
        <SectionHeader
          eyebrow="Portfolio"
          title="Projects"
          subtitle="Search by name or technology, or filter by category."
        />
      </Reveal>

      <Reveal delay={80}>
        <View style={styles.search}>
          <Icon name="search" size={18} color={colors.textDim} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search projects, e.g. Supabase"
            placeholderTextColor={colors.textDim}
            selectionColor={colors.cyan}
            accessibilityLabel="Search projects"
            autoCorrect={false}
            autoCapitalize="none"
            style={styles.input}
          />
          {query ? (
            <Icon name="close-circle" size={18} color={colors.textDim} style={{ padding: 2 }} />
          ) : null}
        </View>
        <View style={styles.chips}>
          {categories.map((c) => (
            <Tag key={c} label={c} active={c === category} onPress={() => setCategory(c)} />
          ))}
        </View>
        <Text style={styles.count}>
          {filtered.length} {filtered.length === 1 ? 'project' : 'projects'}
        </Text>
      </Reveal>

      {filtered.length ? (
        <ResponsiveGrid
          items={filtered}
          renderItem={(p) => <ProjectCard project={p} onPress={() => router.push(`/project/${p.id}`)} />}
        />
      ) : (
        <GlassCard innerStyle={styles.empty}>
          <Icon name="search" size={30} color={colors.textDim} />
          <Text style={type.h3}>No projects found</Text>
          <Text style={type.small}>Try a different search word or choose another category.</Text>
        </GlassCard>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(5,11,20,0.7)',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  input: {
    flex: 1,
    paddingVertical: 13,
    color: colors.text,
    fontSize: 15.5,
    ...Platform.select({ web: { outlineStyle: 'none', outlineWidth: 0 }, default: {} }),
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  count: { color: colors.textDim, fontSize: 12.5, marginBottom: 16 },
  empty: { alignItems: 'center', gap: 8, paddingVertical: 28 },
});
