import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fonts, radii } from '../constants/theme';

export default function Tag({ label, active = false, onPress, style }) {
  const content = (
    <Text style={[styles.text, active && styles.textActive]} numberOfLines={1}>
      {label}
    </Text>
  );
  if (!onPress) return <Pressable disabled style={[styles.tag, active && styles.active, style]}>{content}</Pressable>;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[styles.tag, active && styles.active, style]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tag: {
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: 'rgba(148,190,230,0.06)',
    paddingVertical: 5,
    paddingHorizontal: 11,
  },
  active: { borderColor: colors.borderStrong, backgroundColor: 'rgba(0,240,255,0.14)' },
  text: { fontFamily: fonts.mono, fontSize: 12, color: colors.textMuted, letterSpacing: 0.3 },
  textActive: { color: colors.cyan },
});
