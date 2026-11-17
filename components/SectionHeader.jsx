import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, textGlow, type } from '../constants/theme';

export default function SectionHeader({ eyebrow, title, subtitle, style }) {
  return (
    <View style={[styles.wrap, style]}>
      {eyebrow ? <Text style={[type.eyebrow, textGlow(colors.cyan, 8)]}>{eyebrow}</Text> : null}
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      <LinearGradient
        colors={[...gradients.accent, 'rgba(56,189,248,0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.line}
      />
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 20, gap: 8 },
  title: { ...type.h2 },
  line: { height: 2, width: 96, borderRadius: 2 },
  subtitle: { ...type.body, maxWidth: 620 },
});
