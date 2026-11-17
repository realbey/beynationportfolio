import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AdminShell from '../../components/AdminShell';
import GlassCard from '../../components/GlassCard';
import FormField from '../../components/FormField';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import { colors, type } from '../../constants/theme';
import { supabase } from '../../lib/supabase';
import { useContent } from '../../context/ContentContext';
import { SITE_DEFAULTS } from '../../constants/data';

// Each setting is one row in site_settings (key, value jsonb).
const GROUPS = [
  {
    title: 'Identity',
    fields: [
      { key: 'brand', label: 'Brand name', kind: 'text' },
      { key: 'owner_name', label: 'Your name', kind: 'text' },
      { key: 'role', label: 'Role / headline', kind: 'text' },
      { key: 'availability', label: 'Availability badge', kind: 'text' },
    ],
  },
  {
    title: 'Home screen',
    fields: [
      { key: 'hero_intro', label: 'Intro paragraph', kind: 'multiline' },
      { key: 'hero_phrases', label: 'Typewriter phrases (one per line)', kind: 'lines', hint: 'Shown after "I build".' },
      { key: 'marquee', label: 'Marquee words (one per line)', kind: 'lines' },
    ],
  },
  {
    title: 'About screen',
    fields: [
      { key: 'about_bio', label: 'Biography (blank line between paragraphs)', kind: 'paragraphs' },
      { key: 'interests', label: 'Technical interests (one per line)', kind: 'lines' },
      { key: 'journey', label: 'Journey (JSON list)', kind: 'json', hint: 'Each item: {"year":"2025","title":"...","text":"..."}' },
      { key: 'goals', label: 'Learning goals (JSON list)', kind: 'json', hint: 'Each item: {"icon":"rocket","title":"...","text":"..."}' },
      { key: 'values', label: 'Professional values (JSON list)', kind: 'json', hint: 'Each item: {"icon":"sparkles","title":"...","text":"..."}' },
    ],
  },
  {
    title: 'Contact and social',
    fields: [
      { key: 'contact_blurb', label: 'Contact intro', kind: 'multiline' },
      { key: 'social_email', label: 'Email address', kind: 'text' },
      { key: 'social_whatsapp', label: 'WhatsApp number (digits with country code)', kind: 'text', hint: 'Example: 255712345678' },
      { key: 'social_github', label: 'GitHub URL', kind: 'url' },
      { key: 'social_linkedin', label: 'LinkedIn URL', kind: 'url' },
      { key: 'social_twitter', label: 'Twitter / X URL', kind: 'url' },
      { key: 'social_instagram', label: 'Instagram URL', kind: 'url' },
    ],
  },
];

const ALL = GROUPS.flatMap((g) => g.fields);

function toText(f, v) {
  if (v === undefined || v === null) return '';
  if (f.kind === 'lines') return (Array.isArray(v) ? v : []).join('\n');
  if (f.kind === 'paragraphs') return (Array.isArray(v) ? v : [String(v)]).join('\n\n');
  if (f.kind === 'json') return JSON.stringify(v, null, 2);
  return String(v);
}

function fromText(f, text) {
  const t = String(text || '');
  if (f.kind === 'lines') return t.split('\n').map((s) => s.trim()).filter(Boolean);
  if (f.kind === 'paragraphs') return t.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);
  if (f.kind === 'json') {
    const parsed = JSON.parse(t || '[]');
    if (!Array.isArray(parsed)) throw new Error('must be a list');
    return parsed;
  }
  return t.trim();
}

export default function AdminSettings() {
  const { settings, reload } = useContent();
  const [form, setForm] = useState({});
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const next = {};
    ALL.forEach((f) => {
      next[f.key] = toText(f, settings[f.key] ?? SITE_DEFAULTS[f.key]);
    });
    setForm(next);
  }, [settings]);

  const save = async () => {
    setError('');
    setSaved(false);
    const rows = [];
    for (const f of ALL) {
      try {
        const value = fromText(f, form[f.key]);
        if (f.kind === 'url' && value && !/^https?:\/\/\S+$/i.test(value)) {
          setError(`"${f.label}" must start with http:// or https://`);
          return;
        }
        rows.push({ key: f.key, value });
      } catch (e) {
        setError(`"${f.label}" is not valid: ${e.message}`);
        return;
      }
    }
    setBusy(true);
    const { error: err } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' });
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    setSaved(true);
    reload();
  };

  return (
    <AdminShell
      title="Settings"
      subtitle="Text and links used across the site."
      active="/admin/settings"
      actions={<Button title="Save all" icon="save" loading={busy} onPress={save} size="sm" />}
    >
      {error ? (
        <View style={styles.errorBox}>
          <Icon name="alert-circle" size={18} color={colors.danger} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
      {saved ? (
        <View style={styles.okBox}>
          <Icon name="checkmark-circle" size={18} color={colors.success} />
          <Text style={styles.okText}>Saved. The public site is updated.</Text>
        </View>
      ) : null}

      {GROUPS.map((g) => (
        <GlassCard key={g.title} style={{ marginBottom: 18 }}>
          <Text style={[type.h3, { marginBottom: 14 }]}>{g.title}</Text>
          {g.fields.map((f) => (
            <FormField
              key={f.key}
              label={f.label}
              hint={f.hint}
              value={form[f.key] ?? ''}
              onChangeText={(t) => {
                setSaved(false);
                setForm((s) => ({ ...s, [f.key]: t }));
              }}
              multiline={f.kind !== 'text' && f.kind !== 'url'}
              autoCapitalize={f.kind === 'url' ? 'none' : 'sentences'}
              keyboardType={f.kind === 'url' ? 'url' : 'default'}
              inputStyle={f.kind === 'json' ? { minHeight: 160 } : undefined}
            />
          ))}
        </GlassCard>
      ))}
      <Button title="Save all" icon="save" loading={busy} onPress={save} />
    </AdminShell>
  );
}

const styles = StyleSheet.create({
  errorBox: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(251,113,133,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(251,113,133,0.35)',
    marginBottom: 16,
  },
  errorText: { color: colors.danger, fontSize: 13.5, flex: 1, lineHeight: 19 },
  okBox: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(52,211,153,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(52,211,153,0.35)',
    marginBottom: 16,
  },
  okText: { color: colors.success, fontSize: 13.5, flex: 1 },
});
