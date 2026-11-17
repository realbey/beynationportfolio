import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, fonts, radii } from '../constants/theme';

export default function FormField({
  label,
  error,
  hint,
  style,
  inputStyle,
  multiline = false,
  onFocus,
  onBlur,
  ...rest
}) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={[styles.wrap, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        {...rest}
        multiline={multiline}
        accessibilityLabel={label}
        placeholderTextColor={colors.textDim}
        selectionColor={colors.cyan}
        onFocus={(e) => {
          setFocused(true);
          if (onFocus) onFocus(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          if (onBlur) onBlur(e);
        }}
        style={[
          styles.input,
          multiline && styles.multiline,
          focused && styles.focused,
          !!error && styles.errorBorder,
          inputStyle,
        ]}
      />
      {error ? <Text style={styles.error}>{error}</Text> : hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  label: {
    fontFamily: fonts.mono,
    fontSize: 11.5,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.textMuted,
    marginBottom: 7,
  },
  input: {
    backgroundColor: 'rgba(5, 11, 20, 0.7)',
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radii.md,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15.5,
    color: colors.text,
    ...Platform.select({ web: { outlineStyle: 'none', outlineWidth: 0 }, default: {} }),
  },
  multiline: { minHeight: 120, textAlignVertical: 'top' },
  focused: { borderColor: colors.cyan, backgroundColor: 'rgba(0, 240, 255, 0.05)' },
  errorBorder: { borderColor: colors.danger },
  error: { color: colors.danger, fontSize: 12.5, marginTop: 6 },
  hint: { color: colors.textDim, fontSize: 12, marginTop: 6 },
});
