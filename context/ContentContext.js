import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { SAMPLE_PROJECTS, SAMPLE_SERVICES, SAMPLE_SKILLS, SITE_DEFAULTS } from '../constants/data';

const ContentContext = createContext(null);

function normalizeProject(row) {
  return {
    id: row.slug || row.id,
    dbId: row.id,
    slug: row.slug,
    title: row.title || 'Untitled project',
    tagline: row.tagline || '',
    description: row.description || '',
    category: row.category || 'General',
    tags: row.tags || [],
    images: row.images || [],
    highlights: row.highlights || [],
    github_url: row.github_url || '',
    demo_url: row.demo_url || '',
    featured: !!row.featured,
  };
}

function normalizeSkill(row) {
  return {
    id: row.id,
    category: row.category || 'Other',
    name: row.name,
    level: Math.max(0, Math.min(100, Number(row.level) || 0)),
    icon: row.icon || 'code-slash',
  };
}

function normalizeService(row) {
  return {
    id: row.id,
    title: row.title,
    icon: row.icon || 'sparkles',
    description: row.description || '',
    features: row.features || [],
  };
}

export function ContentProvider({ children }) {
  const [state, setState] = useState({
    projects: SAMPLE_PROJECTS,
    skills: SAMPLE_SKILLS,
    services: SAMPLE_SERVICES,
    settings: SITE_DEFAULTS,
    source: 'local',
    loading: isSupabaseConfigured,
    error: null,
  });

  const reload = useCallback(async () => {
    if (!supabase) return;
    try {
      const [p, s, sv, st] = await Promise.all([
        supabase
          .from('projects')
          .select('*')
          .eq('published', true)
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: false }),
        supabase.from('skills').select('*').eq('visible', true).order('sort_order', { ascending: true }),
        supabase.from('services').select('*').eq('visible', true).order('sort_order', { ascending: true }),
        supabase.from('site_settings').select('key,value'),
      ]);
      const failed = [p, s, sv, st].find((r) => r.error);
      if (failed) throw failed.error;

      const settings = { ...SITE_DEFAULTS };
      (st.data || []).forEach((row) => {
        if (row.value !== null && row.value !== undefined && row.value !== '') settings[row.key] = row.value;
      });

      setState({
        // An empty table falls back to the sample records so a fresh database still looks complete.
        projects: p.data && p.data.length ? p.data.map(normalizeProject) : SAMPLE_PROJECTS,
        skills: s.data && s.data.length ? s.data.map(normalizeSkill) : SAMPLE_SKILLS,
        services: sv.data && sv.data.length ? sv.data.map(normalizeService) : SAMPLE_SERVICES,
        settings,
        source: 'supabase',
        loading: false,
        error: null,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err && err.message ? err.message : 'Could not load content.',
      }));
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const value = useMemo(() => {
    const featured = state.projects.filter((p) => p.featured);
    return {
      ...state,
      featuredProjects: (featured.length ? featured : state.projects).slice(0, 3),
      reload,
    };
  }, [state, reload]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used inside <ContentProvider>');
  return ctx;
}
