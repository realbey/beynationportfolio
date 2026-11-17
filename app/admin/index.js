import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import AdminShell from '../../components/AdminShell';
import GlassCard from '../../components/GlassCard';
import ResponsiveGrid from '../../components/ResponsiveGrid';
import { colors, fonts, textGlow, type } from '../../constants/theme';
import { supabase } from '../../lib/supabase';

const TABLES = [
  { id: 'projects', label: 'Projects', href: '/admin/projects' },
  { id: 'skills', label: 'Skills', href: '/admin/skills' },
  { id: 'services', label: 'Services', href: '/admin/services' },
  { id: 'contact_submissions', label: 'Messages', href: '/admin/messages' },
];

export default function AdminOverview() {
  const router = useRouter();
  const [counts, setCounts] = useState({});
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    let alive = true;
    (async () => {
      const next = {};
      for (const t of TABLES) {
        const { count } = await supabase.from(t.id).select('*', { count: 'exact', head: true });
        next[t.id] = count ?? 0;
      }
      const { count: u } = await supabase
        .from('contact_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);
      if (alive) {
        setCounts(next);
        setUnread(u ?? 0);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <AdminShell title="Overview" subtitle="Manage everything visitors see on your site." active="/admin">
      <ResponsiveGrid
        columns={2}
        gap={14}
        items={TABLES}
        renderItem={(t) => (
          <GlassCard onPress={() => router.replace(t.href)} style={{ flex: 1 }} innerStyle={styles.stat}>
            <Text style={[styles.value, textGlow(colors.cyan, 10)]}>{counts[t.id] ?? '-'}</Text>
            <Text style={styles.label}>{t.label}</Text>
            {t.id === 'contact_submissions' && unread > 0 ? <Text style={styles.unread}>{unread} unread</Text> : null}
          </GlassCard>
        )}
      />
      <View style={{ marginTop: 24 }}>
        <GlassCard innerStyle={{ gap: 8 }}>
          <Text style={type.eyebrow}>Tip</Text>
          <Text style={type.small}>
            Edit your name, bio, journey, social links and hero phrases in Settings. Add projects and skills here and they
            appear on the public site straight away.
          </Text>
        </GlassCard>
      </View>
    </AdminShell>
  );
}

const styles = StyleSheet.create({
  stat: { alignItems: 'center', gap: 4, paddingVertical: 12 },
  value: { color: colors.cyan, fontSize: 34, fontWeight: '800', fontFamily: fonts.mono },
  label: { color: colors.textMuted, fontSize: 12.5, letterSpacing: 1.4, textTransform: 'uppercase' },
  unread: { color: colors.warning, fontSize: 12, fontFamily: fonts.mono, marginTop: 2 },
});
