import React from 'react';
import AdminCrud from '../../components/AdminCrud';
import { isValidSlug } from '../../lib/validate';

const config = {
  table: 'projects',
  title: 'Projects',
  subtitle: 'Case studies shown on the Projects screen.',
  active: '/admin/projects',
  orderBy: 'sort_order',
  titleKey: 'title',
  subtitleKey: 'category',
  blank: () => ({ title: '', slug: '', tagline: '', description: '', category: 'General', tags: [], highlights: [], images: [], github_url: '', demo_url: '', featured: false, published: true, sort_order: 0 }),
  fields: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'slug', label: 'Slug (used in the link)', type: 'text', required: true, placeholder: 'my-project-name', hint: 'Lowercase letters, numbers and hyphens only.' },
    { key: 'tagline', label: 'Tagline', type: 'text' },
    { key: 'description', label: 'Description', type: 'multiline', hint: 'Leave a blank line between paragraphs.' },
    { key: 'category', label: 'Category', type: 'text', required: true, placeholder: 'Education, Business, Gaming...' },
    { key: 'tags', label: 'Tags (comma separated)', type: 'list', placeholder: 'React Native, Supabase' },
    { key: 'highlights', label: 'Key features (one per line)', type: 'list', separator: '\n' },
    { key: 'images', label: 'Images (one image URL per line)', type: 'list', separator: '\n', hint: 'Use full https:// links. Leave empty to show a generated preview.' },
    { key: 'github_url', label: 'GitHub URL', type: 'url' },
    { key: 'demo_url', label: 'Demo URL', type: 'url' },
    { key: 'sort_order', label: 'Sort order (small numbers first)', type: 'number' },
    { key: 'featured', label: 'Featured on Home', type: 'bool' },
    { key: 'published', label: 'Published', type: 'bool' },
  ],
  prepare: (p) => {
    if (!isValidSlug(p.slug)) return { error: 'Slug must use lowercase letters, numbers and single hyphens (for example my-project).' };
    if (p.images.some((u) => !/^https:\/\/\S+$/i.test(u))) return { error: 'Every image must be a full https:// URL.' };
    return { payload: p };
  },
};

export default function AdminProjects() {
  return <AdminCrud config={config} />;
}
