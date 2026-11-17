import React from 'react';
import AdminCrud from '../../components/AdminCrud';

const config = {
  table: 'skills',
  title: 'Skills',
  subtitle: 'Grouped by category on the Skills screen.',
  active: '/admin/skills',
  orderBy: 'sort_order',
  titleKey: 'name',
  subtitleKey: 'category',
  blank: () => ({ name: '', category: 'Frontend', level: 70, icon: 'code-slash', visible: true, sort_order: 0 }),
  fields: [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'category', label: 'Category', type: 'text', required: true, placeholder: 'Frontend, Mobile, Backend & Data, Tools' },
    { key: 'level', label: 'Level (0 to 100)', type: 'number' },
    { key: 'icon', label: 'Icon name', type: 'text', hint: 'Any Ionicons name, for example logo-react or server. Wrong names show a question mark.' },
    { key: 'sort_order', label: 'Sort order (small numbers first)', type: 'number' },
    { key: 'visible', label: 'Visible', type: 'bool' },
  ],
  prepare: (p) => {
    if (p.level < 0 || p.level > 100) return { error: 'Level must be between 0 and 100.' };
    return { payload: p };
  },
};

export default function AdminSkills() {
  return <AdminCrud config={config} />;
}
