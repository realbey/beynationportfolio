import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AdminShell from '../../components/AdminShell';
import GlassCard from '../../components/GlassCard';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import { colors, fonts, type } from '../../constants/theme';
import { supabase } from '../../lib/supabase';
import { openLink } from '../../lib/links';

export default function AdminMessages() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmId, setConfirmId] = useState(null);

  const load = useCallback(async () => {
    const { data, error: err } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);
    if (err) setError(err.message);
    else setRows(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleRead = async (row) => {
    const { error: err } = await supabase.from('contact_submissions').update({ is_read: !row.is_read }).eq('id', row.id);
    if (err) setError(err.message);
    else load();
  };

  const remove = async (id) => {
    const { error: err } = await supabase.from('contact_submissions').delete().eq('id', id);
    setConfirmId(null);
    if (err) setError(err.message);
    else load();
  };

  return (
    <AdminShell title="Messages" subtitle="Submissions from the contact form." active="/admin/messages">
      {error ? (
        <View style={styles.errorBox}>
          <Icon name="alert-circle" size={18} color={colors.danger} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {loading ? (
        <Text style={type.small}>Loading...</Text>
      ) : rows.length === 0 ? (
        <GlassCard innerStyle={{ alignItems: 'center', gap: 8, paddingVertical: 24 }}>
          <Icon name="mail-open-outline" size={30} color={colors.textDim} />
          <Text style={type.h3}>No messages yet</Text>
        </GlassCard>
      ) : (
        <View style={{ gap: 12 }}>
          {rows.map((r) => (
            <GlassCard key={r.id} glow={!r.is_read} innerStyle={{ gap: 8 }}>
              <View style={styles.head}>
                <Text style={styles.subject} numberOfLines={2}>
                  {!r.is_read ? '● ' : ''}
                  {r.subject}
                </Text>
                <Text style={styles.date}>{new Date(r.created_at).toLocaleString()}</Text>
              </View>
              <Text style={styles.from}>
                {r.name} · {r.email}
              </Text>
              {/* Rendered as plain text: never as HTML. */}
              <Text style={type.body} selectable>
                {r.message}
              </Text>
              <View style={styles.actions}>
                <Button title="Reply" size="sm" icon="return-up-back" onPress={() => openLink(`mailto:${r.email}?subject=${encodeURIComponent('Re: ' + r.subject)}`)} />
                <Button title={r.is_read ? 'Mark unread' : 'Mark read'} size="sm" variant="ghost" onPress={() => toggleRead(r)} />
                {confirmId === r.id ? (
                  <>
                    <Button title="Confirm delete" size="sm" variant="danger" onPress={() => remove(r.id)} />
                    <Button title="Cancel" size="sm" variant="ghost" onPress={() => setConfirmId(null)} />
                  </>
                ) : (
                  <Button title="Delete" size="sm" variant="danger" icon="trash-outline" onPress={() => setConfirmId(r.id)} />
                )}
              </View>
            </GlassCard>
          ))}
        </View>
      )}
    </AdminShell>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' },
  subject: { color: colors.text, fontSize: 16, fontWeight: '800', flexShrink: 1 },
  date: { color: colors.textDim, fontFamily: fonts.mono, fontSize: 11.5 },
  from: { color: colors.cyan, fontSize: 13.5 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 6 },
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
});
