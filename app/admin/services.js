import React from 'react';
import AdminCrud from '../../components/AdminCrud';

const config = {
  table: 'services',
  title: 'Services',
  subtitle: 'Shown on the Services screen.',
  active: '/admin/services',
  orderBy: 'sort_order',
  titleKey: 'title',
  subtitleKey: 'description',
  blank: () => ({ title: '', description: '', icon: 'sparkles', features: [], visible: true, sort_order: 0 }),
  fields: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'multiline' },
    { key: 'icon', label: 'Icon name', type: 'text', hint: 'Any Ionicons name, for example globe or phone-portrait.' },
    { key: 'features', label: 'Features (one per line)', type: 'list', separator: '\n' },
    { key: 'sort_order', label: 'Sort order (small numbers first)', type: 'number' },
    { key: 'visible', label: 'Visible', type: 'bool' },
  ],
};

export default function AdminServices() {
  return <AdminCrud config={config} />;
}
