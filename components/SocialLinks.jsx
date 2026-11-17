import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import Icon from './Icon';
import { colors } from '../constants/theme';
import { buildSocialLinks, openLink } from '../lib/links';
import { useContent } from '../context/ContentContext';

// compact: round icon buttons only. Otherwise icon + label rows.
export default function SocialLinks({ compact = false, style }) {
  const { settings } = useContent();
  const links = buildSocialLinks(settings);
  if (!links.length) return null;

  return (
    <View style={[compact ? styles.rowCompact : styles.column, style]}>
      {links.map((l) => (
        <Pressable
          key={l.key}
          accessibilityRole="link"
          accessibilityLabel={l.label}
          onPress={() => openLink(l.url)}
          style={({ pressed }) => [compact ? styles.round : styles.line, pressed && styles.pressed]}
        >
          {l.lib === 'fa5' ? (
            <FontAwesome5 name={l.icon} brand size={compact ? 18 : 20} color={colors.cyan} />
          ) : (
            <Icon name={l.icon} size={compact ? 20 : 22} color={colors.cyan} />
          )}
          {!compact ? <Text style={styles.label}>{l.label}</Text> : null}
          {!compact ? <Icon name="arrow-forward" size={16} color={colors.textDim} style={styles.arrow} /> : null}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  rowCompact: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  column: { gap: 10 },
  round: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(0,240,255,0.06)',
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: 'rgba(0,240,255,0.04)',
  },
  pressed: { opacity: 0.7, borderColor: colors.borderStrong },
  label: { color: colors.text, fontSize: 15, fontWeight: '600', flex: 1 },
  arrow: { marginLeft: 'auto' },
});
