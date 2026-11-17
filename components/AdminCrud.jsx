
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import AdminShell from './AdminShell';
import GlassCard from './GlassCard';
import Button from './Button';
import FormField from './FormField';
import Icon from './Icon';
import { colors, fonts, type } from '../constants/theme';
import { supabase } from '../lib/supabase';
import { useContent } from '../context/ContentContext';

/*
  Generic list + editor for one Supabase table.

  Supported field types:
  text | multiline | number | bool | list | json | url

  Lists:
  - Default separator: comma
  - separator: '\n' for one item per line
*/

function toForm(fields, row) {
  const out = {};

  fields.forEach((f) => {
    const v = row[f.key];

    if (f.type === 'list') {
      const separator = f.separator || ',';

      out[f.key] = Array.isArray(v)
        ? v.join(separator === '\n' ? '\n' : ', ')
        : '';
    } else if (f.type === 'json') {
      out[f.key] = v ? JSON.stringify(v, null, 2) : '';
    } else if (f.type === 'bool') {
      out[f.key] = !!v;
    } else {
      out[f.key] =
        v === null || v === undefined ? '' : String(v);
    }
  });

  return out;
}

function fromForm(fields, form) {
  const payload = {};

  for (const f of fields) {
    const raw = form[f.key];

    if (f.type === 'list') {
      const separator = f.separator || ',';

      payload[f.key] = String(raw || '')
        .split(separator)
        .map((s) => s.trim())
        .filter(Boolean);
    } else if (f.type === 'json') {
      const text = String(raw || '').trim();

      if (!text) {
        payload[f.key] = [];
      } else {
        try {
          payload[f.key] = JSON.parse(text);
        } catch {
          return {
            error: `"${f.label}" is not valid JSON.`,
          };
        }
      }
    } else if (f.type === 'number') {
      const n = Number(raw);

      if (raw === '' || Number.isNaN(n)) {
        return {
          error: `"${f.label}" must be a number.`,
        };
      }

      payload[f.key] = n;
    } else if (f.type === 'bool') {
      payload[f.key] = !!raw;
    } else {
      const text = String(raw || '').trim();

      if (f.required && !text) {
        return {
          error: `"${f.label}" is required.`,
        };
      }

      if (
        f.type === 'url' &&
        text &&
        !/^https?:\/\/\S+$/i.test(text)
      ) {
        return {
          error: `"${f.label}" must start with http:// or https://`,
        };
      }

      payload[f.key] = text;
    }
  }

  return { payload };
}

