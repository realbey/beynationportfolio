import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import Icon from './Icon';
import { colors, fonts, gradients } from '../constants/theme';

export default function SkillBar({ skill, delay = 0 }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(delay, withTiming(skill.level, { duration: 900, easing: Easing.out(Easing.cubic) }));
  }, [skill.level, delay, progress]);

  const fill = useAnimatedStyle(() => ({ width: `${progress.value}%` }));

  return (
    <View style={styles.wrap} accessible accessibilityLabel={`${skill.name}, ${skill.level} percent`}>
      <View style={styles.head}>
        <View style={styles.name}>
          <Icon name={skill.icon} size={17} color={colors.cyan} />
          <Text style={styles.nameText}>{skill.name}</Text>
        </View>
        <Text style={styles.pct}>{skill.level}%</Text>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, fill]}>
          <LinearGradient
            colors={gradients.accent}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8, marginBottom: 16 },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { flexDirection: 'row', alignItems: 'center', gap: 9, flexShrink: 1 },
  nameText: { color: colors.text, fontSize: 15, fontWeight: '600' },
  pct: { color: colors.textMuted, fontFamily: fonts.mono, fontSize: 12.5 },
  track: { height: 7, borderRadius: 4, backgroundColor: 'rgba(148,190,230,0.12)', overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 4, overflow: 'hidden' },
});