export default function AdminCrud({ config }) {
  const { reload } = useContent();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);

    const { data, error: err } = await supabase
      .from(config.table)
      .select('*')
      .order(config.orderBy || 'sort_order', {
        ascending: true,
      });

    if (err) {
      setError(err.message);
    } else {
      setRows(data || []);
    }

    setLoading(false);
  }, [config.table, config.orderBy]);

  useEffect(() => {
    load();
  }, [load]);

  const startNew = () => {
    setError('');

    setEditing({
      id: null,
      form: toForm(config.fields, config.blank()),
    });
  };

  const startEdit = (row) => {
    setError('');

    setEditing({
      id: row.id,
      form: toForm(config.fields, row),
    });
  };

  const save = async () => {
    if (!editing || busy) return;

    setError('');

    let result = fromForm(config.fields, editing.form);

    if (!result.error && config.prepare) {
      result = config.prepare(result.payload);
    }

    if (result.error) {
      setError(result.error);
      return;
    }

    setBusy(true);

    try {
      const query = editing.id
        ? supabase
            .from(config.table)
            .update(result.payload)
            .eq('id', editing.id)
        : supabase
            .from(config.table)
            .insert(result.payload);

      const { error: err } = await query;

      if (err) {
        setError(err.message);
        return;
      }

      setEditing(null);

      await load();
      await reload();
    } catch (err) {
      setError(err?.message || 'Unable to save this record.');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    if (busy) return;

    setBusy(true);
    setError('');

    try {
      const { error: err } = await supabase
        .from(config.table)
        .delete()
        .eq('id', id);

      if (err) {
        setError(err.message);
        return;
      }

      setConfirmId(null);

      await load();
      await reload();
    } catch (err) {
      setError(err?.message || 'Unable to delete this record.');
    } finally {
      setBusy(false);
    }
  };

  const setField = (key) => (value) => {
    setEditing((current) => {
      if (!current) return current;

      return {
        ...current,
        form: {
          ...current.form,
          [key]: value,
        },
      };
    });
  };

  return (
    <AdminShell
      title={config.title}
      subtitle={config.subtitle}
      active={config.active}
      actions={
        !editing ? (
          <Button
            title="Add new"
            icon="add"
            size="sm"
            onPress={startNew}
          />
        ) : null
      }
    >
      {error ? (
        <View style={styles.errorBox}>
          <Icon
            name="alert-circle"
            size={18}
            color={colors.danger}
          />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {editing ? (
        <GlassCard glow>
          <Text style={[type.h3, { marginBottom: 14 }]}>
            {editing.id ? 'Edit record' : 'New record'}
          </Text>

          {config.fields.map((f) =>
            f.type === 'bool' ? (
              <View key={f.key} style={styles.switchRow}>
                <Text style={styles.switchLabel}>
                  {f.label}
                </Text>

                <Switch
                  value={!!editing.form[f.key]}
                  onValueChange={setField(f.key)}
                  trackColor={{
                    false: 'rgba(148,190,230,0.2)',
                    true: 'rgba(0,240,255,0.5)',
                  }}
                  thumbColor={
                    editing.form[f.key]
                      ? colors.cyan
                      : '#8aa0b8'
                  }
                />
              </View>
            ) : (
              <FormField
                key={f.key}
                label={f.label}
                value={editing.form[f.key]}
                onChangeText={setField(f.key)}
                placeholder={
                  f.type === 'list' && f.separator === '\n'
                    ? 'Enter one item per line'
                    : f.placeholder
                }
                hint={f.hint}
                multiline={
                  f.type === 'multiline' ||
                  f.type === 'json' ||
                  (f.type === 'list' && f.separator === '\n')
                }
                keyboardType={
                  f.type === 'number'
                    ? 'numeric'
                    : f.type === 'url'
                      ? 'url'
                      : 'default'
                }
                autoCapitalize={
                  f.type === 'url' || f.key === 'slug'
                    ? 'none'
                    : 'sentences'
                }
                inputStyle={
                  f.type === 'json' ||
                  (f.type === 'list' && f.separator === '\n')
                    ? styles.mono
                    : undefined
                }
              />
            )
          )}

          <View style={styles.row}>
            <Button
              title="Save"
              icon="save"
              loading={busy}
              onPress={save}
            />

            <Button
              title="Cancel"
              variant="ghost"
              onPress={() => {
                setEditing(null);
                setError('');
              }}
            />
          </View>
        </GlassCard>
      ) : loading ? (
        <Text style={type.small}>Loading...</Text>
      ) : rows.length === 0 ? (
        <GlassCard innerStyle={styles.empty}>
          <Icon
            name="albums-outline"
            size={30}
            color={colors.textDim}
          />

          <Text style={type.h3}>Nothing here yet</Text>

          <Text style={type.small}>
            The public site shows sample content until you add
            your first record.
          </Text>
        </GlassCard>
      ) : (
        <View style={{ gap: 12 }}>
          {rows.map((row) => (
            <GlassCard
              key={row.id}
              innerStyle={styles.rowCard}
            >
              <View style={{ flex: 1, gap: 3 }}>
                <Text
                  style={styles.rowTitle}
                  numberOfLines={1}
                >
                  {row[config.titleKey]}
                </Text>

                {config.subtitleKey ? (
                  <Text
                    style={type.small}
                    numberOfLines={1}
                  >
                    {String(row[config.subtitleKey] ?? '')}
                  </Text>
                ) : null}

                {row.published === false ||
                row.visible === false ? (
                  <Text style={styles.hidden}>HIDDEN</Text>
                ) : null}
              </View>

              {confirmId === row.id ? (
                <View style={styles.row}>
                  <Button
                    title="Delete"
                    size="sm"
                    variant="danger"
                    loading={busy}
                    onPress={() => remove(row.id)}
                  />

                  <Button
                    title="No"
                    size="sm"
                    variant="ghost"
                    onPress={() => setConfirmId(null)}
                  />
                </View>
              ) : (
                <View style={styles.row}>
                  <Button
                    title="Edit"
                    size="sm"
                    variant="ghost"
                    icon="create-outline"
                    onPress={() => startEdit(row)}
                  />

                  <Button
                    title=""
                    size="sm"
                    variant="danger"
                    icon="trash-outline"
                    accessibilityLabel="Delete"
                    onPress={() => setConfirmId(row.id)}
                  />
                </View>
              )}
            </GlassCard>
          ))}
        </View>
      )}
    </AdminShell>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },

  rowTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },

  hidden: {
    color: colors.warning,
    fontFamily: fonts.mono,
    fontSize: 10.5,
    letterSpacing: 1.5,
  },

  empty: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 24,
  },

  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  switchLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },

  mono: {
    fontFamily: fonts.mono,
    fontSize: 13,
    minHeight: 140,
    textAlignVertical: 'top',
  },

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

  errorText: {
    color: colors.danger,
    fontSize: 13.5,
    flex: 1,
    lineHeight: 19,
  },
});
